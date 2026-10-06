// Cloudflare Worker: serves the static site from ./out and handles the guest
// forms — RSVPs (`/api/rsvp`, table `rsvps`) and travel plans (`/api/travel`,
// table `travel_plans`). Both work the same way:
//
// POST /api/<form>   { ...fields }
//   → inserts into Supabase (the database generates an edit token), then emails
//     the guest a confirmation with their edit link and emails the couple a
//     notification, both via Resend
// GET  /api/<form>?token=<edit token>
//   → returns that guest's submission, used to prefill the form when they
//     arrive via their edit link (/rsvp/?edit=<token>, /travel/?edit=<token>)
// PUT  /api/<form>?token=<edit token>   { ...fields }
//   → updates that submission and re-sends both emails
//
// GET  /api/rsvps and /api/travel-plans  (Authorization: Bearer <ADMIN_KEY>)
//   → return every submission — used by the /admin page
//
// Required settings (Cloudflare dashboard → Settings → Variables and Secrets,
// or `wrangler secret put <NAME>`):
//   SUPABASE_URL               e.g. https://abcdefgh.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  Supabase → Settings → API → service_role key (Secret)
//   RESEND_API_KEY             resend.com → API Keys (Secret)
//   ADMIN_KEY                  any passphrase you choose — unlocks /admin (Secret)
//   NOTIFY_EMAIL               where notifications go — one address or several
//                              separated by commas (set in wrangler.jsonc vars)
//   RSVP_FROM_EMAIL            sender for all emails (set in wrangler.jsonc vars);
//                              its domain must be verified in Resend

import { siteConfig } from "../src/data/site";
import { renderEmailHtml, renderEmailText, type EmailBrand, type EmailContent } from "./email";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
  ADMIN_KEY: string;
  NOTIFY_EMAIL: string;
  RSVP_FROM_EMAIL?: string;
}

type Rsvp = {
  name: string;
  email: string;
  phone: string | null;
  wishes: string | null;
  attending: boolean;
};

type TravelPlan = {
  name: string;
  email: string;
  phone: string | null;
  party_size: number;
  party_names: string | null;
  arrival_airport: string | null;
  arrival_date: string;
  arrival_time: string | null;
  arrival_flight: string | null;
  departure_airport: string | null;
  departure_date: string | null;
  departure_time: string | null;
  departure_flight: string | null;
  needs_transfer: boolean | null;
  hotel: string | null;
  notes: string | null;
};

type Email = { subject: string; content: EmailContent };

// Everything that differs between the two guest forms.
type GuestForm<T extends { name: string; email: string }> = {
  table: string;
  /** Columns handed back to the guest when they open their edit link */
  columns: string;
  /** PostgREST `order` for the admin list */
  order: string;
  invalidMessage: string;
  /** Returns the cleaned-up row, or null if the submission is invalid */
  parse(body: Record<string, unknown>): T | null;
  emails(row: T, origin: string, token: string, updated: boolean): { guest: Email; couple: Email };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_RE = /^[0-9a-f]{64}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function supabaseHeaders(env: Env) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };
}

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function contactDetails(row: { email: string; phone: string | null }): EmailContent["details"] {
  const details: EmailContent["details"] = [
    { label: "Email", value: row.email, href: `mailto:${row.email}` },
  ];
  if (row.phone) {
    details.push({ label: "Phone", value: row.phone, href: `tel:${row.phone.replace(/[^+\d]/g, "")}` });
  }
  return details;
}

// ── RSVP ─────────────────────────────────────────────────────────────────────

