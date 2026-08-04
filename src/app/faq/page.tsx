import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = { title: "FAQ — Alisha & Neel" };

export default function FaqPage() {
  return (
    <div className="px-5 py-16 md:py-24">
      <SectionHeading
        as="h1"
        eyebrow="questions &"
        title="Answers"
        subtitle="Everything our guests ask most — and if you don't find your answer here, just reach out."
      />
      <div className="mx-auto mt-16 max-w-3xl">
        <FaqAccordion />
      </div>
    </div>
  );
}
