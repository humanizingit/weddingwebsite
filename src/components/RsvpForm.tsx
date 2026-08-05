"use client";

import { useState } from "react";
import { siteConfig } from "@/data/site";

type Status = "idle" | "sending" | "success" | "error";

export default function RsvpForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "">("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !attending) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), attending: attending === "yes" }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-t-[3rem] border border-champagne/50 bg-cream px-8 py-16 text-center">
        {attending === "yes" ? (
          <>
            <p className="font-script text-5xl text-sage-deep">See you in Gujarat!</p>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-charcoal/80">
              Your RSVP is in — we can&apos;t wait to celebrate with you. The formal
              invitation and travel details are on their way.
            </p>
          </>
        ) : (
          <>
            <p className="font-script text-5xl text-sage-deep">You&apos;ll be missed</p>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-charcoal/80">
              Thank you for letting us know — we&apos;ll be thinking of you as we
              celebrate.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-t-[3rem] border border-champagne/50 bg-cream px-6 py-10 md:px-10"
    >
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-taupe"
        >
          Full name *
        </label>
        <input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg border border-champagne/60 bg-cream px-4 py-3 text-sm outline-none transition-colors placeholder:text-taupe/60 focus:border-sage-deep"
        />
      </div>

      <fieldset>
        <legend className="mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-taupe">
          Will you be attending? *
        </legend>
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
          {status === "sending" ? "Sending…" : "Send RSVP"}
        </button>
      </div>
    </form>
  );
}
