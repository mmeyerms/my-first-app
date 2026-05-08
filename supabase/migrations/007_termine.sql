-- ============================================================
-- Migration: 007_termine
-- Beschreibung: Arzttermine + Vorsorgetermine pro Nutzerin
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

CREATE TABLE IF NOT EXISTS termine (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type        TEXT NOT NULL,           -- TerminTypeId, e.g. 'ctg', 'custom'
  title       TEXT NOT NULL,
  date        DATE NOT NULL,
  time        TEXT,                    -- 'HH:MM' oder NULL
  location    TEXT,
  doctor      TEXT,
  notes       TEXT,
  done        BOOLEAN DEFAULT FALSE NOT NULL,
  group_id    TEXT,                    -- für Wiederholungs-Serien
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_termine_user_date ON termine(user_id, date);
CREATE INDEX IF NOT EXISTS idx_termine_group_id ON termine(group_id) WHERE group_id IS NOT NULL;

CREATE TRIGGER termine_updated_at
  BEFORE UPDATE ON termine
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE termine ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_termine_all" ON termine
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
