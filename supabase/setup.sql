-- ============================================================
-- Migration: 001_profiles
-- Beschreibung: Nutzerinnen-Profile für MamaMap
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name            TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 50),
  baby_name       TEXT NOT NULL CHECK (char_length(baby_name) BETWEEN 1 AND 50),
  positive_test_date DATE NOT NULL,
  due_date        DATE NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT due_date_after_test CHECK (due_date > positive_test_date)
);

-- Index for fast user_id lookups (primary access pattern)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Auto-update updated_at on every change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Jede Nutzerin sieht nur ihr eigenes Profil
CREATE POLICY "own_profile_select"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Nutzerin kann ihr eigenes Profil anlegen
CREATE POLICY "own_profile_insert"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Nutzerin kann ihr eigenes Profil bearbeiten
CREATE POLICY "own_profile_update"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Nutzerin kann ihr eigenes Profil löschen (Account-Löschung)
CREATE POLICY "own_profile_delete"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);
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
-- ============================================================
-- Migration: 003_partner
-- Beschreibung: Partner-Einladungssystem für MamaMap
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- Partner-Einladungen (7 Tage gültig, single-use)
CREATE TABLE IF NOT EXISTS partner_invites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mother_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_partner_invites_mother_id ON partner_invites(mother_id);
CREATE INDEX IF NOT EXISTS idx_partner_invites_token ON partner_invites(token);

-- Partner-Verknüpfungen (dauerhaft, bis widerrufen)
CREATE TABLE IF NOT EXISTS partner_links (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mother_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner_user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  active            BOOLEAN DEFAULT true NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (mother_id, partner_user_id)
);

CREATE INDEX IF NOT EXISTS idx_partner_links_mother_id ON partner_links(mother_id);
CREATE INDEX IF NOT EXISTS idx_partner_links_partner_user_id ON partner_links(partner_user_id);

-- RLS für partner_invites
ALTER TABLE partner_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mother_manages_own_invites" ON partner_invites
  FOR ALL USING (auth.uid() = mother_id);

-- RLS für partner_links
ALTER TABLE partner_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mother_sees_own_links" ON partner_links
  FOR SELECT USING (auth.uid() = mother_id);

CREATE POLICY "partner_sees_own_link" ON partner_links
  FOR SELECT USING (auth.uid() = partner_user_id);

CREATE POLICY "mother_manages_own_links" ON partner_links
  FOR ALL USING (auth.uid() = mother_id);

-- ============================================================
-- Erweiterte RLS-Policies: Partner kann Mutter-Daten lesen
-- ============================================================

-- Partner kann Profil der Mutter lesen
CREATE POLICY "partner_reads_mother_profile" ON profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = profiles.user_id AND active = true
    )
  );

-- Partner kann Geburtsplan der Mutter lesen
CREATE POLICY "partner_reads_mother_birth_plan" ON birth_plans
  FOR SELECT USING (
    auth.uid() IN (
      SELECT partner_user_id FROM partner_links
      WHERE mother_id = birth_plans.user_id AND active = true
    )
  );
create table if not exists diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ssw int not null,
  rating int check (rating between 1 and 5),
  word text,
  surprise text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, ssw)
);

alter table diary_entries enable row level security;

create policy "Users manage own diary" on diary_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index idx_diary_user_ssw on diary_entries(user_id, ssw);
-- ============================================================
-- Migration: 005_profile_locale
-- Beschreibung: Sprach-Einstellung pro Nutzerin (DE/EN)
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- Add locale column to profiles. Default is German (matches DEFAULT_LOCALE in src/lib/i18n/types.ts).
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'de';

-- Constrain values to known locales. Drop first so the migration is re-runnable.
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_locale_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_locale_check
  CHECK (locale IN ('de', 'en'));
-- ============================================================
-- Migration: 006_profile_optional_fields
-- Beschreibung: Onboarding-Felder optional machen + Mode (planning/pregnant)
--               + Baby-Geschlecht + Tour-Status
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- 1) Optional machen, was vorher Pflicht war
ALTER TABLE profiles ALTER COLUMN baby_name DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN positive_test_date DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN due_date DROP NOT NULL;

-- Bestehende CHECK-Constraint auf due_date > positive_test_date entfernen
-- und durch eine neue ersetzen, die nur prüft, wenn beide Werte gesetzt sind.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS due_date_after_test;
ALTER TABLE profiles
  ADD CONSTRAINT due_date_after_test
  CHECK (
    positive_test_date IS NULL
    OR due_date IS NULL
    OR due_date > positive_test_date
  );

-- 2) Neue Felder

-- Mode: 'planning' (Kinderwunsch) oder 'pregnant' (Test ist positiv)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'pregnant';

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_mode_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_mode_check
  CHECK (mode IN ('planning', 'pregnant'));

-- Geschlecht des Babys (optional, nur falls bekannt)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS baby_gender TEXT;

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_baby_gender_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_baby_gender_check
  CHECK (baby_gender IN ('female', 'male', 'diverse', 'surprise', 'unknown'));

-- App-Einführung abgeschlossen
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS tour_completed BOOLEAN DEFAULT FALSE;
-- ============================================================
-- Migration: 007_termine
-- Beschreibung: Arzttermine + Vorsorgetermine pro Nutzerin
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

CREATE TABLE IF NOT EXISTS termine (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type        TEXT NOT NULL,           -- TerminTypeId, e.g. 'ctg', 'custom'
  title       TEXT NOT NULL,
  date        DATE NOT NULL,
  time        TEXT,                    -- 'HH:MM' oder NULL
  location    TEXT,
  doctor      TEXT,
  notes       TEXT,
  done        BOOLEAN DEFAULT FALSE NOT NULL,
  group_id    TEXT,                    -- für Wiederholungs-Serien
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_termine_user_date ON termine(user_id, date);
CREATE INDEX IF NOT EXISTS idx_termine_group_id ON termine(group_id) WHERE group_id IS NOT NULL;

CREATE TRIGGER termine_updated_at
  BEFORE UPDATE ON termine
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE termine ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_termine_all" ON termine
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- ============================================================
-- Migration: 008_checklists
-- Beschreibung: Generische Checklists (Packliste, Einkaufsliste, Wochenbett)
--               mit { checked, custom, excluded } JSON-State pro Nutzerin
-- Ausführung: Supabase Dashboard > SQL Editor > Run
-- ============================================================

CREATE TABLE IF NOT EXISTS checklists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kind        TEXT NOT NULL,         -- 'packliste' | 'einkaufsliste' | 'wochenbett'
  state       JSONB NOT NULL DEFAULT '{"checked":[],"custom":[],"excluded":[]}',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, kind)
);

ALTER TABLE checklists DROP CONSTRAINT IF EXISTS checklists_kind_check;
ALTER TABLE checklists
  ADD CONSTRAINT checklists_kind_check
  CHECK (kind IN ('packliste', 'einkaufsliste', 'wochenbett'));

CREATE INDEX IF NOT EXISTS idx_checklists_user_id ON checklists(user_id);

CREATE TRIGGER checklists_updated_at
  BEFORE UPDATE ON checklists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_checklists_all" ON checklists
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
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
