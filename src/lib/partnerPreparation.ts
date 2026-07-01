/**
 * Partner-Vorbereitungs-Tracker
 *
 * Kuratierte Bibliothek konkreter, zeitkritischer Aufgaben, die der Partner
 * in der Schwangerschaft und im Wochenbett erledigen kann. Jede Aufgabe hat
 * eine deadlineSsw (Woche bis zu der sie erledigt sein sollte) und optional
 * einen erklärenden Hinweistext.
 *
 * Konzept: Der Partner sieht "Was ist als nächstes dran?" — sortiert nach
 * Fälligkeit relativ zur aktuellen SSW. Aus jeder Prep-Task kann er per
 * Tap ein partner_todos-Item anlegen, das dann im normalen Todo-Block
 * lebt und von der Mama gesehen/mitgeprüft werden kann.
 */

export type PreparationCategory =
  | 'behoerdlich'
  | 'gesundheit'
  | 'wohnen'
  | 'geburt'
  | 'wochenbett'
  | 'emotional'

export interface PreparationTask {
  id: string
  title: string
  description: string
  category: PreparationCategory
  /** SSW bis zu der die Aufgabe erledigt sein sollte. */
  deadlineSsw: number
  /** Optional: SSW ab der es sinnvoll ist, damit anzufangen. */
  earliestSsw?: number
  /** Emoji für die Kachel. */
  emoji: string
}

export const PREPARATION_TASKS: PreparationTask[] = [
  // 1. Trimester (SSW 1-13) — behördlich + gesundheitlich
  {
    id: 'gyn-termin-mit',
    title: 'Beim ersten Frauenarzt-Termin dabei sein',
    description:
      'Der erste Termin ist emotional groß. Nur dein Da-Sein zählt — Fragen kannst du auch später schriftlich nachreichen.',
    category: 'gesundheit',
    deadlineSsw: 12,
    earliestSsw: 5,
    emoji: '👨‍⚕️',
  },
  {
    id: 'ersttrimester-info',
    title: 'Über Ersttrimester-Screening informieren',
    description:
      'Zwischen SSW 11 und 14. Optional. Sprecht gemeinsam ob ihr das machen wollt — die Entscheidung sollte nicht bei ihr allein liegen.',
    category: 'gesundheit',
    deadlineSsw: 11,
    emoji: '🔬',
  },
  {
    id: 'krankenversicherung',
    title: 'Krankenversicherung informieren',
    description:
      'Sag deiner KV Bescheid, dass ihr ein Baby erwartet. Bei manchen KVs gibt es zusätzliche Vorsorge-Leistungen, die Extra beantragt werden müssen.',
    category: 'behoerdlich',
    deadlineSsw: 15,
    emoji: '🏥',
  },

  // 2. Trimester (SSW 14-27) — behördlich + Kurs + Wohnen
  {
    id: 'geburtsvorbereitung',
    title: 'Geburtsvorbereitungskurs anmelden',
    description:
      'Kurse sind oft ab SSW 24-28 und schnell voll. Melde jetzt an. Frag ob es einen Partner-Tag gibt oder ob ihr das komplett zu zweit macht.',
    category: 'geburt',
    deadlineSsw: 20,
    earliestSsw: 14,
    emoji: '🧘',
  },
  {
    id: 'kita-voranmeldung',
    title: 'Kita-Voranmeldung',
    description:
      'In vielen Städten ist die Warteliste 1-2 Jahre. Erkundige dich in eurer Stadt was üblich ist und melde vorsorglich in 2-3 Kitas an.',
    category: 'behoerdlich',
    deadlineSsw: 25,
    earliestSsw: 15,
    emoji: '🎒',
  },
  {
    id: 'namensgespraech',
    title: 'Namensgespräch führen',
    description:
      'Auch wenn ihr denkt "haben wir schon geklärt" — führt ein bewusstes Gespräch. Welche Namen sind für dich Herzensnamen, welche Nogos, warum?',
    category: 'emotional',
    deadlineSsw: 30,
    emoji: '📝',
  },
  {
    id: 'babyzimmer',
    title: 'Babyzimmer / Schlafplatz vorbereiten',
    description:
      'Wickeltisch, Beistellbett, Schrank. Sie soll in den letzten Wochen NICHT Möbel schleppen — das ist deine Aufgabe.',
    category: 'wohnen',
    deadlineSsw: 32,
    earliestSsw: 24,
    emoji: '🛏️',
  },

  // 3. Trimester (SSW 28-40) — Geburt + Wochenbett + behördlich
  {
    id: 'elternzeit-arbeitgeber',
    title: 'Elternzeit beim Arbeitgeber anmelden',
    description:
      'Muss spätestens 7 Wochen vor Beginn schriftlich beim AG sein. Bei 2 Monaten ab Geburt = SSW 33. Formuliere klar wie lange du willst.',
    category: 'behoerdlich',
    deadlineSsw: 33,
    earliestSsw: 25,
    emoji: '💼',
  },
  {
    id: 'krankenhaus-anmeldung',
    title: 'Krankenhaus zur Geburt anmelden',
    description:
      'Voranmeldung meist in SSW 30-34. Oft mit Vorstellungsabend. Frag ob du bei allem dabei sein darfst — auch bei Kaiserschnitt.',
    category: 'geburt',
    deadlineSsw: 34,
    earliestSsw: 28,
    emoji: '🏥',
  },
  {
    id: 'autositz',
    title: 'Baby-Autositz kaufen + einbauen',
    description:
      'ADAC-Testsieger checken. Wichtig: Einbau vorher üben. Bei der Entlassung braucht ihr den — ohne Sitz keine Heimfahrt.',
    category: 'wohnen',
    deadlineSsw: 33,
    emoji: '🚗',
  },
  {
    id: 'krankenhaustasche-partner',
    title: 'Deine eigene Tasche packen',
    description:
      'Bequeme Klamotten, Snacks, Ladekabel, Kopfhörer, Wechselwäsche. Du bleibst evtl. 12+ Stunden — sei vorbereitet.',
    category: 'geburt',
    deadlineSsw: 35,
    earliestSsw: 30,
    emoji: '🎒',
  },
  {
    id: 'wichtige-nummern',
    title: 'Wichtige Nummern speichern',
    description:
      'Kreißsaal-Direktleitung, Hebamme, Kinderarzt, Nachbetreuung. Auch fest im Auto lassen. Screenshot geht bei Aufregung schnell verloren.',
    category: 'geburt',
    deadlineSsw: 34,
    emoji: '📞',
  },
  {
    id: 'meldeamt-baby',
    title: 'Über Baby-Anmeldung informieren',
    description:
      'Nach Geburt hast du 7 Tage. Standesamt (Geburtsurkunde), Krankenkasse (Familienversicherung), Elterngeld, Kindergeld — plane die Woche danach schon jetzt.',
    category: 'behoerdlich',
    deadlineSsw: 38,
    earliestSsw: 32,
    emoji: '📋',
  },
  {
    id: 'wochenbett-helfer',
    title: 'Wochenbett-Helfer:innen organisieren',
    description:
      'Wer bringt Essen? Wer kauft ein? Wer putzt? Nutzt den Wochenbett-Chef in MamaMap — organisiert das JETZT, nicht wenn ihr schon erschöpft seid.',
    category: 'wochenbett',
    deadlineSsw: 36,
    earliestSsw: 30,
    emoji: '🤝',
  },
  {
    id: 'wochenbett-plan',
    title: 'Wochenbett-Plan besprechen',
    description:
      'Wer schläft wo? Wer trägt Baby wann? Wer kocht? Es hilft riesig, wenn du weißt was in Woche 1-2 auf dich zukommt und einen groben Plan hast.',
    category: 'wochenbett',
    deadlineSsw: 37,
    emoji: '💞',
  },
  {
    id: 'elterngeld',
    title: 'Elterngeld-Antrag vorbereiten',
    description:
      'Formulare sind lang. Verdienstbescheinigungen, Lohnabrechnungen, Bankdaten. Sammle jetzt schon alles zusammen — antrag geht direkt nach Geburt.',
    category: 'behoerdlich',
    deadlineSsw: 39,
    earliestSsw: 33,
    emoji: '💶',
  },
  {
    id: 'schild-fuer-tuer',
    title: 'Ruhe-Schild für die Wohnungstür',
    description:
      '"Bitte nicht klingeln — wir schlafen". Klingt banal, wirkt Wunder. Auch für den Nachbarn ein Hinweis dass ihr jetzt Wochenbett habt.',
    category: 'wochenbett',
    deadlineSsw: 39,
    emoji: '🔕',
  },
]

