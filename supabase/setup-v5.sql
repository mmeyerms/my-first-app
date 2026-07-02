-- ============================================================
-- MAMAMAP — KONSOLIDIERTES SETUP v5 (Migrations 001-022)
-- Idempotent: sicher auf neuer und bestehender DB ausführbar.
-- Ausführung: Supabase Dashboard > SQL Editor > Run
--
-- Neu gegenüber v4:
--   21) Push-Notifications (PROJ-10):
--       push_subscriptions Tabelle + termine.reminder_hours/reminded_at
--       help_slots erweitert: slot_type, target_url, suggested_amount,
--                             thanks_sent_at, completed_at (PROJ-11)
--   22) Partner-Features (PROJ-12):
--       partner_visit_signals (Ampel) + parental_leave_progress
-- ============================================================

-- ------------------------------------------------------------
-- 1) SHARED TRIGGER FUNCTION
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- 2) PROFILES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name               TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 50),
  baby_name          TEXT,
  positive_test_date DATE,
  due_date           DATE,
  locale             TEXT DEFAULT 'de',
  mode               TEXT DEFAULT 'pregnant',
  baby_gender        TEXT,
  tour_completed     BOOLEAN DEFAULT FALSE,
  created_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT due_date_after_test CHECK (
    positive_test_date IS NULL OR due_date IS NULL OR due_date > positive_test_date
  )
);

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_locale_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_locale_check CHECK (locale IN ('de', 'en'));

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_mode_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_mode_check CHECK (mode IN ('planning', 'pregnant'));

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_baby_gender_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_baby_gender_check
  CHECK (baby_gender IS NULL OR baby_gender IN ('female', 'male', 'diverse', 'surprise', 'unknown'));

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_profile_select" ON profiles;
CREATE POLICY "own_profile_select" ON profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "own_profile_insert" ON profiles;
CREATE POLICY "own_profile_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "own_profile_update" ON profiles;
CREATE POLICY "own_profile_update" ON profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "own_profile_delete" ON profiles;
CREATE POLICY "own_profile_delete" ON profiles FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 3) PARTNER SYSTEM (invites + links)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partner_invites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mother_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token      TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_partner_invites_mother_id ON partner_invites(mother_id);
CREATE INDEX IF NOT EXISTS idx_partner_invites_token ON partner_invites(token);
ALTER TABLE partner_invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mother_manages_own_invites" ON partner_invites;
CREATE POLICY "mother_manages_own_invites" ON partner_invites FOR ALL USING (auth.uid() = mother_id);
-- Public-Read auf partner_invites: der Token (UUID) ist der Zugriffsschutz.
-- Ohne diese Policy scheitert der Partner-Accept-Flow, weil nicht-mother-User
-- den Invite via API nicht per Token lookup finden koennen.
DROP POLICY IF EXISTS "public_reads_invite" ON partner_invites;
CREATE POLICY "public_reads_invite" ON partner_invites FOR SELECT USING (true);
-- Multi-Use Invites (Migration 024): 1 Token = bis zu 5 Accepts.
ALTER TABLE partner_invites ADD COLUMN IF NOT EXISTS max_uses INTEGER NOT NULL DEFAULT 5;
ALTER TABLE partner_invites ADD COLUMN IF NOT EXISTS uses_count INTEGER NOT NULL DEFAULT 0;
UPDATE partner_invites SET uses_count = max_uses WHERE used_at IS NOT NULL AND uses_count = 0;
ALTER TABLE partner_invites DROP CONSTRAINT IF EXISTS partner_invites_uses_bounds;
ALTER TABLE partner_invites ADD CONSTRAINT partner_invites_uses_bounds
  CHECK (uses_count >= 0 AND uses_count <= max_uses AND max_uses > 0 AND max_uses <= 20);
-- Partial index — nur nicht ausgeschöpfte Invites. NOW() darf hier NICHT
-- im Predicate stehen (nicht deterministisch fuer PG). expires_at filtert
-- die REST-API separat.
CREATE INDEX IF NOT EXISTS idx_partner_invites_active
  ON partner_invites(mother_id, expires_at)
  WHERE uses_count < max_uses;

