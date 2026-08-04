import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-champagne/40 bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-14 text-center">
        <p className="font-script text-4xl">
          {siteConfig.couple.partner1} &amp; {siteConfig.couple.partner2}
        </p>
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-taupe">
          {siteConfig.weddingDateDisplay} · {siteConfig.location}
        </p>
        <span className="my-2 h-px w-16 bg-champagne" />
        <p className="text-sm text-taupe">
          Questions? Write to us at{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="underline decoration-champagne underline-offset-4 hover:text-charcoal"
          >
            {siteConfig.email}
          </a>
        </p>
        <p className="font-display text-lg italic text-sage-deep">
          {siteConfig.couple.hashtag}
        </p>
      </div>
    </footer>
  );
}
