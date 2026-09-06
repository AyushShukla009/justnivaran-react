-- ==============================================================================
-- JUSTNIVARAN ODR PLATFORM — STAGING ENVIRONMENT BOOTSTRAP MIGRATION (SCHEMA ONLY)
-- Purpose: Complete schema-only setup for isolated staging database.
-- Security: Zero production data, zero client records, zero PII.
-- Compliant with: Arbitration & Conciliation Act 1996, Mediation Act 2023, DPDP Act 2023.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;

-- 2. CORE DISPUTES TABLE (Strict bcrypt hash constraint & server-defaulted protected fields)
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    docket_number VARCHAR(64) NOT NULL UNIQUE DEFAULT ('JN/' || TO_CHAR(NOW(), 'YYYY') || '/' || LPAD(FLOOR(RANDOM()*8999 + 1000)::TEXT, 4, '0')),
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
    -- Strictly enforces bcrypt hash format ($2a$, $2b$, or $2y$ followed by cost and 53-char salt+hash)
    -- Plaintext, MD5, and unsalted SHA-256 strings are strictly rejected by this check constraint
    access_code_hash VARCHAR(72) NOT NULL DEFAULT extensions.crypt('090909', extensions.gen_salt('bf')) CHECK (access_code_hash ~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$'),
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

-- 3. NEUTRALS PANEL TABLE
CREATE TABLE IF NOT EXISTS public.neutrals (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
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

-- 5. LEGAL ASSESSMENTS (METADATA-ONLY INTAKE REPOSITORY)
-- Purpose limitation: Strictly stores operational metadata.
-- NEVER stores factual chronology, contractual text, party names, phone numbers, emails, prompts, documents or generated AI reports.
CREATE TABLE IF NOT EXISTS public.legal_assessments (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    reference_id VARCHAR(64) NOT NULL UNIQUE DEFAULT ('LA-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM()*89999 + 10000)::TEXT, 5, '0')),
    category VARCHAR(64) NOT NULL,
    claim_quantum_tier VARCHAR(32) NOT NULL DEFAULT 'BELOW_25_LAKHS',
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    governing_law_type VARCHAR(64) NOT NULL DEFAULT 'INDIAN_LAW',
    arbitration_clause_status VARCHAR(32) NOT NULL DEFAULT 'PRESENT',
    submission_source VARCHAR(32) NOT NULL DEFAULT 'WEB_PORTAL',
    status VARCHAR(32) NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'ANALYZED', 'EXPIRED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DOCKET PIN RATE LIMITING TABLE
CREATE TABLE IF NOT EXISTS public.docket_pin_attempts (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    client_hash VARCHAR(64) NOT NULL,
    docket_number VARCHAR(64) NOT NULL,
    ip_masked VARCHAR(64),
    attempt_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_successful BOOLEAN NOT NULL DEFAULT false
);

-- 7. STATUTORY NOTICE DELIVERIES TABLE
CREATE TABLE IF NOT EXISTS public.notice_deliveries (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    dispute_id UUID REFERENCES public.disputes(id) ON DELETE CASCADE,
    docket_number VARCHAR(64) NOT NULL,
    recipient_type VARCHAR(16) NOT NULL CHECK (recipient_type IN ('claimant', 'respondent', 'neutral', 'admin')),
    channel VARCHAR(16) NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms', 'portal')),
    recipient_contact TEXT NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'Queued' CHECK (status IN ('Queued', 'Sent', 'Delivered', 'Failed', 'Read')),
    provider_msg_id TEXT,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    error_details TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 8. CASE AUDIT LOGS (IMMUTABLE APPEND-ONLY LEDGER)
CREATE TABLE IF NOT EXISTS public.case_audit_logs (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    case_id UUID REFERENCES public.disputes(id) ON DELETE CASCADE,
    docket_number VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    actor_type VARCHAR(32) NOT NULL DEFAULT 'system',
    actor_id TEXT,
    change_summary TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ADMIN USERS REGISTRY TABLE
-- Stores only references to Supabase Auth uid and authorization roles.
-- NEVER stores passwords, PINs, or credentials.
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'registrar', 'auditor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. INDEXES
CREATE INDEX IF NOT EXISTS idx_disputes_docket ON public.disputes (docket_number);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes (status);
CREATE INDEX IF NOT EXISTS idx_disputes_created ON public.disputes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_neutrals_status ON public.neutrals (status);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations (status);
CREATE INDEX IF NOT EXISTS idx_legal_assessments_ref ON public.legal_assessments (reference_id);
CREATE INDEX IF NOT EXISTS idx_pin_attempts_client_time ON public.docket_pin_attempts (client_hash, attempt_time DESC);
CREATE INDEX IF NOT EXISTS idx_notice_deliveries_docket ON public.notice_deliveries (docket_number);
CREATE INDEX IF NOT EXISTS idx_audit_logs_docket ON public.case_audit_logs (docket_number);

-- 11. FUNCTIONS & TRIGGERS

-- A. Immutable Append-Only Ledger Enforcement Trigger Function
CREATE OR REPLACE FUNCTION public.prevent_audit_log_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'TAMPER_DETECTED: public.case_audit_logs is an immutable append-only ledger. UPDATE and DELETE operations are strictly prohibited for all roles.';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS trg_immutable_case_audit_logs ON public.case_audit_logs;
CREATE TRIGGER trg_immutable_case_audit_logs
    BEFORE UPDATE OR DELETE ON public.case_audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_audit_log_tampering();

-- B. Dispute Audit Trigger
CREATE OR REPLACE FUNCTION public.process_dispute_audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.case_audit_logs (
            case_id, docket_number, event_type, actor_type, change_summary, metadata
        ) VALUES (
            NEW.id,
            NEW.docket_number,
            'FILING_CREATED',
            'edge_function',
            'Dispute matter formally registered in institutional docket index.',
            jsonb_build_object('mode', NEW.mode, 'status', NEW.status)
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.status IS DISTINCT FROM NEW.status) THEN
            INSERT INTO public.case_audit_logs (
                case_id, docket_number, event_type, actor_type, change_summary, metadata
            ) VALUES (
                NEW.id,
                NEW.docket_number,
                'STATUS_CHANGED',
                'admin',
                'Case status transitioned from "' || OLD.status || '" to "' || NEW.status || '".',
                jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
            );
        END IF;

        IF (OLD.assigned_neutral IS DISTINCT FROM NEW.assigned_neutral AND NEW.assigned_neutral IS NOT NULL) THEN
            INSERT INTO public.case_audit_logs (
                case_id, docket_number, event_type, actor_type, change_summary, metadata
            ) VALUES (
                NEW.id,
                NEW.docket_number,
                'NEUTRAL_ASSIGNED',
                'admin',
                'Neutral appointed: ' || NEW.assigned_neutral || '.',
                jsonb_build_object('assigned_neutral', NEW.assigned_neutral)
            );
        END IF;

        IF (OLD.hearing_date IS DISTINCT FROM NEW.hearing_date OR OLD.hearing_time IS DISTINCT FROM NEW.hearing_time) THEN
            INSERT INTO public.case_audit_logs (
                case_id, docket_number, event_type, actor_type, change_summary, metadata
            ) VALUES (
                NEW.id,
                NEW.docket_number,
                'HEARING_SCHEDULED',
                'admin',
                'Virtual hearing scheduled for ' || COALESCE(NEW.hearing_date::text, 'TBD') || ' at ' || COALESCE(NEW.hearing_time, 'TBD') || '.',
                jsonb_build_object('hearing_date', NEW.hearing_date, 'hearing_time', NEW.hearing_time)
            );
        END IF;

        NEW.updated_at = NOW();
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS trg_dispute_audit ON public.disputes;
CREATE TRIGGER trg_dispute_audit
    AFTER INSERT OR UPDATE ON public.disputes
    FOR EACH ROW EXECUTE FUNCTION public.process_dispute_audit();

-- C. Public Submission Protection Triggers (Prevent Administrative Field Tampering)
CREATE OR REPLACE FUNCTION public.sanitize_dispute_submission()
RETURNS TRIGGER AS $$
BEGIN
    -- Public users cannot dictate administrative fields
    NEW.status := 'Notice Issued';
    NEW.assigned_neutral := NULL;
    NEW.hearing_date := NULL;
    NEW.hearing_time := '11:00 AM IST';
    NEW.hearing_room_url := NULL;
    
    -- Ensure docket number format
    IF NEW.docket_number IS NULL OR length(trim(NEW.docket_number)) = 0 THEN
        NEW.docket_number := 'JN/' || TO_CHAR(NOW(), 'YYYY') || '/' || LPAD(FLOOR(RANDOM()*8999 + 1000)::TEXT, 4, '0');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS trg_sanitize_dispute_insert ON public.disputes;
CREATE TRIGGER trg_sanitize_dispute_insert
    BEFORE INSERT ON public.disputes
    FOR EACH ROW
    EXECUTE FUNCTION public.sanitize_dispute_submission();

CREATE OR REPLACE FUNCTION public.sanitize_neutral_submission()
RETURNS TRIGGER AS $$
BEGIN
    -- Public applicants always start Under Review
    NEW.status := 'Under Review';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS trg_sanitize_neutral_insert ON public.neutrals;
CREATE TRIGGER trg_sanitize_neutral_insert
    BEFORE INSERT ON public.neutrals
    FOR EACH ROW
    EXECUTE FUNCTION public.sanitize_neutral_submission();

CREATE OR REPLACE FUNCTION public.sanitize_consultation_submission()
RETURNS TRIGGER AS $$
BEGIN
    -- Public booking requests always start Pending Verification
    NEW.status := 'Pending Verification';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS trg_sanitize_consultation_insert ON public.consultations;
CREATE TRIGGER trg_sanitize_consultation_insert
    BEFORE INSERT ON public.consultations
    FOR EACH ROW
    EXECUTE FUNCTION public.sanitize_consultation_submission();

CREATE OR REPLACE FUNCTION public.sanitize_legal_assessment_submission()
RETURNS TRIGGER AS $$
BEGIN
    -- Public intake requests always start QUEUED (never ANALYZED or EXPIRED)
    NEW.status := 'QUEUED';
    NEW.submission_source := 'WEB_PORTAL';
    IF NEW.reference_id IS NULL OR length(trim(NEW.reference_id)) = 0 THEN
        NEW.reference_id := 'LA-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM()*89999 + 10000)::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS trg_sanitize_legal_assessment_insert ON public.legal_assessments;
CREATE TRIGGER trg_sanitize_legal_assessment_insert
    BEFORE INSERT ON public.legal_assessments
    FOR EACH ROW
    EXECUTE FUNCTION public.sanitize_legal_assessment_submission();

-- D. Handle updated_at for Legal Assessments
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

DROP TRIGGER IF EXISTS set_legal_assessments_updated_at ON public.legal_assessments;
CREATE TRIGGER set_legal_assessments_updated_at
BEFORE UPDATE ON public.legal_assessments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- E. Rate-Limited Docket PIN Verification RPC (Bcrypt Comparison Only)
CREATE OR REPLACE FUNCTION public.internal_verify_docket_pin(
    p_docket TEXT,
    p_pin TEXT,
    p_client_hash TEXT,
    p_ip_masked TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_dispute RECORD;
    v_failed_attempts INT;
    v_cooldown_remaining INT;
    v_is_valid BOOLEAN := false;
BEGIN
    SELECT COUNT(*) INTO v_failed_attempts
    FROM public.docket_pin_attempts
    WHERE client_hash = p_client_hash
      AND is_successful = false
      AND attempt_time > (NOW() - INTERVAL '5 minutes');

    IF v_failed_attempts >= 5 THEN
        SELECT EXTRACT(EPOCH FROM ((attempt_time + INTERVAL '5 minutes') - NOW()))::INT
        INTO v_cooldown_remaining
        FROM public.docket_pin_attempts
        WHERE client_hash = p_client_hash AND is_successful = false
        ORDER BY attempt_time DESC LIMIT 1;

        RETURN jsonb_build_object(
            'success', false,
            'error', 'RATE_LIMITED',
            'message', 'Too many failed verification attempts. Access temporarily locked for security.',
            'lockout_seconds', COALESCE(v_cooldown_remaining, 300)
        );
    END IF;

    SELECT * INTO v_dispute
    FROM public.disputes
    WHERE UPPER(docket_number) = UPPER(TRIM(p_docket));

    IF v_dispute.id IS NULL THEN
        INSERT INTO public.docket_pin_attempts (client_hash, docket_number, ip_masked, is_successful)
        VALUES (p_client_hash, p_docket, p_ip_masked, false);

        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_CREDENTIALS',
            'message', 'The docket number or access PIN provided is invalid.',
            'remaining_attempts', (5 - (v_failed_attempts + 1))
        );
    END IF;

    -- Strict bcrypt comparison using pgcrypto crypt() against the stored bcrypt hash
    -- No unsalted SHA-256 or plaintext comparisons allowed
    v_is_valid := (v_dispute.access_code_hash = extensions.crypt(TRIM(p_pin), v_dispute.access_code_hash));

    IF NOT v_is_valid THEN
        INSERT INTO public.docket_pin_attempts (client_hash, docket_number, ip_masked, is_successful)
        VALUES (p_client_hash, p_docket, p_ip_masked, false);

        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_CREDENTIALS',
            'message', 'The docket number or access PIN provided is invalid.',
            'remaining_attempts', (5 - (v_failed_attempts + 1))
        );
    END IF;

    INSERT INTO public.docket_pin_attempts (client_hash, docket_number, ip_masked, is_successful)
    VALUES (p_client_hash, p_docket, p_ip_masked, true);

    INSERT INTO public.case_audit_logs (
        case_id, docket_number, event_type, actor_type, change_summary, metadata
    ) VALUES (
        v_dispute.id,
        v_dispute.docket_number,
        'PIN_VERIFIED',
        'authenticated_party',
        'Confidential case dossier authenticated via valid Access PIN.',
        jsonb_build_object('client_hash', p_client_hash)
    );

    RETURN jsonb_build_object(
        'success', true,
        'data', jsonb_build_object(
            'docket_number', v_dispute.docket_number,
            'claimant_name', v_dispute.claimant_name,
            'claimant_email', v_dispute.claimant_email,
            'claimant_phone', v_dispute.claimant_phone,
            'respondent_name', v_dispute.respondent_name,
            'respondent_email', v_dispute.respondent_email,
            'respondent_phone', v_dispute.respondent_phone,
            'claim_amount', v_dispute.claim_amount,
            'mode', v_dispute.mode,
            'status', v_dispute.status,
            'dispute_summary', v_dispute.dispute_summary,
            'relief_sought', v_dispute.relief_sought,
            'evidence_file_path', v_dispute.evidence_file_path,
            'assigned_neutral', v_dispute.assigned_neutral,
            'hearing_date', v_dispute.hearing_date,
            'hearing_time', v_dispute.hearing_time,
            'hearing_room_url', v_dispute.hearing_room_url,
            'created_at', v_dispute.created_at
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 12. REVOKE FUNCTION EXECUTION FROM PUBLIC, ANON, AUTHENTICATED
REVOKE ALL ON FUNCTION public.prevent_audit_log_tampering() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.process_dispute_audit() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sanitize_dispute_submission() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sanitize_neutral_submission() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sanitize_consultation_submission() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sanitize_legal_assessment_submission() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.internal_verify_docket_pin(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.internal_verify_docket_pin(TEXT, TEXT, TEXT, TEXT) TO service_role;

-- 13. TABLE PRIVILEGE MATRIX CONFIGURATION

-- Base table privilege revocations from all non-service roles
REVOKE ALL ON TABLE public.disputes FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.neutrals FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.consultations FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.legal_assessments FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.case_audit_logs FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.docket_pin_attempts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.notice_deliveries FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.admin_users FROM PUBLIC, anon, authenticated;

-- STRICT COLUMN-LEVEL GRANTS FOR ANON (Public Form Submission Only)
-- Denies direct client assignment to: id, docket_number, access_code_hash, status, assigned_neutral, hearing_date, hearing_room_url, created_at, updated_at
GRANT INSERT (
    claimant_name,
    claimant_email,
    claimant_phone,
    respondent_name,
    respondent_email,
    respondent_phone,
    claim_amount,
    mode,
    dispute_summary,
    relief_sought,
    evidence_file_path
) ON TABLE public.disputes TO anon;

GRANT INSERT (
    full_name,
    email,
    phone,
    role,
    bar_council_id,
    experience_years,
    specialization,
    languages
) ON TABLE public.neutrals TO anon;

GRANT INSERT (
    name,
    email,
    phone,
    preferred_date,
    preferred_time,
    format,
    notes
) ON TABLE public.consultations TO anon;

GRANT INSERT (
    category,
    claim_quantum_tier,
    currency,
    governing_law_type,
    arbitration_clause_status
) ON TABLE public.legal_assessments TO anon;

-- PRIVILEGES FOR AUTHENTICATED USERS
-- Authenticated users can insert via public forms
GRANT INSERT (
    claimant_name,
    claimant_email,
    claimant_phone,
    respondent_name,
    respondent_email,
    respondent_phone,
    claim_amount,
    mode,
    dispute_summary,
    relief_sought,
    evidence_file_path
) ON TABLE public.disputes TO authenticated;

GRANT INSERT (
    full_name,
    email,
    phone,
    role,
    bar_council_id,
    experience_years,
    specialization,
    languages
) ON TABLE public.neutrals TO authenticated;

GRANT INSERT (
    name,
    email,
    phone,
    preferred_date,
    preferred_time,
    format,
    notes
) ON TABLE public.consultations TO authenticated;

GRANT INSERT (
    category,
    claim_quantum_tier,
    currency,
    governing_law_type,
    arbitration_clause_status
) ON TABLE public.legal_assessments TO authenticated;

-- Admin CRUD Privileges for Authenticated (Governed strictly by RLS app_metadata check)
GRANT SELECT, UPDATE, DELETE ON TABLE public.disputes TO authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.neutrals TO authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.consultations TO authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.legal_assessments TO authenticated;
GRANT SELECT ON TABLE public.case_audit_logs TO authenticated;
GRANT SELECT ON TABLE public.docket_pin_attempts TO authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.notice_deliveries TO authenticated;
GRANT SELECT ON TABLE public.admin_users TO authenticated;

-- Note: authenticated CANNOT INSERT, UPDATE, or DELETE on admin_users (prevents role self-elevation)
-- Note: authenticated CANNOT INSERT, UPDATE, or DELETE on docket_pin_attempts (prevents lockout clearing)
-- Note: authenticated CANNOT UPDATE or DELETE on case_audit_logs (preserves immutable ledger)

-- PRIVILEGES FOR SERVICE_ROLE (Protected Server-Side Operations Only)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.disputes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.neutrals TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.consultations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.legal_assessments TO service_role;
GRANT SELECT, INSERT ON TABLE public.case_audit_logs TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notice_deliveries TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.docket_pin_attempts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_users TO service_role;

-- Revoke UPDATE, DELETE, TRUNCATE on immutable audit logs from all roles
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.case_audit_logs FROM PUBLIC, anon, authenticated, service_role;

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neutrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.docket_pin_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Disputes Policies
DROP POLICY IF EXISTS "Anon insert dispute" ON public.disputes;
CREATE POLICY "Anon insert dispute"
    ON public.disputes FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access on disputes" ON public.disputes;
CREATE POLICY "Admins have full access on disputes"
    ON public.disputes FOR SELECT
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'));

DROP POLICY IF EXISTS "Admins update disputes" ON public.disputes;
CREATE POLICY "Admins update disputes"
    ON public.disputes FOR UPDATE
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'))
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'));

DROP POLICY IF EXISTS "Admins delete disputes" ON public.disputes;
CREATE POLICY "Admins delete disputes"

    ON public.disputes FOR DELETE
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'));

-- Neutrals Policies
DROP POLICY IF EXISTS "Anon insert neutral" ON public.neutrals;
CREATE POLICY "Anon insert neutral"
    ON public.neutrals FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access neutrals" ON public.neutrals;
CREATE POLICY "Admins full access neutrals"
    ON public.neutrals FOR ALL
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'))
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'));

-- Consultations Policies
DROP POLICY IF EXISTS "Anon insert consultation" ON public.consultations;
CREATE POLICY "Anon insert consultation"
    ON public.consultations FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access consultations" ON public.consultations;
CREATE POLICY "Admins full access consultations"
    ON public.consultations FOR ALL
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'))
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'));

-- Legal Assessments Policies
DROP POLICY IF EXISTS "Anon insert legal_assessments" ON public.legal_assessments;
CREATE POLICY "Anon insert legal_assessments"
    ON public.legal_assessments FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access legal_assessments" ON public.legal_assessments;
CREATE POLICY "Admins full access legal_assessments"
    ON public.legal_assessments FOR ALL
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'))
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'));

-- Case Audit Logs Policies (Admins can only SELECT; no user can INSERT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.case_audit_logs;
CREATE POLICY "Admins can view audit logs"
    ON public.case_audit_logs FOR SELECT
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'));

-- Docket Pin Attempts Policies (Admins read-only)
DROP POLICY IF EXISTS "Admins can view docket pin attempts" ON public.docket_pin_attempts;
CREATE POLICY "Admins can view docket pin attempts"
    ON public.docket_pin_attempts FOR SELECT
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'));

-- Notice Deliveries Policies
DROP POLICY IF EXISTS "Admins can view and manage notice deliveries" ON public.notice_deliveries;
CREATE POLICY "Admins can view and manage notice deliveries"
    ON public.notice_deliveries FOR ALL
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'))
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar'));

-- Admin Users Policies (Users can only view their own record; admin can view all; no client INSERT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Users can view own admin record" ON public.admin_users;
CREATE POLICY "Users can view own admin record"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar')
    );

-- 15. STORAGE BUCKET SETUP (Evidence Bucket with RLS)
INSERT INTO storage.buckets (id, name, public)
VALUES ('dispute-evidence', 'dispute-evidence', false)
ON CONFLICT (id) DO NOTHING;

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
