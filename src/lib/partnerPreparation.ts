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

/**
 * Locale-aware category labels. Consumers (client or server) should call
 * `getPreparationCategoryLabel(cat, locale)` instead of reading the raw
 * `PREP_CATEGORY_LABELS` record when i18n matters.
 */
export const PREP_CATEGORY_TRANSLATIONS: Record<
  PreparationCategory,
  Record<'de' | 'en', string>
> = {
  behoerdlich: { de: 'Behördlich', en: 'Administrative' },
  gesundheit: { de: 'Gesundheit', en: 'Health' },
  wohnen: { de: 'Wohnen', en: 'Housing' },
  geburt: { de: 'Geburt', en: 'Birth' },
  wochenbett: { de: 'Wochenbett', en: 'Postpartum' },
  emotional: { de: 'Emotional', en: 'Emotional' },
}

export function getPreparationCategoryLabel(
  category: PreparationCategory,
  locale: 'de' | 'en',
): string {
  const entry = PREP_CATEGORY_TRANSLATIONS[category]
  return entry?.[locale] ?? PREP_CATEGORY_LABELS[category]
}

/**
 * Locale-aware title / description overrides for every preparation task.
 * The German original in PREPARATION_TASKS remains the fallback if a key is
 * missing here. Consumers should use `getPreparationTitle(id, locale)` and
 * `getPreparationDescription(id, locale)` instead of reading `task.title` /
 * `task.description` directly.
 */
export const PREP_TRANSLATIONS: Record<
  string,
  { title: Record<'de' | 'en', string>; description: Record<'de' | 'en', string> }
