import type { Metadata } from "next";
import CalendarDownload from "@/components/CalendarDownload";
import EventCard from "@/components/EventCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { events, allEventsAnnounced } from "@/data/site";

export const metadata: Metadata = { title: "Events — Alisha & Neel" };

const groups = [
  { side: "Alisha", eyebrow: "for the bride", title: "Alisha's Celebrations" },
  { side: "Neel", eyebrow: "for the groom", title: "Neel's Celebrations" },
  { side: "Together", eyebrow: "hand in hand", title: "The Wedding" },
] as const;

export default function EventsPage() {
  return (
    <div className="px-5 py-16 md:py-24">
      <SectionHeading
        as="h1"
        eyebrow="the celebrations"
        title="Events"
        subtitle={
          allEventsAnnounced
            ? "A classic Indian wedding — each family hosts its own ceremonies through the week, and then we all come together for the wedding day. Every ceremony has its own meaning; here's what to expect. Venues and final timings will be shared with the formal invitation."
            : "A classic Indian wedding — each family hosts its own ceremonies, and then we all come together for the wedding day. Neel's side is set below; Alisha's side celebrations will be announced soon. Every ceremony has its own meaning; here's what to expect."
        }
      />

      <div className="mt-8 text-center">
        <CalendarDownload />
      </div>

      <div className="mx-auto mt-4 max-w-6xl space-y-20">
        {groups.map((group) => {
          const groupEvents = events.filter((ev) => ev.side === group.side);
          if (groupEvents.length === 0) return null;
          return (
            <section key={group.side}>
              <Reveal className="mt-16 text-center">
                <p className="font-script text-3xl text-sage-deep">{group.eyebrow}</p>
                <h2 className="mt-2 font-display text-3xl font-light uppercase tracking-[0.2em]">
                  {group.title}
                </h2>
                <span className="mx-auto mt-5 block h-px w-12 bg-champagne" />
              </Reveal>
              <div
                className={
                  groupEvents.length === 1
                    ? "mx-auto mt-10 max-w-xl"
                    : "mt-10 grid gap-8 md:grid-cols-2"
                }
              >
                {groupEvents.map((ev, i) => (
                  <Reveal key={ev.side + ev.name} delay={(i % 2) * 100} className="h-full">
                    <EventCard event={ev} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
