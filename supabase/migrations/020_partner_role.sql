-- ============================================================
-- Migration: 020_partner_role
-- Beschreibung: Partner-Rolle + eigenes Label pro partner_link.
--               Erlaubt dem angemeldeten Partner beim Accept-Flow
--               eine Rolle zu waehlen (papa/mama/oma/opa/bestie/andere)
--               und einen eigenen Namen anzugeben, mit dem er der Mama
--               angezeigt wird.
-- Idempotent.
-- ============================================================

ALTER TABLE partner_links ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE partner_links ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE partner_links DROP CONSTRAINT IF EXISTS partner_links_role_check;
ALTER TABLE partner_links ADD CONSTRAINT partner_links_role_check
  CHECK (role IS NULL OR role IN ('papa', 'mama', 'oma', 'opa', 'bestie', 'andere'));
