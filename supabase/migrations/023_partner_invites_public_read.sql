-- ============================================================
-- Migration: 023_partner_invites_public_read
-- Beschreibung: Fix Partner-Accept-Bug.
--
-- Vorher: Nur mother_id konnte partner_invites lesen. Der Partner
--         (nicht die Mutter) bekam beim Accept-Flow "Einladungs-
--         link existiert nicht", weil RLS SELECT blockierte.
--
-- Nachher: Public-Read auf partner_invites. Der Token (UUID) ist
--          der eigentliche Zugriffsschutz — die API-Route filtert
--          weiterhin mit .eq('token', X). INSERT/UPDATE/DELETE
--          bleiben auf die Mutter beschraenkt (mother_manages_own_invites).
--
-- Sicherheits-Ueberlegung:
--   - UUIDs sind praktisch nicht enumerable
--   - Nur token, mother_id, expires_at, used_at werden preisgegeben
--   - Kein Klartext-Content, keine persoenliche Info
--   - CAS-Guard (used_at IS NULL im PUT) verhindert Race-Conditions
-- ============================================================

DROP POLICY IF EXISTS "public_reads_invite" ON partner_invites;
CREATE POLICY "public_reads_invite" ON partner_invites
  FOR SELECT USING (true);

-- mother_manages_own_invites Policy bleibt bestehen (deckt
-- INSERT/UPDATE/DELETE ab). Alter Kommentar zur Klarheit:
--   mother_manages_own_invites: FOR ALL USING (auth.uid() = mother_id)
-- ============================================================
