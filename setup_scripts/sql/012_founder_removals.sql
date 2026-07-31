-- 012_founder_removals.sql
--
-- Founders hidden by hand. The extractor invents non-people ("ADDITIONAL
-- FOUNDERS / EXECUTIVE TEAM") and users add people by mistake, so cards need a
-- remove that survives re-analysis — deleting from analyses.result would just
-- come back on the next run. Rows here are filtered out of the roster at read
-- time (applyFounderLinks in src/lib/founder-links.ts).
--
-- Keyed on normalised founder name, same as founder_links. Re-adding or
-- re-linking the same name deletes the row (un-remove).
--
-- Run once after 011_team_refresh_state.sql.

create table if not exists public.founder_removals (
  deal_id      uuid not null references public.deals(id) on delete cascade,
  founder_key  text not null,
  founder_name text not null,
  removed_by   uuid references auth.users(id) on delete set null,
  removed_at   timestamptz not null default now(),
  primary key (deal_id, founder_key)
);

alter table public.founder_removals enable row level security;

drop policy if exists founder_removals_owner on public.founder_removals;
create policy founder_removals_owner on public.founder_removals
  for all
  using (
    exists (
      select 1 from public.deals d
      where d.id = founder_removals.deal_id and d.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.deals d
      where d.id = founder_removals.deal_id and d.user_id = auth.uid()
    )
  );

drop policy if exists founder_removals_team on public.founder_removals;
create policy founder_removals_team on public.founder_removals
  for all
  using (
    exists (
      select 1 from public.deals d
      where d.id = founder_removals.deal_id and public.is_teammate(d.user_id)
    )
  )
  with check (
    exists (
      select 1 from public.deals d
      where d.id = founder_removals.deal_id and public.is_teammate(d.user_id)
    )
  );

create index if not exists founder_removals_deal_id_idx
  on public.founder_removals(deal_id);
