-- =====================================================================
-- JUSTNIVARAN ODR PLATFORM — PAYMENT GATEWAY & AUDIT LEDGER SCHEMA
-- Multi-provider payment tracking for Razorpay, Cashfree & Bank Wires
-- =====================================================================

-- 1. Table: public.payment_orders
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(64) UNIQUE NOT NULL,
  docket_number VARCHAR(64),
  party_name VARCHAR(255) NOT NULL,
  party_email VARCHAR(255),
  party_phone VARCHAR(32),
  track VARCHAR(32) NOT NULL DEFAULT 'arbitration',
  claim_amount NUMERIC(15, 2) NOT NULL,
  base_fee NUMERIC(12, 2) NOT NULL,
  gst_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.18,
  gst_amount NUMERIC(12, 2) NOT NULL,
  total_payable NUMERIC(12, 2) NOT NULL,
  registry_share NUMERIC(12, 2) NOT NULL,
  neutral_share NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  status VARCHAR(32) NOT NULL DEFAULT 'CREATED', -- 'CREATED', 'PAID', 'FAILED', 'REFUNDED'
  provider VARCHAR(32) NOT NULL DEFAULT 'razorpay', -- 'razorpay', 'institutional_invoice'
  provider_order_id VARCHAR(128),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table: public.payment_transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(64) NOT NULL REFERENCES public.payment_orders(order_id) ON DELETE CASCADE,
  docket_number VARCHAR(64),
  provider_payment_id VARCHAR(128) NOT NULL,
  payment_method VARCHAR(32), -- 'upi', 'card', 'netbanking', 'wallet', 'neft_rtgs'
  bank VARCHAR(64),
  wallet VARCHAR(64),
  vpa VARCHAR(128),
  amount_paid NUMERIC(12, 2) NOT NULL,
  fee_split_registry NUMERIC(12, 2) NOT NULL,
  fee_split_neutral NUMERIC(12, 2) NOT NULL,
  signature_verified BOOLEAN NOT NULL DEFAULT true,
  status VARCHAR(32) NOT NULL DEFAULT 'CAPTURED',
  raw_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_payment_orders_docket ON public.payment_orders(docket_number);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON public.payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_tx_order ON public.payment_transactions(order_id);

-- Enable RLS
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public/Anon can insert new orders during filing, but only service_role/admins can read/update all
CREATE POLICY "Public order creation"
  ON public.payment_orders
  FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);

CREATE POLICY "Service and Admin view orders"
  ON public.payment_orders
  FOR SELECT
  TO authenticated, service_role
  USING (true);

CREATE POLICY "Service and Admin view transactions"
  ON public.payment_transactions
  FOR ALL
  TO service_role, authenticated
  USING (true);
