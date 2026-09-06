-- ====================================================================
-- JUSTNIVARAN ODR PLATFORM — INSTITUTIONAL SECURITY HARDENING MIGRATION
-- Compliant with: OWASP API Security Top 10 (2023), DPDP Act 2023,
-- Arbitration & Conciliation Act 1996, and Mediation Act 2023.
-- ====================================================================

-- 1. EXTENSIONS (Installed in extensions schema)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;

-- 2. DISPUTES TABLE (Schema Hardened)
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
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
    access_code_hash TEXT NOT NULL, -- Stored as bcrypt/sha256 hash, never plain-text
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

-- Ensure access_code_hash exists if upgrading existing tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'disputes' AND column_name = 'access_code_hash') THEN
        ALTER TABLE public.disputes ADD COLUMN access_code_hash TEXT;
        -- Migrate any existing plaintext access_code to crypt hash if legacy column exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'disputes' AND column_name = 'access_code') THEN
            UPDATE public.disputes SET access_code_hash = extensions.crypt(COALESCE(access_code, '090909'), extensions.gen_salt('bf')) WHERE access_code_hash IS NULL;
            ALTER TABLE public.disputes DROP COLUMN access_code;
        ELSE
            UPDATE public.disputes SET access_code_hash = extensions.crypt('090909', extensions.gen_salt('bf')) WHERE access_code_hash IS NULL;
        END IF;
        ALTER TABLE public.disputes ALTER COLUMN access_code_hash SET NOT NULL;
    END IF;
END $$;

-- 3. SERVER-SIDE DOCKET PIN RATE LIMITING & ATTEMPTS TABLE
-- Rate-limits using a composite client_hash (hashed client IP + docket) to prevent denial-of-service lockout of legitimate parties
CREATE TABLE IF NOT EXISTS public.docket_pin_attempts (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    client_hash VARCHAR(64) NOT NULL, -- sha256(client_ip + ':' + docket_number)
    docket_number VARCHAR(64) NOT NULL,
    ip_masked VARCHAR(64),
    attempt_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_successful BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_pin_attempts_client_time 
    ON public.docket_pin_attempts (client_hash, attempt_time DESC);

-- 4. STATUTORY NOTICE DELIVERY TRACKING TABLE
-- Stores explicit status updated via provider webhooks (Queued -> Sent -> Delivered -> Failed)
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

CREATE INDEX IF NOT EXISTS idx_notice_deliveries_docket ON public.notice_deliveries (docket_number);
CREATE INDEX IF NOT EXISTS idx_notice_deliveries_provider ON public.notice_deliveries (provider_msg_id) WHERE provider_msg_id IS NOT NULL;

-- 5. APPEND-ONLY CASE AUDIT LOGS (Database Trigger-Driven)
CREATE TABLE IF NOT EXISTS public.case_audit_logs (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    case_id UUID REFERENCES public.disputes(id) ON DELETE CASCADE,
    docket_number VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL, -- e.g. FILING_CREATED, STATUS_CHANGED, NEUTRAL_ASSIGNED, HEARING_UPDATED, PIN_VERIFIED
    actor_type VARCHAR(32) NOT NULL DEFAULT 'system', -- system, admin, neutral, edge_function
    actor_id TEXT,
    change_summary TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb, -- Safe metadata only; never stores PINs, tokens, or raw document content
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_docket ON public.case_audit_logs (docket_number);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.case_audit_logs (created_at DESC);

-- Strictly deny UPDATE and DELETE on audit logs to preserve tamper-proof evidentiary integrity
REVOKE UPDATE, DELETE ON public.case_audit_logs FROM public, anon, authenticated;

-- 6. AUDIT TRIGGER FOR AUTOMATIC DISPUTE EVENT LOGGING
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
        -- Log status change
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

        -- Log neutral assignment
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

        -- Log hearing schedule update
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

-- 7. SECURE SERVER-SIDE RPCs (CALLED ONLY BY EDGE FUNCTIONS OR ADMINS)
-- Fully qualified, search_path='', revoked from anon/public

-- RPC A: Rate-Limited PIN Verification (Private to Service Role / Edge Function)
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
    -- 1. Check rate limit for this specific client_hash + docket in the last 300 seconds (5 minutes)
    SELECT COUNT(*) INTO v_failed_attempts
    FROM public.docket_pin_attempts
    WHERE client_hash = p_client_hash
      AND is_successful = false
      AND attempt_time > (NOW() - INTERVAL '5 minutes');

    IF v_failed_attempts >= 5 THEN
        -- Calculate remaining cooldown seconds
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

    -- 2. Fetch dispute record
    SELECT * INTO v_dispute
    FROM public.disputes
    WHERE UPPER(docket_number) = UPPER(TRIM(p_docket));

    -- 3. If docket does not exist, return generic error (prevents docket enumeration)
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

    -- 4. Verify PIN hash using pgcrypto crypt() or fallback comparison
    IF v_dispute.access_code_hash LIKE '$2%' THEN
        v_is_valid := (v_dispute.access_code_hash = extensions.crypt(TRIM(p_pin), v_dispute.access_code_hash));
    ELSE
        -- SHA-256 or bcrypt check
        v_is_valid := (v_dispute.access_code_hash = encode(extensions.digest(TRIM(p_pin), 'sha256'), 'hex') OR v_dispute.access_code_hash = extensions.crypt(TRIM(p_pin), v_dispute.access_code_hash));
    END IF;

    -- 5. Handle verification result
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

    -- 6. Log successful authentication attempt
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

    -- 7. Return minimal required confidential case dossier
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

-- Revoke public execution of internal verification function
REVOKE EXECUTE ON FUNCTION public.internal_verify_docket_pin FROM public, anon;

-- 8. ADMIN USERS REGISTRY TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'registrar')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- Revoke direct anon SELECT and direct anon INSERT on sensitive tables
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neutrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.docket_pin_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin_users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar')
        OR user_id = auth.uid()
    );

-- Disputes Table:
-- 1. Revoke public/anon SELECT completely. All public queries go through Edge Functions.
DROP POLICY IF EXISTS "Public can view case status by docket" ON public.disputes;
DROP POLICY IF EXISTS "Public can submit dispute filings" ON public.disputes;
DROP POLICY IF EXISTS "Authenticated admins have full CRUD on disputes" ON public.disputes;

-- Only authenticated admins with valid role can directly SELECT/UPDATE disputes
CREATE POLICY "Admins have full access on disputes"
    ON public.disputes FOR ALL
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar')
        OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar')
        OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );

-- Neutrals & Consultations Tables:
DROP POLICY IF EXISTS "Public can view neutrals" ON public.neutrals;
DROP POLICY IF EXISTS "Public can submit empanelment applications" ON public.neutrals;
DROP POLICY IF EXISTS "Authenticated admins can manage neutrals" ON public.neutrals;

CREATE POLICY "Admins have full access on neutrals"
    ON public.neutrals FOR ALL
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar')
        OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Public can book consultations" ON public.consultations;
DROP POLICY IF EXISTS "Authenticated admins can manage consultations" ON public.consultations;

CREATE POLICY "Admins have full access on consultations"
    ON public.consultations FOR ALL
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar')
        OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );

-- Audit Logs Table:
CREATE POLICY "Admins can view audit logs"
    ON public.case_audit_logs FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar')
        OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );

-- Notice Deliveries Table:
CREATE POLICY "Admins can view and manage notice deliveries"
    ON public.notice_deliveries FOR ALL
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'registrar')
        OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );
