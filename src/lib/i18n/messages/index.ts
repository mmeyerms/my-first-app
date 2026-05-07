import { de } from './de'
import { en } from './en'
import type { Locale } from '../types'

export type Messages = typeof de

export const messages: Record<Locale, Messages> = {
  de,
  en: en as unknown as Messages,
}

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages.de
}

/**
 * Server-side helper: walks dot-path through messages, e.g. t('de', 'common.save')
 * Returns the path itself as a fallback if the key is missing or not a string.
 */
export function t(locale: Locale, path: string): string {
  const parts = path.split('.')
  let current: unknown = messages[locale]
  for (const p of parts) {
    if (current && typeof current === 'object' && p in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[p]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

/**
 * Replaces {placeholders} in a translated string with values from params.
 */
export function tf(
  locale: Locale,
  path: string,
  params?: Record<string, string | number>,
): string {
  let s = t(locale, path)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    }
  }
  return s
}
