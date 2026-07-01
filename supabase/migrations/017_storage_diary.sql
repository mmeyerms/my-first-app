-- ============================================================
-- 017_storage_diary.sql — Foto pro Tagebuch-Eintrag (Feature 28)
--
-- Fügt der diary_entries-Tabelle eine photo_url-Spalte hinzu und
-- richtet einen privaten Storage-Bucket "diary-photos" mit RLS ein.
--
-- Pfad-Konvention: <user_id>/<uuid>.<ext>
-- Nutzer lesen/schreiben ausschließlich ihre eigenen Dateien.
-- Idempotent.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Schema-Erweiterung: photo_url in diary_entries
-- ------------------------------------------------------------
ALTER TABLE diary_entries ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- ------------------------------------------------------------
-- 2) Storage-Bucket: private "diary-photos"
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('diary-photos', 'diary-photos', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 3) RLS-Policies für storage.objects (bucket = diary-photos)
--    Pfad-Präfix = auth.uid()::text
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "diary_photos_select_own" ON storage.objects;
CREATE POLICY "diary_photos_select_own" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'diary-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "diary_photos_insert_own" ON storage.objects;
CREATE POLICY "diary_photos_insert_own" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'diary-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "diary_photos_update_own" ON storage.objects;
CREATE POLICY "diary_photos_update_own" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'diary-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "diary_photos_delete_own" ON storage.objects;
CREATE POLICY "diary_photos_delete_own" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'diary-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
