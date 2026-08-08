-- Migration: 0009_polymorphic_social_engine.sql (Polymorphic Likes and Comments for Tracks & Videos)

-- 1. Alter likes table to support video_id
ALTER TABLE public.likes
  ALTER COLUMN submission_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS video_id uuid REFERENCES public.videos(id) ON DELETE CASCADE;

-- Add check constraint for likes: exactly one of submission_id or video_id must be NOT NULL
ALTER TABLE public.likes
  DROP CONSTRAINT IF EXISTS chk_likes_target,
  ADD CONSTRAINT chk_likes_target CHECK (
    (submission_id IS NOT NULL AND video_id IS NULL) OR
    (submission_id IS NULL AND video_id IS NOT NULL)
  );

-- 2. Alter comments table to support video_id
ALTER TABLE public.comments
  ALTER COLUMN submission_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS video_id uuid REFERENCES public.videos(id) ON DELETE CASCADE;

-- Add check constraint for comments: exactly one of submission_id or video_id must be NOT NULL
ALTER TABLE public.comments
  DROP CONSTRAINT IF EXISTS chk_comments_target,
  ADD CONSTRAINT chk_comments_target CHECK (
    (submission_id IS NOT NULL AND video_id IS NULL) OR
    (submission_id IS NULL AND video_id IS NOT NULL)
  );

-- 3. Indexes for fast polymorphic lookups
CREATE INDEX IF NOT EXISTS idx_likes_video_id ON public.likes(video_id);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON public.comments(video_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_video ON public.likes(user_id, video_id);
