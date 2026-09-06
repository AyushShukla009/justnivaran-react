-- ==============================================================================
-- JUSTNIVARAN ODR PLATFORM — STAGING SANITIZED SEED DATA (FICTIONAL TEST DATA ONLY)
-- Purpose: Populates the staging database with synthetic test cases.
-- Security: Strictly NO production rows, NO real client data, NO PII.
-- ==============================================================================

DO $$
DECLARE
    v_case_id UUID;
    v_docket VARCHAR(64) := 'JN/STG/2026/1001';
    v_pin_hash TEXT := extensions.crypt('090909', extensions.gen_salt('bf'));
BEGIN
    -- 1. Insert Fictional Staging Dispute
    INSERT INTO public.disputes (
        docket_number,
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
        access_code_hash,
        assigned_neutral,
        hearing_date,
        hearing_time,
        hearing_room_url,
        status
    ) VALUES (
        v_docket,
        'Apex Tech Solutions LLP (Fictional Staging)',
        'staging-claimant@justnivaran-test.local',
        '+919876543210',
        'Zenith Logistics India Ltd. (Fictional Staging)',
        'staging-respondent@justnivaran-test.local',
        '+919876543211',
        1250000.00,
        'ARB',
        '[Sanitized Staging Case] Commercial invoice settlement and service agreement reconciliation.',
        'Recovery of outstanding commercial consideration with statutory pre-award interest under s. 31(7)(a).',
        v_pin_hash,
        'Hon. Justice (Retd.) M. K. Sharma (Staging Arbitrator)',
        CURRENT_DATE + INTERVAL '10 days',
        '11:30 AM IST',
        'https://meet.jit.si/JustNivaran-Staging-1001',
        'Hearing Scheduled'
    )
    ON CONFLICT (docket_number) DO NOTHING
    RETURNING id INTO v_case_id;

    -- 2. Insert Fictional Empaneled Neutral
    INSERT INTO public.neutrals (
        full_name,
        email,
        phone,
        role,
        bar_council_id,
        experience_years,
        specialization,
        languages,
        status
    ) VALUES (
        'Adv. Priya Sundaram (Staging Test)',
        'staging-neutral@justnivaran-test.local',
        '+919876543212',
        'Arbitrator',
        'D/1234/2010-STG',
        15,
        'Commercial & Cross-Border Supply Contracts',
        'English, Hindi, Tamil',
        'Empaneled'
    )
    ON CONFLICT DO NOTHING;

    -- 3. Insert Fictional Consultation
    INSERT INTO public.consultations (
        name,
        email,
        phone,
        preferred_date,
        preferred_time,
        format,
        notes,
        status
    ) VALUES (
        'Rohan Verma (Staging Test)',
        'staging-consultation@justnivaran-test.local',
        '+919876543213',
        CURRENT_DATE + INTERVAL '3 days',
        '03:00 PM',
        'Video Conference',
        'Inquiry regarding fast-track commercial arbitration procedure.',
        'Confirmed'
    )
    ON CONFLICT DO NOTHING;
END $$;
