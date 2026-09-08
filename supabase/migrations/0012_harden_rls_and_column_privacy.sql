-- Migration 0012: Harden RLS & Column-Level Security for profiles, submissions, and password_resets

-- 1. HARDEN public.profiles: Column-Level Security for Anonymous Visitors
-- Revoke blanket SELECT on table from anon
REVOKE SELECT ON public.profiles FROM anon;

-- Grant SELECT ONLY on safe, non-sensitive public columns to anon
GRANT SELECT (id, full_name, display_name, avatar_url, country, genre, bio, instagram_url, twitter_url, created_at, updated_at, username) ON public.profiles TO anon;

-- 2. HARDEN public.password_resets: Block Anonymous Scrapes
DROP POLICY IF EXISTS "Allow public resets access" ON public.password_resets;
-- RLS remains enabled; service role bypasses RLS and manages OTPs securely server-side.

-- 3. HARDEN public.submissions: Restrict to Authenticated Owner & Admin
DROP POLICY IF EXISTS "Allow submissions access" ON public.submissions;

CREATE POLICY "Users can insert their own submissions" 
ON public.submissions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Users can view their own submissions" 
ON public.submissions FOR SELECT 
TO authenticated 
USING (auth.uid() = artist_id);

CREATE POLICY "Admins have full access to submissions" 
ON public.submissions FOR ALL 
TO authenticated 
USING (is_admin()) 
WITH CHECK (is_admin());
