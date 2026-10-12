-- Migration: Add Cloudflare R2 video support to artist_video_overrides
-- Allows Studio administrators to assign either YouTube visuals or Cloudflare R2 uploaded videos
-- to public artist profiles.

-- 1. Add video_type column with default 'YOUTUBE'
ALTER TABLE public.artist_video_overrides
ADD COLUMN IF NOT EXISTS video_type VARCHAR(20) DEFAULT 'YOUTUBE' NOT NULL;

-- 2. Add video_id referencing public.videos(id)
ALTER TABLE public.artist_video_overrides
ADD COLUMN IF NOT EXISTS video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL;

-- 3. Add video_url to store trusted direct R2 streaming URL
ALTER TABLE public.artist_video_overrides
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 4. Allow youtube_video_id and youtube_url to be nullable (for R2 videos)
ALTER TABLE public.artist_video_overrides
ALTER COLUMN youtube_video_id DROP NOT NULL;

ALTER TABLE public.artist_video_overrides
ALTER COLUMN youtube_url DROP NOT NULL;

-- 5. Create index for fast lookups by public.videos reference
CREATE INDEX IF NOT EXISTS idx_artist_video_overrides_video_id
ON public.artist_video_overrides(video_id);

-- 6. Add constraint ensuring either valid YouTube ID or valid R2 video reference
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_override_video_source'
  ) THEN
    ALTER TABLE public.artist_video_overrides
    ADD CONSTRAINT chk_override_video_source CHECK (
      (video_type = 'YOUTUBE' AND youtube_video_id IS NOT NULL) OR
      (video_type = 'R2' AND (video_id IS NOT NULL OR video_url IS NOT NULL))
    );
  END IF;
END $$;
