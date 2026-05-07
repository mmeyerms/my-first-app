-- ============================================================
-- Migration: 005_profile_locale
-- Beschreibung: Sprach-Einstellung pro Nutzerin (DE/EN)
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- Add locale column to profiles. Default is German (matches DEFAULT_LOCALE in src/lib/i18n/types.ts).
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'de';

-- Constrain values to known locales. Drop first so the migration is re-runnable.
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_locale_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_locale_check
  CHECK (locale IN ('de', 'en'));
