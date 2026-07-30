-- 011_team_refresh_state.sql
--
-- Tracks an in-flight team re-run so the UI can say "refreshing" instead of
-- silently doing nothing for the minute or two Flow 3 takes.
--
-- Pasting a founder LinkedIn URL re-triggers the n8n team flow (see
-- retriggerTeamFlow in src/app/actions/founder-links.ts). We stamp
-- team_refresh_at on the deal when we fire it, and Flow 3's callback clears it
-- (kind: "team" in /api/analysis/callback).
--
-- Deliberately a nullable timestamp rather than a status enum: the timestamp
-- doubles as the staleness guard. If the callback never arrives — n8n down,
-- flow edited, run failed — readers treat anything older than a few minutes as
-- finished, so the indicator can't hang forever.
--
-- Run once after 010_founder_links.sql.

alter table public.deals
  add column if not exists team_refresh_at timestamptz;

comment on column public.deals.team_refresh_at is
  'Set when an n8n team re-run is triggered; cleared by the team callback. Readers should also treat values older than ~5 min as stale/finished.';
