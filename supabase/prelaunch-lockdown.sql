-- SUPERSEDED (12 Nov 2026): the lockdown was applied to the live database through
--   supabase/migrations/20261112_public_rpc_layer.sql  and
--   supabase/migrations/20261112_rls_lockdown.sql
-- This file is kept only for reference; do not run it.

-- =============================================================================
-- JustNivaran — PRE-LAUNCH DATABASE LOCKDOWN  (prepared 12 Nov 2026)
-- =============================================================================
-- WHY: As of 12 Nov 2026 the live database lets ANYONE with the public website
-- key read every case (names, emails, phones, summaries, PINs) in `disputes`,
-- read `consultations` and `neutrals`, and send UPDATE requests to `disputes`.
--
-- ORDER MATTERS — do NOT run this before steps 1 and 2, or filing, docket
-- tracking and the admin panel will stop working:
--
--   1. Create the admin login (Supabase Dashboard → Authentication → Users →
--      Add user), then run STEP A below with that email.
--      Also: Authentication → Providers → Email → turn OFF "Enable sign-ups".
--   2. Deploy the Edge Functions in supabase/functions (docket-service,
--      submit-dispute, dispatch-notices, notice-webhook) with their secrets:
--        supabase functions deploy docket-service submit-dispute dispatch-notices notice-webhook
--      Then tell Claude: the browser fallbacks in src/lib/api.js that read the
--      `disputes` table directly will be removed in the same release.
--   3. Run STEP B (this lockdown) in the SQL Editor.
--   4. Run STEP C (verification). Every anon check must FAIL / return nothing.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- STEP A — mark the administrator account (replace the email)
-- ---------------------------------------------------------------------------
-- update auth.users
--    set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
--  where email = 'REPLACE-WITH-ADMIN-EMAIL';


-- ---------------------------------------------------------------------------
-- STEP B — lockdown
-- ---------------------------------------------------------------------------
begin;

-- Admin check based on the signed JWT (app_metadata cannot be edited by users)
create or replace function public.jn_is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- Drop EVERY existing policy on the sensitive tables (old permissive
-- USING (true) policies were never removed and are OR-ed with stricter ones)
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
      from pg_policies
     where schemaname = 'public'
       and tablename in ('disputes', 'consultations', 'neutrals', 'case_audit_logs', 'legal_assessments')
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

alter table if exists public.disputes        enable row level security;
alter table if exists public.consultations   enable row level security;
alter table if exists public.neutrals        enable row level security;
alter table if exists public.case_audit_logs enable row level security;

-- Public may only SUBMIT (no read, no update, no delete)
create policy "public_insert_consultations" on public.consultations
  for insert to anon, authenticated with check (true);
create policy "public_insert_neutral_applications" on public.neutrals
  for insert to anon, authenticated with check (true);
-- Dispute filings go through the submit-dispute Edge Function (service role).
-- If you must keep direct browser filing temporarily, uncomment:
-- create policy "public_insert_disputes" on public.disputes
--   for insert to anon, authenticated with check (true);

-- Administrators only, for everything else
create policy "admin_all_disputes" on public.disputes
  for all to authenticated using (public.jn_is_admin()) with check (public.jn_is_admin());
create policy "admin_all_consultations" on public.consultations
  for all to authenticated using (public.jn_is_admin()) with check (public.jn_is_admin());
create policy "admin_all_neutrals" on public.neutrals
  for all to authenticated using (public.jn_is_admin()) with check (public.jn_is_admin());
create policy "admin_all_audit_logs" on public.case_audit_logs
  for all to authenticated using (public.jn_is_admin()) with check (public.jn_is_admin());

-- Table privileges: anon may not read, change or delete
revoke select, update, delete on public.disputes        from anon;
revoke select, update, delete on public.consultations   from anon;
revoke select, update, delete on public.neutrals        from anon;
revoke all                    on public.case_audit_logs from anon;

-- Evidence files: public upload only; reading restricted to admins
drop policy if exists "Authenticated admins can access dispute evidence" on storage.objects;
create policy "admin_read_dispute_evidence" on storage.objects
  for all to authenticated
  using (bucket_id = 'dispute-evidence' and public.jn_is_admin())
  with check (bucket_id = 'dispute-evidence' and public.jn_is_admin());

commit;


-- ---------------------------------------------------------------------------
-- STEP C — verification (run in SQL Editor; then the curl checks below)
-- ---------------------------------------------------------------------------
-- select tablename, policyname, roles, cmd, qual
--   from pg_policies
--  where schemaname = 'public'
--    and tablename in ('disputes','consultations','neutrals','case_audit_logs')
--  order by tablename;
--
-- From any computer (must return 401/permission error or an empty list):
--   curl "https://zejzfgogccmmhsjexxml.supabase.co/rest/v1/disputes?select=id&limit=1" \
--        -H "apikey: <publishable key>" -H "Authorization: Bearer <publishable key>"
