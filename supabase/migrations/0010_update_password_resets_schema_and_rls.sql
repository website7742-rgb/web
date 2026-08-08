-- Migration: 0010_update_password_resets_schema_and_rls.sql
-- Enables public insert & select policies for password resets table and adds code column support

CREATE TABLE IF NOT EXISTS public.password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    otp_hash TEXT,
    verification_token_hash TEXT,
    attempts INTEGER DEFAULT 0 NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure code column exists if table was created previously with otp_hash
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='password_resets' AND column_name='code') THEN
    ALTER TABLE public.password_resets ADD COLUMN code TEXT;
  END IF;
END $$;

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets(email);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON public.password_resets(expires_at);

-- Enable RLS & Policies
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert and select for password resets" ON public.password_resets;
DROP POLICY IF EXISTS "No direct public access to password_resets" ON public.password_resets;

CREATE POLICY "Allow public insert and select for password resets" 
ON public.password_resets FOR ALL 
USING (true) 
WITH CHECK (true);
