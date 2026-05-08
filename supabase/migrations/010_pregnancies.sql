-- ============================================================
-- Migration: 010_pregnancies
-- Beschreibung: Mehrere Schwangerschaften pro Account.
--               Status-Lifecycle: planning → pregnant → born ODER sternenkind
--               Inkl. Trauer-Begleitung via memorial_note.
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- ------------------------------------------------------------
-- 1) Pregnancies — eine Zeile pro Schwangerschaft
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pregnancies (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Lifecycle status
  status              TEXT NOT NULL DEFAULT 'pregnant',
  is_active           BOOLEAN DEFAULT TRUE NOT NULL,

  -- Baby identity (alle optional)
  baby_name           TEXT,
  baby_gender         TEXT,

  -- Daten der Schwangerschaft
  positive_test_date  DATE,
  due_date            DATE,
  birth_date          DATE,           -- gesetzt bei status='born'
  ended_date          DATE,           -- gesetzt bei status='sternenkind'

  -- Sternenkind-Memorial (geschützter, optional verfasster Erinnerungstext)
  memorial_note       TEXT,

  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE pregnancies DROP CONSTRAINT IF EXISTS pregnancies_status_check;
ALTER TABLE pregnancies
  ADD CONSTRAINT pregnancies_status_check
  CHECK (status IN ('planning', 'pregnant', 'born', 'sternenkind'));

ALTER TABLE pregnancies DROP CONSTRAINT IF EXISTS pregnancies_baby_gender_check;
ALTER TABLE pregnancies
  ADD CONSTRAINT pregnancies_baby_gender_check
  CHECK (baby_gender IS NULL OR baby_gender IN ('female', 'male', 'diverse', 'surprise', 'unknown'));

-- Höchstens EINE aktive Schwangerschaft pro User
DROP INDEX IF EXISTS idx_pregnancies_user_active;
CREATE UNIQUE INDEX idx_pregnancies_user_active
  ON pregnancies(user_id) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_pregnancies_user_id ON pregnancies(user_id);

-- updated_at-Trigger (set_updated_at gibt's schon aus 001_profiles)
DROP TRIGGER IF EXISTS pregnancies_updated_at ON pregnancies;
CREATE TRIGGER pregnancies_updated_at
  BEFORE UPDATE ON pregnancies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_pregnancies_all" ON pregnancies;
CREATE POLICY "own_pregnancies_all" ON pregnancies
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Partner darf aktive Schwangerschaft der Mutter lesen
DROP POLICY IF EXISTS "partner_reads_mother_pregnancy" ON pregnancies;
CREATE POLICY "partner_reads_mother_pregnancy" ON pregnancies
  FOR SELECT USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = pregnancies.user_id AND active = true
    )
  );

-- ------------------------------------------------------------
-- 2) Backfill: bestehende Profile → eine aktive Pregnancy
--    (idempotent, läuft nur wenn noch keine Pregnancy existiert)
-- ------------------------------------------------------------
INSERT INTO pregnancies (
  user_id, status, is_active, baby_name, baby_gender,
  positive_test_date, due_date, created_at
)
SELECT
  p.user_id,
  COALESCE(p.mode, 'pregnant'),
  TRUE,
  p.baby_name,
  p.baby_gender,
  p.positive_test_date,
  p.due_date,
  p.created_at
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM pregnancies pr WHERE pr.user_id = p.user_id
);

-- ------------------------------------------------------------
-- 3) pregnancy_id zu allen Daten-Tabellen ergänzen
--    (nullable; per Backfill auf aktive Pregnancy gesetzt)
-- ------------------------------------------------------------

-- Birth Plans
ALTER TABLE birth_plans ADD COLUMN IF NOT EXISTS pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE;
UPDATE birth_plans bp SET pregnancy_id = (
  SELECT id FROM pregnancies WHERE user_id = bp.user_id AND is_active = TRUE LIMIT 1
)
WHERE bp.pregnancy_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_birth_plans_pregnancy_id ON birth_plans(pregnancy_id);

-- Diary
ALTER TABLE diary_entries ADD COLUMN IF NOT EXISTS pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE;
UPDATE diary_entries de SET pregnancy_id = (
  SELECT id FROM pregnancies WHERE user_id = de.user_id AND is_active = TRUE LIMIT 1
)
WHERE de.pregnancy_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_diary_pregnancy_id ON diary_entries(pregnancy_id);

-- Termine
ALTER TABLE termine ADD COLUMN IF NOT EXISTS pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE;
UPDATE termine t SET pregnancy_id = (
  SELECT id FROM pregnancies WHERE user_id = t.user_id AND is_active = TRUE LIMIT 1
)
WHERE t.pregnancy_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_termine_pregnancy_id ON termine(pregnancy_id);

-- Checklists
ALTER TABLE checklists ADD COLUMN IF NOT EXISTS pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE;
UPDATE checklists c SET pregnancy_id = (
  SELECT id FROM pregnancies WHERE user_id = c.user_id AND is_active = TRUE LIMIT 1
)
WHERE c.pregnancy_id IS NULL;

-- Bei checklists ist (user_id, kind) UNIQUE — neuer Constraint mit pregnancy_id
ALTER TABLE checklists DROP CONSTRAINT IF EXISTS checklists_user_id_kind_key;
DROP INDEX IF EXISTS checklists_user_id_kind_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_checklists_user_pregnancy_kind
  ON checklists(user_id, COALESCE(pregnancy_id, '00000000-0000-0000-0000-000000000000'::uuid), kind);

-- Kinderwunsch State
ALTER TABLE kinderwunsch_state ADD COLUMN IF NOT EXISTS pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE;
UPDATE kinderwunsch_state ks SET pregnancy_id = (
  SELECT id FROM pregnancies WHERE user_id = ks.user_id AND is_active = TRUE LIMIT 1
)
WHERE ks.pregnancy_id IS NULL;

-- (user_id, pregnancy_id) UNIQUE für kinderwunsch_state
ALTER TABLE kinderwunsch_state DROP CONSTRAINT IF EXISTS kinderwunsch_state_user_id_key;
DROP INDEX IF EXISTS kinderwunsch_state_user_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_kinderwunsch_user_pregnancy
  ON kinderwunsch_state(user_id, COALESCE(pregnancy_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- ------------------------------------------------------------
-- 4) Birth Plans: bisheriger UNIQUE (user_id) wird zu (user_id, pregnancy_id)
-- ------------------------------------------------------------
ALTER TABLE birth_plans DROP CONSTRAINT IF EXISTS birth_plans_user_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_birth_plans_user_pregnancy
  ON birth_plans(user_id, COALESCE(pregnancy_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- ------------------------------------------------------------
-- 5) Diary: (user_id, ssw) wird zu (user_id, pregnancy_id, ssw)
-- ------------------------------------------------------------
ALTER TABLE diary_entries DROP CONSTRAINT IF EXISTS diary_entries_user_id_ssw_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_diary_user_pregnancy_ssw
  ON diary_entries(user_id, COALESCE(pregnancy_id, '00000000-0000-0000-0000-000000000000'::uuid), ssw);

-- ============================================================
-- Fertig. Bestehende Daten sind 1:1 in eine erste aktive
-- Schwangerschaft migriert. Neue können jederzeit angelegt werden.
-- Eine Pregnancy zu löschen kaskadiert automatisch all ihre Daten.
-- ============================================================
