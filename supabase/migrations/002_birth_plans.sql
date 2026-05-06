-- ============================================================
-- Migration: 002_birth_plans
-- Beschreibung: Geburtsplan-Antworten für MamaMap
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

CREATE TABLE IF NOT EXISTS birth_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  answers     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_birth_plans_user_id ON birth_plans(user_id);

CREATE TRIGGER birth_plans_updated_at
  BEFORE UPDATE ON birth_plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE birth_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_birth_plan_select" ON birth_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_birth_plan_insert" ON birth_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_birth_plan_update" ON birth_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_birth_plan_delete" ON birth_plans FOR DELETE USING (auth.uid() = user_id);
