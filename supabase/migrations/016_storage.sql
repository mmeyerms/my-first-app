-- ============================================================
-- 016_storage.sql — Supabase Storage für Profilbilder + Ultraschall
--
-- Erstellt zwei Storage-Buckets:
--   * avatars      (public)  — Profilbilder der Nutzer:innen
--   * ultrasounds  (private) — Ultraschall-Bilder pro Schwangerschaft
--
-- Erweitert Tabellen um:
--   * profiles.avatar_url         TEXT
--   * pregnancies.ultrasound_urls JSONB  (Array von {url, ssw, uploadedAt, path})
--
-- RLS-Policies stellen sicher, dass Uploads/Reads nur für den
-- eigenen Ordner (Pfad-Präfix = auth.uid()) möglich sind.
-- Idempotent.
-- ============================================================

-- ------------------------------------------------------------
-- 1) TABELLEN-ERWEITERUNGEN
-- ------------------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS ultrasound_urls JSONB DEFAULT '[]'::jsonb;

-- ------------------------------------------------------------
-- 2) STORAGE-BUCKETS
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('ultrasounds', 'ultrasounds', false)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 3) RLS-POLICIES: avatars (public read, owner write)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_owner_insert" ON storage.objects;
CREATE POLICY "avatars_owner_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "avatars_owner_update" ON storage.objects;
CREATE POLICY "avatars_owner_update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;
CREATE POLICY "avatars_owner_delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ------------------------------------------------------------
-- 4) RLS-POLICIES: ultrasounds (owner-only, private bucket)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "ultrasounds_owner_all" ON storage.objects;
CREATE POLICY "ultrasounds_owner_all" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'ultrasounds'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'ultrasounds'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
