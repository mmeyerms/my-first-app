export type QuestionType = 'single' | 'multi' | 'text'

export interface Question {
  id: string
  stage: 1 | 2 | 3
  label: string
  type: QuestionType
  options?: string[]
  optional?: boolean
}

export const QUESTIONS: Question[] = [
  // Stufe 1 — Kern (immer sichtbar)
  { id: 'location', stage: 1, label: 'Wo möchtest du gebären?', type: 'single', options: ['Krankenhaus', 'Geburtshaus', 'Hausgeburt', 'Noch nicht entschieden'] },
  { id: 'companions', stage: 1, label: 'Wer soll bei der Geburt dabei sein?', type: 'multi', options: ['Partner/in', 'Doula', 'Freundin / Vertraute Person', 'Nur das medizinische Team'] },
  { id: 'pain_management', stage: 1, label: 'Wie möchtest du mit Schmerzen umgehen?', type: 'multi', options: ['PDA (Periduralanästhesie)', 'Wasser (Badewanne / Dusche)', 'TENS-Gerät', 'Hypnobirthing', 'Lachgas', 'Offen – je nach Situation', 'Keine Schmerzmittel'] },
  { id: 'wishes', stage: 1, label: 'Was ist dir bei der Geburt am wichtigsten?', type: 'text', optional: true },
  { id: 'no_gos', stage: 1, label: 'Was möchtest du auf keinen Fall?', type: 'text', optional: true },

  // Stufe 2 — Vertiefung (ab SSW 20)
  { id: 'mobility', stage: 2, label: 'Bewegungsfreiheit während der Geburt?', type: 'single', options: ['Sehr wichtig – ich möchte mich frei bewegen', 'Wichtig, aber flexibel', 'Nicht besonders wichtig'] },
  { id: 'episiotomy', stage: 2, label: 'Dammschnitt – deine Wünsche?', type: 'single', options: ['Nur im absoluten Notfall', 'Bitte möglichst vermeiden', 'Ich vertraue dem medizinischen Team', 'Noch nicht entschieden'] },
  { id: 'bonding', stage: 2, label: 'Bonding direkt nach der Geburt?', type: 'multi', options: ['Sofortkontakt (Haut-zu-Haut)', 'Verzögertes Abnabeln', 'Partner/in schneidet die Nabelschnur', 'Wie das Team empfiehlt'] },
  { id: 'breastfeeding', stage: 2, label: 'Stillwunsch?', type: 'single', options: ['Ja, ich möchte stillen', 'Ja, mit Unterstützung durch Hebamme', 'Nein – Flasche geplant', 'Noch nicht entschieden'] },
  { id: 'photography', stage: 2, label: 'Fotos und Videos – was darf wann?', type: 'multi', options: ['Während der Geburt erlaubt', 'Nur beim Moment der Geburt', 'Partner/in darf filmen', 'Erst nach der Geburt', 'Keine Fotos während der Geburt'] },
  { id: 'atmosphere', stage: 2, label: 'Wünsche zur Atmosphäre (Musik, Licht, Duft)?', type: 'text', optional: true },
  { id: 'complications', stage: 2, label: 'Bei Komplikationen (z.B. Kaiserschnitt): Was gilt?', type: 'text', optional: true },

  // Stufe 3 — Wochenbett (ab SSW 32)
  { id: 'room', stage: 3, label: 'Zimmer-Präferenz im Wochenbett?', type: 'single', options: ['Einzel-Zimmer (wenn möglich)', 'Mehrbett-Zimmer ist ok', 'Egal'] },
  { id: 'visitors', stage: 3, label: 'Besuche – wer darf wann kommen?', type: 'text', optional: true },
  { id: 'baby_sleep', stage: 3, label: 'Baby-Schlafplatz?', type: 'single', options: ['Rooming-in (Baby immer bei mir)', 'Säuglingszimmer nachts', 'Flexibel'] },
  { id: 'discharge', stage: 3, label: 'Entlassung aus dem Krankenhaus?', type: 'single', options: ['So früh wie möglich', 'Lieber ein paar Tage länger bleiben', 'Wie empfohlen'] },
  { id: 'midwife', stage: 3, label: 'Wochenbett-Hebamme organisiert?', type: 'single', options: ['Ja, bereits organisiert ✓', 'Noch nicht – brauche Unterstützung', 'Nicht nötig'] },
]

export const STAGE_UNLOCK: Record<1 | 2 | 3, number> = { 1: 0, 2: 20, 3: 32 }

export function getStageQuestions(stage: 1 | 2 | 3): Question[] {
  return QUESTIONS.filter((q) => q.stage === stage)
}

export function countAnswered(answers: Record<string, unknown>, stage: 1 | 2 | 3): number {
  return getStageQuestions(stage).filter((q) => {
    const a = answers[q.id]
    return Array.isArray(a) ? a.length > 0 : typeof a === 'string' && a.trim().length > 0
  }).length
}
