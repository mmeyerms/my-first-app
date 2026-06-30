-- ============================================================
-- Migration: 011_help_requests
-- Beschreibung: Wochenbett-Chef — Hilfeorganisation für die Mama.
--   Die Mama legt Hilfe-Bedarfe (Slots) an und teilt einen Link.
--   Familie/Freunde tragen sich OHNE Account ein.
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- ------------------------------------------------------------
-- 1) help_requests — eine Hilfe-Liste pro Schwangerschaft
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS help_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id    UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  share_token     TEXT NOT NULL UNIQUE,           -- public-facing token (32+ chars)
  title           TEXT,                           -- short title for the share page
  intro           TEXT,                           -- optional intro for helpers
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

-- Owner sieht und verwaltet die eigene Hilfe-Liste vollständig
DROP POLICY IF EXISTS "own_help_request_all" ON help_requests;
CREATE POLICY "own_help_request_all" ON help_requests
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Public-Read über share_token: Jeder mit einer gültigen UUID kann lesen.
-- Wir filtern in der API-Route auf share_token; UUIDs sind praktisch unraktbar.
DROP POLICY IF EXISTS "public_read_help_requests" ON help_requests;
CREATE POLICY "public_read_help_requests" ON help_requests
  FOR SELECT USING (true);

-- ------------------------------------------------------------
-- 2) help_slots — die einzelnen Bedarfe
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS help_slots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id      UUID REFERENCES help_requests(id) ON DELETE CASCADE NOT NULL,
  category        TEXT NOT NULL,                  -- 'kochen' | 'einkaufen' | 'reden' | 'waesche' | 'kinderbetreuung' | 'andere'
  description     TEXT,                           -- "z.B. Spaghetti Bolognese für 2"
  date            DATE,                           -- optional
  time            TEXT,                           -- 'HH:MM' optional
  helper_name     TEXT,                           -- filled when someone signs up
  helper_message  TEXT,                           -- optional message from helper
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

-- Owner verwaltet alle Slots der eigenen Hilfe-Liste
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

-- Public-Read (gefiltert via API-Route über share_token)
DROP POLICY IF EXISTS "public_read_help_slots" ON help_slots;
CREATE POLICY "public_read_help_slots" ON help_slots
  FOR SELECT USING (true);

-- Public-Claim: anonyme Helfer dürfen einen NOCH NICHT vergebenen Slot
-- übernehmen, indem sie helper_name + helper_message setzen.
DROP POLICY IF EXISTS "public_claims_slot" ON help_slots;
CREATE POLICY "public_claims_slot" ON help_slots
  FOR UPDATE
  USING (helper_name IS NULL OR helper_name = '')
  WITH CHECK (true);

-- ============================================================
-- Fertig. Die App-API-Route /api/helfen/[token]/claim filtert
-- zusätzlich auf request_id und prüft, dass der Slot leer ist.
-- ============================================================
