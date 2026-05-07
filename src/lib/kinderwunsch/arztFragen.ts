export type ArztFrage = {
  id: string
  emoji: string
  text: string
  kategorie: 'fruchtbarkeit' | 'gesundheit' | 'medikamente' | 'genetik' | 'lifestyle'
}

export const ARZT_FRAGEN: ArztFrage[] = [
  // Fruchtbarkeit & Zyklus
  { id: 'af-1', emoji: '🌱', kategorie: 'fruchtbarkeit', text: 'Was kann ich konkret tun, um meine Fruchtbarkeit zu unterstützen?' },
  { id: 'af-2', emoji: '📅', kategorie: 'fruchtbarkeit', text: 'Mein Zyklus ist unregelmäßig — was bedeutet das und was kann ich tun?' },
  { id: 'af-3', emoji: '🔬', kategorie: 'fruchtbarkeit', text: 'Ab wann sollten wir uns Sorgen machen, wenn es nicht klappt?' },
  { id: 'af-4', emoji: '👁️', kategorie: 'fruchtbarkeit', text: 'Wie kann ich meinen Eisprung am besten erkennen?' },
  { id: 'af-5', emoji: '👫', kategorie: 'fruchtbarkeit', text: 'Sollten wir als Paar gemeinsam zur Untersuchung — auch wenn keine Diagnose vorliegt?' },

  // Gesundheit
  { id: 'af-6', emoji: '💊', kategorie: 'gesundheit', text: 'Brauche ich zusätzliche Vitamine oder Mineralien neben Folsäure?' },
  { id: 'af-7', emoji: '⚖️', kategorie: 'gesundheit', text: 'Ist mein BMI im optimalen Bereich für eine Schwangerschaft?' },
  { id: 'af-8', emoji: '🩸', kategorie: 'gesundheit', text: 'Sollte ich vorab Schilddrüse, Eisen, Vitamin D, B12 prüfen lassen?' },
  { id: 'af-9', emoji: '💉', kategorie: 'gesundheit', text: 'Welche Impfungen sollte ich vor einer Schwangerschaft auffrischen?' },

  // Medikamente
  { id: 'af-10', emoji: '⚠️', kategorie: 'medikamente', text: 'Welche meiner Medikamente sind in einer Schwangerschaft problematisch — und gibt es Alternativen?' },
  { id: 'af-11', emoji: '🌿', kategorie: 'medikamente', text: 'Welche pflanzlichen Mittel oder Tees sollte ich beim Versuchen meiden?' },

  // Genetik & Vorerkrankungen
  { id: 'af-12', emoji: '🧬', kategorie: 'genetik', text: 'Sollten wir eine genetische Beratung in Anspruch nehmen?' },
  { id: 'af-13', emoji: '🧪', kategorie: 'genetik', text: 'Welche Vorsorgeuntersuchungen werden später in der SS gemacht — und wann?' },
  { id: 'af-14', emoji: '🩺', kategorie: 'genetik', text: 'Wie wirkt sich meine Vorerkrankung auf eine Schwangerschaft aus?' },

  // Lifestyle
  { id: 'af-15', emoji: '🏃', kategorie: 'lifestyle', text: 'Welche Sportarten sind in der Schwangerschaft empfehlenswert?' },
  { id: 'af-16', emoji: '☕', kategorie: 'lifestyle', text: 'Wie viel Koffein, Alkohol, Süßstoff darf ich in der frühen SS noch?' },
  { id: 'af-17', emoji: '💼', kategorie: 'lifestyle', text: 'Mein Job hat Risiken (Schichtarbeit / Chemikalien / schweres Heben) — was muss ich beachten?' },
  { id: 'af-18', emoji: '🌡️', kategorie: 'lifestyle', text: 'Sauna, Hot-Tub, Solarium — was ist tabu und ab wann?' },
]

export const ARZT_KATEGORIE_LABELS: Record<ArztFrage['kategorie'], string> = {
  fruchtbarkeit: '🌱 Fruchtbarkeit & Zyklus',
  gesundheit: '🩺 Allgemeine Gesundheit',
  medikamente: '💊 Medikamente',
  genetik: '🧬 Genetik & Vorerkrankungen',
  lifestyle: '🌿 Lifestyle',
}
