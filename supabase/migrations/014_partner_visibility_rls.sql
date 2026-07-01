-- ============================================================
-- Migration: 014_partner_visibility_rls
-- Beschreibung: Partner-Sichtbarkeits-Flags aus user_preferences.settings
--               werden serverseitig via RLS enforced. Bisher wurden die
--               Flags nur clientseitig geprueft — theoretisch konnte ein
--               Partner via direktem API-Call versteckte Daten fetchen.
--
-- Betroffen:
--   - birth_plans:   Sichtbarkeits-Key "geburtsplan"
--   - partner_todos: Sichtbarkeits-Key "partnerTodos" (SELECT + UPDATE)
--
-- Default (kein user_preferences-Row vorhanden): sichtbar = true,
-- entspricht DEFAULT_PREFERENCES.partnerVisibility in src/lib/preferences/types.ts.
-- ============================================================

-- ------------------------------------------------------------
-- Birth plans — partner darf nur lesen wenn visibility.geburtsplan = true
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "partner_reads_mother_birth_plan" ON birth_plans;
CREATE POLICY "partner_reads_mother_birth_plan" ON birth_plans FOR SELECT
  USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = birth_plans.user_id AND active = TRUE
    )
    AND COALESCE(
      (SELECT (settings->'partnerVisibility'->>'geburtsplan')::boolean
       FROM user_preferences WHERE user_id = birth_plans.user_id),
      TRUE
    ) = TRUE
  );

-- ------------------------------------------------------------
-- Partner todos — sichtbar und toggle-bar nur wenn visibility.partnerTodos = true
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "partner_reads_partner_todos" ON partner_todos;
CREATE POLICY "partner_reads_partner_todos" ON partner_todos FOR SELECT
  USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = partner_todos.user_id AND active = TRUE
    )
    AND COALESCE(
      (SELECT (settings->'partnerVisibility'->>'partnerTodos')::boolean
       FROM user_preferences WHERE user_id = partner_todos.user_id),
      TRUE
    ) = TRUE
  );

DROP POLICY IF EXISTS "partner_updates_partner_todos_done" ON partner_todos;
CREATE POLICY "partner_updates_partner_todos_done" ON partner_todos FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = partner_todos.user_id AND active = TRUE
    )
    AND COALESCE(
      (SELECT (settings->'partnerVisibility'->>'partnerTodos')::boolean
       FROM user_preferences WHERE user_id = partner_todos.user_id),
      TRUE
    ) = TRUE
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = partner_todos.user_id AND active = TRUE
    )
    AND COALESCE(
      (SELECT (settings->'partnerVisibility'->>'partnerTodos')::boolean
       FROM user_preferences WHERE user_id = partner_todos.user_id),
      TRUE
    ) = TRUE
  );
