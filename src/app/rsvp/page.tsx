import type { Metadata } from "next";
import RsvpForm from "@/components/RsvpForm";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = { title: "RSVP — Alisha & Neel" };

export default function RsvpPage() {
  return (
    <div className="px-5 py-16 md:py-24">
      <SectionHeading
        as="h1"
        eyebrow="kindly reply"
        title="RSVP"
        subtitle="We hope you can join us! Please respond by October 1, 2026 so we can plan every detail with you in mind."
      />
      <div className="mx-auto mt-16 max-w-2xl">
        <RsvpForm />
      </div>
    </div>
  );
}