> = {
  'gyn-termin-mit': {
    title: {
      de: 'Beim ersten Frauenarzt-Termin dabei sein',
      en: 'Come to the first OB-GYN appointment',
    },
    description: {
      de: 'Der erste Termin ist emotional groß. Nur dein Da-Sein zählt — Fragen kannst du auch später schriftlich nachreichen.',
      en: 'The first appointment carries a lot of emotion. Simply being there is what matters — you can send in questions later in writing.',
    },
  },
  'ersttrimester-info': {
    title: {
      de: 'Über Ersttrimester-Screening informieren',
      en: 'Learn about first-trimester screening',
    },
    description: {
      de: 'Zwischen SSW 11 und 14. Optional. Sprecht gemeinsam ob ihr das machen wollt — die Entscheidung sollte nicht bei ihr allein liegen.',
      en: 'Between week 11 and 14. Optional. Talk it through together — the decision shouldn\'t rest on her alone.',
    },
  },
  'krankenversicherung': {
    title: {
      de: 'Krankenversicherung informieren',
      en: 'Notify your health insurance',
    },
    description: {
      de: 'Sag deiner KV Bescheid, dass ihr ein Baby erwartet. Bei manchen KVs gibt es zusätzliche Vorsorge-Leistungen, die Extra beantragt werden müssen.',
      en: 'Let your insurer know you are expecting. Some plans offer extra prenatal benefits that need to be requested explicitly.',
    },
  },
  'geburtsvorbereitung': {
    title: {
      de: 'Geburtsvorbereitungskurs anmelden',
      en: 'Sign up for a childbirth prep class',
    },
    description: {
      de: 'Kurse sind oft ab SSW 24-28 und schnell voll. Melde jetzt an. Frag ob es einen Partner-Tag gibt oder ob ihr das komplett zu zweit macht.',
      en: 'Classes start around week 24-28 and fill up fast. Sign up now. Ask whether there is a partner day or if you go together.',
    },
  },
  'kita-voranmeldung': {
    title: {
      de: 'Kita-Voranmeldung',
      en: 'Pre-register for daycare',
    },
    description: {
      de: 'In vielen Städten ist die Warteliste 1-2 Jahre. Erkundige dich in eurer Stadt was üblich ist und melde vorsorglich in 2-3 Kitas an.',
      en: 'In many cities the waiting list runs 1-2 years. Find out what is standard in your town and register in 2-3 daycares just in case.',
    },
  },
  'namensgespraech': {
    title: {
      de: 'Namensgespräch führen',
      en: 'Have the name conversation',
    },
    description: {
      de: 'Auch wenn ihr denkt "haben wir schon geklärt" — führt ein bewusstes Gespräch. Welche Namen sind für dich Herzensnamen, welche Nogos, warum?',
      en: 'Even if you think "we already agreed" — have a proper talk. Which names are dear to you, which are no-gos, and why?',
    },
  },
  'babyzimmer': {
    title: {
      de: 'Babyzimmer / Schlafplatz vorbereiten',
      en: 'Prepare the nursery / sleeping spot',
    },
    description: {
      de: 'Wickeltisch, Beistellbett, Schrank. Sie soll in den letzten Wochen NICHT Möbel schleppen — das ist deine Aufgabe.',
      en: 'Changing table, bedside crib, wardrobe. She should NOT be hauling furniture in the last weeks — that\'s your job.',
    },
  },
  'elternzeit-arbeitgeber': {
    title: {
      de: 'Elternzeit beim Arbeitgeber anmelden',
      en: 'Request parental leave from your employer',
    },
    description: {
      de: 'Muss spätestens 7 Wochen vor Beginn schriftlich beim AG sein. Bei 2 Monaten ab Geburt = SSW 33. Formuliere klar wie lange du willst.',
      en: 'Must be filed in writing at least 7 weeks before it starts. For 2 months from birth that means week 33. Be clear about how long you want.',
    },
  },
  'krankenhaus-anmeldung': {
    title: {
      de: 'Krankenhaus zur Geburt anmelden',
      en: 'Register at the hospital for the birth',
    },
    description: {
      de: 'Voranmeldung meist in SSW 30-34. Oft mit Vorstellungsabend. Frag ob du bei allem dabei sein darfst — auch bei Kaiserschnitt.',
      en: 'Pre-registration usually happens in week 30-34, often with an info evening. Ask whether you can be present for everything — including a C-section.',
    },
  },
  'autositz': {
    title: {
      de: 'Baby-Autositz kaufen + einbauen',
      en: 'Buy and install the baby car seat',
    },
    description: {
      de: 'ADAC-Testsieger checken. Wichtig: Einbau vorher üben. Bei der Entlassung braucht ihr den — ohne Sitz keine Heimfahrt.',
      en: 'Check consumer safety winners. Important: practice the install first. You need it at discharge — no seat, no ride home.',
    },
  },
  'krankenhaustasche-partner': {
    title: {
      de: 'Deine eigene Tasche packen',
      en: 'Pack your own hospital bag',
    },
    description: {
      de: 'Bequeme Klamotten, Snacks, Ladekabel, Kopfhörer, Wechselwäsche. Du bleibst evtl. 12+ Stunden — sei vorbereitet.',
      en: 'Comfortable clothes, snacks, charging cable, headphones, spare underwear. You may stay 12+ hours — be prepared.',
    },
  },
  'wichtige-nummern': {
    title: {
      de: 'Wichtige Nummern speichern',
      en: 'Save the important phone numbers',
    },
    description: {
      de: 'Kreißsaal-Direktleitung, Hebamme, Kinderarzt, Nachbetreuung. Auch fest im Auto lassen. Screenshot geht bei Aufregung schnell verloren.',
      en: 'Direct line to labor & delivery, midwife, pediatrician, aftercare. Keep them in the car too. A screenshot gets lost easily in the rush.',
    },
  },
  'meldeamt-baby': {
    title: {
      de: 'Über Baby-Anmeldung informieren',
      en: 'Learn how to register the baby',
    },
    description: {
      de: 'Nach Geburt hast du 7 Tage. Standesamt (Geburtsurkunde), Krankenkasse (Familienversicherung), Elterngeld, Kindergeld — plane die Woche danach schon jetzt.',
      en: 'You have 7 days after birth. Registry office (birth certificate), insurer (family coverage), parental allowance, child benefit — plan the week ahead now.',
    },
  },
  'wochenbett-helfer': {
    title: {
      de: 'Wochenbett-Helfer:innen organisieren',
      en: 'Organize postpartum helpers',
    },
    description: {
      de: 'Wer bringt Essen? Wer kauft ein? Wer putzt? Nutzt den Wochenbett-Chef in MamaMap — organisiert das JETZT, nicht wenn ihr schon erschöpft seid.',
      en: 'Who brings food? Who does groceries? Who cleans? Use the postpartum captain in MamaMap — organize this NOW, not when you\'re already exhausted.',
    },
  },
  'wochenbett-plan': {
    title: {
      de: 'Wochenbett-Plan besprechen',
      en: 'Talk through your postpartum plan',
    },
    description: {
      de: 'Wer schläft wo? Wer trägt Baby wann? Wer kocht? Es hilft riesig, wenn du weißt was in Woche 1-2 auf dich zukommt und einen groben Plan hast.',
      en: 'Who sleeps where? Who carries the baby when? Who cooks? It helps enormously to know what week 1-2 will look like and have a rough plan.',
    },
  },
  'elterngeld': {
    title: {
      de: 'Elterngeld-Antrag vorbereiten',
      en: 'Prepare the parental allowance application',
    },
    description: {
      de: 'Formulare sind lang. Verdienstbescheinigungen, Lohnabrechnungen, Bankdaten. Sammle jetzt schon alles zusammen — antrag geht direkt nach Geburt.',
      en: 'The forms are long. Income statements, pay slips, banking details. Gather everything now — the application goes in right after birth.',
    },
  },
  'schild-fuer-tuer': {
    title: {
      de: 'Ruhe-Schild für die Wohnungstür',
      en: 'Quiet sign for the front door',
    },
    description: {
      de: '"Bitte nicht klingeln — wir schlafen". Klingt banal, wirkt Wunder. Auch für den Nachbarn ein Hinweis dass ihr jetzt Wochenbett habt.',
      en: '"Please don\'t ring — we\'re sleeping." Sounds trivial, works wonders. Also signals to neighbors that you\'re in postpartum mode.',
    },
  },
}

export function getPreparationTitle(id: string, locale: 'de' | 'en'): string {
  const entry = PREP_TRANSLATIONS[id]
  if (entry) return entry.title[locale] ?? entry.title.de
  const fallback = PREPARATION_TASKS.find((t) => t.id === id)
  return fallback?.title ?? id
}

export function getPreparationDescription(id: string, locale: 'de' | 'en'): string {
  const entry = PREP_TRANSLATIONS[id]
  if (entry) return entry.description[locale] ?? entry.description.de
  const fallback = PREPARATION_TASKS.find((t) => t.id === id)
  return fallback?.description ?? ''
}
