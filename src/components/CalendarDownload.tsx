"use client";

import { events, siteConfig } from "@/data/site";

/** 2027-01-26T15:00:00+05:30 → 20270126T093000Z (UTC, RFC 5545 format) */
function toUTC(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function esc(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** RFC 5545 line folding — max 75 octets per line, continuations indented */
function fold(line: string) {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  out.push(rest);
  return out.join("\r\n");
}

export function buildIcs() {
  const stamp = toUTC(new Date().toISOString());
  const coupleNames = `${siteConfig.couple.partner1} & ${siteConfig.couple.partner2}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${coupleNames} Wedding//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const ev of events) {
    const label = ev.side === "Together" ? ev.name : `${ev.name} (${ev.side}'s side)`;
    const slug = `${ev.side}-${ev.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${slug}@alisha-neel-wedding`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toUTC(ev.startISO)}`,
      `DTEND:${toUTC(ev.endISO)}`,
      fold(`SUMMARY:${esc(`${label} — ${coupleNames}'s Wedding`)}`),
      fold(`DESCRIPTION:${esc(`${ev.description} Attire: ${ev.attire}`)}`),
      fold(`LOCATION:${esc(`${ev.venue}, ${siteConfig.location}`)}`),
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export default function CalendarDownload({ className = "" }: { className?: string }) {
  function download() {
    const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alisha-and-neel-wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      className={`inline-flex items-center gap-2 rounded-full border border-charcoal px-8 py-3 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-charcoal hover:text-ivory ${className}`}
    >
      <span aria-hidden>📅</span> Add to calendar
    </button>
  );
}
