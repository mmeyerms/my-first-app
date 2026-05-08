-- ============================================================
-- Migration: 006_profile_optional_fields
-- Beschreibung: Onboarding-Felder optional machen + Mode (planning/pregnant)
--               + Baby-Geschlecht + Tour-Status
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- 1) Optional machen, was vorher Pflicht war
ALTER TABLE profiles ALTER COLUMN baby_name DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN positive_test_date DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN due_date DROP NOT NULL;

-- Bestehende CHECK-Constraint auf due_date > positive_test_date entfernen
-- und durch eine neue ersetzen, die nur prüft, wenn beide Werte gesetzt sind.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS due_date_after_test;
ALTER TABLE profiles
  ADD CONSTRAINT due_date_after_test
  CHECK (
    positive_test_date IS NULL
    OR due_date IS NULL
    OR due_date > positive_test_date
  );

-- 2) Neue Felder

-- Mode: 'planning' (Kinderwunsch) oder 'pregnant' (Test ist positiv)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'pregnant';

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_mode_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_mode_check
  CHECK (mode IN ('planning', 'pregnant'));

-- Geschlecht des Babys (optional, nur falls bekannt)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS baby_gender TEXT;

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_baby_gender_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_baby_gender_check
  CHECK (baby_gender IN ('female', 'male', 'diverse', 'surprise', 'unknown'));

-- App-Einführung abgeschlossen
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS tour_completed BOOLEAN DEFAULT FALSE;
