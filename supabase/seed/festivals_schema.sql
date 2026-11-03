-- Pavitra · festivals CMS table (document-oriented)
-- Run this in the Supabase SQL editor (or it is applied automatically by seed.mjs).
--
-- Festival documents vary in shape (e.g. Navratri has a nine_nights array that
-- other festivals lack), so the full CMS document lives in a single `data` jsonb
-- column, with a few duplicated columns for cheap indexing/listing.

create table if not exists public.festivals (
  id            text primary key,            -- e.g. "ganesh-chaturthi-2026"
  slug          text not null,               -- e.g. "ganesh-chaturthi"
  year          int  not null,
  festival_date date,                        -- primary observance date
  name          jsonb,                       -- { en, te, sa } for quick listing
  data          jsonb not null,              -- the complete CMS document
  schema_version int default 1,
  updated_at    timestamptz default now()
);

alter table public.festivals enable row level security;

-- Festivals are public reference content (no user data) → allow anon read.
drop policy if exists "festivals are readable by everyone" on public.festivals;
create policy "festivals are readable by everyone"
  on public.festivals for select using (true);

create unique index if not exists festivals_slug_year_idx on public.festivals (slug, year);
create index if not exists festivals_date_idx on public.festivals (festival_date);

-- Writes are performed with the service_role key (server-side seed), which
-- bypasses RLS; no public insert/update policy is granted on purpose.
