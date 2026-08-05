import type { Metadata } from "next";
import AdminRsvps from "@/components/AdminRsvps";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Guest List — Alisha & Neel",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="px-5 py-16 md:py-24">
      <SectionHeading
        as="h1"
        eyebrow="for the couple"
        title="Guest List"
        subtitle="Enter the admin key to see everyone who has RSVPed. Responses live in Supabase — this page pulls them in real time."
      />
      <div className="mx-auto mt-16 max-w-3xl">
        <AdminRsvps />
      </div>
    </div>
  );
}
