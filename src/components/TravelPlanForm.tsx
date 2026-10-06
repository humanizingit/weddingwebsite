"use client";

import { useEffect, useState } from "react";
import { siteConfig, travel } from "@/data/site";

type Status = "idle" | "loading" | "sending" | "success" | "error";

const AIRPORTS = ["Mumbai (BOM)", "Surat (STV)", "Ahmedabad (AMD)", "Other"];
const HOTELS = [
  ...travel.hotels.list.map((h) => h.name),
  "Staying with family or friends",
  "Not booked yet",
  "Other",
];

const emptyPlan = {
  name: "",
  email: "",
  phone: "",
  party_size: "1",
  party_names: "",
  arrival_airport: AIRPORTS[0],
  arrival_date: "",
  arrival_time: "",
  arrival_flight: "",
  departure_airport: "",
  departure_date: "",
  departure_time: "",
  departure_flight: "",
  needs_transfer: "" as "" | "yes" | "no",
  hotel: "",
  notes: "",
};
type Plan = typeof emptyPlan;

const labelClass = "mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-taupe";
const inputClass =
  "w-full rounded-lg border border-champagne/60 bg-cream px-4 py-3 text-base outline-none md:text-sm transition-colors placeholder:text-taupe/60 focus:border-sage-deep";
// iOS sizes date/time fields on its own unless their native look is reset.
const dateInputClass = `${inputClass} min-w-0 text-left max-md:min-h-[3.125rem] max-md:appearance-none`;
const groupTitleClass =
  "border-b border-champagne/40 pb-2 font-display text-xl font-light uppercase tracking-[0.18em]";

// Keeps a previously saved choice selectable even if it's no longer in the list.
const withCurrent = (options: string[], current: string) =>
  current && !options.includes(current) ? [current, ...options] : options;

