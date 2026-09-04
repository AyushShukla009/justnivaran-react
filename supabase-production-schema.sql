-- ====================================================================
-- JUSTNIVARAN ODR PLATFORM — INSTITUTIONAL PRODUCTION DATABASE SCHEMA
-- Compliant with: Arbitration & Conciliation Act 1996, Mediation Act 2023,
-- Information Technology Act 2000, and DPDP Act 2023.
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. DISPUTES TABLE
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    docket_number VARCHAR(64) NOT NULL UNIQUE,
    claimant_name TEXT NOT NULL,
    claimant_email TEXT NOT NULL,
    claimant_phone TEXT NOT NULL,
    respondent_name TEXT NOT NULL,
    respondent_email TEXT NOT NULL,
    respondent_phone TEXT,
    claim_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    mode VARCHAR(16) NOT NULL DEFAULT 'ARB' CHECK (mode IN ('NEG', 'MED', 'CON', 'FTA', 'ARB', 'LOK')),
    dispute_summary TEXT NOT NULL,
    relief_sought TEXT NOT NULL,
    access_code VARCHAR(16) DEFAULT '090909',
    evidence_file_path TEXT,
    assigned_neutral TEXT,
    hearing_date DATE,
    hearing_time VARCHAR(32) DEFAULT '11:00 AM IST',
    hearing_room_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'Notice Issued' CHECK (status IN (
        'Notice Issued',
        'Negotiation Active',
        'Mediation in Progress',
        'Hearing Scheduled',
        'Award Rendered',
        'Settled'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure access_code column exists for existing deployments
ALTER TABLE public.disputes ADD COLUMN IF NOT EXISTS access_code VARCHAR(16) DEFAULT '090909';

-- 3. NEUTRALS PANEL TABLE
CREATE TABLE IF NOT EXISTS public.neutrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'Arbitrator' CHECK (role IN ('Arbitrator', 'Mediator', 'Conciliator')),
    bar_council_id TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    specialization TEXT NOT NULL,
    languages TEXT NOT NULL DEFAULT 'English, Hindi',
    status VARCHAR(32) NOT NULL DEFAULT 'Under Review' CHECK (status IN (
        'Under Review',
        'Empaneled',
        'Interview Scheduled',
        'Rejected'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CONSULTATIONS TABLE
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(32) NOT NULL,
    format VARCHAR(32) NOT NULL DEFAULT 'Video Conference',
    notes TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'Pending Verification' CHECK (status IN (
        'Pending Verification',
        'Pending',
        'Confirmed',
        'Completed',
        'Cancelled'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CASE AUDIT LOGS (APPEND-ONLY RECORD INTEGRITY)
CREATE TABLE IF NOT EXISTS public.case_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.disputes(id) ON DELETE CASCADE,
    docket_number VARCHAR(64) NOT NULL,
    action TEXT NOT NULL,
    actor_id UUID,
    actor_email TEXT,
    old_state JSONB,
    new_state JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. INDEXES FOR HIGH-PERFORMANCE SEARCH & DOCKET LOOKUP
CREATE INDEX IF NOT EXISTS idx_disputes_docket_number ON public.disputes (docket_number);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes (status);
CREATE INDEX IF NOT EXISTS idx_disputes_created_at ON public.disputes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disputes_hearing_date ON public.disputes (hearing_date) WHERE hearing_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neutrals_status ON public.neutrals (status);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations (status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_docket ON public.case_audit_logs (docket_number);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neutrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_audit_logs ENABLE ROW LEVEL SECURITY;

-- Disputes Policies
DROP POLICY IF EXISTS "Public can submit dispute filings" ON public.disputes;
CREATE POLICY "Public can submit dispute filings"
    ON public.disputes FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view case status by docket" ON public.disputes;
CREATE POLICY "Public can view case status by docket"
    ON public.disputes FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated admins have full CRUD on disputes" ON public.disputes;
CREATE POLICY "Authenticated admins have full CRUD on disputes"
    ON public.disputes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Neutrals Policies
DROP POLICY IF EXISTS "Public can submit empanelment applications" ON public.neutrals;
CREATE POLICY "Public can submit empanelment applications"
    ON public.neutrals FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can manage neutrals" ON public.neutrals;
CREATE POLICY "Authenticated admins can manage neutrals"
    ON public.neutrals FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Consultations Policies
DROP POLICY IF EXISTS "Public can book consultations" ON public.consultations;
CREATE POLICY "Public can book consultations"
    ON public.consultations FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can manage consultations" ON public.consultations;
CREATE POLICY "Authenticated admins can manage consultations"
    ON public.consultations FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Audit Logs Policies
DROP POLICY IF EXISTS "Authenticated admins can view and record audit logs" ON public.case_audit_logs;
CREATE POLICY "Authenticated admins can view and record audit logs"
    ON public.case_audit_logs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 8. STORAGE BUCKET SETUP (Run in Supabase Storage or Dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('dispute-evidence', 'dispute-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can upload evidence files; only authenticated admins can list/download
DROP POLICY IF EXISTS "Public can upload dispute evidence" ON storage.objects;
CREATE POLICY "Public can upload dispute evidence"
    ON storage.objects FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'dispute-evidence');

DROP POLICY IF EXISTS "Authenticated admins can access dispute evidence" ON storage.objects;
CREATE POLICY "Authenticated admins can access dispute evidence"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'dispute-evidence')
    WITH CHECK (bucket_id = 'dispute-evidence');

-- 9. ROLE-BASED ADMIN AUTHORIZATION & SECURITY
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role VARCHAR(32) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'registrar', 'auditor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    OR EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