const rsvpForm: GuestForm<Rsvp> = {
  table: "rsvps",
  columns: "name,email,phone,wishes,attending",
  order: "created_at.desc",
  invalidMessage: "A name, a valid email and a yes/no are required",

  parse(body) {
    const name = text(body.name);
    const email = text(body.email).toLowerCase();
    const phone = text(body.phone);
    const wishes = text(body.wishes);
    if (
      !name ||
      name.length > 200 ||
      email.length > 254 ||
      !EMAIL_RE.test(email) ||
      phone.length > 40 ||
      wishes.length > 2000 ||
      typeof body.attending !== "boolean"
    ) {
      return null;
    }
    return { name, email, phone: phone || null, wishes: wishes || null, attending: body.attending };
  },

  emails(rsvp, origin, token, updated) {
    const response = rsvp.attending ? "Joyfully accepts" : "Regretfully declines";
    const badge = { label: response, tone: rsvp.attending ? "sage" : "blush" } as const;
    const details = contactDetails(rsvp);
    if (rsvp.wishes) details.push({ label: "Wishes for the couple", value: rsvp.wishes });

    return {
      guest: {
        subject: updated
          ? "Your RSVP has been updated — Alisha & Neel"
          : rsvp.attending
            ? "We've got your RSVP — see you in Gujarat!"
            : "We've got your RSVP — you'll be missed",
        content: {
          preheader: updated
            ? "Your changes are saved."
            : rsvp.attending
              ? "Your RSVP is in — we can't wait to celebrate with you."
              : "Thank you for letting us know.",
          eyebrow: updated ? "RSVP updated" : "RSVP received",
          heading: rsvp.attending ? "See you in Gujarat!" : "You'll be missed",
          intro: `Dear ${rsvp.name}, ${
            updated
              ? "your RSVP has been updated. Here's what we have for you now."
              : rsvp.attending
                ? "thank you for your RSVP. We can't wait to celebrate with you! Here's what we have for you."
                : "thank you for letting us know. We'll be thinking of you as we celebrate. Here's what we have for you."
          }`,
          badge,
          details: [{ label: "Name", value: rsvp.name }, ...details],
          button: { label: "Edit your RSVP", href: `${origin}/rsvp/?edit=${token}` },
          footnote:
            "Plans changed? Update your reply any time with the button above. The link is personal to you, so please don't forward it.",
          signoff: "With love,",
        },
      },
      couple: {
        subject: `RSVP${updated ? " updated" : ""}: ${rsvp.name} ${response.toLowerCase()}${
          rsvp.attending ? " 🎉" : ""
        }`,
        content: {
          preheader: `${rsvp.name} ${response.toLowerCase()}.`,
          eyebrow: updated ? "RSVP updated" : "New RSVP",
          heading: rsvp.name,
          intro: updated
            ? "changed their reply on the website. Here's the latest."
            : "just replied on the website.",
          badge,
          details,
          button: { label: "View guest list", href: `${origin}/admin/` },
        },
      },
    };
  },
};

// ── Travel plans ─────────────────────────────────────────────────────────────

// "2027-01-25" → "Mon, Jan 25, 2027"
const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

// "14:30" → "2:30 PM"
function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
}

const journey = (
  airport: string | null,
  date: string | null,
  time: string | null,
  flight: string | null
) => [airport, date && formatDate(date), time && formatTime(time), flight].filter(Boolean).join(" · ");

