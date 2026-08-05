// Cloudflare Worker: serves the static site from ./out and handles the RSVP API.
//
// POST /api/rsvp   { name: string, attending: boolean }
//   → inserts into Supabase `rsvps` table, then emails a notification via Resend
// GET  /api/rsvps  (Authorization: Bearer <ADMIN_KEY>)
//   → returns all RSVPs, newest first — used by the /admin page
//
// Required settings (Cloudflare dashboard → Settings → Variables and Secrets,
// or `wrangler secret put <NAME>`):
//   SUPABASE_URL               e.g. https://abcdefgh.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  Supabase → Settings → API → service_role key (Secret)
//   RESEND_API_KEY             resend.com → API Keys (Secret)
//   ADMIN_KEY                  any passphrase you choose — unlocks /admin (Secret)
//   NOTIFY_EMAIL               where RSVP notifications go (set in wrangler.jsonc vars)
//   RSVP_FROM_EMAIL            optional; defaults to Resend's onboarding sender

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
  ADMIN_KEY: string;
  NOTIFY_EMAIL: string;
  RSVP_FROM_EMAIL?: string;
}

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

async function handleRsvpSubmit(request: Request, env: Env): Promise<Response> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: "RSVP isn't configured yet" }, 503);
  }

  let body: { name?: unknown; attending?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const attending = body.attending;
  if (!name || name.length > 200 || typeof attending !== "boolean") {
    return json({ error: "A name and a yes/no are required" }, 400);
  }

  const dbRes = await fetch(`${env.SUPABASE_URL}/rest/v1/rsvps`, {
    method: "POST",
    headers: { ...supabaseHeaders(env), Prefer: "return=minimal" },
    body: JSON.stringify({ name, attending }),
  });
  if (!dbRes.ok) {
    return json({ error: "Could not save your RSVP" }, 502);
  }

  // Notify via Resend. The RSVP is already saved — a mail failure shouldn't
  // fail the request, so errors are swallowed deliberately.
  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.RSVP_FROM_EMAIL || "Wedding RSVP <onboarding@resend.dev>",
          to: [env.NOTIFY_EMAIL],
          subject: `RSVP: ${name} ${attending ? "joyfully accepts 🎉" : "regretfully declines"}`,
          html: `<p><strong>${name}</strong> has RSVPed: <strong>${
            attending ? "Joyfully accepts" : "Regretfully declines"
          }</strong></p><p>View everyone at your /admin page or in Supabase.</p>`,
        }),
      });
    } catch {
      // ignore — notification only
    }
  }

  return json({ ok: true });
}

async function handleRsvpList(request: Request, env: Env): Promise<Response> {
  const auth = request.headers.get("Authorization") ?? "";
  if (!env.ADMIN_KEY || auth !== `Bearer ${env.ADMIN_KEY}`) {
    return json({ error: "Unauthorized" }, 401);
  }

  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/rsvps?select=name,attending,created_at&order=created_at.desc`,
    { headers: supabaseHeaders(env) }
  );
  if (!res.ok) {
    return json({ error: "Could not load RSVPs" }, 502);
  }
  return json(await res.json());
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/rsvp" && request.method === "POST") {
      return handleRsvpSubmit(request, env);
    }
    if (url.pathname === "/api/rsvps" && request.method === "GET") {
      return handleRsvpList(request, env);
    }
    if (url.pathname.startsWith("/api/")) {
      return json({ error: "Not found" }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
