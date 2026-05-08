export type Theme = 'classic' | 'editorial'

export const THEMES: readonly Theme[] = ['classic', 'editorial'] as const
export const DEFAULT_THEME: Theme = 'editorial'
export const THEME_COOKIE = 'mamamap-theme'

export const THEME_LABELS: Record<Theme, { de: string; en: string }> = {
  classic: { de: 'Klassisch', en: 'Classic' },
  editorial: { de: 'Editorial', en: 'Editorial' },
}

export const THEME_DESCRIPTIONS: Record<Theme, { de: string; en: string }> = {
  classic: {
    de: 'Verspielt, warm, mit Emojis und Rosé-Tönen.',
    en: 'Playful, warm, with emojis and rosé tones.',
  },
  editorial: {
    de: 'Edel, ruhig, mit Serifenschrift und Burgund-Tönen.',
    en: 'Refined, calm, with serif typography and burgundy tones.',
  },
}

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}
