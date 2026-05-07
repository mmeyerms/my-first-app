import type { Locale } from './i18n/types'
import type { LocalizedString } from './i18n/localized'
import { localized } from './i18n/localized'

export type Milestone = {
  ssw: number
  title: LocalizedString
  description: LocalizedString
  emoji: string
}

export const MILESTONES: Milestone[] = [
  {
    ssw: 4,
    emoji: '🌱',
    title: { de: 'Einnistung', en: 'Implantation' },
    description: {
      de: 'Dein Baby hat sich eingenistet — der Beginn einer wunderbaren Reise.',
      en: 'Your baby has implanted — the beginning of a wonderful journey.',
    },
  },
  {
    ssw: 6,
    emoji: '💓',
    title: { de: 'Herzschlag', en: 'Heartbeat' },
    description: {
      de: 'Das Herz deines Babys beginnt zu schlagen — winzig, aber schon da!',
      en: 'Your baby\'s heart starts to beat — tiny, but already there!',
    },
  },
  {
    ssw: 8,
    emoji: '🫘',
    title: { de: 'Körperform', en: 'Body shape' },
    description: {
      de: 'Arme, Beine und Gesichtszüge formen sich. Dein Baby ist jetzt so groß wie eine Bohne.',
      en: 'Arms, legs and facial features are forming. Your baby is now about the size of a bean.',
    },
  },
  {
    ssw: 10,
    emoji: '🤲',
    title: { de: 'Alle Organe angelegt', en: 'All organs in place' },
    description: {
      de: 'Alle wichtigen Organe sind angelegt. Ab jetzt reifen sie aus.',
      en: 'All major organs are in place. From here on, they mature.',
    },
  },
  {
    ssw: 12,
    emoji: '📸',
    title: { de: 'Erstes Ultraschall-Screening', en: 'First ultrasound screening' },
    description: {
      de: 'Erstes Trimester geschafft! Beim Ultraschall siehst du dein Baby richtig.',
      en: 'First trimester complete! On the ultrasound you can really see your baby.',
    },
  },
  {
    ssw: 16,
    emoji: '🐾',
    title: { de: 'Erste Bewegungen', en: 'First movements' },
    description: {
      de: 'Manche Mamas spüren jetzt ein leichtes Flattern — die ersten Tritte des Babys.',
      en: 'Some mums feel a faint flutter now — the baby\'s first kicks.',
    },
  },
  {
    ssw: 20,
    emoji: '🔍',
    title: { de: 'Feindiagnostik', en: 'Anomaly scan' },
    description: {
      de: 'Großer Ultraschall: Organe, Größe, Geschlecht — alles kann jetzt gesehen werden.',
      en: 'Big scan: organs, size, sex — all of it can be seen now.',
    },
  },
  {
    ssw: 24,
    emoji: '🫁',
    title: { de: 'Lebensfähigkeit', en: 'Viability' },
    description: {
      de: 'Ab jetzt wäre dein Baby mit intensivmedizinischer Unterstützung lebensfähig.',
      en: 'From now on your baby would be viable with intensive medical support.',
    },
  },
  {
    ssw: 28,
    emoji: '👁️',
    title: { de: 'Augen öffnen', en: 'Eyes open' },
    description: {
      de: 'Dein Baby öffnet die Augen und kann auf Licht reagieren.',
      en: 'Your baby opens its eyes and can respond to light.',
    },
  },
  {
    ssw: 32,
    emoji: '🧠',
    title: { de: 'Gehirn wächst', en: 'Brain growth' },
    description: {
      de: 'Das Gehirn entwickelt sich rasant. Dein Baby träumt schon!',
      en: 'The brain is developing rapidly. Your baby is already dreaming!',
    },
  },
  {
    ssw: 36,
    emoji: '🔄',
    title: { de: 'Kopflage', en: 'Head-down position' },
    description: {
      de: 'Viele Babys drehen sich jetzt in die Kopflage — bereit für die Geburt.',
      en: 'Many babies turn head-down now — ready for birth.',
    },
  },
  {
    ssw: 37,
    emoji: '✅',
    title: { de: 'Reif geboren', en: 'Full term' },
    description: {
      de: 'Ab jetzt gilt dein Baby als termingerecht — es könnte jeden Moment kommen!',
      en: 'From now on your baby is considered full term — it could come any moment!',
    },
  },
  {
    ssw: 40,
    emoji: '🌸',
    title: { de: 'Errechneter Geburtstermin', en: 'Estimated due date' },
    description: {
      de: 'Der große Tag! Babys kommen wann sie wollen — du bist bereit.',
      en: 'The big day! Babies come when they want — you are ready.',
    },
  },
]

export function getMilestonesUpToSSW(ssw: number): Milestone[] {
  return MILESTONES.filter((m) => m.ssw <= ssw)
}

export function getNextMilestone(ssw: number): Milestone | undefined {
  return MILESTONES.find((m) => m.ssw > ssw)
}

export function getMilestoneTitle(milestone: Milestone, locale: Locale): string {
  return localized(milestone.title, locale)
}

export function getMilestoneDescription(milestone: Milestone, locale: Locale): string {
  return localized(milestone.description, locale)
}
