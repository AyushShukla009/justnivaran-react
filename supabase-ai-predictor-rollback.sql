-- ==============================================================================
-- JustNivaran ODR: AI Outcome Predictor Telemetry Schema Rollback
-- Safely drops only the AI telemetry table, functions, and pg_cron job.
-- NEVER modifies or drops any core dispute, user, or consultation tables.
-- ==============================================================================

-- 1. Unschedule pg_cron retention job if present
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-ai-telemetry-cleanup') THEN
            PERFORM cron.unschedule('daily-ai-telemetry-cleanup');
        END IF;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Ignore if pg_cron is not configured
    NULL;
END $$;

-- 2. Drop Stored Procedures & Functions
DROP FUNCTION IF EXISTS public.check_and_log_ai_request(TEXT, TEXT, INT, INT);
DROP FUNCTION IF EXISTS public.cleanup_expired_ai_telemetry();

-- 3. Drop Telemetry Table and Associated Indexes/Policies (Cascades strictly within table)
DROP TABLE IF EXISTS public.ai_assessment_requests CASCADE;
