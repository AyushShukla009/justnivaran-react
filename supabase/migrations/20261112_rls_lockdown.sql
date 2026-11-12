-- =============================================================================
-- JustNivaran: table lockdown (applied 12 Nov 2026 to ustnivaran-db)
-- Before: anon could SELECT, UPDATE, DELETE and TRUNCATE disputes,
-- consultations and neutrals. After: the public may only INSERT (submit forms);
-- reading, changing and deleting are for the admin account only. Public case
-- access goes through the functions in 20261112_public_rpc_layer.sql.
-- =============================================================================
begin;

-- The registry administrator (role is read from the signed JWT by jn_is_admin)
update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
 where email = 'admin@justnivaran.in';

-- Remove the open policies
drop policy if exists "Enable read for all users"   on public.disputes;
drop policy if exists "Validate and update disputes" on public.disputes;
drop policy if exists "Allow delete disputes"       on public.disputes;
drop policy if exists "Enable read for all users"   on public.consultations;
drop policy if exists "Allow delete consultations"  on public.consultations;
drop policy if exists "Enable read for all users"   on public.neutrals;
drop policy if exists "Allow delete neutrals"       on public.neutrals;
-- (the existing "Validate and insert ..." policies stay: the public may submit forms)

alter table public.disputes      enable row level security;
alter table public.consultations enable row level security;
alter table public.neutrals      enable row level security;

-- Administrator: full access
drop policy if exists "admin_all_disputes" on public.disputes;
drop policy if exists "admin_all_consultations" on public.consultations;
drop policy if exists "admin_all_neutrals" on public.neutrals;
create policy "admin_all_disputes" on public.disputes
  for all to authenticated using (public.jn_is_admin()) with check (public.jn_is_admin());
create policy "admin_all_consultations" on public.consultations
  for all to authenticated using (public.jn_is_admin()) with check (public.jn_is_admin());
create policy "admin_all_neutrals" on public.neutrals
  for all to authenticated using (public.jn_is_admin()) with check (public.jn_is_admin());

-- Table privileges. TRUNCATE ignores row-level security, so it is removed from both roles.
revoke select, update, delete, truncate, trigger, references on public.disputes      from anon;
revoke select, update, delete, truncate, trigger, references on public.consultations from anon;
revoke select, update, delete, truncate, trigger, references on public.neutrals      from anon;
revoke truncate, trigger, references on public.disputes      from authenticated;
revoke truncate, trigger, references on public.consultations from authenticated;
revoke truncate, trigger, references on public.neutrals      from authenticated;

commit;
