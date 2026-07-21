-- AETHERIA MUSIC GROUP — Production Database Schema & RLS Security

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ARTISTS TABLE
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  bio TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  hero_url TEXT NOT NULL,
  genres TEXT[] NOT NULL,
  monthly_listeners BIGINT DEFAULT 0,
  total_streams BIGINT DEFAULT 0,
  grammy_wins INT DEFAULT 0,
  riaa_certifications JSONB DEFAULT '{"platinum": 0, "gold": 0, "diamond": 0}',
  socials JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_genres ON artists USING GIN(genres);

-- 2. RELEASES TABLE
CREATE TABLE IF NOT EXISTS releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('ALBUM', 'EP', 'SINGLE', 'VINYL')),
  release_date DATE NOT NULL,
  cover_url TEXT NOT NULL,
  catalog_number TEXT UNIQUE NOT NULL,
  upc_code TEXT UNIQUE,
  spotify_url TEXT,
  apple_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_releases_slug ON releases(slug);
CREATE INDEX IF NOT EXISTS idx_releases_artist ON releases(artist_id);
CREATE INDEX IF NOT EXISTS idx_releases_date ON releases(release_date DESC);

-- 3. TRACKS TABLE
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID REFERENCES releases(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration INT NOT NULL,
  audio_url TEXT NOT NULL,
  isrc_code TEXT UNIQUE NOT NULL,
  track_number INT NOT NULL,
  plays_count BIGINT DEFAULT 0,
  is_explicit BOOLEAN DEFAULT FALSE,
  featured_artists TEXT[] DEFAULT '{}',
  waveform_peaks INT[] DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_tracks_release ON tracks(release_id);
CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist_id);

-- 4. TOUR DATES TABLE
CREATE TABLE IF NOT EXISTS tour_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  tour_name TEXT NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  ticket_status VARCHAR(20) CHECK (ticket_status IN ('AVAILABLE', 'LIMITED', 'SOLD_OUT')),
  ticket_url TEXT NOT NULL
);

-- 5. MERCH TABLE
CREATE TABLE IF NOT EXISTS merch (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(30) CHECK (category IN ('HOODIES', 'TEES', 'VINYL', 'ACCESSORIES')),
  image_url TEXT NOT NULL,
  is_exclusive BOOLEAN DEFAULT FALSE,
  stock INT DEFAULT 100,
  sizes TEXT[] DEFAULT '{"S", "M", "L", "XL"}'
);

-- 6. DEMO SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS demo_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_name TEXT NOT NULL,
  email TEXT NOT NULL,
  track_title TEXT NOT NULL,
  genre TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  bio_notes TEXT,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'DECLINED')),
  ip_address TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY POLICIES
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on artists" ON artists FOR SELECT USING (true);
CREATE POLICY "Allow public read on releases" ON releases FOR SELECT USING (true);
CREATE POLICY "Allow public read on tracks" ON tracks FOR SELECT USING (true);
CREATE POLICY "Allow public read on tour_dates" ON tour_dates FOR SELECT USING (true);
CREATE POLICY "Allow public read on merch" ON merch FOR SELECT USING (true);
CREATE POLICY "Allow public insert for demo submission" ON demo_submissions FOR INSERT WITH CHECK (true);