CREATE TABLE IF NOT EXISTS partner_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mother_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  active          BOOLEAN DEFAULT TRUE NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (mother_id, partner_user_id)
);
CREATE INDEX IF NOT EXISTS idx_partner_links_mother_id ON partner_links(mother_id);
CREATE INDEX IF NOT EXISTS idx_partner_links_partner_user_id ON partner_links(partner_user_id);
ALTER TABLE partner_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mother_sees_own_links" ON partner_links;
CREATE POLICY "mother_sees_own_links" ON partner_links FOR SELECT USING (auth.uid() = mother_id);
DROP POLICY IF EXISTS "partner_sees_own_link" ON partner_links;
CREATE POLICY "partner_sees_own_link" ON partner_links FOR SELECT USING (auth.uid() = partner_user_id);
DROP POLICY IF EXISTS "mother_manages_own_links" ON partner_links;
CREATE POLICY "mother_manages_own_links" ON partner_links FOR ALL USING (auth.uid() = mother_id);

-- Partner reads mother's profile
DROP POLICY IF EXISTS "partner_reads_mother_profile" ON profiles;
CREATE POLICY "partner_reads_mother_profile" ON profiles FOR SELECT
  USING (auth.uid() IN (
    SELECT partner_user_id FROM partner_links WHERE mother_id = profiles.user_id AND active = TRUE
  ));

