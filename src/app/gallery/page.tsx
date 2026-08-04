import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = { title: "Gallery — Alisha & Neel" };

export default function GalleryPage() {
  return (
    <div className="px-5 py-16 md:py-24">
      <SectionHeading
        as="h1"
        eyebrow="captured moments"
        title="Gallery"
        subtitle="A few of our favorite frames — with many more to come after the celebrations."
      />
      <div className="mx-auto mt-16 max-w-6xl">
        <GalleryGrid />
      </div>
    </div>
  );
}
