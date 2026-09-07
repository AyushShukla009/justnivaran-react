-- ==============================================================================
-- JUSTNIVARAN ODR PLATFORM — PRODUCTION HARDENING ROLLBACK & RECOVERY PLAN
-- Purpose: Safely roll back triggers, functions, column constraints, and RPCs
-- introduced in supabase-production-hardening.sql without destroying core data.
-- Idempotency: Fully rerunnable and non-destructive to public case records.
-- ==============================================================================

-- 1. DROP REFINED TRIGGERS & REVERT TO BASELINE
DROP TRIGGER IF EXISTS trg_sanitize_legal_assessment_insert ON public.legal_assessments;
DROP TRIGGER IF EXISTS set_legal_assessments_updated_at ON public.legal_assessments;
DROP TRIGGER IF EXISTS trg_sanitize_consultation_insert ON public.consultations;
DROP TRIGGER IF EXISTS trg_sanitize_neutral_insert ON public.neutrals;
DROP TRIGGER IF EXISTS trg_sanitize_dispute_insert ON public.disputes;
DROP TRIGGER IF EXISTS trg_immutable_case_audit_logs ON public.case_audit_logs;
DROP TRIGGER IF EXISTS trg_dispute_updated_at ON public.disputes;
DROP TRIGGER IF EXISTS trg_dispute_audit ON public.disputes;

-- 2. DROP FUNCTIONS
DROP FUNCTION IF EXISTS public.submit_public_dispute(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.internal_verify_docket_pin(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.admin_reset_docket_pin(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.handle_dispute_updated_at();
DROP FUNCTION IF EXISTS public.prevent_audit_log_tampering();
DROP FUNCTION IF EXISTS public.process_dispute_audit();
DROP FUNCTION IF EXISTS public.sanitize_dispute_submission();
DROP FUNCTION IF EXISTS public.sanitize_neutral_submission();
DROP FUNCTION IF EXISTS public.sanitize_consultation_submission();
DROP FUNCTION IF EXISTS public.sanitize_legal_assessment_submission();
DROP FUNCTION IF EXISTS public.handle_legal_assessments_updated_at();

-- 3. REMOVE CONSTRAINTS & RESET COLUMN DEFAULTS (NON-DESTRUCTIVE)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_disputes_access_code_hash'
    ) THEN
        ALTER TABLE public.disputes DROP CONSTRAINT chk_disputes_access_code_hash;
    END IF;
END $$;

-- Reset default on access_code_hash if present
ALTER TABLE public.disputes ALTER COLUMN access_code_hash DROP DEFAULT;

-- Note: We intentionally retain the access_code_hash column and case_audit_logs data
-- to prevent accidental data loss during recovery.

-- 4. RESTORE BASELINE AUDIT TRIGGER (IF REQUIRED BY LEGACY CODEBASE)
CREATE OR REPLACE FUNCTION public.process_dispute_audit_legacy()
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
        NEW.updated_at = NOW();
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_dispute_audit
    AFTER INSERT OR UPDATE ON public.disputes
    FOR EACH ROW EXECUTE FUNCTION public.process_dispute_audit_legacy();

-- 5. RE-GRANT BASELINE REST API PERMISSIONS
GRANT SELECT, INSERT ON TABLE public.disputes TO anon;
GRANT SELECT, INSERT ON TABLE public.neutrals TO anon;
GRANT SELECT, INSERT ON TABLE public.consultations TO anon;
GRANT SELECT, INSERT ON TABLE public.legal_assessments TO anon;

GRANT ALL PRIVILEGES ON TABLE public.disputes TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.neutrals TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.consultations TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.legal_assessments TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.case_audit_logs TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.notice_deliveries TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.admin_users TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.docket_pin_attempts TO authenticated;

-- 6. RESTORE BASELINE STORAGE POLICIES
DROP POLICY IF EXISTS "Authorized admins can access dispute evidence" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can access dispute evidence" ON storage.objects;
CREATE POLICY "Authenticated admins can access dispute evidence"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'dispute-evidence')
    WITH CHECK (bucket_id = 'dispute-evidence');

-- Rollback Complete
