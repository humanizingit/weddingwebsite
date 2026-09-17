import type { WeddingEvent } from "@/data/site";

export default function EventCard({ event }: { event: WeddingEvent }) {
  return (
    <article className="flex h-full flex-col rounded-t-[3rem] border border-champagne/50 bg-cream px-8 pb-8 pt-10 text-center shadow-sm">
      <p className="text-[0.6rem] uppercase tracking-[0.3em] text-taupe">
        {event.side === "Together" ? "Alisha & Neel" : `${event.side}'s side`}
      </p>
      <p className="mt-3 font-script text-2xl text-sage-deep">{event.gujaratiName ?? " "}</p>
      <h3 className="mt-1 font-display text-3xl font-light uppercase tracking-[0.15em]">
        {event.name}
      </h3>
      <span className="mx-auto mt-5 h-px w-12 bg-champagne" />

      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-taupe">When</dt>
          <dd className="mt-1">
            {event.date}
            <br />
            {event.time}
          </dd>
        </div>
        <div>
          <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-taupe">Where</dt>
          <dd className="mt-1">
            {event.venue}
            {event.venueLink && (
              <a
                href={event.venueLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-sage-deep underline decoration-champagne underline-offset-4 transition-colors hover:text-charcoal"
              >
                View on map
              </a>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-taupe">Attire</dt>
          <dd className="mt-1">{event.attire}</dd>
        </div>
      </dl>

      <p className="mt-6 text-sm leading-relaxed text-charcoal/85">{event.description}</p>

      <div className="mt-auto pt-6">
        <div className="rounded-2xl bg-sage-mist/50 px-5 py-4 text-left">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-sage-deep">
            About the tradition
          </p>
          <p className="mt-2 font-display text-[0.95rem] italic leading-relaxed text-charcoal/80">
            {event.tradition}
          </p>
        </div>
      </div>
    </article>
  );
}
