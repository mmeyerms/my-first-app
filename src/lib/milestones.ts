export type Milestone = {
  ssw: number
  title: string
  description: string
  emoji: string
}

export const MILESTONES: Milestone[] = [
  { ssw: 4, emoji: '🌱', title: 'Einnistung', description: 'Dein Baby hat sich eingenistet — der Beginn einer wunderbaren Reise.' },
  { ssw: 6, emoji: '💓', title: 'Herzschlag', description: 'Das Herz deines Babys beginnt zu schlagen — winzig, aber schon da!' },
  { ssw: 8, emoji: '🫘', title: 'Körperform', description: 'Arme, Beine und Gesichtszüge formen sich. Dein Baby ist jetzt so groß wie eine Bohne.' },
  { ssw: 10, emoji: '🤲', title: 'Alle Organe angelegt', description: 'Alle wichtigen Organe sind angelegt. Ab jetzt reifen sie aus.' },
  { ssw: 12, emoji: '📸', title: 'Erstes Ultraschall-Screening', description: 'Erstes Trimester geschafft! Beim Ultraschall siehst du dein Baby richtig.' },
  { ssw: 16, emoji: '🐾', title: 'Erste Bewegungen', description: 'Manche Mamas spüren jetzt ein leichtes Flattern — die ersten Tritte des Babys.' },
  { ssw: 20, emoji: '🔍', title: 'Feindiagnostik', description: 'Großer Ultraschall: Organe, Größe, Geschlecht — alles kann jetzt gesehen werden.' },
  { ssw: 24, emoji: '🫁', title: 'Lebensfähigkeit', description: 'Ab jetzt wäre dein Baby mit intensivmedizinischer Unterstützung lebensfähig.' },
  { ssw: 28, emoji: '👁️', title: 'Augen öffnen', description: 'Dein Baby öffnet die Augen und kann auf Licht reagieren.' },
  { ssw: 32, emoji: '🧠', title: 'Gehirn wächst', description: 'Das Gehirn entwickelt sich rasant. Dein Baby träumt schon!' },
  { ssw: 36, emoji: '🔄', title: 'Kopflage', description: 'Viele Babys drehen sich jetzt in die Kopflage — bereit für die Geburt.' },
  { ssw: 37, emoji: '✅', title: 'Reif geboren', description: 'Ab jetzt gilt dein Baby als termingerecht — es könnte jeden Moment kommen!' },
  { ssw: 40, emoji: '🌸', title: 'Errechneter Geburtstermin', description: 'Der große Tag! Babys kommen wann sie wollen — du bist bereit.' },
]

export function getMilestonesUpToSSW(ssw: number): Milestone[] {
  return MILESTONES.filter((m) => m.ssw <= ssw)
}

export function getNextMilestone(ssw: number): Milestone | undefined {
  return MILESTONES.find((m) => m.ssw > ssw)
}
