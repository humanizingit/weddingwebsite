"use client";

import { useState } from "react";
import { siteConfig, events } from "@/data/site";

type Status = "idle" | "sending" | "success" | "error" | "unconfigured";

const inputClass =
  "w-full rounded-lg border border-champagne/60 bg-cream px-4 py-3 text-sm outline-none transition-colors placeholder:text-taupe/60 focus:border-sage-deep";

const labelClass = "mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-taupe";

export default function RsvpForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [attending, setAttending] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (!siteConfig.formspreeId) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${siteConfig.formspreeId}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-t-[3rem] border border-champagne/50 bg-cream px-8 py-16 text-center">
        <p className="font-script text-5xl text-sage-deep">Thank you!</p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-charcoal/80">
          Your RSVP has been received — we can&apos;t wait to celebrate with you in
          Gujarat. Keep an eye on your inbox for the formal invitation and travel
          details.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-t-[3rem] border border-champagne/50 bg-cream px-6 py-10 md:px-10"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name *
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Will you be attending? *</legend>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { value: "Joyfully accepts", label: "Joyfully accept" },
            { value: "Regretfully declines", label: "Regretfully decline" },
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
                onChange={(e) => setAttending(e.target.value)}
                className="accent-sage-deep"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {attending !== "Regretfully declines" && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="guests" className={labelClass}>
                Number of guests (including you)
              </label>
              <select id="guests" name="guests" className={inputClass} defaultValue="1">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dietary" className={labelClass}>
                Dietary restrictions
              </label>
              <input
                id="dietary"
                name="dietary"
                placeholder="Vegetarian, vegan, allergies…"
                className={inputClass}
              />
            </div>
          </div>

          <fieldset>
            <legend className={labelClass}>Which events will you join?</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {events.map((ev) => {
                const eventLabel =
                  ev.side === "Together" ? ev.name : `${ev.name} — ${ev.side}'s side`;
                return (
                  <label
                    key={ev.side + ev.name}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-champagne/60 px-4 py-3 text-sm transition-colors hover:border-champagne has-checked:border-sage-deep has-checked:bg-sage-mist/60"
                  >
                    <input
                      type="checkbox"
                      name="events"
                      value={eventLabel}
                      className="accent-sage-deep"
                    />
                    <span>
                      {eventLabel}
                      <span className="block text-xs text-taupe">{ev.date}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="flight" className={labelClass}>
              Flight / travel details (if known)
            </label>
            <input
              id="flight"
              name="flight"
              placeholder="e.g. Air India 119, arriving BOM Jan 23 — helps us plan your van pickup"
              className={inputClass}
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="message" className={labelClass}>
          A note for the couple
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Share your excitement, questions, or well wishes…"
          className={inputClass}
        />
      </div>

      {status === "unconfigured" && (
        <p className="rounded-lg bg-blush/50 px-4 py-3 text-center text-sm text-charcoal/80">
          Online RSVP isn&apos;t live quite yet — we&apos;re putting the finishing
          touches on it. In the meantime, email us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-2">
            {siteConfig.email}
          </a>
          .
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-blush/50 px-4 py-3 text-center text-sm text-charcoal/80">
          Something went wrong sending your RSVP. Please try again, or email us at{" "}
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
          {status === "sending" ? "Sending…" : "Send RSVP"}
        </button>
      </div>
    </form>
  );
}
