import type { RecurrenceRhythm } from './types'

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

/**
 * Format a Date as YYYY-MM-DD using its local components (not UTC).
 */
export function formatLocalDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * Parse YYYY-MM-DD into a local-time Date at 00:00.
 * Avoids the timezone shift that `new Date('YYYY-MM-DD')` introduces.
 */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map((x) => parseInt(x, 10))
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

/**
 * Add `days` calendar days to an ISO date.
 */
export function addDaysIso(iso: string, days: number): string {
  const d = parseLocalDate(iso)
  d.setDate(d.getDate() + days)
  return formatLocalDate(d)
}

/**
 * Add `months` calendar months to an ISO date, preserving day-of-month
 * where possible. If the target month is shorter (e.g. Jan 31 → Feb),
 * clamp to the last day of that month.
 */
export function addMonthsIso(iso: string, months: number): string {
  const d = parseLocalDate(iso)
  const desiredDay = d.getDate()
  // Move to the 1st first to avoid overflow into the next month.
  d.setDate(1)
  d.setMonth(d.getMonth() + months)
  // Last day of the target month.
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  d.setDate(Math.min(desiredDay, lastDay))
  return formatLocalDate(d)
}

/**
 * Generate a list of N occurrence dates, starting at `startIso` (inclusive).
 * count must be >= 1.
 */
export function generateOccurrenceDates(
  startIso: string,
  rhythm: RecurrenceRhythm,
  count: number,
): string[] {
  const safeCount = Math.max(1, Math.min(20, Math.floor(count)))
  const out: string[] = []
  for (let i = 0; i < safeCount; i++) {
    if (i === 0) {
      out.push(startIso)
      continue
    }
    if (rhythm === 'weekly') {
      out.push(addDaysIso(startIso, 7 * i))
    } else if (rhythm === 'biweekly') {
      out.push(addDaysIso(startIso, 14 * i))
    } else {
      out.push(addMonthsIso(startIso, i))
    }
  }
  return out
}

export function generateGroupId(): string {
  return `recur-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
