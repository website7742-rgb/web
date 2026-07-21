-- 1. Remove Storage Security
DROP POLICY IF EXISTS "storage_delete_admin" ON storage.objects;
DROP POLICY IF EXISTS "storage_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "storage_select_public" ON storage.objects;

-- 2. Remove New RLS Policies
DROP POLICY IF EXISTS "artists_select_public" ON artists;
DROP POLICY IF EXISTS "artists_insert_admin" ON artists;
DROP POLICY IF EXISTS "artists_update_admin" ON artists;
DROP POLICY IF EXISTS "artists_delete_admin" ON artists;

DROP POLICY IF EXISTS "releases_select_public" ON releases;
DROP POLICY IF EXISTS "releases_insert_admin" ON releases;
DROP POLICY IF EXISTS "releases_update_admin" ON releases;
DROP POLICY IF EXISTS "releases_delete_admin" ON releases;

DROP POLICY IF EXISTS "tracks_select_public" ON tracks;
DROP POLICY IF EXISTS "tracks_insert_admin" ON tracks;
DROP POLICY IF EXISTS "tracks_update_admin" ON tracks;
DROP POLICY IF EXISTS "tracks_delete_admin" ON tracks;

DROP POLICY IF EXISTS "tour_dates_select_public" ON tour_dates;
DROP POLICY IF EXISTS "tour_dates_insert_admin" ON tour_dates;
DROP POLICY IF EXISTS "tour_dates_update_admin" ON tour_dates;
DROP POLICY IF EXISTS "tour_dates_delete_admin" ON tour_dates;

DROP POLICY IF EXISTS "merch_select_public" ON merch;
DROP POLICY IF EXISTS "merch_insert_admin" ON merch;
DROP POLICY IF EXISTS "merch_update_admin" ON merch;
DROP POLICY IF EXISTS "merch_delete_admin" ON merch;

DROP POLICY IF EXISTS "demo_submissions_select_admin" ON demo_submissions;
DROP POLICY IF EXISTS "demo_submissions_insert_public" ON demo_submissions;
DROP POLICY IF EXISTS "demo_submissions_update_admin" ON demo_submissions;
DROP POLICY IF EXISTS "demo_submissions_delete_admin" ON demo_submissions;

-- 3. Restore old simple policies
CREATE POLICY "Allow public read on artists" ON artists FOR SELECT USING (true);
CREATE POLICY "Allow public read on releases" ON releases FOR SELECT USING (true);
CREATE POLICY "Allow public read on tracks" ON tracks FOR SELECT USING (true);
CREATE POLICY "Allow public read on tour_dates" ON tour_dates FOR SELECT USING (true);
CREATE POLICY "Allow public read on merch" ON merch FOR SELECT USING (true);
CREATE POLICY "Allow public insert for demo submission" ON demo_submissions FOR INSERT WITH CHECK (true);

-- 4. Remove triggers and function
DROP TRIGGER IF EXISTS artists_audit ON artists;
DROP TRIGGER IF EXISTS releases_audit ON releases;
DROP TRIGGER IF EXISTS tracks_audit ON tracks;
DROP FUNCTION IF EXISTS log_audit_event();

-- 5. Drop tables and functions
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
DROP TABLE IF EXISTS audit_logs;
DROP POLICY IF EXISTS "Admins can view admins" ON admins;
DROP TABLE IF EXISTS admins;
DROP FUNCTION IF EXISTS is_admin();
