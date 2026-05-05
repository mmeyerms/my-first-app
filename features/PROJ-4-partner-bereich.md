# PROJ-4: Partner-Bereich

## Status: Planned
**Created:** 2026-05-05
**Last Updated:** 2026-05-05

## Dependencies
- Requires: PROJ-1 (User Onboarding & Profil) — SSW muss bekannt sein für phasengerechte Tipps
- Requires: PROJ-3 (Tägliches Tipp-Popup) — Tipp-Content-Bibliothek wird mitgenutzt

## User Stories
- Als werdende Mutter möchte ich einen Bereich für meinen Partner freigeben, damit er eigene, für ihn relevante Tipps erhält.
- Als Partner möchte ich wissen, was in der aktuellen SSW passiert, damit ich besser unterstützen kann.
- Als Partner möchte ich konkrete To-Dos und Handlungsempfehlungen erhalten, nicht nur medizinische Fakten.
- Als Partner möchte ich den Geburtsplan meiner Partnerin einsehen können, damit ich vorbereitet bin.
- Als werdende Mutter möchte ich kontrollieren, ob der Partner-Bereich aktiv ist, damit ich entscheide wer Zugriff hat.

## Partner-Bereich Inhalte (Konzept)

### Phasenspezifische Partner-Tipps
- **Erstes Trimester:** "Übernimm haushaltsnahe Aufgaben ohne Aufforderung", "Frag täglich wie es ihr geht — und höre zu", "Vermeide Kommentare über Gewichtszunahme"
- **Zweites Trimester:** "Begleite sie zum Ultraschall", "Lerne die Geburtspräferenzen kennen", "Organisiere jetzt schon die Elternzeit"
- **Drittes Trimester:** "Pack die Krankentasche gemeinsam", "Kenne den Weg zum Krankenhaus auswendig", "Übe Atemübungen gemeinsam"
- **Endspurt:** "Bleib erreichbar, Telefon immer geladen", "Kenne die Geburtswehen-Zeichen", "Sei ihr Anker"

### Inhalts-Typen
- **To-Do des Tages:** Eine konkrete Aufgabe
- **Wissenssnippet:** Was passiert gerade mit Baby und Mutter?
- **Gesprächsimpuls:** "Fragt heute gemeinsam: Wie soll unser erstes Wochenende zu dritt aussehen?"

## Acceptance Criteria
- [ ] Mutter kann in den Einstellungen einen "Partner-Zugang" aktivieren (Toggle)
- [ ] Partner-Zugang generiert einen Einladungslink oder Code (7 Tage gültig)
- [ ] Partner kann sich mit dem Link registrieren und sieht die Partner-Ansicht (nicht das volle Dashboard)
- [ ] Partner-Ansicht zeigt: aktuelle SSW, heutigen Partner-Tipp, aktuellen Geburtsplan (read-only)
- [ ] Partner-Tipps sind SSW-spezifisch (mind. 2 Tipps pro Woche)
- [ ] Partner kann keine Profil- oder Geburtsplan-Daten bearbeiten (nur lesen)
- [ ] Mutter kann Partner-Zugang jederzeit widerrufen

## Edge Cases
- Was wenn der Partner-Link abläuft (nach 7 Tagen)? → Hinweis + Mutter kann neuen Link erstellen
- Was wenn jemand den Link missbraucht? → Code ist single-use (nur ein Partner-Account pro Mutter)
- Was wenn die Mutter kein Partner-Zugang aktiviert? → Partner-Bereich ist ausgeblendet, kein Hinweis darauf
- Was wenn der Partner eigene Tipps für SSW 1 sehen will, die Mutter aber schon in SSW 30 ist? → Immer aktuelle SSW der Mutter zeigen
- Was wenn die Mutter ihren Account löscht? → Partner-Account wird automatisch deaktiviert

## Technical Requirements
- Supabase-Tabelle `partner_invites` (user_id, token, expires_at, used)
- Supabase-Tabelle `partner_links` (mother_id, partner_user_id, active)
- Row Level Security: Partner kann nur `birth_plans` und `profiles` seiner Partnerin lesen
- Einladungslink: `/partner/accept/[token]`
- Partner-Rolle unterscheidet sich von Mutter-Rolle in der UI (eigenes Layout)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
