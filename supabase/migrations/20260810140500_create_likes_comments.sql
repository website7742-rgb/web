-- Migration: 20260810140500_create_likes_comments.sql

-- 1. Create Likes Table & RLS
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete cascade,
  video_id text, -- Video ID for external/YouTube videos
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure a user can only like a specific target once
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_target 
ON public.likes(user_id, COALESCE(submission_id::text, ''), COALESCE(video_id, ''));

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Likes are publicly readable" ON public.likes;
CREATE POLICY "Likes are publicly readable" ON public.likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert own likes" ON public.likes;
CREATE POLICY "Authenticated users can insert own likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own likes" ON public.likes;
CREATE POLICY "Users can delete own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);


-- 2. Create Comments Table & RLS
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete cascade,
  video_id text, -- Video ID for external/YouTube videos
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments are publicly readable" ON public.comments;
CREATE POLICY "Comments are publicly readable" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert own comments" ON public.comments;
CREATE POLICY "Authenticated users can insert own comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);
