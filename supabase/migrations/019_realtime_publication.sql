-- ============================================================
-- Migration: 019_realtime_publication
-- Beschreibung: Fuegt die relevanten Tabellen zur supabase_realtime-Publication
--               hinzu. Ohne diesen Schritt bekommen abonnierte Clients keine
--               postgres_changes-Events, obwohl RLS SELECT erlaubt.
--               REPLICA IDENTITY FULL sorgt dafuer, dass DELETE-Events die
--               kompletten Row-Daten enthalten (nicht nur die PK).
-- Idempotent (WHERE NOT EXISTS check via DO-Block).
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'partner_todos'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE partner_todos;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'birth_plans'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE birth_plans;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'termine'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE termine;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'diary_entries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE diary_entries;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'partner_links'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE partner_links;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_preferences'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_preferences;
  END IF;
END $$;

ALTER TABLE partner_todos REPLICA IDENTITY FULL;
ALTER TABLE birth_plans REPLICA IDENTITY FULL;
ALTER TABLE termine REPLICA IDENTITY FULL;
ALTER TABLE diary_entries REPLICA IDENTITY FULL;
ALTER TABLE partner_links REPLICA IDENTITY FULL;
ALTER TABLE user_preferences REPLICA IDENTITY FULL;