-- ------------------------------------------------------------
-- 4) PREGNANCIES (VOR den scoped Tabellen)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pregnancies (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status             TEXT NOT NULL DEFAULT 'pregnant',
  is_active          BOOLEAN DEFAULT TRUE NOT NULL,
  baby_name          TEXT,
  baby_gender        TEXT,
  positive_test_date DATE,
  due_date           DATE,
  birth_date         DATE,
  ended_date         DATE,
  memorial_note      TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE pregnancies DROP CONSTRAINT IF EXISTS pregnancies_status_check;
ALTER TABLE pregnancies ADD CONSTRAINT pregnancies_status_check
  CHECK (status IN ('planning', 'pregnant', 'born', 'sternenkind'));
ALTER TABLE pregnancies DROP CONSTRAINT IF EXISTS pregnancies_baby_gender_check;
ALTER TABLE pregnancies ADD CONSTRAINT pregnancies_baby_gender_check
  CHECK (baby_gender IS NULL OR baby_gender IN ('female', 'male', 'diverse', 'surprise', 'unknown'));

DROP INDEX IF EXISTS idx_pregnancies_user_active;
CREATE UNIQUE INDEX IF NOT EXISTS idx_pregnancies_user_active
  ON pregnancies(user_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_pregnancies_user_id ON pregnancies(user_id);

DROP TRIGGER IF EXISTS pregnancies_updated_at ON pregnancies;
CREATE TRIGGER pregnancies_updated_at BEFORE UPDATE ON pregnancies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_pregnancies_all" ON pregnancies;
CREATE POLICY "own_pregnancies_all" ON pregnancies FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "partner_reads_mother_pregnancy" ON pregnancies;
CREATE POLICY "partner_reads_mother_pregnancy" ON pregnancies FOR SELECT
  USING (auth.uid() IN (
    SELECT partner_user_id FROM partner_links WHERE mother_id = pregnancies.user_id AND active = TRUE
  ));

-- ------------------------------------------------------------
-- 5) BIRTH PLANS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS birth_plans (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  answers      JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE birth_plans ADD COLUMN IF NOT EXISTS pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_birth_plans_user_id ON birth_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_birth_plans_pregnancy_id ON birth_plans(pregnancy_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_birth_plans_user_pregnancy
  ON birth_plans(user_id, COALESCE(pregnancy_id, '00000000-0000-0000-0000-000000000000'::uuid));

DROP TRIGGER IF EXISTS birth_plans_updated_at ON birth_plans;
CREATE TRIGGER birth_plans_updated_at BEFORE UPDATE ON birth_plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE birth_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_birth_plan_select" ON birth_plans;
CREATE POLICY "own_birth_plan_select" ON birth_plans FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "own_birth_plan_insert" ON birth_plans;
CREATE POLICY "own_birth_plan_insert" ON birth_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "own_birth_plan_update" ON birth_plans;
CREATE POLICY "own_birth_plan_update" ON birth_plans FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "own_birth_plan_delete" ON birth_plans;
CREATE POLICY "own_birth_plan_delete" ON birth_plans FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "partner_reads_mother_birth_plan" ON birth_plans;
CREATE POLICY "partner_reads_mother_birth_plan" ON birth_plans FOR SELECT
  USING (auth.uid() IN (
    SELECT partner_user_id FROM partner_links WHERE mother_id = birth_plans.user_id AND active = TRUE
  ));

-- ------------------------------------------------------------
-- 6) DIARY ENTRIES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diary_entries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  ssw          INT NOT NULL,
  rating       INT CHECK (rating BETWEEN 1 AND 5),
  word         TEXT,
  surprise     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE diary_entries ADD COLUMN IF NOT EXISTS pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_diary_user_ssw ON diary_entries(user_id, ssw);
CREATE INDEX IF NOT EXISTS idx_diary_pregnancy_id ON diary_entries(pregnancy_id);

DROP TRIGGER IF EXISTS diary_entries_updated_at ON diary_entries;
CREATE TRIGGER diary_entries_updated_at BEFORE UPDATE ON diary_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own diary" ON diary_entries;
CREATE POLICY "Users manage own diary" ON diary_entries FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 7) TERMINE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS termine (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id          UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  type                  TEXT NOT NULL,
  title                 TEXT NOT NULL,
  date                  DATE NOT NULL,
  time                  TEXT,
  location              TEXT,
  doctor                TEXT,
  notes                 TEXT,
  done                  BOOLEAN DEFAULT FALSE NOT NULL,
  group_id              TEXT,
  reminder_hours_before INTEGER,
  color                 TEXT,
  category_slug         TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE termine ADD COLUMN IF NOT EXISTS pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE;
ALTER TABLE termine ADD COLUMN IF NOT EXISTS reminder_hours_before INTEGER;
ALTER TABLE termine ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE termine ADD COLUMN IF NOT EXISTS category_slug TEXT;

CREATE INDEX IF NOT EXISTS idx_termine_user_date ON termine(user_id, date);
CREATE INDEX IF NOT EXISTS idx_termine_group_id ON termine(group_id) WHERE group_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_termine_pregnancy_id ON termine(pregnancy_id);
CREATE INDEX IF NOT EXISTS idx_termine_user_location ON termine(user_id, location) WHERE location IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_termine_user_doctor ON termine(user_id, doctor) WHERE doctor IS NOT NULL;

DROP TRIGGER IF EXISTS termine_updated_at ON termine;
CREATE TRIGGER termine_updated_at BEFORE UPDATE ON termine
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE termine ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_termine_all" ON termine;
CREATE POLICY "own_termine_all" ON termine FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 8) CHECKLISTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS checklists (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL,
  state        JSONB NOT NULL DEFAULT '{"checked":[],"custom":[],"excluded":[]}',
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE checklists ADD COLUMN IF NOT EXISTS pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE;
ALTER TABLE checklists DROP CONSTRAINT IF EXISTS checklists_kind_check;
ALTER TABLE checklists ADD CONSTRAINT checklists_kind_check
  CHECK (kind IN ('packliste', 'einkaufsliste', 'wochenbett'));
CREATE INDEX IF NOT EXISTS idx_checklists_user_id ON checklists(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_checklists_user_pregnancy_kind
  ON checklists(user_id, COALESCE(pregnancy_id, '00000000-0000-0000-0000-000000000000'::uuid), kind);

DROP TRIGGER IF EXISTS checklists_updated_at ON checklists;
CREATE TRIGGER checklists_updated_at BEFORE UPDATE ON checklists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_checklists_all" ON checklists;
CREATE POLICY "own_checklists_all" ON checklists FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 9) KINDERWUNSCH STATE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kinderwunsch_state (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  koerper      JSONB NOT NULL DEFAULT '[]',
  team         JSONB NOT NULL DEFAULT '{}',
  aengste      JSONB NOT NULL DEFAULT '{"fav":[],"read":[]}',
  vorfreude    JSONB NOT NULL DEFAULT '{"first30":[],"bucket":[]}',
  manifest     JSONB NOT NULL DEFAULT '{"agreed":[],"custom":[]}',
  arzt         JSONB NOT NULL DEFAULT '{"asked":[],"custom":[]}',
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE kinderwunsch_state ADD COLUMN IF NOT EXISTS pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_kinderwunsch_state_user_id ON kinderwunsch_state(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_kinderwunsch_user_pregnancy
  ON kinderwunsch_state(user_id, COALESCE(pregnancy_id, '00000000-0000-0000-0000-000000000000'::uuid));

DROP TRIGGER IF EXISTS kinderwunsch_state_updated_at ON kinderwunsch_state;
CREATE TRIGGER kinderwunsch_state_updated_at BEFORE UPDATE ON kinderwunsch_state
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE kinderwunsch_state ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_kinderwunsch_all" ON kinderwunsch_state;
CREATE POLICY "own_kinderwunsch_all" ON kinderwunsch_state FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 10) HELP REQUESTS + SLOTS (Wochenbett-Chef)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS help_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  share_token  TEXT NOT NULL UNIQUE,
  title        TEXT,
  intro        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_help_requests_user_id ON help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_token ON help_requests(share_token);
CREATE INDEX IF NOT EXISTS idx_help_requests_pregnancy_id ON help_requests(pregnancy_id);

DROP TRIGGER IF EXISTS help_requests_updated_at ON help_requests;
CREATE TRIGGER help_requests_updated_at BEFORE UPDATE ON help_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_help_request_all" ON help_requests;
CREATE POLICY "own_help_request_all" ON help_requests FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "public_read_help_requests" ON help_requests;
CREATE POLICY "public_read_help_requests" ON help_requests FOR SELECT USING (TRUE);

CREATE TABLE IF NOT EXISTS help_slots (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id     UUID REFERENCES help_requests(id) ON DELETE CASCADE NOT NULL,
  category       TEXT NOT NULL,
  description    TEXT,
  date           DATE,
  time           TEXT,
  helper_name    TEXT,
  helper_message TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE help_slots DROP CONSTRAINT IF EXISTS help_slots_category_check;
ALTER TABLE help_slots ADD CONSTRAINT help_slots_category_check
  CHECK (category IN ('kochen', 'einkaufen', 'reden', 'waesche', 'kinderbetreuung', 'andere'));
CREATE INDEX IF NOT EXISTS idx_help_slots_request_id ON help_slots(request_id);
CREATE INDEX IF NOT EXISTS idx_help_slots_date ON help_slots(date);

DROP TRIGGER IF EXISTS help_slots_updated_at ON help_slots;
CREATE TRIGGER help_slots_updated_at BEFORE UPDATE ON help_slots
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE help_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "owner_manages_slots" ON help_slots;
CREATE POLICY "owner_manages_slots" ON help_slots FOR ALL
  USING (EXISTS (SELECT 1 FROM help_requests hr WHERE hr.id = help_slots.request_id AND hr.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM help_requests hr WHERE hr.id = help_slots.request_id AND hr.user_id = auth.uid()));
DROP POLICY IF EXISTS "public_read_help_slots" ON help_slots;
CREATE POLICY "public_read_help_slots" ON help_slots FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "public_claims_slot" ON help_slots;
CREATE POLICY "public_claims_slot" ON help_slots FOR UPDATE
  USING (helper_name IS NULL OR helper_name = '') WITH CHECK (TRUE);

-- ------------------------------------------------------------
-- 11) USER PREFERENCES (Personalisierung)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  settings   JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "prefs_select_own" ON user_preferences;
CREATE POLICY "prefs_select_own" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "prefs_insert_own" ON user_preferences;
CREATE POLICY "prefs_insert_own" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "prefs_update_own" ON user_preferences;
CREATE POLICY "prefs_update_own" ON user_preferences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "prefs_delete_own" ON user_preferences;
CREATE POLICY "prefs_delete_own" ON user_preferences FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS user_preferences_updated_at ON user_preferences;
CREATE TRIGGER user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- 12) TERMIN CATEGORIES (eigene Termin-Typen pro User)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS termin_categories (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug                   TEXT NOT NULL,
  label                  TEXT NOT NULL,
  emoji                  TEXT,
  color                  TEXT,
  default_location       TEXT,
  default_reminder_hours INTEGER,
  notes_template         TEXT,
  is_builtin             BOOLEAN NOT NULL DEFAULT FALSE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_termin_categories_user ON termin_categories(user_id);

ALTER TABLE termin_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "termin_cat_select_own" ON termin_categories;
CREATE POLICY "termin_cat_select_own" ON termin_categories FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "termin_cat_insert_own" ON termin_categories;
CREATE POLICY "termin_cat_insert_own" ON termin_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "termin_cat_update_own" ON termin_categories;
CREATE POLICY "termin_cat_update_own" ON termin_categories FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "termin_cat_delete_own" ON termin_categories;
CREATE POLICY "termin_cat_delete_own" ON termin_categories FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 13) PARTNER TODOS (Aufgaben die die Mama dem Partner zuweist)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partner_todos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE,
  title        TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  description  TEXT,
  due_date     DATE,
  done         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_partner_todos_user ON partner_todos(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_todos_pregnancy ON partner_todos(pregnancy_id);

DROP TRIGGER IF EXISTS partner_todos_updated_at ON partner_todos;
CREATE TRIGGER partner_todos_updated_at BEFORE UPDATE ON partner_todos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE partner_todos ENABLE ROW LEVEL SECURITY;

-- Mother has full CRUD on her own todos.
DROP POLICY IF EXISTS "own_partner_todos_all" ON partner_todos;
CREATE POLICY "own_partner_todos_all" ON partner_todos FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Partner can SELECT when linked AND visibility.partnerTodos = true.
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

-- Partner can UPDATE only when visibility allows it. API restricts to `done` field.
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

-- ------------------------------------------------------------
-- 14) PARTNER VISIBILITY RLS-TIGHTEN
--     Erweitert bestehende Partner-Read-Policies um den Sichtbarkeits-Check
--     aus user_preferences.settings.partnerVisibility. Standard TRUE wenn
--     kein user_preferences-Row existiert.
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
-- 15) MULTIPLES (Zwillinge / Drillinge)
-- ------------------------------------------------------------
ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS baby_names TEXT[] DEFAULT NULL;
ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS is_multiple BOOLEAN NOT NULL DEFAULT FALSE;

-- ------------------------------------------------------------
-- 16) STORAGE — Profil-Avatar (public bucket) + Ultraschall (private bucket)
-- ------------------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS ultrasound_urls JSONB DEFAULT '[]'::jsonb;

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('ultrasounds', 'ultrasounds', FALSE) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
DROP POLICY IF EXISTS "avatars_owner_insert" ON storage.objects;
CREATE POLICY "avatars_owner_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "avatars_owner_update" ON storage.objects;
CREATE POLICY "avatars_owner_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;
CREATE POLICY "avatars_owner_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "ultrasounds_owner_all" ON storage.objects;
CREATE POLICY "ultrasounds_owner_all" ON storage.objects FOR ALL
  USING (bucket_id = 'ultrasounds' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'ultrasounds' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ------------------------------------------------------------
-- 17) STORAGE — Tagebuch-Fotos (private bucket) + diary_entries.photo_url
-- ------------------------------------------------------------
ALTER TABLE diary_entries ADD COLUMN IF NOT EXISTS photo_url TEXT;

