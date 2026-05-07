export type Locale = 'de' | 'en'

export const LOCALES: readonly Locale[] = ['de', 'en'] as const
export const DEFAULT_LOCALE: Locale = 'de'
export const LOCALE_COOKIE = 'mamamap-locale'

export const LOCALE_LABELS: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}
