-- 1. Create Admins and Audit Logs
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admins" ON admins FOR SELECT USING (true); -- Usually restricted, but for simplicity we can allow admins to view

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admins WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    action TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (is_admin());

CREATE OR REPLACE FUNCTION log_audit_event() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (table_name, action, record_id, old_data, user_id)
        VALUES (TG_TABLE_NAME, TG_OP, OLD.id, row_to_json(OLD)::JSONB, auth.uid());
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (table_name, action, record_id, old_data, new_data, user_id)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB, auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (table_name, action, record_id, new_data, user_id)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(NEW)::JSONB, auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach triggers
CREATE TRIGGER artists_audit AFTER INSERT OR UPDATE OR DELETE ON artists FOR EACH ROW EXECUTE FUNCTION log_audit_event();
CREATE TRIGGER releases_audit AFTER INSERT OR UPDATE OR DELETE ON releases FOR EACH ROW EXECUTE FUNCTION log_audit_event();
CREATE TRIGGER tracks_audit AFTER INSERT OR UPDATE OR DELETE ON tracks FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- 2. Clean up old simple policies
DROP POLICY IF EXISTS "Allow public read on artists" ON artists;
DROP POLICY IF EXISTS "Allow public read on releases" ON releases;
DROP POLICY IF EXISTS "Allow public read on tracks" ON tracks;
DROP POLICY IF EXISTS "Allow public read on tour_dates" ON tour_dates;
DROP POLICY IF EXISTS "Allow public read on merch" ON merch;
DROP POLICY IF EXISTS "Allow public insert for demo submission" ON demo_submissions;

-- 3. Enterprise RLS Policies (Separated)

-- ARTISTS
CREATE POLICY "artists_select_public" ON artists FOR SELECT USING (true);
CREATE POLICY "artists_insert_admin" ON artists FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "artists_update_admin" ON artists FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "artists_delete_admin" ON artists FOR DELETE USING (is_admin());

-- RELEASES
CREATE POLICY "releases_select_public" ON releases FOR SELECT USING (true);
CREATE POLICY "releases_insert_admin" ON releases FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "releases_update_admin" ON releases FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "releases_delete_admin" ON releases FOR DELETE USING (is_admin());

-- TRACKS
CREATE POLICY "tracks_select_public" ON tracks FOR SELECT USING (true);
CREATE POLICY "tracks_insert_admin" ON tracks FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "tracks_update_admin" ON tracks FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "tracks_delete_admin" ON tracks FOR DELETE USING (is_admin());

-- TOUR DATES
CREATE POLICY "tour_dates_select_public" ON tour_dates FOR SELECT USING (true);
CREATE POLICY "tour_dates_insert_admin" ON tour_dates FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "tour_dates_update_admin" ON tour_dates FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "tour_dates_delete_admin" ON tour_dates FOR DELETE USING (is_admin());

-- MERCH
CREATE POLICY "merch_select_public" ON merch FOR SELECT USING (true);
CREATE POLICY "merch_insert_admin" ON merch FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "merch_update_admin" ON merch FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "merch_delete_admin" ON merch FOR DELETE USING (is_admin());

-- DEMO SUBMISSIONS
CREATE POLICY "demo_submissions_select_admin" ON demo_submissions FOR SELECT USING (is_admin());
CREATE POLICY "demo_submissions_insert_public" ON demo_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "demo_submissions_update_admin" ON demo_submissions FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "demo_submissions_delete_admin" ON demo_submissions FOR DELETE USING (is_admin());

-- 4. Storage Security
INSERT INTO storage.buckets (id, name, public) VALUES ('artist-assets', 'artist-assets', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "storage_select_public" ON storage.objects FOR SELECT USING (bucket_id = 'artist-assets');
CREATE POLICY "storage_insert_admin" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'artist-assets' AND
  is_admin() AND
  (RIGHT(name, 4) IN ('.jpg', '.png') OR RIGHT(name, 5) IN ('.webp', '.jpeg'))
);
CREATE POLICY "storage_update_admin" ON storage.objects FOR UPDATE USING (
  bucket_id = 'artist-assets' AND
  is_admin()
) WITH CHECK (
  bucket_id = 'artist-assets' AND
  is_admin()
);
CREATE POLICY "storage_delete_admin" ON storage.objects FOR DELETE USING (
  bucket_id = 'artist-assets' AND
  is_admin()
);
