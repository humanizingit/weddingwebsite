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

## RSVP: Supabase (storage) + Resend (email) via Cloudflare Worker

The RSVP form is intentionally simple — **name, email, phone, yes/no and wishes for
the couple** (everybody's invited to everything!). Submissions go to `POST /api/rsvp`,
handled by the Cloudflare Worker in [`worker/index.ts`](worker/index.ts), which:

1. **Stores** the response in a Supabase table (`rsvps`) — your permanent guest list.
   The database generates a secret **edit token** for each RSVP.
2. **Emails the guest** a confirmation from `rsvp@alishaandneelpatel.com` with their
   details and a personal edit link (`/rsvp/?edit=<token>`) to change their reply
3. **Emails you** a notification — to every address in `NOTIFY_EMAIL`

### One-time setup

**Supabase (storage):**
1. Create a free project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql) (safe to
   re-run). Row level security is on with no public policies, so only the worker's
   service key can touch the table.
3. Grab **Project Settings → API**: the project URL and the `service_role` key

**Resend (email):**
1. Create a free account at [resend.com](https://resend.com) → **API Keys** → create one
2. Verify `alishaandneelpatel.com` under **Domains** — guest confirmations can only
   be sent from a verified domain

**Cloudflare (wire it up):** In the dashboard → Workers & Pages → `weddingwebsite` →
**Settings → Variables and Secrets**, add these as **Secrets**:

| Name | Value |
|---|---|
| `SUPABASE_URL` | your project URL (`https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | the service_role key |
| `RESEND_API_KEY` | your Resend key |
| `ADMIN_KEY` | any passphrase you choose — unlocks the guest list page |

(`NOTIFY_EMAIL` — comma-separated — and `RSVP_FROM_EMAIL` are already set in
`wrangler.jsonc`.) Redeploy after adding them.

### Travel plans

The Travel page has a **Share Your Travel Plans** form (arrival and departure flights,
group size, van seats, hotel). It works exactly like the RSVP form — saved to the
`travel_plans` table, confirmation email with a personal edit link
(`/travel/?edit=<token>`), and a notification to you — via `/api/travel`.

### Viewing your RSVPs and travel plans

- **`/admin` on your live site** — enter your `ADMIN_KEY` to see live counts and the
  full RSVP and travel-plan lists (arrivals sorted by date), each with a
  **Download CSV** button
- **Supabase dashboard** — Table Editor → `rsvps` / `travel_plans`
- **Email** — every submission also lands in your inbox via Resend

### Local testing

`npm run dev` serves only the static site (no API). To test the full RSVP flow
locally, copy the template and fill in your real values:
```bash
cp .dev.vars.example .dev.vars
```
(`.dev.vars` is this project's local env file — the Workers equivalent of `.env`,
and it's gitignored.) Then run the site through the Worker:
```bash
npm run build && npx wrangler dev
```
The Supabase table itself is created once by running
[`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.

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