const travelForm: GuestForm<TravelPlan> = {
  table: "travel_plans",
  columns:
    "name,email,phone,party_size,party_names,arrival_airport,arrival_date,arrival_time,arrival_flight,departure_airport,departure_date,departure_time,departure_flight,needs_transfer,hotel,notes",
  order: "arrival_date.asc,arrival_time.asc.nullslast",
  invalidMessage: "A name, a valid email, the number of travellers and an arrival date are required",

  parse(body) {
    let valid = true;
    // Optional field: trimmed, null when empty, must fit `max` and `pattern`.
    const optional = (key: string, max: number, pattern?: RegExp) => {
      const value = text(body[key]);
      if (value.length > max || (value && pattern && !pattern.test(value))) valid = false;
      return value || null;
    };
    const date = (key: string) => {
      const value = optional(key, 10, DATE_RE);
      if (value && Number.isNaN(Date.parse(value))) valid = false;
      return value;
    };

    const name = text(body.name);
    const email = text(body.email).toLowerCase();
    const partySize = body.party_size;
    const needsTransfer = body.needs_transfer ?? null;
    const plan = {
      name,
      email,
      phone: optional("phone", 40),
      party_size: partySize as number,
      party_names: optional("party_names", 500),
      arrival_airport: optional("arrival_airport", 60),
      arrival_date: date("arrival_date") ?? "",
      arrival_time: optional("arrival_time", 5, TIME_RE),
      arrival_flight: optional("arrival_flight", 60),
      departure_airport: optional("departure_airport", 60),
      departure_date: date("departure_date"),
      departure_time: optional("departure_time", 5, TIME_RE),
      departure_flight: optional("departure_flight", 60),
      needs_transfer: needsTransfer as boolean | null,
      hotel: optional("hotel", 120),
      notes: optional("notes", 2000),
    };
    if (
      !valid ||
      !name ||
      name.length > 200 ||
      email.length > 254 ||
      !EMAIL_RE.test(email) ||
      typeof partySize !== "number" ||
      !Number.isInteger(partySize) ||
      partySize < 1 ||
      partySize > 30 ||
      !plan.arrival_date ||
      (needsTransfer !== null && typeof needsTransfer !== "boolean")
    ) {
      return null;
    }
    return plan;
  },

  emails(plan, origin, token, updated) {
    const arriving = journey(plan.arrival_airport, plan.arrival_date, plan.arrival_time, plan.arrival_flight);
    const departing = journey(plan.departure_airport, plan.departure_date, plan.departure_time, plan.departure_flight);
    const badge = plan.needs_transfer
      ? ({ label: "Van seats requested", tone: "sage" } as const)
      : undefined;

    const details: EmailContent["details"] = [
      {
        label: "Travellers",
        value: plan.party_names ? `${plan.party_size} · ${plan.party_names}` : String(plan.party_size),
      },
      { label: "Arriving", value: arriving },
    ];
    if (departing) details.push({ label: "Departing", value: departing });
    if (plan.needs_transfer !== null) {
      details.push({ label: "Van from Mumbai airport", value: plan.needs_transfer ? "Yes, please" : "No, thank you" });
    }
    if (plan.hotel) details.push({ label: "Staying at", value: plan.hotel });
    if (plan.notes) details.push({ label: "Notes", value: plan.notes });
    details.push(...contactDetails(plan));

    return {
      guest: {
        subject: updated
          ? "Your travel plans are updated — Alisha & Neel"
          : "We've got your travel plans — Alisha & Neel",
        content: {
          preheader: updated ? "Your changes are saved." : "Thank you for sharing your travel plans.",
          eyebrow: updated ? "Travel plans updated" : "Travel plans received",
          heading: "Safe travels!",
          intro: `Dear ${plan.name}, ${
            updated
              ? "your travel plans have been updated. Here's what we have for you now."
              : "thank you for sharing your travel plans. Here's what we have for you."
          }`,
          badge,
          details: [{ label: "Name", value: plan.name }, ...details],
          button: { label: "Update travel plans", href: `${origin}/travel/?edit=${token}#travel-plans` },
          footnote:
            "Flights changed, or details still to come? Update your plans any time with the button above. The link is personal to you, so please don't forward it.",
          signoff: "With love,",
        },
      },
      couple: {
        subject: `Travel plans${updated ? " updated" : ""}: ${plan.name} (${plan.party_size}) arriving ${formatDate(plan.arrival_date)}`,
        content: {
          preheader: `${plan.party_size} arriving ${formatDate(plan.arrival_date)}.`,
          eyebrow: updated ? "Travel plans updated" : "New travel plans",
          heading: plan.name,
          intro: updated
            ? "changed their travel plans on the website. Here's the latest."
            : "just shared their travel plans on the website.",
          badge,
          details,
          button: { label: "View travel plans", href: `${origin}/admin/` },
        },
      },
    };
  },
};

// ── Shared plumbing ──────────────────────────────────────────────────────────

// Sends the guest their confirmation (with edit link) and notifies the couple.
// The submission is already saved — a mail failure shouldn't fail the request,
// so errors are logged rather than thrown.
async function sendEmails(
  env: Env,
  origin: string,
  guestAddress: string,
  emails: { guest: Email; couple: Email }
) {
  if (!env.RESEND_API_KEY) return;

  const from = env.RSVP_FROM_EMAIL || "Wedding RSVP <onboarding@resend.dev>";
  const notify = (env.NOTIFY_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  const brand: EmailBrand = {
    names: [siteConfig.couple.partner1, siteConfig.couple.partner2],
    dateLine: `${siteConfig.weddingDateDisplay} · ${siteConfig.location}`,
    hashtag: siteConfig.couple.hashtag,
    siteUrl: origin,
  };
  const send = async (to: string[], replyTo: string[], { subject, content }: Email) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        ...(replyTo.length ? { reply_to: replyTo } : {}),
        subject,
        html: renderEmailHtml(brand, content),
        text: renderEmailText(brand, content),
      }),
    });
    // Shows up in `wrangler dev` output and the Worker's logs in Cloudflare.
    if (!res.ok) console.error(`Resend rejected an email (${res.status}): ${await res.text()}`);
  };

  await Promise.allSettled([
    send([guestAddress], notify, emails.guest),
    notify.length ? send(notify, [guestAddress], emails.couple) : null,
  ]);
}

// Reads and validates a submission. `honeypot` is true when the hidden
// "website" field was filled in — only bots do that.
async function readSubmission<T extends { name: string; email: string }>(
  form: GuestForm<T>,
  request: Request
): Promise<{ row: T; honeypot: boolean } | null> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return null;
  }
  if (!body || typeof body !== "object") return null;

  const row = form.parse(body);
  return row && { row, honeypot: text(body.website) !== "" };
}

