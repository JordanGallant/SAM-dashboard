-- Option C — Email-verified signup + scheduled cleanup of inactive accounts.
-- Run this in Supabase SQL Editor once.

-- 1. Add last_active_at column to profiles (used to spare users who
--    haven't paid yet but are actively exploring)
alter table public.profiles
  add column if not exists last_active_at timestamptz;

-- 2. Ensure pg_cron extension is enabled
create extension if not exists pg_cron;

-- 3. Drop any previous versions of these jobs (idempotent)
do $$
begin
  if exists (select 1 from cron.job where jobname = 'cleanup-unverified') then
    perform cron.unschedule('cleanup-unverified');
  end if;
  if exists (select 1 from cron.job where jobname = 'cleanup-inactive') then
    perform cron.unschedule('cleanup-inactive');
  end if;
end $$;

-- 4. Schedule: delete unverified accounts after 7 days
-- Runs daily at 03:00 UTC
select cron.schedule(
  'cleanup-unverified',
  '0 3 * * *',
  $$
    delete from auth.users
    where email_confirmed_at is null
      and created_at < now() - interval '7 days'
  $$
);

-- 5. Schedule: delete verified-but-inactive accounts after 30 days
-- Skips accounts where last_active_at was recent (someone logged in
-- even if they haven't paid yet — don't rug them).
select cron.schedule(
  'cleanup-inactive',
  '5 3 * * *',
  $$
    delete from auth.users
    where id in (
      select p.id
      from public.profiles p
      where p.subscription_status = 'inactive'
        and p.created_at < now() - interval '30 days'
        and (p.last_active_at is null or p.last_active_at < now() - interval '14 days')
    )
  $$
);

-- 6. Verify the jobs are scheduled
-- Run this query to check: select jobname, schedule, active from cron.job;
