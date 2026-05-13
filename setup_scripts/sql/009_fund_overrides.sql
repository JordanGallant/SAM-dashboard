-- 009_fund_overrides.sql
--
-- Per-fund overrides for the two values Mark wants to be able to bend
-- without changing tier-config.ts: seat cap and memos-per-month cap.
-- NULL = use the tier default; integer = override the cap at this value.
--
-- These are enforced server-side in src/app/actions/members.ts (seats)
-- and the memo-usage gate (memos), and surfaced read-only in the
-- customer UI. Editing the values is restricted to /admin/limits.

alter table public.funds
  add column if not exists seats_override int,
  add column if not exists memos_override int;

-- Sanity: a 0 override is a footgun (would disable the feature entirely).
-- Require positive values, but allow NULL to mean "no override".
alter table public.funds
  drop constraint if exists funds_seats_override_positive,
  drop constraint if exists funds_memos_override_positive;

alter table public.funds
  add constraint funds_seats_override_positive
    check (seats_override is null or seats_override > 0),
  add constraint funds_memos_override_positive
    check (memos_override is null or memos_override > 0);
