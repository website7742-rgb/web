-- 1. Helper Functions
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Modify Existing Tables to add Auditing Columns
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('artists', 'releases', 'tracks', 'tour_dates', 'merch', 'demo_submissions', 'audit_logs')
    LOOP
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();', t);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;', t);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;', t);
        
        -- Attach updated_at trigger
        EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I;', t, t);
        EXECUTE format('CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t, t);

        -- Attach audit log trigger (if not already attached)
        EXECUTE format('DROP TRIGGER IF EXISTS %I_audit ON %I;', t, t);
        IF t != 'audit_logs' THEN
            EXECUTE format('CREATE TRIGGER %I_audit AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION log_audit_event();', t, t);
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 3. Create New Enterprise Tables
CREATE TABLE IF NOT EXISTS genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    iso_code VARCHAR(2) UNIQUE NOT NULL,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS artist_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE(artist_id, platform)
);

CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_path TEXT UNIQUE NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    bucket_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 4. Attach Triggers to New Tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT unnest(ARRAY['genres', 'countries', 'artist_links', 'settings', 'media_assets'])
    LOOP
        EXECUTE format('CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t, t);
        EXECUTE format('CREATE TRIGGER %I_audit AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION log_audit_event();', t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. Enable RLS on New Tables
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for New Tables (Strict is_admin checks)
-- Public Selects (except settings)
CREATE POLICY "Public can read genres" ON genres FOR SELECT USING (true);
CREATE POLICY "Public can read countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Public can read artist_links" ON artist_links FOR SELECT USING (true);
CREATE POLICY "Public can read media_assets" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Only admins can read settings" ON settings FOR SELECT USING (is_admin());

-- Admin Write Policies
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT unnest(ARRAY['genres', 'countries', 'artist_links', 'settings', 'media_assets'])
    LOOP
        EXECUTE format('CREATE POLICY "Admins can insert %I" ON %I FOR INSERT WITH CHECK (is_admin());', t, t);
        EXECUTE format('CREATE POLICY "Admins can update %I" ON %I FOR UPDATE USING (is_admin());', t, t);
        EXECUTE format('CREATE POLICY "Admins can delete %I" ON %I FOR DELETE USING (is_admin());', t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 7. Supabase Storage Setup & Policies
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('demos', 'demos', false) ON CONFLICT DO NOTHING;

-- Storage RLS
-- Media Bucket: Public Read, Admin Write
CREATE POLICY "Public Read Media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admin Insert Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND is_admin());
CREATE POLICY "Admin Update Media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND is_admin());
CREATE POLICY "Admin Delete Media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND is_admin());

-- Demos Bucket: Public Insert, Admin Read/Update/Delete
CREATE POLICY "Public Insert Demos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'demos');
CREATE POLICY "Admin Read Demos" ON storage.objects FOR SELECT USING (bucket_id = 'demos' AND is_admin());
CREATE POLICY "Admin Update Demos" ON storage.objects FOR UPDATE USING (bucket_id = 'demos' AND is_admin());
CREATE POLICY "Admin Delete Demos" ON storage.objects FOR DELETE USING (bucket_id = 'demos' AND is_admin());
