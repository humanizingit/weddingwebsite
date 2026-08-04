"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function getParts(): Parts | null {
  const diff = new Date(siteConfig.weddingDateISO).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

export default function Countdown() {
  // Start as undefined so the server render and first client render match,
  // then fill in after mount to avoid a hydration mismatch.
  const [parts, setParts] = useState<Parts | null | undefined>(undefined);

  useEffect(() => {
    setParts(getParts());
    const id = setInterval(() => setParts(getParts()), 1000);
    return () => clearInterval(id);
  }, []);

  if (parts === null) {
    return (
      <p className="font-script text-3xl text-sage-deep">
        Just married!
      </p>
    );
  }

  const blocks: { label: string; value: string }[] = [
    { label: "Days", value: parts ? String(parts.days) : "—" },
    { label: "Hours", value: parts ? String(parts.hours).padStart(2, "0") : "—" },
    { label: "Minutes", value: parts ? String(parts.minutes).padStart(2, "0") : "—" },
    { label: "Seconds", value: parts ? String(parts.seconds).padStart(2, "0") : "—" },
  ];

  return (
    <div className="flex items-start justify-center gap-6 md:gap-10">
      {blocks.map((b, i) => (
        <div key={b.label} className="flex items-start gap-6 md:gap-10">
          {i > 0 && <span className="mt-2 font-display text-3xl text-champagne">·</span>}
          <div className="text-center">
            <p className="font-display text-4xl font-light tabular-nums md:text-5xl">
              {b.value}
            </p>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-taupe">
              {b.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
