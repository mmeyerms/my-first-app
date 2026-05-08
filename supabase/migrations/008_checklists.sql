-- ============================================================
-- Migration: 008_checklists
-- Beschreibung: Generische Checklists (Packliste, Einkaufsliste, Wochenbett)
--               mit { checked, custom, excluded } JSON-State pro Nutzerin
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

CREATE TABLE IF NOT EXISTS checklists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kind        TEXT NOT NULL,         -- 'packliste' | 'einkaufsliste' | 'wochenbett'
  state       JSONB NOT NULL DEFAULT '{"checked":[],"custom":[],"excluded":[]}',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, kind)
);

ALTER TABLE checklists DROP CONSTRAINT IF EXISTS checklists_kind_check;
ALTER TABLE checklists
  ADD CONSTRAINT checklists_kind_check
  CHECK (kind IN ('packliste', 'einkaufsliste', 'wochenbett'));

CREATE INDEX IF NOT EXISTS idx_checklists_user_id ON checklists(user_id);

CREATE TRIGGER checklists_updated_at
  BEFORE UPDATE ON checklists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_checklists_all" ON checklists
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
