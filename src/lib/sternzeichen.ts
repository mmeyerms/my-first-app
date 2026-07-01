/**
 * Sternzeichen-Prognose
 *
 * Derives the (western) zodiac sign for a given due date, so we can show a
 * playful "Baby-Sternzeichen"-Widget on the dashboard and on /woche.
 *
 * Standard western zodiac spans are inclusive on both ends. Steinbock
 * (Capricorn) wraps around the year boundary (Dec 22 - Jan 19).
 */

export type ZodiacKey =
  | 'widder'
  | 'stier'
  | 'zwillinge'
  | 'krebs'
  | 'loewe'
  | 'jungfrau'
  | 'waage'
  | 'skorpion'
  | 'schuetze'
  | 'steinbock'
  | 'wassermann'
  | 'fische'

export interface Zodiac {
  key: ZodiacKey
  label: string
  emoji: string
  hint: string
}

interface ZodiacSpan {
  key: ZodiacKey
  label: string
  emoji: string
  hint: string
  // Month is 1-based
  fromMonth: number
  fromDay: number
  toMonth: number
  toDay: number
}

/**
 * Western zodiac spans in calendar order starting from Widder.
 * Steinbock (Capricorn) wraps around the year — handled specially in the
 * matcher below.
 */
const SPANS: ZodiacSpan[] = [
  {
    key: 'widder',
    label: 'Widder',
    emoji: '♈',
    hint: 'Mutig, neugierig, immer voraus',
    fromMonth: 3,
    fromDay: 21,
    toMonth: 4,
    toDay: 19,
  },
  {
    key: 'stier',
    label: 'Stier',
    emoji: '♉',
    hint: 'Gemuetlich, verlaesslich, genussvoll',
    fromMonth: 4,
    fromDay: 20,
    toMonth: 5,
    toDay: 20,
  },
  {
    key: 'zwillinge',
    label: 'Zwillinge',
    emoji: '♊',
    hint: 'Neugierig, gespraechig, verspielt',
    fromMonth: 5,
    fromDay: 21,
    toMonth: 6,
    toDay: 20,
  },
  {
    key: 'krebs',
    label: 'Krebs',
    emoji: '♋',
    hint: 'Gefuehlvoll, kuschelig, familienverliebt',
    fromMonth: 6,
    fromDay: 21,
    toMonth: 7,
    toDay: 22,
  },
  {
    key: 'loewe',
    label: 'Loewe',
    emoji: '♌',
    hint: 'Strahlend, warmherzig, kleiner Star',
    fromMonth: 7,
    fromDay: 23,
    toMonth: 8,
    toDay: 22,
  },
  {
    key: 'jungfrau',
    label: 'Jungfrau',
    emoji: '♍',
    hint: 'Aufmerksam, ordentlich, feinfuehlig',
    fromMonth: 8,
    fromDay: 23,
    toMonth: 9,
    toDay: 22,
  },
  {
    key: 'waage',
    label: 'Waage',
    emoji: '♎',
    hint: 'Harmonisch, charmant, ausgeglichen',
    fromMonth: 9,
    fromDay: 23,
    toMonth: 10,
    toDay: 22,
  },
  {
    key: 'skorpion',
    label: 'Skorpion',
    emoji: '♏',
    hint: 'Intensiv, mutig, tief fuehlend',
    fromMonth: 10,
    fromDay: 23,
    toMonth: 11,
    toDay: 21,
  },
  {
    key: 'schuetze',
    label: 'Schuetze',
    emoji: '♐',
    hint: 'Abenteuerlustig, froehlich, weltoffen',
    fromMonth: 11,
    fromDay: 22,
    toMonth: 12,
    toDay: 21,
  },
  {
    key: 'steinbock',
    label: 'Steinbock',
    emoji: '♑',
    // Wraps year end (Dec 22 - Jan 19).
    hint: 'Ruhig, geduldig, zielstrebig',
    fromMonth: 12,
    fromDay: 22,
    toMonth: 1,
    toDay: 19,
  },
  {
    key: 'wassermann',
    label: 'Wassermann',
    emoji: '♒',
    hint: 'Einzigartig, kreativ, freigeistig',
    fromMonth: 1,
    fromDay: 20,
    toMonth: 2,
    toDay: 18,
  },
  {
    key: 'fische',
    label: 'Fische',
    emoji: '♓',
    hint: 'Traeumerisch, sanft, mitfuehlend',
    fromMonth: 2,
    fromDay: 19,
    toMonth: 3,
    toDay: 20,
  },
]

/**
 * Parses a strict YYYY-MM-DD date string, validates the calendar date, and
 * returns { month, day } (1-based) — or null when invalid.
 */
function parseIsoDate(iso: string): { month: number; day: number } | null {
  if (typeof iso !== 'string') return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  const year = parseInt(match[1]!, 10)
  const month = parseInt(match[2]!, 10)
  const day = parseInt(match[3]!, 10)
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  // Reconstruct to catch invalid calendar dates (e.g. Feb 30, Apr 31).
  const dt = new Date(year, month - 1, day)
  if (
    dt.getFullYear() !== year ||
    dt.getMonth() !== month - 1 ||
    dt.getDate() !== day
  ) {
    return null
  }
  return { month, day }
}

/**
 * Returns the zodiac for the given ISO date string (YYYY-MM-DD).
 * Returns null when the input is not a valid date string.
 */
export function getZodiacForDate(iso: string): Zodiac | null {
  const parsed = parseIsoDate(iso)
  if (!parsed) return null
  const { month, day } = parsed

  for (const span of SPANS) {
    const startsInMonth = month === span.fromMonth && day >= span.fromDay
    const endsInMonth = month === span.toMonth && day <= span.toDay

    // Both normal and wrapping spans (Steinbock) match on either end of the
    // range — a date can only fall into either the start month or the end
    // month of a single sign anyway.
    if (startsInMonth || endsInMonth) {
      return {
        key: span.key,
        label: span.label,
        emoji: span.emoji,
        hint: span.hint,
      }
    }
  }

  // Should never happen for valid dates — return null defensively.
  return null
}
