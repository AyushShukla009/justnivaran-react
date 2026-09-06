-- ==============================================================================
-- JustNivaran ODR: AI Outcome Predictor Persistent Telemetry & Rate-Limiting Schema
-- Security Model: Zero browser access. Server-side service_role access only.
-- Privacy Guarantee: Stores strictly non-sensitive operational metrics.
-- NEVER stores dispute facts, claims, defences, contract text, prompts, or reports.
-- ==============================================================================

-- 1. Table: AI Assessment Request Telemetry (Strict Constraints & Format Validation)
CREATE TABLE IF NOT EXISTS public.ai_assessment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    client_identifier_hash VARCHAR(64) NOT NULL CHECK (client_identifier_hash ~ '^[0-9a-f]{64}$'),
    status VARCHAR(32) NOT NULL CHECK (status IN ('IN_PROGRESS', 'COMPLETED_SUCCESS', 'FAILED', 'RATE_LIMITED')),
    model_identifier VARCHAR(64) NOT NULL CHECK (length(model_identifier) > 0 AND length(model_identifier) <= 64),
    latency_ms INTEGER CHECK (latency_ms IS NULL OR latency_ms >= 0),
    error_code VARCHAR(64) CHECK (error_code IS NULL OR length(error_code) <= 64)
);

-- Comments & Metadata
COMMENT ON TABLE public.ai_assessment_requests IS 'Metadata-only operational telemetry for persistent rate-limiting. Strictly no case data, PII, raw IPs or raw device identifiers stored.';

-- Enable and Force Row Level Security (RLS)
ALTER TABLE public.ai_assessment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assessment_requests FORCE ROW LEVEL SECURITY;

-- 2. Revoke ALL table privileges from public, anon, and authenticated roles
REVOKE ALL ON TABLE public.ai_assessment_requests FROM PUBLIC, anon, authenticated;

-- Grant MINIMUM REQUIRED privileges ONLY to server-side service_role (No TRUNCATE, TRIGGER, REFERENCES)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_assessment_requests TO service_role;

