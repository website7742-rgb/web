-- 1. Drop Storage Policies
DROP POLICY IF EXISTS "Public Read Media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Media" ON storage.objects;

DROP POLICY IF EXISTS "Public Insert Demos" ON storage.objects;
DROP POLICY IF EXISTS "Admin Read Demos" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Demos" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Demos" ON storage.objects;

-- 2. Drop New Tables
DROP TABLE IF EXISTS media_assets CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS artist_links CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS genres CASCADE;

-- 3. Remove Columns from Existing Tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('artists', 'releases', 'tracks', 'tour_dates', 'merch', 'demo_submissions', 'audit_logs')
    LOOP
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS updated_at;', t);
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS created_by;', t);
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS updated_by;', t);
        
        -- Drop triggers
        EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I;', t, t);
        EXECUTE format('DROP TRIGGER IF EXISTS %I_audit ON %I;', t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. Drop helper function
DROP FUNCTION IF EXISTS set_updated_at();