async function handleSubmit<T extends { name: string; email: string }>(
  form: GuestForm<T>,
  request: Request,
  env: Env
): Promise<Response> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: "This form isn't configured yet" }, 503);
  }

  const submission = await readSubmission(form, request);
  if (!submission) {
    return json({ error: form.invalidMessage }, 400);
  }
  if (submission.honeypot) {
    return json({ ok: true });
  }

  const dbRes = await fetch(`${env.SUPABASE_URL}/rest/v1/${form.table}?select=edit_token`, {
    method: "POST",
    headers: { ...supabaseHeaders(env), Prefer: "return=representation" },
    body: JSON.stringify(submission.row),
  });
  if (!dbRes.ok) {
    return json({ error: "Could not save your details" }, 502);
  }
  const [{ edit_token: editToken }] = (await dbRes.json()) as { edit_token: string }[];

  const origin = new URL(request.url).origin;
  await sendEmails(env, origin, submission.row.email, form.emails(submission.row, origin, editToken, false));
  return json({ ok: true, editToken });
}

async function handleLookup<T extends { name: string; email: string }>(
  form: GuestForm<T>,
  request: Request,
  env: Env
): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!TOKEN_RE.test(token)) {
    return json({ error: "That edit link isn't valid" }, 404);
  }

  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/${form.table}?select=${form.columns}&edit_token=eq.${token}`,
    { headers: supabaseHeaders(env) }
  );
  if (!res.ok) {
    return json({ error: "Could not load your details" }, 502);
  }
  const [row] = (await res.json()) as T[];
  return row ? json(row) : json({ error: "That edit link isn't valid" }, 404);
}

async function handleUpdate<T extends { name: string; email: string }>(
  form: GuestForm<T>,
  request: Request,
  env: Env
): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!TOKEN_RE.test(token)) {
    return json({ error: "That edit link isn't valid" }, 404);
  }

  const submission = await readSubmission(form, request);
  if (!submission) {
    return json({ error: form.invalidMessage }, 400);
  }

  const dbRes = await fetch(
    `${env.SUPABASE_URL}/rest/v1/${form.table}?select=edit_token&edit_token=eq.${token}`,
    {
      method: "PATCH",
      headers: { ...supabaseHeaders(env), Prefer: "return=representation" },
      body: JSON.stringify({ ...submission.row, updated_at: new Date().toISOString() }),
    }
  );
  if (!dbRes.ok) {
    return json({ error: "Could not save your details" }, 502);
  }
  if (((await dbRes.json()) as unknown[]).length === 0) {
    return json({ error: "That edit link isn't valid" }, 404);
  }

  const origin = new URL(request.url).origin;
  await sendEmails(env, origin, submission.row.email, form.emails(submission.row, origin, token, true));
  return json({ ok: true, editToken: token });
}

async function handleList<T extends { name: string; email: string }>(
  form: GuestForm<T>,
  request: Request,
  env: Env
): Promise<Response> {
  const auth = request.headers.get("Authorization") ?? "";
  if (!env.ADMIN_KEY || auth !== `Bearer ${env.ADMIN_KEY}`) {
    return json({ error: "Unauthorized" }, 401);
  }

  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/${form.table}?select=${form.columns},created_at,updated_at&order=${form.order}`,
    { headers: supabaseHeaders(env) }
  );
  if (!res.ok) {
    return json({ error: "Could not load the list" }, 502);
  }
  return json(await res.json());
}

function handleForm<T extends { name: string; email: string }>(
  form: GuestForm<T>,
  request: Request,
  env: Env
): Promise<Response> | Response {
  switch (request.method) {
    case "POST":
      return handleSubmit(form, request, env);
    case "GET":
      return handleLookup(form, request, env);
    case "PUT":
      return handleUpdate(form, request, env);
    default:
      return json({ error: "Not found" }, 404);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/rsvp") {
      return handleForm(rsvpForm, request, env);
    }
    if (url.pathname === "/api/travel") {
      return handleForm(travelForm, request, env);
    }
    if (url.pathname === "/api/rsvps" && request.method === "GET") {
      return handleList(rsvpForm, request, env);
    }
    if (url.pathname === "/api/travel-plans" && request.method === "GET") {
      return handleList(travelForm, request, env);
    }
    if (url.pathname.startsWith("/api/")) {
      return json({ error: "Not found" }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
