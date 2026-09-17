import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { travel, villages } from "@/data/site";

export const metadata: Metadata = { title: "Travel & Stay — Alisha & Neel" };

export default function TravelPage() {
  return (
    <div className="px-5 py-16 md:py-24">
      <SectionHeading
        as="h1"
        eyebrow="getting there"
        title="Travel & Stay"
        subtitle="Everything you need to plan your journey to South Gujarat — flights, vans, hotels, and what to expect in January."
      />

      {/* Getting there — fly into Mumbai */}
      <section className="mx-auto mt-16 max-w-3xl">
        <Reveal>
          <div className="rounded-t-[3rem] border border-champagne/50 bg-cream px-8 pb-8 pt-10 text-center md:px-12">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-taupe">
              Fly into
            </p>
            <p className="mt-3 font-display text-5xl font-light tracking-[0.2em] text-sage-deep">
              {travel.gettingThere.airportCode}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-taupe">
              {travel.gettingThere.airportName}
            </p>
            <a
              href={travel.gettingThere.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[0.65rem] uppercase tracking-[0.25em] text-sage-deep underline decoration-champagne underline-offset-4 transition-colors hover:text-charcoal"
            >
              View airport on map
            </a>
            <span className="mx-auto my-5 block h-px w-12 bg-champagne" />
            <p className="leading-relaxed text-charcoal/85">{travel.gettingThere.text}</p>
            <p className="mt-4 text-sm italic leading-relaxed text-taupe">
              {travel.gettingThere.alternates}
            </p>
          </div>
        </Reveal>
      </section>

      {/* The villages — map embeds */}
      <section className="mx-auto mt-16 max-w-5xl">
        <Reveal className="text-center">
          <p className="font-script text-3xl text-sage-deep">where it all happens</p>
          <h2 className="mt-2 font-display text-3xl font-light uppercase tracking-[0.2em]">
            The Villages
          </h2>
          <span className="mx-auto mt-5 block h-px w-12 bg-champagne" />
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-taupe">
            The celebrations take place in the families&apos; ancestral villages in South
            Gujarat — Alisha&apos;s side in Koli Bhatana and Neel&apos;s side in Jespor.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {villages.map((v, i) => (
            <Reveal key={v.who} delay={i * 100}>
              <div className="overflow-hidden rounded-t-[3rem] border border-champagne/50 bg-cream">
                <div className="px-6 pb-5 pt-8 text-center">
                  <p className="font-script text-2xl text-sage-deep">
                    {v.who}&apos;s village
                  </p>
                  <p className="mt-1 font-display text-2xl font-light uppercase tracking-[0.15em]">
                    {v.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-taupe">
                    {v.region}
                  </p>
                </div>
                <iframe
                  title={`Map of ${v.name}, ${v.region}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(v.mapQuery)}&z=13&output=embed`}
                  className="h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="px-6 py-4 text-center">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.65rem] uppercase tracking-[0.25em] text-sage-deep underline decoration-champagne underline-offset-4 hover:text-charcoal"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Group flights */}
      <section className="mx-auto mt-16 max-w-3xl">
        <Reveal>
          <div className="border-l-2 border-champagne pl-6">
            <h2 className="font-display text-2xl font-light uppercase tracking-[0.18em]">
              {travel.flights.title}
            </h2>
            <p className="mt-3 leading-relaxed text-charcoal/80">{travel.flights.text}</p>
          </div>
          {travel.flights.list.length > 0 ? (
            <ul className="mt-6 divide-y divide-champagne/40 border-y border-champagne/40">
              {travel.flights.list.map((f) => (
                <li
                  key={`${f.route}-${f.date}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                >
                  <span className="font-display text-xl">{f.route}</span>
                  <span className="text-sm text-charcoal/80">{f.airline}</span>
                  <span className="text-sm text-taupe">{f.date}</span>
                  {f.note && <span className="text-sm italic text-sage-deep">{f.note}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 rounded-2xl bg-blush/40 px-6 py-4 text-center text-sm text-charcoal/75">
              ✈ {travel.flights.comingSoon}
            </p>
          )}
        </Reveal>
      </section>

      {/* Airport transfers */}
      <section className="mx-auto mt-16 max-w-3xl">
        <Reveal>
          <div className="border-l-2 border-champagne pl-6">
            <h2 className="font-display text-2xl font-light uppercase tracking-[0.18em]">
              {travel.transfers.title}
            </h2>
            <p className="mt-3 leading-relaxed text-charcoal/80">{travel.transfers.text}</p>
          </div>
        </Reveal>
      </section>

      {/* Hotels */}
      <section className="mx-auto mt-16 max-w-3xl">
        <Reveal>
          <div className="border-l-2 border-champagne pl-6">
            <h2 className="font-display text-2xl font-light uppercase tracking-[0.18em]">
              {travel.hotels.title}
            </h2>
            <p className="mt-3 leading-relaxed text-charcoal/80">{travel.hotels.text}</p>
          </div>
          {travel.hotels.list.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {travel.hotels.list.map((h) => (
                <div
                  key={h.name}
                  className="rounded-t-[2.5rem] border border-champagne/50 bg-cream px-6 pb-6 pt-8 text-center"
                >
                  <p className="font-display text-2xl font-light">{h.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-taupe">{h.area}</p>
                  <span className="mx-auto my-4 block h-px w-10 bg-champagne" />
                  <p className="text-sm leading-relaxed text-charcoal/80">{h.note}</p>
                  {h.url && (
                    <a
                      href={h.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block rounded-full border border-charcoal px-6 py-2 text-[0.65rem] uppercase tracking-[0.25em] transition-colors hover:bg-charcoal hover:text-ivory"
                    >
                      View hotel
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-sage-mist/50 px-6 py-4 text-center text-sm text-charcoal/75">
              ✦ {travel.hotels.comingSoon}
            </p>
          )}
        </Reveal>
      </section>

      {/* Visa / Weather */}
      <section className="mx-auto mt-16 max-w-3xl space-y-10">
        {[travel.visa, travel.weather].map((s) => (
          <Reveal key={s.title}>
            <div className="border-l-2 border-champagne pl-6">
              <h2 className="font-display text-2xl font-light uppercase tracking-[0.18em]">
                {s.title}
              </h2>
              <p className="mt-3 leading-relaxed text-charcoal/80">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Tips */}
      <section className="mx-auto mt-20 max-w-3xl">
        <Reveal>
          <div className="rounded-t-[3rem] bg-sage-mist/40 px-8 py-10 md:px-12">
            <p className="text-center font-script text-3xl text-sage-deep">good to know</p>
            <ul className="mt-6 space-y-3">
              {travel.tips.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm leading-relaxed text-charcoal/85">
                  <span aria-hidden className="mt-0.5 text-champagne">
                    ✦
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
