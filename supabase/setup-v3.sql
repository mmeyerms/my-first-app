-- ============================================================
-- MamaMap — Setup v3
-- Inhalt: Migration 011_help_requests (Wochenbett-Chef)
--
-- Voraussetzung: setup.sql und setup-v2.sql wurden bereits ausgeführt.
-- Ausführung: Supabase Dashboard > SQL Editor > Paste & Run
-- ============================================================

-- ------------------------------------------------------------
-- Migration: 011_help_requests
-- Beschreibung: Wochenbett-Chef — Hilfeorganisation für die Mama.
--   Die Mama legt Hilfe-Bedarfe (Slots) an und teilt einen Link.
--   Familie/Freunde tragen sich OHNE Account ein.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS help_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id    UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  share_token     TEXT NOT NULL UNIQUE,
  title           TEXT,
  intro           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_help_requests_user_id ON help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_token ON help_requests(share_token);
CREATE INDEX IF NOT EXISTS idx_help_requests_pregnancy_id ON help_requests(pregnancy_id);

DROP TRIGGER IF EXISTS help_requests_updated_at ON help_requests;
CREATE TRIGGER help_requests_updated_at
  BEFORE UPDATE ON help_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_help_request_all" ON help_requests;
CREATE POLICY "own_help_request_all" ON help_requests
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "public_read_help_requests" ON help_requests;
CREATE POLICY "public_read_help_requests" ON help_requests
  FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS help_slots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id      UUID REFERENCES help_requests(id) ON DELETE CASCADE NOT NULL,
  category        TEXT NOT NULL,
  description     TEXT,
  date            DATE,
  time            TEXT,
  helper_name     TEXT,
  helper_message  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE help_slots DROP CONSTRAINT IF EXISTS help_slots_category_check;
ALTER TABLE help_slots
  ADD CONSTRAINT help_slots_category_check
  CHECK (category IN ('kochen', 'einkaufen', 'reden', 'waesche', 'kinderbetreuung', 'andere'));

CREATE INDEX IF NOT EXISTS idx_help_slots_request_id ON help_slots(request_id);
CREATE INDEX IF NOT EXISTS idx_help_slots_date ON help_slots(date);

DROP TRIGGER IF EXISTS help_slots_updated_at ON help_slots;
CREATE TRIGGER help_slots_updated_at
  BEFORE UPDATE ON help_slots
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE help_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_manages_slots" ON help_slots;
CREATE POLICY "owner_manages_slots" ON help_slots
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM help_requests hr
      WHERE hr.id = help_slots.request_id
      AND hr.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM help_requests hr
      WHERE hr.id = help_slots.request_id
      AND hr.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "public_read_help_slots" ON help_slots;
CREATE POLICY "public_read_help_slots" ON help_slots
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_claims_slot" ON help_slots;
CREATE POLICY "public_claims_slot" ON help_slots
  FOR UPDATE
  USING (helper_name IS NULL OR helper_name = '')
  WITH CHECK (true);

-- ============================================================
-- Fertig.
-- ============================================================
