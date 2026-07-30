-- 010_founder_links.sql
--
-- Manual LinkedIn overrides for founders on a deal.
--
-- The analysis pipeline scrapes founder LinkedIn URLs out of decks and team
-- pages, and misses often enough that users need a way to paste the correct
-- profile by hand. Overrides live here rather than in analyses.result so a
-- re-analysis doesn't wipe them.
--
-- Founders have no stable id in the analysis blob, so rows are keyed on a
-- normalised founder name (lower-cased, whitespace-collapsed — see
-- founderKey() in src/lib/founder-links.ts, which must stay in sync).
--
-- Run once after 009_fund_overrides.sql.

create table if not exists public.founder_links (
  deal_id      uuid not null references public.deals(id) on delete cascade,
  founder_key  text not null,
  founder_name text not null,
  linkedin_url text not null,
  updated_by   uuid references auth.users(id) on delete set null,
  updated_at   timestamptz not null default now(),
  primary key (deal_id, founder_key)
);

-- Only canonical profile URLs — the server action normalises before writing,
-- this is the backstop against anything else reaching the table.
alter table public.founder_links
  drop constraint if exists founder_links_url_is_linkedin;

alter table public.founder_links
  add constraint founder_links_url_is_linkedin
    check (linkedin_url ~ '^https://www\.linkedin\.com/in/[A-Za-z0-9_%.-]+/$');

alter table public.founder_links enable row level security;

-- Owner of the deal.
drop policy if exists founder_links_owner on public.founder_links;
create policy founder_links_owner on public.founder_links
  for all
  using (
    exists (
      select 1 from public.deals d
      where d.id = founder_links.deal_id and d.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.deals d
      where d.id = founder_links.deal_id and d.user_id = auth.uid()
    )
  );

-- Teammates on the same fund — same shape as the documents/analyses policies
-- added in 007_team_visibility.sql.
drop policy if exists founder_links_team on public.founder_links;
create policy founder_links_team on public.founder_links
  for all
  using (
    exists (
      select 1 from public.deals d
      where d.id = founder_links.deal_id and public.is_teammate(d.user_id)
    )
  )
  with check (
    exists (
      select 1 from public.deals d
      where d.id = founder_links.deal_id and public.is_teammate(d.user_id)
    )
  );

create index if not exists founder_links_deal_id_idx
  on public.founder_links(deal_id);
