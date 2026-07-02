# PROJ-11 — Wochenbett-Chef+: iCal, Wunschzettel, Danke

**Status:** In Progress
**Created:** 2026-07-02
**Priority:** P0/P1 (verdoppelt strukturelles USP)

## Kurzbeschreibung

Drei gezielte Erweiterungen am bestehenden Wochenbett-Chef:

1. **iCal-Export** — Helfer:in bekommt beim Slot-Claim einen "In Kalender speichern"-Link (`.ics`), reduziert Ghost-Helfer.
2. **Wunschzettel-Typen** — Slots können `task` · `gift` · `money` sein, mit Ziel-URL (Amazon-Wunschzettel, PayPal.me, kaufland.de Wunschzettel). Bislang nur "Aufgabe erledigen".
3. **1-Klick-Danke-System** — nach Slot-Erfüllung kann Mama mit einem Klick eine Danke-Nachricht an den Helfer per WhatsApp/SMS teilen. Templates pro Kategorie.

## User Stories

1. Als Helfer:in möchte ich beim Slot-Übernehmen den Termin direkt in meinen Kalender speichern können, damit ich ihn nicht vergesse.
2. Als Mama möchte ich einen konkreten Wunsch (Amazon-Wunschzettel, Geldbeitrag via PayPal) einstellen können, damit Helfer:innen konkret helfen und nicht raten müssen.
3. Als Helfer:in möchte ich klar sehen ob ich eine Aufgabe erledigen, ein Geschenk kaufen oder Geld beitragen soll, damit ich nicht unsicher bin was von mir erwartet wird.
4. Als Mama möchte ich nach erledigtem Slot einen Danke-Text vorformuliert bekommen, den ich per WhatsApp/SMS teilen kann.

## Acceptance Criteria

- [ ] iCal-Endpoint `GET /api/helfen/[token]/ics/[slotId]` liefert valide `.ics` Datei (RFC 5545)
- [ ] `iCal-Download` Button erscheint auf HelferView nach erfolgreichem Claim
- [ ] `help_slots.slot_type` unterstützt `task | gift | money` (Default: task)
- [ ] `help_slots.target_url` speichert URL (optional, validate mit Zod URL())
- [ ] `help_slots.suggested_amount` speichert Zahl (optional, für money-Typ)
- [ ] HelpCoordinator zeigt Typ-Auswahl im Anlege-Dialog
- [ ] HelferView zeigt passenden CTA je Typ ("Aufgabe übernehmen" | "Zum Wunschzettel" | "Betrag beitragen")
- [ ] `help_slots.thanks_sent_at` speichert Zeitpunkt
- [ ] HelpCoordinator zeigt "Danke sagen" Button pro erfüllten Slot
- [ ] Danke-Templates pro Kategorie in i18n (DE/EN)
- [ ] "Danke sagen"-Dialog nutzt Web Share API + Fallback (WhatsApp + SMS + Copy-Link)

## Non-Goals

- Kein integriertes Payment (PayPal-Link wird an user delegiert, wir handhaben kein Geld)
- Keine Push an Helfer:in beim Danke (verlässt sich auf App-externe Kanäle)
- Keine Kalender-Sync (nur One-Time-Export via .ics)

## Technical Approach

**DB-Änderungen (Migration 021)**

```sql
ALTER TABLE help_slots ADD COLUMN slot_type TEXT DEFAULT 'task';
ALTER TABLE help_slots ADD CONSTRAINT help_slots_type_check
  CHECK (slot_type IN ('task', 'gift', 'money'));
ALTER TABLE help_slots ADD COLUMN target_url TEXT;
ALTER TABLE help_slots ADD COLUMN suggested_amount NUMERIC(6, 2);
ALTER TABLE help_slots ADD COLUMN thanks_sent_at TIMESTAMPTZ;
ALTER TABLE help_slots ADD COLUMN completed_at TIMESTAMPTZ;
```

**Neue API-Routes**
- `GET /api/helfen/[token]/ics/[slotId]` — public, filtert auf Token, liefert .ics
- `POST /api/help-requests/[id]/slots/[slotId]/thanks` — owner, setzt thanks_sent_at
- `POST /api/help-requests/[id]/slots/[slotId]/complete` — owner, setzt completed_at

**Frontend**
- HelpCoordinator: Typ-Radio + URL-Input + Suggested-Amount-Input im Neuer-Slot-Dialog
- HelperView: iCal-Download nach Claim + Typ-abhängiger CTA
- Danke-Dialog mit Web Share API + Fallback

## Implementation Notes

_(wird während Umsetzung aktualisiert)_
