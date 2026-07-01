-- ============================================================
-- Migration: 016_partner_realtime_rls
-- Feature: PROJ-49 (Live-Sync Partner via Supabase Realtime)
-- Beschreibung: Damit der Partner Termine und (optional) Tagebuch-Eintraege
--               der Mutter ueber Realtime abonnieren kann, brauchen wir
--               explizite SELECT-RLS-Policies. Ohne diese sind die Rows
--               fuer den Partner unsichtbar — sowohl beim normalen Query
--               als auch im Realtime-Stream.
--
-- Sichtbarkeit wird — analog zu Migration 014 — aus
--   user_preferences.settings->'partnerVisibility'->>{'termine'|'tagebuch'}
-- gelesen. Default (kein user_preferences-Row): sichtbar = true.
--
-- Der Partner kann in beiden Faellen ausschliesslich LESEN.
-- ============================================================

-- ------------------------------------------------------------
-- Termine — Partner darf lesen, wenn visibility.termine = true
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "partner_reads_mother_termine" ON termine;
CREATE POLICY "partner_reads_mother_termine" ON termine FOR SELECT
  USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = termine.user_id AND active = TRUE
    )
    AND COALESCE(
      (SELECT (settings->'partnerVisibility'->>'termine')::boolean
       FROM user_preferences WHERE user_id = termine.user_id),
      TRUE
    ) = TRUE
  );

-- ------------------------------------------------------------
-- Diary — Partner darf lesen, wenn visibility.tagebuch = true.
-- Standardmaessig ist tagebuch = false in DEFAULT_PREFERENCES, d.h. der
-- Partner sieht ohne explizite Freigabe *nichts*.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "partner_reads_mother_diary" ON diary_entries;
CREATE POLICY "partner_reads_mother_diary" ON diary_entries FOR SELECT
  USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = diary_entries.user_id AND active = TRUE
    )
    AND COALESCE(
      (SELECT (settings->'partnerVisibility'->>'tagebuch')::boolean
       FROM user_preferences WHERE user_id = diary_entries.user_id),
      FALSE
    ) = TRUE
  );
