"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/site";

type Stage = "hidden" | "closed" | "opening";

const SEEN_KEY = "an-invitation-opened";

const sparkles = [
  { left: "10%", top: "16%", delay: "0s" },
  { left: "86%", top: "20%", delay: "0.9s" },
  { left: "16%", top: "76%", delay: "1.5s" },
  { left: "82%", top: "70%", delay: "0.4s" },
  { left: "50%", top: "8%", delay: "1.2s" },
  { left: "35%", top: "88%", delay: "0.7s" },
];

export default function InvitationIntro() {
  const [stage, setStage] = useState<Stage>("hidden");
  const openingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show once per visit — after mount, so server and first client render match.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      // storage unavailable — still show the invitation
    }
    setStage("closed");
  }, []);

  // Nobody should be stuck at the door: open by itself after a moment.
  useEffect(() => {
    if (stage !== "closed") return;
    const t = setTimeout(open, 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Keep the page from scrolling behind the invitation.
  useEffect(() => {
    if (stage === "hidden") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [stage]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  function open() {
    if (openingRef.current) return;
    openingRef.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStage("opening");
    timerRef.current = setTimeout(
      () => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          // fine — it will simply play again next page load
        }
        setStage("hidden");
      },
      reduced ? 400 : 2900
    );
  }

  if (stage === "hidden") return null;
  const opened = stage === "opening";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open the wedding invitation"
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className={`intro-fade-in fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-ivory transition-opacity duration-700 ease-out motion-reduce:transition-none ${
        opened ? "opacity-0 delay-[2100ms] motion-reduce:delay-0" : "opacity-100"
      }`}
    >
      {/* soft blush / sage wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(232,211,205,0.55),transparent_55%),radial-gradient(circle_at_82%_78%,rgba(168,181,160,0.4),transparent_55%)]"
      />

      {sparkles.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="intro-sparkle"
          style={{ left: s.left, top: s.top, animationDelay: s.delay }}
        >
          ✦
        </span>
      ))}

      <p
        className={`relative font-script text-5xl text-sage-deep transition-opacity duration-500 md:text-6xl ${
          opened ? "opacity-0" : "opacity-100"
        }`}
      >
        You&apos;re invited
      </p>

      {/* envelope */}
      <div className="relative mt-12 w-72 md:w-80" style={{ perspective: "1200px" }}>
        <div className="relative h-48 md:h-52">
          {/* back */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-champagne to-[#b7a488] shadow-xl" />

          {/* invitation card — rises out once the flap opens */}
          <div
            className={`absolute left-1/2 top-2 z-20 w-[86%] -translate-x-1/2 transition-transform duration-[1100ms] ease-out motion-reduce:transition-none ${
              opened ? "-translate-y-[72%] delay-500 motion-reduce:delay-0" : "translate-y-0"
            }`}
          >
            <div className="rounded-b-lg rounded-t-[4.5rem] border border-champagne/60 bg-cream px-6 pb-5 pt-9 text-center shadow-lg">
              <p className="text-[0.55rem] uppercase tracking-[0.3em] text-taupe">
                together with our families
              </p>
              <p className="mt-2 font-script text-4xl text-charcoal">
                {siteConfig.couple.partner1} &amp; {siteConfig.couple.partner2}
              </p>
              <span className="mx-auto mt-3 block h-px w-10 bg-champagne" />
              <p className="mt-3 font-display text-sm font-light uppercase tracking-[0.3em]">
                {siteConfig.weddingDateDisplay}
              </p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-taupe">
                {siteConfig.location}
              </p>
            </div>
          </div>

          {/* front pocket */}
          <div className="absolute inset-0 z-30 rounded-xl bg-gradient-to-b from-[#d9c8af] to-champagne [clip-path:polygon(0_0,50%_44%,100%_0,100%_100%,0_100%)]" />

          {/* flap (with wax seal) — swings open */}
          <div
            className={`absolute inset-x-0 top-0 h-[54%] origin-top transition-transform duration-700 ease-in-out motion-reduce:transition-none ${
              opened ? "z-10 [transform:rotateX(180deg)]" : "z-40"
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 rounded-t-xl bg-gradient-to-b from-[#d3c0a5] to-[#c2ad90] shadow-sm [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
            <div
              className={`absolute left-1/2 top-[92%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-sage-deep/30 bg-sage-deep shadow-md transition-opacity duration-300 [backface-visibility:hidden] ${
                opened ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="font-script text-xl leading-none text-ivory">
                {siteConfig.couple.partner1[0]}&amp;{siteConfig.couple.partner2[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p
        className={`relative mt-10 animate-pulse text-[0.65rem] uppercase tracking-[0.35em] text-taupe transition-opacity duration-300 ${
          opened ? "opacity-0" : "opacity-100"
        }`}
      >
        tap the seal to open
      </p>
    </div>
  );
}
