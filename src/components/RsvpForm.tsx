"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";

type Status = "idle" | "loading" | "sending" | "success" | "error";

const labelClass = "mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-taupe";
const inputClass =
  "w-full rounded-lg border border-champagne/60 bg-cream px-4 py-3 text-base outline-none md:text-sm transition-colors placeholder:text-taupe/60 focus:border-sage-deep";

export default function RsvpForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wishes, setWishes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — real guests never see it
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  // Set when the guest arrives via their emailed link (/rsvp/?edit=<token>),
  // and again after a successful submit so the success screen can link to it.
  const [editToken, setEditToken] = useState("");
  const [editing, setEditing] = useState(false);
  const [badLink, setBadLink] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("edit");
    if (!token) return;

    setStatus("loading");
    fetch(`/api/rsvp?token=${encodeURIComponent(token)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((rsvp) => {
        setName(rsvp.name ?? "");
        setEmail(rsvp.email ?? "");
        setPhone(rsvp.phone ?? "");
        setWishes(rsvp.wishes ?? "");
        setAttending(rsvp.attending ? "yes" : "no");
        setEditToken(token);
        setEditing(true);
      })
      .catch(() => setBadLink(true))
      .finally(() => setStatus("idle"));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !attending) return;

    setStatus("sending");
    try {
      const res = await fetch(
        editing ? `/api/rsvp?token=${encodeURIComponent(editToken)}` : "/api/rsvp",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            wishes: wishes.trim(),
            attending: attending === "yes",
            website,
          }),
        }
      );
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (typeof data.editToken === "string") setEditToken(data.editToken);
      }
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "loading") {
    return (
      <div className="rounded-t-[3rem] border border-champagne/50 bg-cream px-8 py-16 text-center">
        <p className="text-sm text-taupe">Finding your RSVP…</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-t-[3rem] border border-champagne/50 bg-cream px-8 py-16 text-center">
        {attending === "yes" ? (
          <>
            <p className="font-script text-5xl text-sage-deep">See you in Gujarat!</p>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-charcoal/80">
              Your RSVP is {editing ? "updated" : "in"} — we can&apos;t wait to celebrate
              with you. The formal invitation and travel details are on their way.
            </p>
          </>
        ) : (
          <>
            <p className="font-script text-5xl text-sage-deep">You&apos;ll be missed</p>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-charcoal/80">
              {editing ? "Your RSVP is updated. " : ""}Thank you for letting us know —
              we&apos;ll be thinking of you as we celebrate.
            </p>
          </>
        )}
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-charcoal/80">
          We&apos;ve emailed a confirmation to <span className="break-all">{email.trim()}</span>{" "}
          with a personal link to change your reply any time.
          {editToken && (
            <>
              {" "}
              You can also{" "}
              <a href={`/rsvp/?edit=${editToken}`} className="underline underline-offset-2">
                edit your RSVP
              </a>{" "}
              right now.
            </>
          )}
        </p>
        {attending === "yes" && (
          <a
            href="/travel/#travel-plans"
            className="mt-8 inline-block rounded-full border border-charcoal px-8 py-3 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-charcoal hover:text-ivory"
          >
            Share your travel plans
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-t-[3rem] border border-champagne/50 bg-cream px-6 py-10 md:px-10"
    >
      {editing && (
        <p className="rounded-lg bg-sage-mist/60 px-4 py-3 text-center text-sm text-charcoal/80">
          Welcome back! Update anything below and save your changes.
        </p>
      )}
      {badLink && (
        <p className="rounded-lg bg-blush/50 px-4 py-3 text-center text-sm text-charcoal/80">
          That edit link isn&apos;t valid any more. You can send a new RSVP below, or
          use the link from your most recent confirmation email.
        </p>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          Full name *
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={200}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={40}
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 123 4567"
            className={inputClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Will you be attending? *</legend>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { value: "yes" as const, label: "Joyfully accept" },
            { value: "no" as const, label: "Regretfully decline" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center justify-center gap-3 rounded-lg border px-4 py-3.5 text-sm transition-colors ${
                attending === opt.value
                  ? "border-sage-deep bg-sage-mist/60"
                  : "border-champagne/60 hover:border-champagne"
              }`}
            >
              <input
                type="radio"
                name="attending"
                value={opt.value}
                required
                checked={attending === opt.value}
                onChange={() => setAttending(opt.value)}
                className="accent-sage-deep"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="wishes" className={labelClass}>
          Wishes for the couple
        </label>
        <textarea
          id="wishes"
          name="wishes"
          rows={4}
          maxLength={2000}
          value={wishes}
          onChange={(e) => setWishes(e.target.value)}
          placeholder="A note, a blessing, a favourite memory…"
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-blush/50 px-4 py-3 text-center text-sm text-charcoal/80">
          Something went wrong sending your RSVP. Please try again in a moment, or
          email us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-2">
            {siteConfig.email}
          </a>
          .
        </p>
      )}

      <div className="text-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full border border-charcoal bg-charcoal px-10 py-3.5 text-xs uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-transparent hover:text-charcoal disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : editing ? "Save changes" : "Send RSVP"}
        </button>
      </div>
    </form>
  );
}
