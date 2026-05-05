# Product Requirements Document

## Vision
MamaMap begleitet werdende Mütter (und ihre Partner) von der ersten positiven Linie bis ins Wochenbett. Die App strukturiert die emotionale und praktische Reise der Schwangerschaft, gibt phasengerechte Impulse und hilft dabei, gemeinsam einen persönlichen Geburtsplan zu erstellen.

## Target Users

**Primäre Nutzer: Werdende Mütter**
- Frauen jeder Altersgruppe, kurz nach positivem Schwangerschaftstest
- Bedürfnis: Orientierung und Sicherheit in einer aufregenden, manchmal überwältigenden Zeit
- Schmerzpunkt: Informationsflut, fehlende persönliche Begleitung, Unsicherheit bei Geburtsplanentscheidungen

**Sekundäre Nutzer: Partner**
- Wollen unterstützen, wissen aber oft nicht wie
- Bedürfnis: Klare, verständliche Tipps was jetzt wichtig ist
- Schmerzpunkt: Fühlen sich ausgeschlossen oder überfordert

## Core Features (Roadmap)

| Priority | Feature | Status |
|----------|---------|--------|
| P0 (MVP) | User Onboarding & Profil | Planned |
| P0 (MVP) | Geburtsplan-Wizard | Planned |
| P1 | Tägliches Tipp-Popup | Planned |
| P2 | Partner-Bereich | Planned |

## Success Metrics
- Abschlussrate des Geburtsplan-Wizards > 60%
- Täglich aktive Nutzerinnen (DAU) > 40% der registrierten Nutzer
- PDF-Exports pro Woche als Indikator für tatsächliche Nutzung
- NPS (Weiterempfehlungsrate) > 50

## Constraints
- Team: 1 Entwickler (Claude-unterstützt)
- Tech-Stack: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Supabase
- Phase 1 (MVP): Onboarding + Geburtsplan-Wizard
- Phase 2: Tipp-Popup + Partner-Bereich

## Non-Goals
- Keine medizinische Beratung oder Diagnose
- Keine Anbindung an Krankenhaus- oder Arzt-Systeme
- Keine native Mobile App (zunächst nur Web/PWA)
- Keine Community-Funktionen (Forum, Chat)
- Kein Wochenbett-Tracking nach der Geburt (vorerst)

---

Use `/requirements` to create detailed feature specifications for each item in the roadmap above.
