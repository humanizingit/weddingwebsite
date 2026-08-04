import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { registry } from "@/data/site";

export const metadata: Metadata = { title: "Registry — Alisha & Neel" };

export default function RegistryPage() {
  return (
    <div className="px-5 py-16 md:py-24">
      <SectionHeading
        as="h1"
        eyebrow="with gratitude"
        title="Registry"
        subtitle={registry.intro}
      />

      <div className="mx-auto mt-16 grid max-w-3xl gap-8 md:grid-cols-2">
        {registry.links.map((link, i) => (
          <Reveal key={link.name} delay={i * 100} className="h-full">
            <div className="flex h-full flex-col rounded-t-[3rem] border border-champagne/50 bg-cream px-8 pb-8 pt-10 text-center">
              <h2 className="font-display text-2xl font-light uppercase tracking-[0.15em]">
                {link.name}
              </h2>
              <span className="mx-auto my-4 block h-px w-10 bg-champagne" />
              <p className="text-sm leading-relaxed text-charcoal/80">{link.description}</p>
              <div className="mt-auto pt-6">
                {link.url ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-charcoal px-8 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] transition-colors hover:bg-charcoal hover:text-ivory"
                  >
                    View
                  </a>
                ) : (
                  <p className="text-xs uppercase tracking-[0.25em] text-taupe">
                    Details coming soon
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-16 max-w-2xl">
        <p className="rounded-2xl bg-blush/40 px-8 py-5 text-center font-display text-lg italic text-charcoal/80">
          {registry.note}
        </p>
      </Reveal>
    </div>
  );
}
