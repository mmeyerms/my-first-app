-- ============================================================
-- Migration: 021_push_and_helpslots
-- Beschreibung: Zwei Features in einer Migration.
--   A) Web-Push-Subscriptions (PROJ-10)
--   B) help_slots Erweiterung: Typ, Ziel-URL, Betrag, Danke, Abschluss (PROJ-11)
-- Idempotent. Ausfuehrung: Supabase Dashboard > SQL Editor > Run.
-- ============================================================

-- ============================================================
-- A) push_subscriptions — Web Push Endpunkte pro Nutzer
-- ============================================================
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint      TEXT NOT NULL UNIQUE,
  p256dh        TEXT NOT NULL,
  auth          TEXT NOT NULL,
  user_agent    TEXT,
  active        BOOLEAN DEFAULT true NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_used_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(active) WHERE active = true;

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Owner verwaltet die eigenen Push-Endpunkte vollstaendig.
DROP POLICY IF EXISTS "own_push_subscriptions_all" ON push_subscriptions;
CREATE POLICY "own_push_subscriptions_all" ON push_subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Kein Public-Read: Push-Endpunkte sind sensibel (Angreifer koennte
-- unerwuenschte Nachrichten senden bei Kenntnis der VAPID-Keys).

-- ============================================================
-- B) help_slots Erweiterung — Typen, Ziel-URL, Danke, Abschluss
-- ============================================================
-- Slot-Typ: task (Aufgabe erledigen), gift (Geschenk kaufen),
-- money (Geldbeitrag leisten). Steuerung fuer HelferView-CTAs.
ALTER TABLE help_slots ADD COLUMN IF NOT EXISTS slot_type TEXT DEFAULT 'task' NOT NULL;

ALTER TABLE help_slots DROP CONSTRAINT IF EXISTS help_slots_type_check;
ALTER TABLE help_slots ADD CONSTRAINT help_slots_type_check
  CHECK (slot_type IN ('task', 'gift', 'money'));

-- Optional: URL zu Amazon-Wunschzettel / PayPal.me / kaufland.de
-- Nur bei slot_type IN ('gift', 'money') sinnvoll — auf API-Level validiert.
ALTER TABLE help_slots ADD COLUMN IF NOT EXISTS target_url TEXT;

-- Optional: Vorgeschlagener Geldbetrag (Euro), nur fuer slot_type='money'.
ALTER TABLE help_slots ADD COLUMN IF NOT EXISTS suggested_amount NUMERIC(6, 2);

-- Zeitpunkt zu dem die Mama sich beim Helfer bedankt hat (via 1-Klick-Share).
ALTER TABLE help_slots ADD COLUMN IF NOT EXISTS thanks_sent_at TIMESTAMPTZ;

-- Zeitpunkt zu dem der Slot als erledigt markiert wurde.
-- Wichtig: unterschiedlich zu "helper_name IS NOT NULL" (das ist nur "zugesagt").
ALTER TABLE help_slots ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_help_slots_completed_at ON help_slots(completed_at) WHERE completed_at IS NOT NULL;

-- ============================================================
-- C) termine — Reminder-Felder fuer Push-Cron
-- ============================================================
-- Anzahl Stunden vor Termin, zu denen der Push gesendet werden soll.
-- NULL = kein Reminder. Uebliche Werte: 1, 3, 24, 72.
ALTER TABLE termine ADD COLUMN IF NOT EXISTS reminder_hours INTEGER;

-- Zeitstempel des tatsaechlich gesendeten Reminders. Verhindert Doppel-Sendung
-- wenn der Cron mehrfach getriggert wird oder ein Retry noetig ist.
ALTER TABLE termine ADD COLUMN IF NOT EXISTS reminded_at TIMESTAMPTZ;

-- Index fuer den stuendlichen Reminder-Cron: er filtert auf
--   date + time - reminder_hours <= now() AND reminded_at IS NULL
-- ein partial index auf pending reminders bleibt schmal.
CREATE INDEX IF NOT EXISTS idx_termine_reminder_pending
  ON termine(date, reminder_hours)
  WHERE reminder_hours IS NOT NULL AND reminded_at IS NULL AND done = false;

-- ============================================================
-- Fertig.
-- ============================================================
