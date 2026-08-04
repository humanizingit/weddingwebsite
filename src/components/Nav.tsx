"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/events", label: "Events" },
  { href: "/travel", label: "Travel" },
  { href: "/gallery", label: "Gallery" },
  { href: "/registry", label: "Registry" },
  { href: "/faq", label: "FAQ" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-champagne/40 bg-ivory/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-script text-3xl leading-none text-charcoal"
          onClick={() => setOpen(false)}
        >
          {siteConfig.couple.partner1[0]}
          <span className="px-0.5 text-2xl text-champagne">&amp;</span>
          {siteConfig.couple.partner2[0]}
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[0.7rem] uppercase tracking-[0.22em] transition-colors hover:text-sage-deep ${
                isActive(l.href) ? "text-sage-deep" : "text-charcoal/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/rsvp"
            className="rounded-full border border-charcoal px-5 py-2 text-[0.7rem] uppercase tracking-[0.22em] transition-colors hover:bg-charcoal hover:text-ivory"
          >
            RSVP
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span
            className={`h-px w-6 bg-charcoal transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-charcoal transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-champagne/40 bg-ivory md:hidden">
          <div className="flex flex-col items-center gap-5 py-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`text-xs uppercase tracking-[0.25em] ${
                  isActive(l.href) ? "text-sage-deep" : "text-charcoal/80"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/rsvp"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full border border-charcoal px-8 py-2.5 text-xs uppercase tracking-[0.25em]"
            >
              RSVP
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
