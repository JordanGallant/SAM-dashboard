-- 008_fix_fund_members_rls.sql
--
-- The original policies in 006 self-referenced fund_members in their
-- subqueries:
--
--   using (fund_id in (select fund_id from fund_members where user_id = auth.uid()))
--
-- This is recursive — Postgres re-applies the policy when evaluating the
-- subquery and ends up returning empty result sets even for legit owners.
-- Symptom: /settings/members shows '0 / 3 seats used', fund-website scrape
-- creates a duplicate funds row every time because the existing-fund lookup
-- returns null.
--
-- Replace with a non-recursive shape: "your own row OR teammate's row",
-- where the teammate check goes through the SECURITY DEFINER is_teammate()
-- function from 007 so it bypasses RLS instead of triggering another pass.

drop policy if exists fund_members_select on public.fund_members;
create policy fund_members_select on public.fund_members
  for select
  using (user_id = auth.uid() or public.is_teammate(user_id));

drop policy if exists fund_members_write on public.fund_members;
create policy fund_members_write on public.fund_members
  for all
  using (user_id = auth.uid() or public.is_teammate(user_id))
  with check (user_id = auth.uid() or public.is_teammate(user_id));

-- Same recursion bug on fund_invitations — fix in kind by going through
-- the SECURITY DEFINER helper.
drop policy if exists fund_invitations_select on public.fund_invitations;
create policy fund_invitations_select on public.fund_invitations
  for select
  using (
    public.is_teammate((select user_id from public.funds where id = fund_invitations.fund_id))
  );

drop policy if exists fund_invitations_write on public.fund_invitations;
create policy fund_invitations_write on public.fund_invitations
  for all
  using (
    public.is_teammate((select user_id from public.funds where id = fund_invitations.fund_id))
  )
  with check (
    public.is_teammate((select user_id from public.funds where id = fund_invitations.fund_id))
  );
