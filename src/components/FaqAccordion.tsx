import { faqs } from "@/data/site";

export default function FaqAccordion() {
  return (
    <div className="divide-y divide-champagne/40 border-y border-champagne/40">
      {faqs.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-display text-xl font-medium">{f.q}</span>
            <span
              aria-hidden
              className="shrink-0 font-display text-2xl font-light text-champagne transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/80">
            {f.a}
          </p>
        </details>
      ))}
    </div>
  );
}
