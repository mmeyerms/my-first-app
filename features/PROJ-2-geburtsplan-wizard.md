# PROJ-2: Geburtsplan-Wizard

## Status: In Progress
**Created:** 2026-05-05
**Last Updated:** 2026-05-05

## Dependencies
- Requires: PROJ-1 (User Onboarding & Profil) — Nutzer muss eingeloggt sein, SSW muss bekannt sein

## User Stories
- Als werdende Mutter möchte ich Schritt für Schritt durch meinen Geburtsplan geführt werden, damit ich keine wichtigen Entscheidungen vergesse.
- Als werdende Mutter möchte ich mit einfachen Kernfragen starten und tiefere Fragen später beantworten können, damit ich nicht überfordert werde.
- Als werdende Mutter möchte ich meinen Fortschritt speichern und jederzeit weitermachen können, damit ich nicht alles auf einmal entscheiden muss.
- Als werdende Mutter möchte ich meinen fertigen Geburtsplan als PDF exportieren, damit ich ihn ins Krankenhaus mitnehmen kann.
- Als werdende Mutter möchte ich meine Antworten jederzeit bearbeiten können, damit ich Entscheidungen überdenken kann.
- Als werdende Mutter möchte ich sehen, wie viel Prozent meines Geburtsplans ich bereits ausgefüllt habe, damit ich motiviert bleibe.

## Wizard-Struktur (Stufenweise)

### Stufe 1 — Kern (immer sichtbar, ~5 Fragen)
1. **Geburtsort:** Krankenhaus / Geburtshaus / Hausgeburt / Noch nicht entschieden
2. **Begleitung:** Wer soll dabei sein? (Partner, Doula, Freundin, allein)
3. **Schmerzmanagement:** PDA ja/nein/offen, Alternativen (Wasser, TENS, Hypnobirthing)
4. **Wichtigste Wünsche:** Freitext — Was ist dir am wichtigsten?
5. **No-Go's:** Freitext — Was möchtest du auf keinen Fall?

### Stufe 2 — Vertiefung (ab SSW 20 freigeschaltet, ~7 Fragen)
6. **Bewegungsfreiheit:** Möchtest du dich frei bewegen können?
7. **Dammschutz:** Wünsche zum Thema Dammschnitt (episiotomy)?
8. **Bonding:** Sofortkontakt nach der Geburt, verzögertes Abnabeln?
9. **Stillwunsch:** Möchtest du stillen? Unterstützung gewünscht?
10. **Fotografie / Video:** Wer darf wann fotografieren?
11. **Musik / Atmosphäre:** Bestimmte Musik, Licht, Duft?
12. **Bei Komplikationen:** Was soll bei Kaiserschnitt oder Notfall gelten?

### Stufe 3 — Wochenbett (ab SSW 32 freigeschaltet, ~5 Fragen)
13. **Zimmer-Präferenz:** Einzel- oder Mehrbettzimmer?
14. **Besuche:** Wer darf wann kommen?
15. **Baby-Schlafplatz:** Rooming-in oder Säuglingszimmer?
16. **Entlassung:** Frühe Entlassung gewünscht oder lieber länger bleiben?
17. **Hebamme zuhause:** Bereits eine Wochenbett-Hebamme organisiert?

## Acceptance Criteria
- [ ] Wizard zeigt Stufe 1 (5 Fragen) für alle eingeloggten Nutzer
- [ ] Stufe 2 wird ab SSW 20 freigeschaltet (visuell als "coming soon" sichtbar vorher)
- [ ] Stufe 3 wird ab SSW 32 freigeschaltet
- [ ] Fortschrittsanzeige (z.B. "3 von 5 Stufe-1-Fragen beantwortet")
- [ ] Antworten werden automatisch gespeichert (kein manuelles Speichern nötig)
- [ ] Jede Frage einzeln bearbeitbar (nicht nur sequenziell)
- [ ] PDF-Export zeigt alle beantworteten Fragen strukturiert + Name des Kindes + ET
- [ ] PDF enthält Titel "Mein Geburtsplan — [Babyname]" und Datum der Erstellung
- [ ] Übersichtsseite zeigt alle Antworten auf einen Blick

## Edge Cases
- Was wenn SSW sich durch ET-Korrektur ändert und Stufen neu berechnet werden? → Bereits beantwortete Fragen bleiben, neue Stufen werden freigeschaltet
- Was wenn jemand SSW 25 ist und Stufe 2 noch nicht freigeschaltet ist? → Hinweis "Stufe 2 wird in SSW 20 freigeschaltet — du bist auf dem Weg!"
- Was wenn Freitext-Felder leer gelassen werden? → Optional, kein Pflichtfeld
- Was wenn jemand den PDF-Export macht, bevor Stufe 1 vollständig ist? → Export möglich, nicht beantwortete Felder als "Noch nicht entschieden" markiert
- Was wenn eine Nutzerin den Browser schließt ohne zu speichern? → Autosave nach jeder Antwort

## Technical Requirements
- Daten in Supabase-Tabelle `birth_plans` (user_id, answers JSONB, updated_at)
- PDF-Generierung: `react-pdf` oder `jspdf` im Browser
- Keine separate Speicher-Schaltfläche — Autosave per debounce
- SSW-Check für Stufenfreischaltung: aus `profiles.due_date` berechnet

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Seiten & Komponenten-Struktur
```
/geburtsplan                    ← Geschützt (SSR — lädt Profil + Antworten)
+-- GeburtsplanView (Client Component)
    +-- Fortschrittsanzeige (beantwortet / gesamt)
    +-- PDF-Export Button
    +-- StageSection Stufe 1 (Kern — immer sichtbar)
    |   +-- QuestionCard × 5 (single / multi / text)
    +-- StageSection Stufe 2 (SSW 20+ — sonst Lock-Banner)
    |   +-- QuestionCard × 7
    +-- StageSection Stufe 3 (SSW 32+ — sonst Lock-Banner)
        +-- QuestionCard × 5
```

### Datenmodell
- `birth_plans` Tabelle: `user_id, answers (JSONB), updated_at`
- `answers` Format: `{ "location": "Krankenhaus", "companions": ["Partner/in"], ... }`
- SSW wird nicht gespeichert — live aus `profiles.due_date` berechnet

### Tech-Entscheidungen
| Entscheidung | Warum |
|---|---|
| JSONB für answers | Flexibel für 17 Fragen mit unterschiedlichen Typen |
| Autosave (debounce 800ms) | Keine explizite Speichern-Schaltfläche nötig |
| jspdf (Browser-seitig) | Kein Server-Roundtrip für PDF — läuft im Browser |
| Fragen als Konstante | Typsicher, leicht erweiterbar |

### Neue Abhängigkeiten
| Paket | Zweck |
|---|---|
| `jspdf` | PDF-Generierung im Browser |

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
