-- ============================================================
-- Migration: 025_tracking_entries
-- Beschreibung: PROJ-15 Kick-Counter + Symptom-/Gewichtstagebuch.
--   Eine generische Tages-Tracking-Tabelle: ein Row pro User,
--   Tag und Kind ('kicks' | 'symptom'). Payload ist JSONB:
--     kicks:   { count, durationMin, startedAt }
--     symptom: { weight, mood, symptoms[], note }
-- Idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS tracking_entries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id  UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  date          DATE NOT NULL,
  kind          TEXT NOT NULL,
  payload       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE tracking_entries DROP CONSTRAINT IF EXISTS tracking_entries_kind_check;
ALTER TABLE tracking_entries ADD CONSTRAINT tracking_entries_kind_check
  CHECK (kind IN ('kicks', 'symptom'));

-- Ein Eintrag pro User+Tag+Kind — Upsert-Ziel.
CREATE UNIQUE INDEX IF NOT EXISTS idx_tracking_user_date_kind
  ON tracking_entries(user_id, date, kind);
CREATE INDEX IF NOT EXISTS idx_tracking_user_kind_date
  ON tracking_entries(user_id, kind, date DESC);

DROP TRIGGER IF EXISTS tracking_entries_updated_at ON tracking_entries;
CREATE TRIGGER tracking_entries_updated_at
  BEFORE UPDATE ON tracking_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE tracking_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_tracking_all" ON tracking_entries;
CREATE POLICY "own_tracking_all" ON tracking_entries
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Fertig.
-- ============================================================
