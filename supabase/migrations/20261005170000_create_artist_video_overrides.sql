-- Migration: Create Artist Video Overrides Table
-- Allows authorized Studio administrators to assign, replace, or override spotlight YouTube visuals for public artists.

CREATE TABLE IF NOT EXISTS public.artist_video_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_slug VARCHAR(100) UNIQUE NOT NULL,
  artist_name TEXT NOT NULL,
  youtube_video_id VARCHAR(11) NOT NULL,
  youtube_url TEXT NOT NULL,
  title TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  source VARCHAR(50) DEFAULT 'MANUAL_STUDIO' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  admin_note TEXT,
  match_confidence VARCHAR(30) DEFAULT 'EXACT',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for high-performance slug lookups
CREATE INDEX IF NOT EXISTS idx_artist_video_overrides_slug 
ON public.artist_video_overrides(artist_slug);

-- Enable Row Level Security
ALTER TABLE public.artist_video_overrides ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Active overrides are publicly viewable
CREATE POLICY "Active artist video overrides are publicly viewable"
ON public.artist_video_overrides FOR SELECT
USING (is_active = true);

-- 2. Strict Admin Modification Policy: Only verified admins can insert, update, delete
CREATE POLICY "Strict Admin modification access for artist video overrides"
ON public.artist_video_overrides FOR ALL
USING (
  exists (
    select 1 from public.admins where admins.id = auth.uid()
  )
)
WITH CHECK (
  exists (
    select 1 from public.admins where admins.id = auth.uid()
  )
);
