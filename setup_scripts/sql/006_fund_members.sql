-- 006_fund_members.sql
--
-- Adds team-seat support for Pro tier (and future Fund tier).
-- Each fund gets a fund_members roster (owner + members) and a
-- fund_invitations table for one-time email invite tokens.
--
-- Run-once script. Idempotent via "if not exists" guards.

create table if not exists fund_members (
  fund_id      uuid not null references funds(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null default 'member' check (role in ('owner','member')),
  joined_at    timestamptz not null default now(),
  primary key (fund_id, user_id)
);
create index if not exists fund_members_user_idx on fund_members(user_id);

create table if not exists fund_invitations (
  id           uuid primary key default gen_random_uuid(),
  fund_id      uuid not null references funds(id) on delete cascade,
  email        text not null,
  token        text not null unique,
  invited_by   uuid not null references auth.users(id),
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null default (now() + interval '14 days'),
  accepted_at  timestamptz,
  revoked_at   timestamptz
);
create unique index if not exists fund_invitations_pending_email
  on fund_invitations(fund_id, lower(email))
  where accepted_at is null and revoked_at is null;

-- Backfill: every existing fund owner is now an explicit owner row.
insert into fund_members (fund_id, user_id, role)
  select id, user_id, 'owner' from funds
  on conflict do nothing;

-- RLS
alter table fund_members enable row level security;
alter table fund_invitations enable row level security;

-- Members of a fund can read the roster
drop policy if exists fund_members_select on fund_members;
create policy fund_members_select on fund_members
  for select using (
    fund_id in (select fund_id from fund_members where user_id = auth.uid())
  );

-- Any fund member can insert/delete (per product spec: any member can invite/remove)
drop policy if exists fund_members_write on fund_members;
create policy fund_members_write on fund_members
  for all using (
    fund_id in (select fund_id from fund_members where user_id = auth.uid())
  ) with check (
    fund_id in (select fund_id from fund_members where user_id = auth.uid())
  );

-- Invitations visible to members of the fund
drop policy if exists fund_invitations_select on fund_invitations;
create policy fund_invitations_select on fund_invitations
  for select using (
    fund_id in (select fund_id from fund_members where user_id = auth.uid())
  );

-- Members can create/revoke invitations on their fund
drop policy if exists fund_invitations_write on fund_invitations;
create policy fund_invitations_write on fund_invitations
  for all using (
    fund_id in (select fund_id from fund_members where user_id = auth.uid())
  ) with check (
    fund_id in (select fund_id from fund_members where user_id = auth.uid())
  );
