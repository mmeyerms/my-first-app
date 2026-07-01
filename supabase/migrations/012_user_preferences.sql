-- ============================================================
-- Migration: 012_user_preferences
-- Beschreibung: Zentrale Personalisierungs-Einstellungen pro User.
--               Ein JSONB-Blob damit neue Optionen ohne Schema-Migration
--               ergaenzt werden koennen.
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prefs_select_own" ON user_preferences;
CREATE POLICY "prefs_select_own" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "prefs_insert_own" ON user_preferences;
CREATE POLICY "prefs_insert_own" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "prefs_update_own" ON user_preferences;
CREATE POLICY "prefs_update_own" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "prefs_delete_own" ON user_preferences;
CREATE POLICY "prefs_delete_own" ON user_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_user_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_preferences_updated_at ON user_preferences;
CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_user_preferences_timestamp();

-- ============================================================
-- 013: Erweiterte Termine-Felder (Kategorien, Standard-Ort, Reminder, Farbe, Templates)
-- ============================================================

-- Zusaetzliche Spalten fuer bestehende termine-Tabelle
ALTER TABLE termine
  ADD COLUMN IF NOT EXISTS reminder_hours_before INTEGER,
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS category_slug TEXT;

-- Custom Kategorien pro User (name + emoji + default_location + default_reminder + color)
CREATE TABLE IF NOT EXISTS termin_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT NOT NULL,
  label TEXT NOT NULL,
  emoji TEXT,
  color TEXT,
  default_location TEXT,
  default_reminder_hours INTEGER,
  notes_template TEXT,
  is_builtin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_termin_categories_user ON termin_categories(user_id);

ALTER TABLE termin_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "termin_cat_select_own" ON termin_categories;
CREATE POLICY "termin_cat_select_own" ON termin_categories
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "termin_cat_insert_own" ON termin_categories;
CREATE POLICY "termin_cat_insert_own" ON termin_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "termin_cat_update_own" ON termin_categories;
CREATE POLICY "termin_cat_update_own" ON termin_categories
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "termin_cat_delete_own" ON termin_categories;
CREATE POLICY "termin_cat_delete_own" ON termin_categories
  FOR DELETE USING (auth.uid() = user_id);
