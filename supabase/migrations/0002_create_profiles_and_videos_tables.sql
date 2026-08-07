-- Migration: Create Profiles and Videos Tables

-- 1. Create Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy allowing users to read their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Create a policy allowing users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);


-- 2. Create Videos Table
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_name text,
  video_url text,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure RLS is enabled
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access to videos
CREATE POLICY "Videos are publicly viewable"
ON public.videos FOR SELECT
USING (true);

-- Restrict all modifications (INSERT/UPDATE/DELETE) to strict administrators
CREATE POLICY "Strict Admin modification access for videos"
ON public.videos FOR ALL
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
