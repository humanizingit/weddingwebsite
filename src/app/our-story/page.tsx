import type { Metadata } from "next";
import ArchImage from "@/components/ArchImage";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { story } from "@/data/site";

export const metadata: Metadata = { title: "Our Story — Alisha & Neel" };

export default function OurStoryPage() {
  return (
    <div className="px-5 py-16 md:py-24">
      <SectionHeading as="h1" eyebrow="the story of" title="Us" subtitle={story.intro} />

      <div className="mx-auto mt-20 max-w-5xl space-y-24">
        {story.milestones.map((m, i) => (
          <Reveal key={m.title}>
            <div
              className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <ArchImage
                src={m.image}
                alt={m.title}
                className="mx-auto aspect-[3/4] w-full max-w-sm"
              />
              <div className={`text-center ${i % 2 === 1 ? "md:text-right" : "md:text-left"}`}>
                <p className="font-script text-3xl text-sage-deep">{m.date}</p>
                <h2 className="mt-2 font-display text-3xl font-light uppercase tracking-[0.18em] md:text-4xl">
                  {m.title}
                </h2>
                <span
                  className={`mx-auto mt-5 block h-px w-12 bg-champagne ${
                    i % 2 === 1 ? "md:ml-auto md:mr-0" : "md:ml-0"
                  }`}
                />
                <p className="mt-6 leading-relaxed text-charcoal/80">{m.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-24 text-center">
        <p className="font-script text-4xl text-sage-deep md:text-5xl">
          …and the best chapter is still to come
        </p>
      </Reveal>
    </div>
  );
}
