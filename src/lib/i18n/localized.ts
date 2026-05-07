import type { Locale } from './types'

export type LocalizedString = { de: string; en: string }

export function localized(s: LocalizedString, locale: Locale): string {
  return s[locale] ?? s.de
}

export function localizedOrEmpty(s: LocalizedString | undefined, locale: Locale): string {
  if (!s) return ''
  return s[locale] ?? s.de
}
