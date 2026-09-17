-- RSVP table for the wedding website.
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  attending boolean not null,
  created_at timestamptz not null default now()
);

-- Lock the table down: no anonymous/public access. Only the Cloudflare Worker,
-- using the service_role key, can read or write (service_role bypasses RLS).
alter table rsvps enable row level security;
