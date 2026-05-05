# PROJ-3: Tägliches Tipp-Popup

## Status: Planned
**Created:** 2026-05-05
**Last Updated:** 2026-05-05

## Dependencies
- Requires: PROJ-1 (User Onboarding & Profil) — SSW muss aus dem Profil bekannt sein

## User Stories
- Als werdende Mutter möchte ich beim täglichen Öffnen der App einen Tipp passend zu meiner aktuellen Schwangerschaftswoche sehen, damit ich relevante Impulse bekomme.
- Als werdende Mutter möchte ich täglich nur einen Tipp sehen (nicht mehrere), damit es nicht überwältigend ist.
- Als werdende Mutter möchte ich den Tipp wegklicken und zur App navigieren können, damit er mich nicht blockiert.
- Als werdende Mutter möchte ich mir den heutigen Tipp später noch einmal anschauen können, damit ich ihn nicht vergesse.
- Als werdende Mutter möchte ich positive Mindset-Impulse (Affirmationen, Gedankenanstöße) erhalten, nicht nur medizinische Fakten.

## Tipp-Inhalte (Konzept)

### Kategorien pro SSW-Phase
- **SSW 1–12 (Erstes Trimester):** Körperveränderungen, Übelkeit, erste Schritte, Geheimnis bewahren, Erschöpfung normalisieren
- **SSW 13–27 (Zweites Trimester):** Baby-Bewegungen, Babybauch, Partner einbeziehen, Geburtsplan starten, Gedanken zur Geburt
- **SSW 28–36 (Drittes Trimester):** Krankentasche packen, Geburtsvorbereitung, Nesting-Instinkt, Ängste ansprechen
- **SSW 37–42 (Endspurt):** Geduld, letzte Vorbereitungen, Geburtswehen erkennen, positive Affirmationen

### Tipp-Typen
- **Praktischer Tipp:** "Ab SSW 20 empfiehlt es sich, eine Hebamme für das Wochenbett zu suchen."
- **Mindset-Impuls:** "Dein Körper weiß, was er tut. Vertrau ihm."
- **Partnerschaft:** "Zeig deinem Partner heute diesen Artikel über [Thema]."
- **Gedankenanstoß:** "Was macht dich heute stolz auf dich und deinen Körper?"

## Acceptance Criteria
- [ ] Beim ersten App-Öffnen eines neuen Tages erscheint ein Popup/Modal
- [ ] Popup zeigt: SSW, Tipp-Text, Tipp-Kategorie (Emoji + Label)
- [ ] Popup kann per "Schließen"-Button oder Klick außerhalb weggedrückt werden
- [ ] Pro Tag wird maximal ein Popup gezeigt (auch bei mehrfachem Öffnen)
- [ ] Nutzer kann den heutigen Tipp auf einer "Heute"-Seite nochmals lesen
- [ ] Tipps sind SSW-spezifisch (mindestens 3 Tipps pro Woche, rotierend)
- [ ] Positive Mindset-Impulse machen mindestens 40% der Inhalte aus
- [ ] Kein Popup am Tag der Registrierung (Onboarding-Flow hat Priorität)

## Edge Cases
- Was wenn die Nutzerin die App mehrmals am selben Tag öffnet? → Popup nur einmal zeigen (gespeichertes Datum in localStorage oder Supabase)
- Was wenn für die aktuelle SSW kein spezifischer Tipp vorhanden ist? → Fallback auf den Tipp der nächsten vorhandenen Woche
- Was wenn die SSW > 42 (überfällig)? → Spezielle "Du bist fast da!"-Tipps + kein Fehler
- Was wenn die SSW < 1 (ET zu nah am Test-Datum)? → Allgemeiner Ersttrimester-Tipp
- Was wenn die Nutzerin offline ist? → Letzter gecacheter Tipp wird angezeigt

## Technical Requirements
- Tipp-Inhalt: Statische JSON-Datei (kein CMS nötig für MVP) mit ~130 Tipps (40 Wochen × 3)
- Popup-State: In Supabase `daily_tip_log` (user_id, date) oder localStorage
- Performance: Tipp wird clientseitig aus JSON geladen — kein API-Call nötig
- Barrierefreiheit: Popup via ESC schließbar, Fokus-Management korrekt

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
