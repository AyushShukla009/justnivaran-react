-- =============================================================================
-- JustNivaran: secure public access layer (applied 12 Nov 2026 to ustnivaran-db)
-- Public visitors reach case data ONLY through these SECURITY DEFINER functions;
-- the tables themselves are locked (see 20261112_rls_lockdown.sql).
-- =============================================================================

-- Admin check from the signed JWT (app_metadata is not user-editable)
create or replace function public.jn_is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- Failed PIN attempts (for lockout); not readable by the public
create table if not exists public.jn_pin_attempts (
  id bigserial primary key,
  docket_number text not null,
  attempted_at timestamptz not null default now()
);
create index if not exists jn_pin_attempts_docket_time on public.jn_pin_attempts (docket_number, attempted_at);
alter table public.jn_pin_attempts enable row level security;
revoke all on public.jn_pin_attempts from anon, authenticated;

-- Normalise a docket typed by a user: upper-case, '-' -> '/', no wildcards
create or replace function public.jn_norm_docket(p text)
returns text
language sql
immutable
as $$
  select upper(replace(regexp_replace(trim(coalesce(p, '')), '[%_*\\]', '', 'g'), '-', '/'));
$$;

-- PIN stored in the summary as "[Case Access PIN: 123456]"
create or replace function public.jn_summary_pin(summary text)
returns text
language sql
immutable
as $$
  select (regexp_match(coalesce(summary, ''), '\[(?:Case Access PIN|PIN|Case PIN):\s*([A-Za-z0-9]+)\]', 'i'))[1];
$$;

-- 1. Public status: no personal data
create or replace function public.jn_docket_status(p_docket text)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare r record;
begin
  select docket_number, mode, status, created_at into r
    from disputes where jn_norm_docket(docket_number) = jn_norm_docket(p_docket) limit 1;
  if not found then
    return json_build_object('success', false, 'error', 'NOT_FOUND');
  end if;
  return json_build_object('success', true, 'data', json_build_object(
    'docket_number', r.docket_number, 'mode', r.mode, 'status', r.status, 'created_at', r.created_at));
end;
$$;

-- 2. Open a case with docket + PIN (5 failures per docket per 15 minutes -> locked)
create or replace function public.jn_verify_pin(p_docket text, p_pin text)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  d text := jn_norm_docket(p_docket);
  fails int;
  r disputes%rowtype;
begin
  select count(*) into fails from jn_pin_attempts
   where docket_number = d and attempted_at > now() - interval '15 minutes';
  if fails >= 5 then
    return json_build_object('success', false, 'error', 'LOCKED',
      'message', 'Too many incorrect attempts. Please try again in 15 minutes.');
  end if;

  select * into r from disputes where jn_norm_docket(docket_number) = d limit 1;
  if found and length(trim(coalesce(p_pin, ''))) >= 4
     and jn_summary_pin(r.dispute_summary) is not null
     and lower(jn_summary_pin(r.dispute_summary)) = lower(trim(p_pin)) then
    return json_build_object('success', true, 'data', row_to_json(r));
  end if;

  insert into jn_pin_attempts (docket_number) values (d);
  return json_build_object('success', false, 'error', 'INVALID_CREDENTIALS',
    'message', 'Invalid Case Access PIN. Authentication failed.');
end;
$$;

-- 3. Party adds a supplementary statement (PIN required)
create or replace function public.jn_add_supplement(p_docket text, p_pin text, p_text text)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare v json; new_summary text;
begin
  if length(trim(coalesce(p_text, ''))) = 0 or length(p_text) > 5000 then
    return json_build_object('success', false, 'error', 'INVALID_TEXT');
  end if;
  v := jn_verify_pin(p_docket, p_pin);
  if (v ->> 'success')::boolean is not true then
    return v;
  end if;
  update disputes
     set dispute_summary = coalesce(dispute_summary, '') || E'\n\n[Supplementary Statement — '
         || to_char(now() at time zone 'Asia/Kolkata', 'DD Mon YYYY') || E']:\n' || trim(p_text)
   where jn_norm_docket(docket_number) = jn_norm_docket(p_docket)
   returning dispute_summary into new_summary;
  return json_build_object('success', true, 'dispute_summary', new_summary);
end;
$$;

-- 4. File a dispute (server generates docket + PIN; returns them once)
create or replace function public.submit_public_dispute(
  p_claimant_name text, p_claimant_email text, p_claimant_phone text,
  p_respondent_name text, p_respondent_email text, p_respondent_phone text,
  p_claim_amount numeric, p_mode text, p_dispute_summary text, p_relief_sought text,
  p_evidence_file_path text default null)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  m text := upper(coalesce(nullif(regexp_replace(p_mode, '[^A-Za-z-]', '', 'g'), ''), 'ARB'));
  docket text;
  pin text := lpad((floor(random() * 1000000))::int::text, 6, '0');
  r disputes%rowtype;
  tries int := 0;
begin
  if coalesce(trim(p_claimant_name), '') = '' or coalesce(trim(p_claimant_email), '') = ''
     or coalesce(trim(p_respondent_name), '') = '' then
    return json_build_object('success', false, 'error', 'Please complete the required claimant and respondent details.');
  end if;
  if length(coalesce(p_dispute_summary, '')) > 20000 then
    return json_build_object('success', false, 'error', 'The dispute summary is too long.');
  end if;
  loop
    docket := 'JN/' || m || '/' || to_char(now(), 'YYYY') || '/' || lpad((floor(random() * 1000000))::int::text, 6, '0');
    exit when not exists (select 1 from disputes where docket_number = docket);
    tries := tries + 1;
    if tries > 10 then
      return json_build_object('success', false, 'error', 'Could not allocate a docket number. Please try again.');
    end if;
  end loop;

  insert into disputes (docket_number, claimant_name, claimant_email, claimant_phone,
                        respondent_name, respondent_email, respondent_phone, claim_amount,
                        mode, dispute_summary, relief_sought, status)
  values (docket, trim(p_claimant_name), trim(p_claimant_email), trim(coalesce(p_claimant_phone, '')),
          trim(p_respondent_name), trim(coalesce(p_respondent_email, '')), trim(coalesce(p_respondent_phone, '')),
          coalesce(p_claim_amount, 0), m,
          trim(coalesce(p_dispute_summary, '')) || E'\n[Case Access PIN: ' || pin || ']',
          trim(coalesce(p_relief_sought, '')), 'Notice Issued')
  returning * into r;

  return json_build_object('success', true, 'data', json_build_object(
    'id', r.id, 'docket_number', r.docket_number, 'access_pin', pin,
    'status', r.status, 'mode', r.mode, 'created_at', r.created_at));
end;
$$;

-- Only these entry points are callable by the public
revoke all on function public.jn_docket_status(text) from public;
revoke all on function public.jn_verify_pin(text, text) from public;
revoke all on function public.jn_add_supplement(text, text, text) from public;
revoke all on function public.submit_public_dispute(text, text, text, text, text, text, numeric, text, text, text, text) from public;
grant execute on function public.jn_docket_status(text) to anon, authenticated;
grant execute on function public.jn_verify_pin(text, text) to anon, authenticated;
grant execute on function public.jn_add_supplement(text, text, text) to anon, authenticated;
grant execute on function public.submit_public_dispute(text, text, text, text, text, text, numeric, text, text, text, text) to anon, authenticated;
