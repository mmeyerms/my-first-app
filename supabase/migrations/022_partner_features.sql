-- ============================================================
-- Migration: 022_partner_features
-- Beschreibung: Zwei Tabellen fuer stateful Partner-Features.
--   A) partner_visit_signals — Ampel fuer Besuchs-Etikette
--      (Feature 07). Mama setzt Signal, Partner sehen es.
--   B) parental_leave_progress — Elternzeit-Wizard State
--      (Feature 03, nur Papa). Fortschritt pro Partner-Link.
-- Idempotent.
-- ============================================================

-- ============================================================
-- A) partner_visit_signals — Wochenbett-Besuchs-Ampel
-- ============================================================
CREATE TABLE IF NOT EXISTS partner_visit_signals (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  signal      TEXT NOT NULL DEFAULT 'green',
  note        TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE partner_visit_signals DROP CONSTRAINT IF EXISTS partner_visit_signals_signal_check;
ALTER TABLE partner_visit_signals ADD CONSTRAINT partner_visit_signals_signal_check
  CHECK (signal IN ('green', 'yellow', 'red'));

DROP TRIGGER IF EXISTS partner_visit_signals_updated_at ON partner_visit_signals;
CREATE TRIGGER partner_visit_signals_updated_at
  BEFORE UPDATE ON partner_visit_signals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE partner_visit_signals ENABLE ROW LEVEL SECURITY;

-- Mother has full CRUD.
DROP POLICY IF EXISTS "own_visit_signal_all" ON partner_visit_signals;
CREATE POLICY "own_visit_signal_all" ON partner_visit_signals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Partners linked to the mother can read.
DROP POLICY IF EXISTS "partner_reads_visit_signal" ON partner_visit_signals;
CREATE POLICY "partner_reads_visit_signal" ON partner_visit_signals FOR SELECT
  USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = partner_visit_signals.user_id AND active = TRUE
    )
  );

-- Realtime — so partner UI updates the moment mother changes it.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'partner_visit_signals'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE partner_visit_signals;
  END IF;
END $$;
ALTER TABLE partner_visit_signals REPLICA IDENTITY FULL;

-- ============================================================
-- B) parental_leave_progress — Elternzeit-Wizard State (Papa)
-- ============================================================
-- Fortschritt speichern damit der Wizard nach Neustart weiter geht.
-- Ein Row pro Partner-Link. Der Partner ist der Owner.
CREATE TABLE IF NOT EXISTS parental_leave_progress (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  target_start_date DATE,
  weeks_planned     INTEGER,
  employer_notified BOOLEAN NOT NULL DEFAULT FALSE,
  hr_letter_sent    BOOLEAN NOT NULL DEFAULT FALSE,
  elterngeld_applied BOOLEAN NOT NULL DEFAULT FALSE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parental_leave_partner ON parental_leave_progress(partner_user_id);

DROP TRIGGER IF EXISTS parental_leave_progress_updated_at ON parental_leave_progress;
CREATE TRIGGER parental_leave_progress_updated_at
  BEFORE UPDATE ON parental_leave_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE parental_leave_progress ENABLE ROW LEVEL SECURITY;

-- Partner (=owner) has full CRUD on their own row.
DROP POLICY IF EXISTS "own_parental_leave_all" ON parental_leave_progress;
CREATE POLICY "own_parental_leave_all" ON parental_leave_progress
  FOR ALL USING (auth.uid() = partner_user_id) WITH CHECK (auth.uid() = partner_user_id);

-- ============================================================
-- Fertig.
-- ============================================================