-- 3. Explicit Default-Deny RLS Policies for Anon and Authenticated Roles
DROP POLICY IF EXISTS "Deny all access to anon on ai_assessment_requests" ON public.ai_assessment_requests;
CREATE POLICY "Deny all access to anon on ai_assessment_requests"
ON public.ai_assessment_requests
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny all access to authenticated on ai_assessment_requests" ON public.ai_assessment_requests;
CREATE POLICY "Deny all access to authenticated on ai_assessment_requests"
ON public.ai_assessment_requests
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Service role full access on ai_assessment_requests" ON public.ai_assessment_requests;
CREATE POLICY "Service role full access on ai_assessment_requests"
ON public.ai_assessment_requests
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Indexes for persistent rate-limiting sliding window queries
CREATE INDEX IF NOT EXISTS idx_ai_requests_client_hash_created ON public.ai_assessment_requests (client_identifier_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_requests_created ON public.ai_assessment_requests (created_at DESC);

-- 4. Concurrency-Safe Rate-Limiting Stored Procedure (SECURITY INVOKER)
CREATE OR REPLACE FUNCTION public.check_and_log_ai_request(
    p_client_hash TEXT,
    p_model TEXT DEFAULT 'openai/gpt-oss-120b',
    p_max_requests INT DEFAULT 3,
    p_window_seconds INT DEFAULT 3600
)
RETURNS JSON AS $$
DECLARE
    v_count INT;
    v_oldest TIMESTAMPTZ;
    v_now TIMESTAMPTZ := NOW();
    v_retry_after INT := 0;
BEGIN
    -- Strict Parameter Validation
    IF p_client_hash IS NULL OR p_client_hash !~ '^[0-9a-f]{64}$' THEN
        RAISE EXCEPTION 'INVALID_CLIENT_HASH: must be a 64-character lowercase hexadecimal string';
    END IF;

    IF p_model IS NULL OR length(trim(p_model)) = 0 OR length(p_model) > 64 THEN
        RAISE EXCEPTION 'INVALID_MODEL: model identifier must be between 1 and 64 characters';
    END IF;

    IF p_max_requests IS NULL OR p_max_requests < 1 OR p_max_requests > 100 THEN
        RAISE EXCEPTION 'INVALID_MAX_REQUESTS: limit must be between 1 and 100';
    END IF;

    IF p_window_seconds IS NULL OR p_window_seconds < 1 OR p_window_seconds > 86400 THEN
        RAISE EXCEPTION 'INVALID_WINDOW_SECONDS: window must be between 1 and 86400 seconds';
    END IF;

    -- Concurrency Control:
    -- Concurrent requests sharing the same derived advisory-lock key are serialized.
    -- Hash collisions may conservatively serialize unrelated clients but must not allow the same client to bypass the configured limit.
    PERFORM pg_advisory_xact_lock(hashtext(p_client_hash));

    -- Check sliding window count for this client hash
    SELECT COUNT(*), MIN(created_at)
    INTO v_count, v_oldest
    FROM public.ai_assessment_requests
    WHERE client_identifier_hash = p_client_hash
      AND created_at >= v_now - (p_window_seconds || ' seconds')::INTERVAL;

    IF v_count >= p_max_requests THEN
        v_retry_after := CEIL(EXTRACT(EPOCH FROM (v_oldest + (p_window_seconds || ' seconds')::INTERVAL - v_now)));
        RETURN json_build_object(
            'allowed', false,
            'count', v_count,
            'retry_after_seconds', GREATEST(v_retry_after, 1),
            'source', 'database'
        );
    END IF;

    -- Record request in telemetry log inside locked transaction
    INSERT INTO public.ai_assessment_requests (client_identifier_hash, model_identifier, status)
    VALUES (p_client_hash, p_model, 'IN_PROGRESS');

    RETURN json_build_object(
        'allowed', true,
        'remaining', p_max_requests - v_count - 1,
        'source', 'database'
    );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

-- Revoke function execution from public, anon, and authenticated; grant ONLY to service_role
REVOKE ALL ON FUNCTION public.check_and_log_ai_request(TEXT, TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_log_ai_request(TEXT, TEXT, INT, INT) TO service_role;

-- 5. Automated Telemetry Retention Cleanup Function (Fixed 7-Day Purge, SECURITY INVOKER)
CREATE OR REPLACE FUNCTION public.cleanup_expired_ai_telemetry()
RETURNS INT AS $$
DECLARE
    v_deleted_rows INT;
BEGIN
    -- Fixed 7-day retention purge (caller-controlled arbitrary retention periods disallowed)
    DELETE FROM public.ai_assessment_requests
    WHERE created_at < NOW() - INTERVAL '7 days';

    GET DIAGNOSTICS v_deleted_rows = ROW_COUNT;
    RETURN v_deleted_rows;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

-- Restrict retention cleanup function strictly to server-side service_role
REVOKE ALL ON FUNCTION public.cleanup_expired_ai_telemetry() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_ai_telemetry() TO service_role;

-- 6. Idempotent Automated Daily Retention Cleanup Schedule via pg_cron (03:00 UTC)
-- Note: pg_cron is natively supported on Supabase (Database -> Extensions).
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
    ) THEN
        -- Unschedule existing job if it exists to ensure idempotency across re-runs
        IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-ai-telemetry-cleanup') THEN
            PERFORM cron.unschedule('daily-ai-telemetry-cleanup');
        END IF;

        -- Schedule daily execution of 7-day retention purge at 03:00 UTC
        PERFORM cron.schedule(
            'daily-ai-telemetry-cleanup',
            '0 3 * * *',
            'SELECT public.cleanup_expired_ai_telemetry();'
        );
    END IF;
END $$;

