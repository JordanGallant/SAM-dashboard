-- 007_team_visibility.sql
--
-- Extends row-level security on deals/documents/analyses/funds so that
-- teammates (other users in the same fund_members group) can read and write
-- each other's rows. We do NOT replace existing self-only policies — we add
-- additional permissive policies, and PostgreSQL OR's them together.
--
-- Run once after 006_fund_members.sql.

-- Helper: is `target_user` on the same fund as the caller?
create or replace function public.is_teammate(target_user uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.fund_members fm1
    join public.fund_members fm2 on fm2.fund_id = fm1.fund_id
    where fm1.user_id = auth.uid()
      and fm2.user_id = target_user
  )
$$;

-- Deals — anyone on the same fund can read/write
drop policy if exists deals_team on public.deals;
create policy deals_team on public.deals
  for all
  using (public.is_teammate(user_id))
  with check (public.is_teammate(user_id));

-- Documents — attach to a deal. Allow if caller is teammate of the deal's owner.
drop policy if exists documents_team on public.documents;
create policy documents_team on public.documents
  for all
  using (
    exists (
      select 1 from public.deals d
      where d.id = documents.deal_id and public.is_teammate(d.user_id)
    )
  )
  with check (
    exists (
      select 1 from public.deals d
      where d.id = documents.deal_id and public.is_teammate(d.user_id)
    )
  );

-- Analyses — same pattern, joined through deal_id.
drop policy if exists analyses_team on public.analyses;
create policy analyses_team on public.analyses
  for all
  using (
    exists (
      select 1 from public.deals d
      where d.id = analyses.deal_id and public.is_teammate(d.user_id)
    )
  )
  with check (
    exists (
      select 1 from public.deals d
      where d.id = analyses.deal_id and public.is_teammate(d.user_id)
    )
  );

-- Funds — teammates can read the shared fund row.
-- (Writes still go through the upsertFund server action which checks role.)
drop policy if exists funds_team_read on public.funds;
create policy funds_team_read on public.funds
  for select
  using (public.is_teammate(user_id));

drop policy if exists funds_team_write on public.funds;
create policy funds_team_write on public.funds
  for update
  using (public.is_teammate(user_id))
  with check (public.is_teammate(user_id));

-- Note: chat_threads + chat_messages remain user-scoped on purpose.
-- Each member's Ask Sam history stays private to them.
