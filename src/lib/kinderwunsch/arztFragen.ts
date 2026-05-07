import type { LocalizedString } from '@/lib/i18n/localized'

export type ArztFrage = {
  id: string
  emoji: string
  text: LocalizedString
  kategorie: 'fruchtbarkeit' | 'gesundheit' | 'medikamente' | 'genetik' | 'lifestyle'
}

export const ARZT_FRAGEN: ArztFrage[] = [
  // Fruchtbarkeit & Zyklus
  {
    id: 'af-1',
    emoji: '🌱',
    kategorie: 'fruchtbarkeit',
    text: {
      de: 'Was kann ich konkret tun, um meine Fruchtbarkeit zu unterstützen?',
      en: 'What concrete steps can I take to support my fertility?',
    },
  },
  {
    id: 'af-2',
    emoji: '📅',
    kategorie: 'fruchtbarkeit',
    text: {
      de: 'Mein Zyklus ist unregelmäßig — was bedeutet das und was kann ich tun?',
      en: 'My cycle is irregular — what does that mean and what can I do?',
    },
  },
  {
    id: 'af-3',
    emoji: '🔬',
    kategorie: 'fruchtbarkeit',
    text: {
      de: 'Ab wann sollten wir uns Sorgen machen, wenn es nicht klappt?',
      en: 'At what point should we start to worry if it isn\'t happening?',
    },
  },
  {
    id: 'af-4',
    emoji: '👁️',
    kategorie: 'fruchtbarkeit',
    text: {
      de: 'Wie kann ich meinen Eisprung am besten erkennen?',
      en: 'What\'s the best way to identify when I\'m ovulating?',
    },
  },
  {
    id: 'af-5',
    emoji: '👫',
    kategorie: 'fruchtbarkeit',
    text: {
      de: 'Sollten wir als Paar gemeinsam zur Untersuchung — auch wenn keine Diagnose vorliegt?',
      en: 'Should we go in for testing together as a couple — even without a diagnosis?',
    },
  },

  // Gesundheit
  {
    id: 'af-6',
    emoji: '💊',
    kategorie: 'gesundheit',
    text: {
      de: 'Brauche ich zusätzliche Vitamine oder Mineralien neben Folsäure?',
      en: 'Do I need additional vitamins or minerals besides folic acid?',
    },
  },
  {
    id: 'af-7',
    emoji: '⚖️',
    kategorie: 'gesundheit',
    text: {
      de: 'Ist mein BMI im optimalen Bereich für eine Schwangerschaft?',
      en: 'Is my BMI in the optimal range for pregnancy?',
    },
  },
  {
    id: 'af-8',
    emoji: '🩸',
    kategorie: 'gesundheit',
    text: {
      de: 'Sollte ich vorab Schilddrüse, Eisen, Vitamin D, B12 prüfen lassen?',
      en: 'Should I have my thyroid, iron, vitamin D, and B12 levels checked beforehand?',
    },
  },
  {
    id: 'af-9',
    emoji: '💉',
    kategorie: 'gesundheit',
    text: {
      de: 'Welche Impfungen sollte ich vor einer Schwangerschaft auffrischen?',
      en: 'Which vaccinations should I refresh before pregnancy?',
    },
  },

  // Medikamente
  {
    id: 'af-10',
    emoji: '⚠️',
    kategorie: 'medikamente',
    text: {
      de: 'Welche meiner Medikamente sind in einer Schwangerschaft problematisch — und gibt es Alternativen?',
      en: 'Which of my medications are problematic during pregnancy — and are there alternatives?',
    },
  },
  {
    id: 'af-11',
    emoji: '🌿',
    kategorie: 'medikamente',
    text: {
      de: 'Welche pflanzlichen Mittel oder Tees sollte ich beim Versuchen meiden?',
      en: 'Which herbal remedies or teas should I avoid while trying to conceive?',
    },
  },

  // Genetik & Vorerkrankungen
  {
    id: 'af-12',
    emoji: '🧬',
    kategorie: 'genetik',
    text: {
      de: 'Sollten wir eine genetische Beratung in Anspruch nehmen?',
      en: 'Should we get genetic counseling?',
    },
  },
  {
    id: 'af-13',
    emoji: '🧪',
    kategorie: 'genetik',
    text: {
      de: 'Welche Vorsorgeuntersuchungen werden später in der SS gemacht — und wann?',
      en: 'Which prenatal screenings will be done later in pregnancy — and when?',
    },
  },
  {
    id: 'af-14',
    emoji: '🩺',
    kategorie: 'genetik',
    text: {
      de: 'Wie wirkt sich meine Vorerkrankung auf eine Schwangerschaft aus?',
      en: 'How will my pre-existing condition affect pregnancy?',
    },
  },

  // Lifestyle
  {
    id: 'af-15',
    emoji: '🏃',
    kategorie: 'lifestyle',
    text: {
      de: 'Welche Sportarten sind in der Schwangerschaft empfehlenswert?',
      en: 'Which kinds of exercise are recommended during pregnancy?',
    },
  },
  {
    id: 'af-16',
    emoji: '☕',
    kategorie: 'lifestyle',
    text: {
      de: 'Wie viel Koffein, Alkohol, Süßstoff darf ich in der frühen SS noch?',
      en: 'How much caffeine, alcohol, or sweetener is still okay in early pregnancy?',
    },
  },
  {
    id: 'af-17',
    emoji: '💼',
    kategorie: 'lifestyle',
    text: {
      de: 'Mein Job hat Risiken (Schichtarbeit / Chemikalien / schweres Heben) — was muss ich beachten?',
      en: 'My job involves risks (shift work / chemicals / heavy lifting) — what should I watch out for?',
    },
  },
  {
    id: 'af-18',
    emoji: '🌡️',
    kategorie: 'lifestyle',
    text: {
      de: 'Sauna, Hot-Tub, Solarium — was ist tabu und ab wann?',
      en: 'Sauna, hot tub, tanning bed — what\'s off-limits, and from when?',
    },
  },
]

export const ARZT_KATEGORIE_LABELS: Record<ArztFrage['kategorie'], LocalizedString> = {
  fruchtbarkeit: { de: '🌱 Fruchtbarkeit & Zyklus', en: '🌱 Fertility & cycle' },
  gesundheit: { de: '🩺 Allgemeine Gesundheit', en: '🩺 General health' },
  medikamente: { de: '💊 Medikamente', en: '💊 Medications' },
  genetik: { de: '🧬 Genetik & Vorerkrankungen', en: '🧬 Genetics & pre-existing conditions' },
  lifestyle: { de: '🌿 Lifestyle', en: '🌿 Lifestyle' },
}
