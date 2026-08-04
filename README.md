# Alisha & Neel — Wedding Website 💍

A wedding website for **Alisha & Neel Patel** — January 29, 2027 · South Gujarat, India.
Built with Next.js + Tailwind CSS, exported as a fully static site (free to host anywhere).

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Customize everything in one file

Almost all content lives in **`src/data/site.ts`** — edit it to update:

- Names, wedding date, location, hashtag, contact email
- **Events** — dates, times, venues, attire, descriptions, and which side hosts each
  (`side: "Alisha" | "Neel" | "Together"`). Each event's `startISO`/`endISO` feed the
  "Add to Calendar" (.ics) download.
- **Our Story** milestones (replace the placeholder prose with your real story!)
- **Travel** — the Mumbai arrival info, **group flights list** (`travel.flights.list`),
  sprinter-van transfer note, and **hotels list** (`travel.hotels.list`); commented
  examples show the shape. Empty lists show a tasteful "coming soon" note.
- **Villages** — the two map embeds (Koli Bhatana & Jespore) come from `villages`;
  tweak `mapQuery` if Google Maps needs a more specific address.
- **Registry** — add your registry / honeymoon-fund links in `registry.links`
- **Gallery** image list
- **FAQs**

## Turn on the RSVP form (2 minutes)

1. Create a free account at [formspree.io](https://formspree.io) and click **New Form**
2. Copy the form ID from your endpoint URL — e.g. `https://formspree.io/f/xabcdefg` → `xabcdefg`
3. Paste it into `formspreeId` in `src/data/site.ts`

RSVPs will then arrive in your email inbox (and the Formspree dashboard). Until the ID
is set, the form shows guests a friendly "email us instead" note.

## Replace the placeholder images

Drop your real photos into `public/images/` using the same filenames
(`hero.svg` → `hero.jpg` etc. — if you change filenames/extensions, update the paths in
`src/data/site.ts` and the hero/story images in `src/app/page.tsx` and
`src/app/our-story/page.tsx`). Portrait photos (3:4) look best in the arch frames.

## Deploy (free)

```bash
npm run build
```

The static site is exported to `out/`. Easiest options:

- **Vercel** — `npx vercel` or connect the repo at vercel.com (zero config)
- **Netlify** — drag the `out/` folder into app.netlify.com/drop
- **GitHub Pages** — push `out/` to a `gh-pages` branch

Then point a custom domain (e.g. `alishaandneel.com`) at it from your host's dashboard.