INSERT INTO storage.buckets (id, name, public) VALUES ('diary-photos', 'diary-photos', FALSE) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "diary_photos_select_own" ON storage.objects;
CREATE POLICY "diary_photos_select_own" ON storage.objects FOR SELECT
  USING (bucket_id = 'diary-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "diary_photos_insert_own" ON storage.objects;
CREATE POLICY "diary_photos_insert_own" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'diary-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "diary_photos_update_own" ON storage.objects;
CREATE POLICY "diary_photos_update_own" ON storage.objects FOR UPDATE
  USING (bucket_id = 'diary-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "diary_photos_delete_own" ON storage.objects;
CREATE POLICY "diary_photos_delete_own" ON storage.objects FOR DELETE
  USING (bucket_id = 'diary-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ------------------------------------------------------------
-- 18) REALTIME PARTNER-RLS — Termine + Tagebuch fuer Live-Sync freischalten
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "partner_reads_mother_termine" ON termine;
CREATE POLICY "partner_reads_mother_termine" ON termine FOR SELECT
  USING (
    auth.uid() IN (SELECT partner_user_id FROM partner_links WHERE mother_id = termine.user_id AND active = TRUE)
    AND COALESCE((SELECT (settings->'partnerVisibility'->>'termine')::boolean
                  FROM user_preferences WHERE user_id = termine.user_id), TRUE) = TRUE
  );

DROP POLICY IF EXISTS "partner_reads_mother_diary" ON diary_entries;
CREATE POLICY "partner_reads_mother_diary" ON diary_entries FOR SELECT
  USING (
    auth.uid() IN (SELECT partner_user_id FROM partner_links WHERE mother_id = diary_entries.user_id AND active = TRUE)
    AND COALESCE((SELECT (settings->'partnerVisibility'->>'tagebuch')::boolean
                  FROM user_preferences WHERE user_id = diary_entries.user_id), FALSE) = TRUE
  );

-- ------------------------------------------------------------
-- 19) REALTIME PUBLICATION — Tables must be added to supabase_realtime
--     publication for change events to reach subscribed clients. Without
--     this, Realtime subscriptions receive nothing even though RLS allows
--     SELECT. REPLICA IDENTITY FULL ensures DELETE events include full row
--     data (default REPLICA IDENTITY only sends the PRIMARY KEY).
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- 20) PARTNER ROLLE + DISPLAY NAME
--     Erweitert partner_links um role + display_name, damit der
--     Partner beim Accept-Flow angeben kann, wer er ist (Papa/Mama/
--     Oma/Opa/Bestie/Andere) und mit welchem Namen er der Mama
--     angezeigt wird.
-- ------------------------------------------------------------
ALTER TABLE partner_links ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE partner_links ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE partner_links DROP CONSTRAINT IF EXISTS partner_links_role_check;
ALTER TABLE partner_links ADD CONSTRAINT partner_links_role_check
  CHECK (role IS NULL OR role IN ('papa', 'mama', 'oma', 'opa', 'bestie', 'andere'));

