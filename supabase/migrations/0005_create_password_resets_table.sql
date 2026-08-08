-- Migration: Create Password Resets Table for OTP Password Recovery

CREATE TABLE IF NOT EXISTS public.password_resets (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  otp_hash text not null,
  verification_token_hash text,
  attempts integer default 0 not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast lookup by email and expiration
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets(email);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON public.password_resets(expires_at);

-- Enable RLS (Service role will bypass RLS in Server Actions)
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Block public direct access; access is managed server-side via Server Actions
CREATE POLICY "No direct public access to password_resets"
ON public.password_resets FOR ALL
USING (false);
