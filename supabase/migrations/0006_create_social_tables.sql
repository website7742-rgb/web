-- Migration: 0006_create_social_tables.sql (Likes, Comments, Followers)

-- 1. Create Likes Table
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid not null references public.submissions(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, submission_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are publicly readable" 
ON public.likes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert own likes" 
ON public.likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" 
ON public.likes FOR DELETE 
USING (auth.uid() = user_id);


-- 2. Create Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid not null references public.submissions(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are publicly readable" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert own comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" 
ON public.comments FOR DELETE 
USING (auth.uid() = user_id);


-- 3. Create Followers Table
CREATE TABLE IF NOT EXISTS public.followers (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id)
);

ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Followers are publicly readable" 
ON public.followers FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can follow others" 
ON public.followers FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" 
ON public.followers FOR DELETE 
USING (auth.uid() = follower_id);