/**
 * Sortiert die Tasks nach Dringlichkeit relativ zur aktuellen SSW.
 * Überfällige zuerst, dann nach deadlineSsw aufsteigend.
 */
export function sortByRelevance(tasks: PreparationTask[], currentSsw: number): PreparationTask[] {
  return [...tasks].sort((a, b) => {
    const aOverdue = a.deadlineSsw < currentSsw
    const bOverdue = b.deadlineSsw < currentSsw
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1
    return a.deadlineSsw - b.deadlineSsw
  })
}

/**
 * Filtert Tasks: nur die zeigen, die noch nicht "zu früh" sind (earliestSsw prüfen).
 */
export function activeTasks(currentSsw: number): PreparationTask[] {
  return PREPARATION_TASKS.filter((t) => !t.earliestSsw || currentSsw >= t.earliestSsw)
}

export const PREP_CATEGORY_LABELS: Record<PreparationCategory, string> = {
  behoerdlich: 'Behördlich',
  gesundheit: 'Gesundheit',
  wohnen: 'Wohnen',
  geburt: 'Geburt',
  wochenbett: 'Wochenbett',
  emotional: 'Emotional',
}

export const PREP_CATEGORY_COLORS: Record<PreparationCategory, string> = {
  behoerdlich: 'hsl(215 45% 45%)',
  gesundheit: 'hsl(140 40% 40%)',
  wohnen: 'hsl(30 55% 50%)',
  geburt: 'hsl(340 55% 50%)',
  wochenbett: 'hsl(280 40% 50%)',
  emotional: 'hsl(50 55% 45%)',
}
