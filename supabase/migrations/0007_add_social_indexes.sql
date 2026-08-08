-- Migration: 0007_add_social_indexes.sql (Performance Indexing for Aggregates & Foreign Keys)

-- 1. Index for Likes submission_id (Optimizes COUNT(*) aggregates in feed query)
CREATE INDEX IF NOT EXISTS idx_likes_submission_id ON public.likes(submission_id);

-- 2. Index for Comments submission_id (Optimizes COUNT(*) aggregates in feed query)
CREATE INDEX IF NOT EXISTS idx_comments_submission_id ON public.comments(submission_id);

-- 3. Index for Followers following_id (Optimizes follower count queries per artist)
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON public.followers(following_id);

-- 4. Composite indexes for fast unique lookup queries
CREATE INDEX IF NOT EXISTS idx_likes_user_submission ON public.likes(user_id, submission_id);
CREATE INDEX IF NOT EXISTS idx_followers_follower_following ON public.followers(follower_id, following_id);
