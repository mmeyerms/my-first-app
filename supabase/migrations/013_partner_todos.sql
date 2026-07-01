-- ============================================================
-- Migration: 013_partner_todos
-- Beschreibung: Eigene To-Dos für Partner:in.
--   Die Mama legt konkrete Aufgaben an ("Elternzeit-Antrag stellen
--   bis SSW 30", "Kurs anmelden"), Partner:in sieht sie im
--   Partner-Dashboard und kann sie abhaken.
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

CREATE TABLE IF NOT EXISTS partner_todos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,  -- mother_id
  pregnancy_id  UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  due_date      DATE,
  done          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_todos_user_id ON partner_todos(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_todos_pregnancy_id ON partner_todos(pregnancy_id);
CREATE INDEX IF NOT EXISTS idx_partner_todos_done ON partner_todos(done);

-- updated_at Trigger (set_updated_at kommt aus 001_profiles.sql)
DROP TRIGGER IF EXISTS partner_todos_updated_at ON partner_todos;
CREATE TRIGGER partner_todos_updated_at
  BEFORE UPDATE ON partner_todos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
ALTER TABLE partner_todos ENABLE ROW LEVEL SECURITY;

-- Mama hat volle CRUD-Rechte auf eigene To-Dos
DROP POLICY IF EXISTS "mother_manages_partner_todos" ON partner_todos;
CREATE POLICY "mother_manages_partner_todos" ON partner_todos
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Partner:in darf verlinkte To-Dos LESEN
DROP POLICY IF EXISTS "partner_reads_partner_todos" ON partner_todos;
CREATE POLICY "partner_reads_partner_todos" ON partner_todos
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = partner_todos.user_id AND active = true
    )
  );

-- Partner:in darf To-Dos UPDATEN — auf DB-Ebene erlauben wir das ganze Row,
-- die API-Route filtert die tatsächlich änderbaren Felder (nur 'done').
-- So bleibt die Policy einfach, während die API die Business-Rule enforcet.
DROP POLICY IF EXISTS "partner_updates_partner_todos_done" ON partner_todos;
CREATE POLICY "partner_updates_partner_todos_done" ON partner_todos
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = partner_todos.user_id AND active = true
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = partner_todos.user_id AND active = true
    )
  );

-- ============================================================
-- Fertig.
-- ============================================================
