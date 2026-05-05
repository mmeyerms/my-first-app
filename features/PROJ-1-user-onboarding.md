# PROJ-1: User Onboarding & Profil

## Status: Architected
**Created:** 2026-05-05
**Last Updated:** 2026-05-05

## Dependencies
- None

## User Stories
- Als werdende Mutter möchte ich mich registrieren und einloggen, damit meine Daten geräteübergreifend gespeichert sind.
- Als werdende Mutter möchte ich beim ersten Start das Datum des positiven Tests, den Arbeitsnamen des Kindes und den errechneten Geburtstermin (ET) eingeben, damit die App meine aktuelle Schwangerschaftswoche (SSW) kennt.
- Als werdende Mutter möchte ich mein Profil jederzeit bearbeiten können (z.B. ET korrigieren nach dem ersten Ultraschall), damit die Inhalte aktuell bleiben.
- Als werdende Mutter möchte ich beim Login direkt auf mein persönliches Dashboard weitergeleitet werden, damit ich schnell zu meinen Inhalten komme.
- Als werdende Mutter möchte ich meinen Account löschen können, damit ich die Kontrolle über meine Daten behalte.

## Acceptance Criteria
- [ ] Registrierung via E-Mail + Passwort (Supabase Auth)
- [ ] Login-Seite mit E-Mail/Passwort
- [ ] Onboarding-Flow nach erster Registrierung (3 Schritte):
  - Schritt 1: Willkommen + Name der Nutzerin
  - Schritt 2: Datum des positiven Tests + Arbeitsname des Kindes
  - Schritt 3: Errechneter Geburtstermin (ET) + Bestätigung
- [ ] SSW wird automatisch aus dem ET berechnet und im Profil angezeigt
- [ ] Profil-Seite mit Bearbeitungsmöglichkeit aller Onboarding-Daten
- [ ] Passwort-Vergessen-Flow (E-Mail Reset)
- [ ] Geschützte Routen: Nicht eingeloggte Nutzer werden zum Login weitergeleitet
- [ ] Account-Löschung möglich (mit Bestätigungsdialog)

## Edge Cases
- Was passiert, wenn der ET in der Vergangenheit liegt? → Validierung mit Hinweis "Bitte prüfe dein Datum"
- Was passiert bei ungültigem Datum des positiven Tests (z.B. nach dem ET)? → Validierungsfehler
- Was wenn die Nutzerin die E-Mail-Bestätigung nicht erhält? → Link zur Hilfe + "E-Mail erneut senden"
- Was wenn jemand bereits einen Account hat und sich nochmals registriert? → Supabase gibt Fehler zurück, Hinweis "E-Mail bereits registriert"
- Was wenn der ET per Ultraschall korrigiert wird? → Profil-Bearbeitung möglich, SSW wird neu berechnet

## Technical Requirements
- Security: Supabase Auth (Row Level Security aktiviert)
- Validierung: Zod-Schemas für alle Formulare
- SSW-Berechnung: `Math.floor((ET - heute) / 7)` → aktuelle SSW = `40 - Wochen bis ET`
- Passwörter: Min. 8 Zeichen, keine Speicherung im Klartext (Supabase-Standard)
- Profildaten in Supabase-Tabelle `profiles` (user_id, name, baby_name, positive_test_date, due_date)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Seiten & Komponenten-Struktur

```
/login                          ← Öffentlich
+-- LoginForm
    +-- E-Mail-Feld
    +-- Passwort-Feld
    +-- "Anmelden"-Button
    +-- "Passwort vergessen?"-Link
    +-- "Noch kein Account?"-Link → /register

/register                       ← Öffentlich
+-- RegisterForm
    +-- E-Mail-Feld
    +-- Passwort-Feld
    +-- "Account erstellen"-Button
    +-- "Bereits registriert?"-Link → /login

/onboarding                     ← Nur nach erster Registrierung
+-- SchrittAnzeige (1 / 2 / 3)
+-- Schritt 1: Willkommen
    +-- Vorname der Nutzerin
+-- Schritt 2: Baby-Details
    +-- Datum des positiven Tests (Datumsfeld)
    +-- Arbeitsname des Kindes
+-- Schritt 3: Geburtstermin
    +-- Errechneter Geburtstermin (ET) — Datumsfeld
    +-- SSW-Vorschau: "Du bist in SSW 12 🎉"
    +-- "Alles fertig!"-Button

/dashboard                      ← Geschützt (Login erforderlich)
+-- Begrüßung ("Hallo [Name], du bist in SSW [X]")
+-- Navigation zu Hauptbereichen (Geburtsplan, Tipps, Partner)

/profil                         ← Geschützt
+-- ProfilFormular (alle Onboarding-Daten editierbar)
    +-- Vorname, Babyname, Test-Datum, ET
    +-- "Speichern"-Button
+-- Danger Zone
    +-- "Account löschen"-Button (mit Bestätigungsdialog)

/passwort-vergessen             ← Öffentlich
+-- E-Mail-Feld + "Link senden"-Button
```

### Datenmodell

**Supabase Auth** (eingebaut): E-Mail, Passwort (verschlüsselt), Login-Session

**Profil-Tabelle** (eigene Datenbanktabelle — eine Zeile pro Nutzerin):
- Vorname der Nutzerin
- Arbeitsname des Kindes
- Datum des positiven Tests
- Errechneter Geburtstermin (ET)
- Erstellt am / Zuletzt geändert am

**SSW wird nicht gespeichert** — wird immer live berechnet: `aktuelle SSW = 40 − (Tage bis ET ÷ 7)`

### Tech-Entscheidungen

| Entscheidung | Warum |
|---|---|
| Supabase Auth | Login, Registrierung, Passwort-Reset out-of-the-box — keine eigene Auth-Logik nötig |
| Next.js Middleware | Schützt `/dashboard` und `/profil` automatisch — unauthentifizierte Nutzer → /login |
| `@supabase/ssr` | Supabase-Auth SSR-kompatibel für Next.js (Sessions serverseitig zuverlässig) |
| Zod + react-hook-form | Formularvalidierung — bereits installiert |
| Natives Datumsfeld | `input type="date"` — kein extra Paket, funktioniert auf Mobile |

### Neue Abhängigkeiten

| Paket | Zweck |
|---|---|
| `@supabase/ssr` | Supabase-Auth serverseitig (Next.js SSR-kompatibel) |

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
