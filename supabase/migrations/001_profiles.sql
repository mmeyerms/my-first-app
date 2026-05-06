-- ============================================================
-- Migration: 001_profiles
-- Beschreibung: Nutzerinnen-Profile für MamaMap
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name            TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 50),
  baby_name       TEXT NOT NULL CHECK (char_length(baby_name) BETWEEN 1 AND 50),
  positive_test_date DATE NOT NULL,
  due_date        DATE NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT due_date_after_test CHECK (due_date > positive_test_date)
);

-- Index for fast user_id lookups (primary access pattern)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Auto-update updated_at on every change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Jede Nutzerin sieht nur ihr eigenes Profil
CREATE POLICY "own_profile_select"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Nutzerin kann ihr eigenes Profil anlegen
CREATE POLICY "own_profile_insert"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Nutzerin kann ihr eigenes Profil bearbeiten
CREATE POLICY "own_profile_update"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Nutzerin kann ihr eigenes Profil löschen (Account-Löschung)
CREATE POLICY "own_profile_delete"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);
