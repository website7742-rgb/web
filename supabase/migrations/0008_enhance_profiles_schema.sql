-- Migration: 0008_enhance_profiles_schema.sql (Bio, Social Links, Country, Genre & Public Read Policy)

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS twitter_url text,
  ADD COLUMN IF NOT EXISTS country text default 'USA',
  ADD COLUMN IF NOT EXISTS genre text default 'Hip-Hop';

-- Allow public read access to profiles so roster and comments can show names & bios
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);
