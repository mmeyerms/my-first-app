-- ============================================================
-- Migration: 009_kinderwunsch_state
-- Beschreibung: Eine Zeile pro Nutzerin mit allen 6 Inseln des
--               Kinderwunsch-Gartens als JSON-Spalten.
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

CREATE TABLE IF NOT EXISTS kinderwunsch_state (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Insel 1: Körper-Checkliste — Array of checked item IDs
  koerper         JSONB NOT NULL DEFAULT '[]',

  -- Insel 2: Team-Fragen — { questionId: answer text }
  team            JSONB NOT NULL DEFAULT '{}',

  -- Insel 3: Ängste — { fav: [ids], read: [ids] }
  aengste         JSONB NOT NULL DEFAULT '{"fav":[],"read":[]}',

  -- Insel 4: Vorfreude — { letter: { content, writtenAt, sealed }, first30: [], bucket: [] }
  vorfreude       JSONB NOT NULL DEFAULT '{"first30":[],"bucket":[]}',

  -- Insel 5: Manifest — { agreed: [ids], custom: [{id,text}], signedAt?, mama?, partner? }
  manifest        JSONB NOT NULL DEFAULT '{"agreed":[],"custom":[]}',

  -- Insel 6: Arzt-Fragen — { asked: [ids], custom: [{id,text,kategorie}] }
  arzt            JSONB NOT NULL DEFAULT '{"asked":[],"custom":[]}',

  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_kinderwunsch_state_user_id ON kinderwunsch_state(user_id);

CREATE TRIGGER kinderwunsch_state_updated_at
  BEFORE UPDATE ON kinderwunsch_state
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE kinderwunsch_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_kinderwunsch_all" ON kinderwunsch_state
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