-- ============================================================
-- 21) PUSH-NOTIFICATIONS (PROJ-10) + WOCHENBETT-CHEF+ (PROJ-11)
-- ============================================================

-- ---------------------------
-- 21a) push_subscriptions — Web-Push Endpunkte pro Nutzer
-- ---------------------------
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint      TEXT NOT NULL UNIQUE,
  p256dh        TEXT NOT NULL,
  auth          TEXT NOT NULL,
  user_agent    TEXT,
  active        BOOLEAN DEFAULT TRUE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_used_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(active) WHERE active = TRUE;

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_push_subscriptions_all" ON push_subscriptions;
CREATE POLICY "own_push_subscriptions_all" ON push_subscriptions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ---------------------------
-- 21b) help_slots — Erweiterung fuer Wochenbett-Chef+
--      (Slot-Typ, Ziel-URL, Betrag, Danke, Abschluss)
-- ---------------------------
ALTER TABLE help_slots ADD COLUMN IF NOT EXISTS slot_type TEXT DEFAULT 'task' NOT NULL;
ALTER TABLE help_slots DROP CONSTRAINT IF EXISTS help_slots_type_check;
ALTER TABLE help_slots ADD CONSTRAINT help_slots_type_check
  CHECK (slot_type IN ('task', 'gift', 'money'));

