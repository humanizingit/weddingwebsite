import Link from "next/link";
import ArchImage from "@/components/ArchImage";
import CalendarDownload from "@/components/CalendarDownload";
import Countdown from "@/components/Countdown";
import Reveal from "@/components/Reveal";
import { siteConfig, events, story, allEventsAnnounced } from "@/data/site";

export default function HomePage() {
  return (
    <>
      {/* Hero — an echo of the save-the-date */}
      <section className="px-5 pb-20 pt-14 md:pt-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <h1 className="font-display text-4xl font-light uppercase tracking-[0.3em] text-champagne md:text-6xl">
              We&apos;re getting married
            </h1>
          </Reveal>
          <Reveal delay={150} className="mt-10 w-full max-w-md md:mt-12">
            <ArchImage
              src="/images/hero.webp"
              alt={`${siteConfig.couple.partner1} and ${siteConfig.couple.partner2}`}
              className="aspect-[3/4] w-full"
            />
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-10 font-script text-6xl leading-tight md:text-7xl">
              {siteConfig.couple.partner1}{" "}
              <span className="text-champagne">&amp;</span>{" "}
              {siteConfig.couple.partner2}
            </p>
            <p className="mt-6 font-display text-2xl font-light uppercase tracking-[0.35em] md:text-3xl">
              {siteConfig.weddingDateDisplay}
            </p>
            <p className="mt-3 font-display text-xl font-light tracking-[0.15em] text-taupe">
              {siteConfig.location}
            </p>
            <p className="mt-4 font-display text-lg italic text-sage-deep">
              formal invitation to follow
            </p>
          </Reveal>
        </div>
      </section>

      {/* Countdown */}
      <section className="border-y border-champagne/40 bg-cream px-5 py-14">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="mb-8 font-script text-4xl text-sage-deep">counting down to forever</p>
          <Countdown />
          <div className="mt-10">
            <CalendarDownload />
          </div>
        </Reveal>
      </section>

      {/* Story teaser */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <ArchImage
              src="/images/first-photo.webp"
              alt="Alisha and Neel — their first photo together"
              className="mx-auto aspect-[3/4] w-full max-w-sm"
            />
          </Reveal>
          <Reveal delay={150} className="text-center md:text-left">
            <p className="font-script text-4xl text-sage-deep">our story</p>
            <h2 className="mt-3 font-display text-4xl font-light uppercase tracking-[0.18em]">
              Two hearts,
              <br />
              one journey
            </h2>
            <p className="mt-6 leading-relaxed text-charcoal/80">{story.intro}</p>
            <Link
              href="/our-story"
              className="mt-8 inline-block rounded-full border border-charcoal px-8 py-3 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-charcoal hover:text-ivory"
            >
              Read our story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Events overview */}
      <section className="border-y border-champagne/40 bg-cream px-5 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="font-script text-4xl text-sage-deep">the celebrations</p>
            <h2 className="mt-3 font-display text-4xl font-light uppercase tracking-[0.18em]">
              {allEventsAnnounced ? "Four days of joy" : "The celebrations begin"}
            </h2>
          </Reveal>
          <div
            className={
              events.length > 1
                ? "mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5"
                : "mx-auto mt-12 max-w-sm"
            }
          >
            {events.map((ev, i) => (
              <Reveal key={ev.side + ev.name} delay={(i % 4) * 100}>
                <p className="font-script text-xl text-sage-deep">
                  {ev.side === "Together" ? "together" : `${ev.side}'s side`}
                </p>
                <p className="mt-1 font-display text-xl font-medium uppercase tracking-[0.12em]">
                  {ev.name}
                </p>
                <span className="mx-auto my-3 block h-px w-8 bg-champagne" />
                <p className="text-xs uppercase tracking-[0.2em] text-taupe">{ev.date}</p>
                <p className="mt-2 text-sm text-charcoal/80">{ev.location}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <p className="mt-12 font-display text-lg italic text-sage-deep">
              {allEventsAnnounced
                ? "venues, timings & full details coming soon"
                : "Alisha's side celebrations & remaining venue details coming soon"}
            </p>
            <Link
              href="/events"
              className="mt-6 inline-block rounded-full border border-charcoal px-8 py-3 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-charcoal hover:text-ivory"
            >
              View all events
            </Link>
          </Reveal>
        </div>
      </section>

      {/* RSVP CTA */}
      <section className="bg-sage-mist/40 px-5 py-24 text-center">
        <Reveal className="mx-auto max-w-2xl">
          <p className="font-script text-5xl text-sage-deep md:text-6xl">
            will you join us?
          </p>
          <p className="mx-auto mt-6 max-w-md text-charcoal/80">
            We&apos;d be honored to have you with us in {siteConfig.location}. Let us
            know if you can make it!
          </p>
          <Link
            href="/rsvp"
            className="mt-10 inline-block rounded-full border border-charcoal bg-charcoal px-12 py-4 text-xs uppercase tracking-[0.3em] text-ivory transition-colors hover:bg-transparent hover:text-charcoal"
          >
            RSVP
          </Link>
        </Reveal>
      </section>
    </>
  );
}
