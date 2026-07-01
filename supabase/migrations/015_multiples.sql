-- ============================================================
-- 015_multiples.sql — Support für Zwillinge / Drillinge
-- Fügt der pregnancies-Tabelle Felder für mehrere Babys hinzu:
--   * baby_names: TEXT[]  — Liste aller Baby-Namen (bei Mehrlingen)
--   * is_multiple: BOOLEAN — TRUE bei Zwillingen/Drillingen etc.
-- baby_name bleibt für Backward-Compat erhalten (erster Name).
-- Idempotent.
-- ============================================================

ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS baby_names TEXT[] DEFAULT NULL;
ALTER TABLE pregnancies ADD COLUMN IF NOT EXISTS is_multiple BOOLEAN NOT NULL DEFAULT FALSE;