ALTER TABLE help_slots ADD COLUMN IF NOT EXISTS target_url TEXT;
ALTER TABLE help_slots ADD COLUMN IF NOT EXISTS suggested_amount NUMERIC(6, 2);
ALTER TABLE help_slots ADD COLUMN IF NOT EXISTS thanks_sent_at TIMESTAMPTZ;
ALTER TABLE help_slots ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_help_slots_completed_at
  ON help_slots(completed_at) WHERE completed_at IS NOT NULL;

-- ---------------------------
-- 21c) termine — Reminder-Felder fuer Push-Cron
--      (unabhaengig vom pre-existing reminder_hours_before,
--       weil der neue Cron eigene Semantik hat)
-- ---------------------------
ALTER TABLE termine ADD COLUMN IF NOT EXISTS reminder_hours INTEGER;
ALTER TABLE termine ADD COLUMN IF NOT EXISTS reminded_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_termine_reminder_pending
  ON termine(date, reminder_hours)
  WHERE reminder_hours IS NOT NULL AND reminded_at IS NULL AND done = FALSE;

-- ============================================================
-- 22) PARTNER-FEATURES 2.0 (PROJ-12)
-- ============================================================

-- ---------------------------
-- 22a) partner_visit_signals — Ampel fuer Wochenbett-Besuche
-- ---------------------------
CREATE TABLE IF NOT EXISTS partner_visit_signals (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  signal      TEXT NOT NULL DEFAULT 'green',
  note        TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE partner_visit_signals DROP CONSTRAINT IF EXISTS partner_visit_signals_signal_check;
ALTER TABLE partner_visit_signals ADD CONSTRAINT partner_visit_signals_signal_check
  CHECK (signal IN ('green', 'yellow', 'red'));

DROP TRIGGER IF EXISTS partner_visit_signals_updated_at ON partner_visit_signals;
CREATE TRIGGER partner_visit_signals_updated_at BEFORE UPDATE ON partner_visit_signals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE partner_visit_signals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_visit_signal_all" ON partner_visit_signals;
CREATE POLICY "own_visit_signal_all" ON partner_visit_signals FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "partner_reads_visit_signal" ON partner_visit_signals;
CREATE POLICY "partner_reads_visit_signal" ON partner_visit_signals FOR SELECT
  USING (auth.uid() IN (
    SELECT partner_user_id FROM partner_links
    WHERE mother_id = partner_visit_signals.user_id AND active = TRUE
  ));

-- Realtime — Ampel-Wechsel muss beim Partner sofort sichtbar sein.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'partner_visit_signals'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE partner_visit_signals;
  END IF;
END $$;
ALTER TABLE partner_visit_signals REPLICA IDENTITY FULL;

-- ---------------------------
-- 22b) parental_leave_progress — Elternzeit-Wizard State (Papa)
-- ---------------------------
CREATE TABLE IF NOT EXISTS parental_leave_progress (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  target_start_date DATE,
  weeks_planned     INTEGER,
  employer_notified BOOLEAN NOT NULL DEFAULT FALSE,
  hr_letter_sent    BOOLEAN NOT NULL DEFAULT FALSE,
  elterngeld_applied BOOLEAN NOT NULL DEFAULT FALSE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_parental_leave_partner ON parental_leave_progress(partner_user_id);

DROP TRIGGER IF EXISTS parental_leave_progress_updated_at ON parental_leave_progress;
CREATE TRIGGER parental_leave_progress_updated_at BEFORE UPDATE ON parental_leave_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE parental_leave_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_parental_leave_all" ON parental_leave_progress;
CREATE POLICY "own_parental_leave_all" ON parental_leave_progress FOR ALL
  USING (auth.uid() = partner_user_id) WITH CHECK (auth.uid() = partner_user_id);

-- ============================================================
-- FERTIG. Alle Tabellen + RLS + Trigger + Realtime sind idempotent angelegt.
--
-- Nach Ausfuehrung pruefen (im Supabase SQL Editor):
--   SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public' ORDER BY table_name;
-- Erwartete Tabellen (16):
--   birth_plans, checklists, diary_entries, help_requests, help_slots,
--   kinderwunsch_state, parental_leave_progress, partner_invites,
--   partner_links, partner_todos, partner_visit_signals, pregnancies,
--   profiles, push_subscriptions, termine, termin_categories,
--   user_preferences
-- ============================================================
