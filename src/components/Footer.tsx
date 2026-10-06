import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-champagne/40 bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-12 text-center sm:py-14">
        <p className="font-display text-3xl font-light tracking-[0.04em] sm:text-4xl">
          {siteConfig.couple.partner1}{" "}
          <span className="italic text-sage-deep">&amp;</span> {siteConfig.couple.partner2}
        </p>
        <p className="mt-4 flex flex-col gap-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-taupe sm:flex-row sm:gap-3 sm:text-[0.7rem] sm:tracking-[0.3em]">
          <span>{siteConfig.weddingDateDisplay}</span>
          <span aria-hidden className="hidden sm:inline">
            ·
          </span>
          <span>{siteConfig.location}</span>
        </p>
        <span className="my-6 h-px w-12 bg-champagne" />
        <p className="text-sm leading-relaxed text-taupe">
          Questions? Write to us at <br className="sm:hidden" />
          <a
            href={`mailto:${siteConfig.email}`}
            className="break-all underline decoration-champagne underline-offset-4 hover:text-charcoal"
          >
            {siteConfig.email}
          </a>
        </p>
        <p className="mt-4 text-sm tracking-[0.12em] text-sage-deep">
          {siteConfig.couple.hashtag}
        </p>
      </div>
    </footer>
  );
}
