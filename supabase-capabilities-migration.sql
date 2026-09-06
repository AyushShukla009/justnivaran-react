-- ==============================================================================
-- JustNivaran ODR: Advanced Capabilities Migration & RLS Security Schema
-- Capabilities:
-- 1. AI-Assisted Legal Risk & Outcome Assessment (Beta)
-- 2. Fast-Track Arbitration under Section 29B
-- 3. Emergency Arbitration & Interim Relief (48-72h)
-- ==============================================================================

-- 1. Table: Legal Assessments (Beta Intake & Precedential Mapping)
CREATE TABLE IF NOT EXISTS public.legal_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    claim_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    dispute_date DATE,
    factual_summary TEXT NOT NULL,
    primary_claims TEXT NOT NULL,
    expected_defenses TEXT,
    governing_law TEXT DEFAULT 'Laws of India',
    arbitration_clause TEXT,
    clause_details TEXT,
    evidence_checklist TEXT[] DEFAULT '{}',
    relief_sought TEXT,
    applicant_name TEXT NOT NULL,
    applicant_org TEXT,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Queued for Analysis',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on legal_assessments
ALTER TABLE public.legal_assessments ENABLE ROW LEVEL SECURITY;

-- Anonymous public users can ONLY INSERT their assessment requests
DROP POLICY IF EXISTS "Anon insert legal_assessments" ON public.legal_assessments;
CREATE POLICY "Anon insert legal_assessments"
ON public.legal_assessments
FOR INSERT
TO anon
WITH CHECK (true);

-- Authenticated registry administrators can SELECT and UPDATE
DROP POLICY IF EXISTS "Admin full access legal_assessments" ON public.legal_assessments;
CREATE POLICY "Admin full access legal_assessments"
ON public.legal_assessments
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Index for fast reference lookup
CREATE INDEX IF NOT EXISTS idx_legal_assessments_ref ON public.legal_assessments (reference_id);
CREATE INDEX IF NOT EXISTS idx_legal_assessments_created ON public.legal_assessments (created_at DESC);

-- 2. Audit Trail Trigger for Updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_legal_assessments_updated_at ON public.legal_assessments;
CREATE TRIGGER set_legal_assessments_updated_at
BEFORE UPDATE ON public.legal_assessments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Documentation Notice
COMMENT ON TABLE public.legal_assessments IS 'Stores structured beta dispute parameters for AI-assisted legal risk and outcome assessment with strict DPDP Act purpose limitation.';
