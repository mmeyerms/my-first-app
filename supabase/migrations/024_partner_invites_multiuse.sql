-- ============================================================
-- Migration: 024_partner_invites_multiuse
-- Beschreibung: Partner-Einladungslinks werden Multi-Use.
--   Bisher: 1 Token = 1 Accept (used_at wurde gesetzt und blockierte weitere).
--   Neu:    1 Token = bis zu 5 Accepts (Papa, Oma, Opa, Bestie, ...).
--
-- Die UNIQUE (mother_id, partner_user_id) constraint auf partner_links
-- verhindert weiterhin, dass DIESELBE Person sich doppelt registriert.
--
-- Idempotent.
-- ============================================================

-- Neu: max_uses + uses_count
ALTER TABLE partner_invites ADD COLUMN IF NOT EXISTS max_uses INTEGER NOT NULL DEFAULT 5;
ALTER TABLE partner_invites ADD COLUMN IF NOT EXISTS uses_count INTEGER NOT NULL DEFAULT 0;

-- Semantik-Update: used_at wird jetzt nur noch gesetzt, wenn max_uses
-- erreicht ist (dann ist der Token endgueltig verbraucht). Bereits
-- verwendete Tokens aus alter Semantik (used_at IS NOT NULL, uses_count = 0)
-- werden auf uses_count = max_uses gehoben, sodass ihre Semantik erhalten
-- bleibt: sie sind verbraucht.
UPDATE partner_invites
   SET uses_count = max_uses
 WHERE used_at IS NOT NULL AND uses_count = 0;

-- Constraint: uses_count darf nie max_uses ueberschreiten.
ALTER TABLE partner_invites DROP CONSTRAINT IF EXISTS partner_invites_uses_bounds;
ALTER TABLE partner_invites ADD CONSTRAINT partner_invites_uses_bounds
  CHECK (uses_count >= 0 AND uses_count <= max_uses AND max_uses > 0 AND max_uses <= 20);

-- Optional: schmaler Index fuer "noch nutzbare invites"-Queries.
-- NOW() darf NICHT im Predicate stehen (Postgres verlangt deterministische
-- Ausdruecke in Index-Bedingungen). expires_at wird stattdessen zum
-- Sortier-Key gemacht — filtern uebernimmt die REST-API.
CREATE INDEX IF NOT EXISTS idx_partner_invites_active
  ON partner_invites(mother_id, expires_at)
  WHERE uses_count < max_uses;

-- ============================================================
-- Fertig.
-- ============================================================
