# PROJ-10 — Push-Notifications

**Status:** In Progress
**Created:** 2026-07-02
**Priority:** P0 (blockiert Retention-Metriken)

## Kurzbeschreibung

Web Push Notifications für drei Anlässe: (a) Wochenwechsel (neue SSW), (b) Termin-Reminder gemäß Nutzer-Einstellung (1h/3h/1d/3d vorher), (c) neue Wochenbett-Helfer:in hat einen Slot übernommen. Läuft im Browser (Chrome, Firefox, Safari 16.4+) und später via Capacitor-Wrapper auf iOS/Android.

## User Stories

1. Als werdende Mutter möchte ich am Wochenwechsel eine Push-Meldung "Du bist jetzt in SSW 24 — Baby ist jetzt so groß wie eine Papaya" erhalten, damit ich die App wieder öffne und den neuen Content sehe.
2. Als Nutzerin möchte ich Termin-Reminder gemäß meiner Einstellung (Standard: 1 Tag vorher) erhalten, damit ich keinen Vorsorge- oder Hebammen-Termin verpasse.
3. Als Wochenbett-Chef möchte ich sofort erfahren wenn jemand einen Hilfe-Slot übernimmt, damit ich mich zeitnah zurückmelden kann.
4. Als Nutzerin möchte ich Push in den Einstellungen granular pro Anlass ein-/ausschalten können (nicht alles auf einmal).

## Acceptance Criteria

- [ ] Web Push funktioniert in Chrome, Firefox, Safari 16.4+
- [ ] VAPID-Keys werden korrekt als Env-Vars geladen (nicht committed)
- [ ] Subscribe-Flow bittet um Berechtigung — nur wenn Nutzer:in aktiv opt-in klickt (keine kalte Prompt-Ausfahrt)
- [ ] Bei Widerruf der Berechtigung wird `push_subscriptions.active` auf false gesetzt (410 Handling)
- [ ] 3 Notification-Typen einzeln aktivierbar in `settings.notifications.push`
- [ ] Cron-Job "Wochenwechsel" läuft täglich 8 Uhr MEZ, checkt wer SSW-Wechsel heute hat
- [ ] Cron-Job "Termin-Reminder" läuft stündlich, respektiert Nutzer:in-Zeitzone
- [ ] Slot-Claim triggert sofortige Push an den Chef (nicht via Cron)
- [ ] Test-Notification-Button in Settings

## Non-Goals (Scope-Grenze)

- Keine iOS-native Push (kommt mit Capacitor-Wrapper in Q4)
- Kein OneSignal / 3rd-party Push-Service — Web Push nativ mit web-push-Package
- Keine Marketing-/Kampagnen-Pushes (nur transaktional relevante)
- Keine Rich-Media-Pushes (Bilder) — nur Text + Icon + Deep-Link

## Technical Approach

**Stack**
- `web-push` Package für Server-Send (Node runtime)
- Service Worker registriert `push`- und `notificationclick`-Handler
- VAPID Public Key im Client (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`), Private Key nur Server-seitig
- Cron via Vercel `vercel.json`

**Neue DB-Tabelle: `push_subscriptions`**
- id (UUID PK), user_id (FK auth.users), endpoint (TEXT UNIQUE), p256dh (TEXT), auth (TEXT), user_agent (TEXT), active (BOOL), created_at, last_used_at
- RLS: `own_subscription_all` (owner CRUD)

**Neue Prefs-Keys** (`user_preferences.settings.notifications.push`)
- `weekChange: boolean` (default true)
- `terminReminder: boolean` (default true)
- `helpSlotClaimed: boolean` (default true)

**Neue API-Routes**
- `POST /api/push/subscribe` — Body: {endpoint, keys}, upsert
- `DELETE /api/push/unsubscribe` — deaktiviert
- `POST /api/push/test` — sendet Test-Notification an eigene Subscriptions
- `POST /api/cron/push-week-change` — daily 8:00 UTC
- `POST /api/cron/push-termin-reminder` — hourly
- Trigger im `POST /api/helfen/[token]/claim`: sendet an owner

## Env Vars (neue)

```
VAPID_PUBLIC_KEY   — im Client als NEXT_PUBLIC_VAPID_PUBLIC_KEY exposed
VAPID_PRIVATE_KEY  — nur Server, niemals im Client
VAPID_SUBJECT      — mailto:hallo@mamamap.app
```

## Implementation Notes

_(wird während Umsetzung aktualisiert)_
