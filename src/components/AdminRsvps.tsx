"use client";

import { useState } from "react";

type Rsvp = { name: string; attending: boolean; created_at: string };

export default function AdminRsvps() {
  const [adminKey, setAdminKey] = useState("");
  const [rows, setRows] = useState<Rsvp[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rsvps", {
        headers: { Authorization: `Bearer ${adminKey}` },
      });
      if (res.status === 401) {
        setError("That admin key isn't right.");
        setRows(null);
      } else if (!res.ok) {
        setError("Could not load RSVPs — check that the worker is deployed and its secrets are set.");
        setRows(null);
      } else {
        setRows(await res.json());
      }
    } catch {
      setError("Network error — the API is only available on the deployed site (or `npx wrangler dev`).");
    }
    setLoading(false);
  }

  const accepted = rows?.filter((r) => r.attending) ?? [];
  const declined = rows?.filter((r) => !r.attending) ?? [];

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
        <>
          <div className="mx-auto grid max-w-lg grid-cols-3 gap-4 text-center">
            {[
              { label: "Total", value: rows.length },
              { label: "Accepted", value: accepted.length },
              { label: "Declined", value: declined.length },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-t-[2rem] border border-champagne/50 bg-cream px-4 pb-4 pt-6"
              >
                <p className="font-display text-4xl font-light">{s.value}</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-taupe">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {rows.length === 0 ? (
            <p className="text-center text-sm text-taupe">No RSVPs yet — check back soon!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-y border-champagne/40 text-left text-sm">
                <thead>
                  <tr className="border-b border-champagne/40 text-[0.65rem] uppercase tracking-[0.25em] text-taupe">
                    <th className="px-4 py-3 font-normal">Name</th>
                    <th className="px-4 py-3 font-normal">Response</th>
                    <th className="px-4 py-3 font-normal">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-champagne/30">
                  {rows.map((r, i) => (
                    <tr key={`${r.name}-${r.created_at}-${i}`}>
                      <td className="px-4 py-3 font-display text-base">{r.name}</td>
                      <td className="px-4 py-3">
                        {r.attending ? (
                          <span className="text-sage-deep">Joyfully accepts</span>
                        ) : (
                          <span className="text-taupe">Regretfully declines</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-taupe">
                        {new Date(r.created_at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