export default function TravelPlanForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [plan, setPlan] = useState<Plan>(emptyPlan);
  const [website, setWebsite] = useState(""); // honeypot — real guests never see it
  // Set when the guest arrives via their emailed link (/travel/?edit=<token>),
  // and again after a successful submit so the success screen can link to it.
  const [editToken, setEditToken] = useState("");
  const [editing, setEditing] = useState(false);
  const [badLink, setBadLink] = useState(false);

  const set =
    (key: keyof Plan) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setPlan((p) => ({ ...p, [key]: e.target.value }));

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("edit");
    if (!token) return;

    setStatus("loading");
    fetch(`/api/travel?token=${encodeURIComponent(token)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((saved) => {
        const loaded = { ...emptyPlan };
        for (const key of Object.keys(emptyPlan) as (keyof Plan)[]) {
          if (key === "needs_transfer") {
            loaded.needs_transfer =
              saved.needs_transfer === true ? "yes" : saved.needs_transfer === false ? "no" : "";
          } else {
            loaded[key] = saved[key] == null ? "" : String(saved[key]);
          }
        }
        setPlan(loaded);
        setEditToken(token);
        setEditing(true);
      })
      .catch(() => setBadLink(true))
      .finally(() => setStatus("idle"));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("sending");
    try {
      const res = await fetch(
        editing ? `/api/travel?token=${encodeURIComponent(editToken)}` : "/api/travel",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...plan,
            party_size: Number(plan.party_size),
            needs_transfer: plan.needs_transfer === "" ? null : plan.needs_transfer === "yes",
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
        <p className="text-sm text-taupe">Finding your travel plans…</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-t-[3rem] border border-champagne/50 bg-cream px-8 py-16 text-center">
        <p className="font-script text-5xl text-sage-deep">Safe travels!</p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-charcoal/80">
          Your travel plans are {editing ? "updated" : "in"} — thank you! We&apos;ve emailed a
          copy to <span className="break-all">{plan.email.trim()}</span> with a personal link
          to update them any time.
          {editToken && (
            <>
              {" "}
              You can also{" "}
              <a
                href={`/travel/?edit=${editToken}#travel-plans`}
                className="underline underline-offset-2"
              >
                edit your plans
              </a>{" "}
              right now.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-10 rounded-t-[3rem] border border-champagne/50 bg-cream px-6 py-10 md:px-10"
    >
      {editing && (
        <p className="rounded-lg bg-sage-mist/60 px-4 py-3 text-center text-sm text-charcoal/80">
          Welcome back! Update anything below and save your changes.
        </p>
      )}
      {badLink && (
        <p className="rounded-lg bg-blush/50 px-4 py-3 text-center text-sm text-charcoal/80">
          That edit link isn&apos;t valid any more. You can send your plans again below, or
          use the link from your most recent confirmation email.
        </p>
      )}

      <div className="space-y-6">
        <h3 className={groupTitleClass}>Who&apos;s travelling</h3>
        <div>
          <label htmlFor="travel-name" className={labelClass}>
            Full name *
          </label>
          <input
            id="travel-name"
            required
            maxLength={200}
            autoComplete="name"
            value={plan.name}
            onChange={set("name")}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 md:gap-4">
          <div>
            <label htmlFor="travel-email" className={labelClass}>
              Email *
            </label>
            <input
              id="travel-email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              value={plan.email}
              onChange={set("email")}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="travel-phone" className={labelClass}>
              Phone / WhatsApp
            </label>
            <input
              id="travel-phone"
              type="tel"
              maxLength={40}
              autoComplete="tel"
              value={plan.phone}
              onChange={set("phone")}
              placeholder="+1 555 123 4567"
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-[10rem_1fr] md:gap-4">
          <div>
            <label htmlFor="travel-party-size" className={labelClass}>
              Travellers *
            </label>
            <input
              id="travel-party-size"
              type="number"
              required
              min={1}
              max={30}
              inputMode="numeric"
              value={plan.party_size}
              onChange={set("party_size")}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="travel-party-names" className={labelClass}>
              Who&apos;s with you?
            </label>
            <input
              id="travel-party-names"
              maxLength={500}
              value={plan.party_names}
              onChange={set("party_names")}
              placeholder="Names of everyone in your group"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {(
        [
          { prefix: "arrival", title: "Arriving in India", required: true },
          { prefix: "departure", title: "Heading home", required: false },
        ] as const
      ).map(({ prefix, title, required }) => (
        <div key={prefix} className="space-y-6">
          <h3 className={groupTitleClass}>{title}</h3>
          <div className="grid gap-6 md:grid-cols-2 md:gap-4">
            <div>
              <label htmlFor={`travel-${prefix}-airport`} className={labelClass}>
                Airport
              </label>
              <select
                id={`travel-${prefix}-airport`}
                value={plan[`${prefix}_airport`]}
                onChange={set(`${prefix}_airport`)}
                className={inputClass}
              >
                {!required && <option value="">Not sure yet</option>}
                {withCurrent(AIRPORTS, plan[`${prefix}_airport`]).map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`travel-${prefix}-flight`} className={labelClass}>
                Airline &amp; flight number
              </label>
              <input
                id={`travel-${prefix}-flight`}
                maxLength={60}
                value={plan[`${prefix}_flight`]}
                onChange={set(`${prefix}_flight`)}
                placeholder="e.g. Air India 119"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor={`travel-${prefix}-date`} className={labelClass}>
                Date{required ? " *" : ""}
              </label>
              <input
                id={`travel-${prefix}-date`}
                type="date"
                required={required}
                value={plan[`${prefix}_date`]}
                onChange={set(`${prefix}_date`)}
                className={dateInputClass}
              />
            </div>
            <div>
              <label htmlFor={`travel-${prefix}-time`} className={labelClass}>
                Local time
              </label>
              <input
                id={`travel-${prefix}-time`}
                type="time"
                value={plan[`${prefix}_time`]}
                onChange={set(`${prefix}_time`)}
                className={dateInputClass}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="space-y-6">
        <h3 className={groupTitleClass}>On the ground</h3>
        <fieldset>
          <legend className={labelClass}>Need seats in the van from Mumbai airport?</legend>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { value: "yes" as const, label: "Yes, please" },
              { value: "no" as const, label: "No, we're sorted" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center justify-center gap-3 rounded-lg border px-4 py-3.5 text-sm transition-colors ${
                  plan.needs_transfer === opt.value
                    ? "border-sage-deep bg-sage-mist/60"
                    : "border-champagne/60 hover:border-champagne"
                }`}
              >
                <input
                  type="radio"
                  name="needs_transfer"
                  value={opt.value}
                  checked={plan.needs_transfer === opt.value}
                  onChange={set("needs_transfer")}
                  className="accent-sage-deep"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="travel-hotel" className={labelClass}>
            Where are you staying?
          </label>
          <select
            id="travel-hotel"
            value={plan.hotel}
            onChange={set("hotel")}
            className={inputClass}
          >
            <option value="">Select…</option>
            {withCurrent(HOTELS, plan.hotel).map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="travel-notes" className={labelClass}>
            Anything else we should know?
          </label>
          <textarea
            id="travel-notes"
            rows={3}
            maxLength={2000}
            value={plan.notes}
            onChange={set("notes")}
            placeholder="Connecting flights, extra luggage, mobility needs, a different hotel…"
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="travel-website">Website</label>
        <input
          id="travel-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-blush/50 px-4 py-3 text-center text-sm text-charcoal/80">
          Something went wrong sending your travel plans. Please try again in a moment, or
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
          {status === "sending" ? "Sending…" : editing ? "Save changes" : "Send travel plans"}
        </button>
      </div>
    </form>
  );
}
