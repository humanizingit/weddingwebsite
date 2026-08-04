"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { gallery } from "@/data/site";

export default function GalleryGrid() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % gallery.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {gallery.map((g, i) => (
          <button
            key={g.src}
            onClick={() => setLightbox(i)}
            className={`group overflow-hidden bg-cream transition-transform duration-300 hover:-translate-y-1 ${
              i % 2 === 0 ? "rounded-t-full" : "rounded-b-full"
            }`}
            aria-label={`View photo: ${g.alt}`}
          >
            <img
              src={g.src}
              alt={g.alt}
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/90 p-6 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute right-6 top-6 text-3xl font-light text-ivory/80 hover:text-ivory"
            aria-label="Close"
          >
            ×
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-4xl font-light text-ivory/70 hover:text-ivory md:left-8"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lightbox - 1 + gallery.length) % gallery.length);
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <figure className="max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={gallery[lightbox].src}
              alt={gallery[lightbox].alt}
              className="max-h-[80vh] rounded-t-[8rem] object-contain"
            />
            <figcaption className="mt-4 text-center text-xs uppercase tracking-[0.25em] text-ivory/70">
              {gallery[lightbox].alt}
            </figcaption>
          </figure>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-4xl font-light text-ivory/70 hover:text-ivory md:right-8"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lightbox + 1) % gallery.length);
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
