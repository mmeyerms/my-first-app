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
