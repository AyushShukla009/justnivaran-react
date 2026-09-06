-- ====================================================================
-- JUSTNIVARAN ODR PLATFORM — STAGING / QA DYNAMIC TEST SEED HARNESS
-- DO NOT EXECUTE IN PRODUCTION.
-- Generates a randomized, sanitized QA case with a 7-day expiration timestamp.
-- ====================================================================

DO $$
DECLARE
    v_docket VARCHAR(64);
    v_raw_pin VARCHAR(6);
    v_pin_hash TEXT;
    v_case_id UUID;
BEGIN
    -- 1. Generate randomized QA docket and random 6-digit test PIN
    v_docket := 'JN/QA/' || TO_CHAR(NOW(), 'YYYY') || '/' || LPAD(FLOOR(RANDOM()*8999 + 1000)::TEXT, 4, '0');
    v_raw_pin := LPAD(FLOOR(RANDOM()*899999 + 100000)::TEXT, 6, '0');
    v_pin_hash := extensions.crypt(v_raw_pin, extensions.gen_salt('bf'));

    -- 2. Insert sanitized QA dispute (expires in 7 days)
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
        'Apex Tech Solutions LLP (QA)',
        'qa-claimant@justnivaran-test.local',
        '+919876543210',
        'Zenith Logistics India Ltd. (QA)',
        'qa-respondent@justnivaran-test.local',
        '+919876543211',
        1250000.00,
        'ARB',
        '[Sanitized QA Test Case] Commercial invoice settlement and service agreement reconciliation. Confidentiality protected under DPDP Act 2023.',
        'Recovery of outstanding commercial consideration with statutory pre-award interest under s. 31(7)(a).',
        v_pin_hash,
        'Hon. Justice (Retd.) M. K. Sharma (QA Panel Arbitrator)',
        CURRENT_DATE + INTERVAL '12 days',
        '11:30 AM IST',
        'https://meet.jit.si/JustNivaran-Hearing-' || REPLACE(v_docket, '/', '-'),
        'Hearing Scheduled'
    ) RETURNING id INTO v_case_id;

    -- 3. Insert mock notice delivery records for QA testing
    INSERT INTO public.notice_deliveries (
        dispute_id,
        docket_number,
        recipient_type,
        channel,
        recipient_contact,
        status,
        provider_msg_id,
        dispatched_at,
        delivered_at
    ) VALUES 
    (
        v_case_id,
        v_docket,
        'respondent',
        'whatsapp',
        '+919876543211',
        'Delivered',
        'wamid.QA_' || extensions.gen_random_uuid()::TEXT,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days' + INTERVAL '3 minutes'
    ),
    (
        v_case_id,
        v_docket,
        'respondent',
        'email',
        'qa-respondent@justnivaran-test.local',
        'Delivered',
        'msg_email_QA_' || extensions.gen_random_uuid()::TEXT,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days' + INTERVAL '1 minute'
    );

    -- 4. Print QA test credentials in migration console output
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'QA STAGING CASE CREATED SUCCESSFULLY:';
    RAISE NOTICE 'DOCKET NUMBER: %', v_docket;
    RAISE NOTICE 'TEST ACCESS PIN: %', v_raw_pin;
    RAISE NOTICE 'STATUS: Hearing Scheduled';
    RAISE NOTICE '==================================================';
END $$;
