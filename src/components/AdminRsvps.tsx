"use client";

import { useState } from "react";

type Rsvp = {
  name: string;
  email: string | null;
  phone: string | null;
  wishes: string | null;
  attending: boolean;
  created_at: string;
  updated_at: string | null;
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
  created_at: string;
  updated_at: string | null;
};

const thClass = "px-4 py-3 font-normal";

// "2027-01-25" + "14:30" → "Mon, Jan 25 · 2:30 PM" (airport-local, no timezone shift)
function formatWhen(date: string | null, time: string | null) {
  if (!date) return "";
  const day = new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  if (!time) return day;
  const clock = new Date(`${date}T${time}:00`).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} · ${clock}`;
}

// Saves rows as a spreadsheet-friendly CSV file.
function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const columns = Object.keys(rows[0]);
  const cell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [columns.join(","), ...rows.map((r) => columns.map((c) => cell(r[c])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Stats({ items }: { items: { label: string; value: number }[] }) {
  return (
    <div className="mx-auto grid max-w-lg grid-cols-3 gap-4 text-center">
      {items.map((s) => (
        <div key={s.label} className="rounded-t-[2rem] border border-champagne/50 bg-cream px-4 pb-4 pt-6">
          <p className="font-display text-4xl font-light">{s.value}</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-taupe">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ title, onDownload }: { title: string; onDownload?: () => void }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h2 className="font-display text-2xl font-light uppercase tracking-[0.18em]">{title}</h2>
      {onDownload && (
        <button
          type="button"
          onClick={onDownload}
          className="rounded-full border border-charcoal px-5 py-2 text-[0.65rem] uppercase tracking-[0.25em] transition-colors hover:bg-charcoal hover:text-ivory"
        >
          Download CSV
        </button>
      )}
    </div>
  );
}

export default function AdminRsvps() {
  const [adminKey, setAdminKey] = useState("");
  const [rows, setRows] = useState<Rsvp[] | null>(null);
  const [plans, setPlans] = useState<TravelPlan[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${adminKey}` };
      const [rsvpRes, travelRes] = await Promise.all([
        fetch("/api/rsvps", { headers }),
        fetch("/api/travel-plans", { headers }),
      ]);
      if (rsvpRes.status === 401) {
        setError("That admin key isn't right.");
        setRows(null);
        setPlans(null);
      } else if (!rsvpRes.ok || !travelRes.ok) {
        setError("Could not load the lists — check that the worker is deployed and its secrets are set.");
        setRows(null);
        setPlans(null);
      } else {
        setRows(await rsvpRes.json());
        setPlans(await travelRes.json());
      }
    } catch {
      setError("Network error — the API is only available on the deployed site (or `npx wrangler dev`).");
    }
    setLoading(false);
  }

  const accepted = rows?.filter((r) => r.attending) ?? [];
  const declined = rows?.filter((r) => !r.attending) ?? [];
  const travellers = plans?.reduce((sum, p) => sum + p.party_size, 0) ?? 0;
  const vanSeats = plans?.reduce((sum, p) => sum + (p.needs_transfer ? p.party_size : 0), 0) ?? 0;

  return (
    <div className="space-y-10">
      <form onSubmit={load} className="mx-auto flex max-w-md gap-3">
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="Admin key"
          required
          className="w-full rounded-lg border border-champagne/60 bg-cream px-4 py-3 text-sm outline-none transition-colors placeholder:text-taupe/60 focus:border-sage-deep"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-full border border-charcoal bg-charcoal px-6 py-2 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-transparent hover:text-charcoal disabled:opacity-60"
        >
          {loading ? "Loading…" : "View"}
        </button>
      </form>

      {error && (
        <p className="mx-auto max-w-md rounded-lg bg-blush/50 px-4 py-3 text-center text-sm text-charcoal/80">
          {error}
        </p>
      )}

      {rows && (
        <section className="space-y-8">
          <SectionTitle
            title="RSVPs"
            onDownload={rows.length ? () => downloadCsv("rsvps.csv", rows) : undefined}
          />
          <Stats
            items={[
              { label: "Total", value: rows.length },
              { label: "Accepted", value: accepted.length },
              { label: "Declined", value: declined.length },
            ]}
          />

          {rows.length === 0 ? (
            <p className="text-center text-sm text-taupe">No RSVPs yet — check back soon!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-y border-champagne/40 text-left text-sm">
                <thead>
                  <tr className="border-b border-champagne/40 text-[0.65rem] uppercase tracking-[0.25em] text-taupe">
                    <th className={thClass}>Name</th>
                    <th className={thClass}>Contact</th>
                    <th className={thClass}>Response</th>
                    <th className={thClass}>Wishes</th>
                    <th className={thClass}>Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-champagne/30">
                  {rows.map((r, i) => (
                    <tr key={`${r.name}-${r.created_at}-${i}`} className="align-top">
                      <td className="px-4 py-3 font-display text-base">{r.name}</td>
                      <td className="px-4 py-3">
                        {r.email && (
                          <a href={`mailto:${r.email}`} className="block underline-offset-2 hover:underline">
                            {r.email}
                          </a>
                        )}
                        {r.phone && <span className="block text-taupe">{r.phone}</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {r.attending ? (
                          <span className="text-sage-deep">Joyfully accepts</span>
                        ) : (
                          <span className="text-taupe">Regretfully declines</span>
                        )}
                      </td>
                      <td className="max-w-xs whitespace-pre-wrap px-4 py-3 text-charcoal/80">
                        {r.wishes}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-taupe">
                        {new Date(r.created_at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                        {r.updated_at && <span className="block text-xs">edited</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {plans && (
        <section className="space-y-8 pt-6">
          <SectionTitle
            title="Travel plans"
            onDownload={plans.length ? () => downloadCsv("travel-plans.csv", plans) : undefined}
          />
          <Stats
            items={[
              { label: "Groups", value: plans.length },
              { label: "Travellers", value: travellers },
              { label: "Van seats", value: vanSeats },
            ]}
          />

          {plans.length === 0 ? (
            <p className="text-center text-sm text-taupe">No travel plans yet — check back soon!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-y border-champagne/40 text-left text-sm">
                <thead>
                  <tr className="border-b border-champagne/40 text-[0.65rem] uppercase tracking-[0.25em] text-taupe">
                    <th className={thClass}>Name</th>
                    <th className={thClass}>Group</th>
                    <th className={thClass}>Arriving</th>
                    <th className={thClass}>Departing</th>
                    <th className={thClass}>Van</th>
                    <th className={thClass}>Staying at</th>
                    <th className={thClass}>Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-champagne/30">
                  {plans.map((p, i) => (
                    <tr key={`${p.name}-${p.created_at}-${i}`} className="align-top">
                      <td className="px-4 py-3">
                        <span className="block font-display text-base">{p.name}</span>
                        <a href={`mailto:${p.email}`} className="block underline-offset-2 hover:underline">
                          {p.email}
                        </a>
                        {p.phone && <span className="block text-taupe">{p.phone}</span>}
                      </td>
                      <td className="max-w-[12rem] px-4 py-3">
                        {p.party_size}
                        {p.party_names && <span className="block text-taupe">{p.party_names}</span>}
                      </td>
                      {(["arrival", "departure"] as const).map((leg) => (
                        <td key={leg} className="px-4 py-3 whitespace-nowrap">
                          {formatWhen(p[`${leg}_date`], p[`${leg}_time`])}
                          <span className="block text-taupe">
                            {[p[`${leg}_airport`], p[`${leg}_flight`]].filter(Boolean).join(" · ")}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {p.needs_transfer === null ? (
                          ""
                        ) : p.needs_transfer ? (
                          <span className="text-sage-deep">Yes</span>
                        ) : (
                          <span className="text-taupe">No</span>
                        )}
                      </td>
                      <td className="max-w-[12rem] px-4 py-3">{p.hotel}</td>
                      <td className="max-w-xs whitespace-pre-wrap px-4 py-3 text-charcoal/80">
                        {p.notes}
                        {p.updated_at && <span className="block text-xs text-taupe">edited</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
