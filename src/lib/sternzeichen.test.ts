import { describe, it, expect } from 'vitest'
import { getZodiacForDate, type ZodiacKey } from './sternzeichen'

interface Case {
  iso: string
  key: ZodiacKey
  label: string
}

/**
 * One mid-range sample per sign, so a broken lookup shows up loudly.
 */
const MID_RANGE: Case[] = [
  { iso: '2026-04-01', key: 'widder', label: 'Widder' },
  { iso: '2026-05-01', key: 'stier', label: 'Stier' },
  { iso: '2026-06-01', key: 'zwillinge', label: 'Zwillinge' },
  { iso: '2026-07-01', key: 'krebs', label: 'Krebs' },
  { iso: '2026-08-01', key: 'loewe', label: 'Loewe' },
  { iso: '2026-09-01', key: 'jungfrau', label: 'Jungfrau' },
  { iso: '2026-10-01', key: 'waage', label: 'Waage' },
  { iso: '2026-11-01', key: 'skorpion', label: 'Skorpion' },
  { iso: '2026-12-01', key: 'schuetze', label: 'Schuetze' },
  { iso: '2026-12-31', key: 'steinbock', label: 'Steinbock' },
  { iso: '2026-01-25', key: 'wassermann', label: 'Wassermann' },
  { iso: '2026-03-01', key: 'fische', label: 'Fische' },
]

/**
 * Boundary dates — the exact first & last day of every sign, so off-by-one
 * bugs in the span table surface immediately.
 */
const EDGES: Case[] = [
  { iso: '2026-03-21', key: 'widder', label: 'Widder' },
  { iso: '2026-04-19', key: 'widder', label: 'Widder' },
  { iso: '2026-04-20', key: 'stier', label: 'Stier' },
  { iso: '2026-05-20', key: 'stier', label: 'Stier' },
  { iso: '2026-05-21', key: 'zwillinge', label: 'Zwillinge' },
  { iso: '2026-06-20', key: 'zwillinge', label: 'Zwillinge' },
  { iso: '2026-06-21', key: 'krebs', label: 'Krebs' },
  { iso: '2026-07-22', key: 'krebs', label: 'Krebs' },
  { iso: '2026-07-23', key: 'loewe', label: 'Loewe' },
  { iso: '2026-08-22', key: 'loewe', label: 'Loewe' },
  { iso: '2026-08-23', key: 'jungfrau', label: 'Jungfrau' },
  { iso: '2026-09-22', key: 'jungfrau', label: 'Jungfrau' },
  { iso: '2026-09-23', key: 'waage', label: 'Waage' },
  { iso: '2026-10-22', key: 'waage', label: 'Waage' },
  { iso: '2026-10-23', key: 'skorpion', label: 'Skorpion' },
  { iso: '2026-11-21', key: 'skorpion', label: 'Skorpion' },
  { iso: '2026-11-22', key: 'schuetze', label: 'Schuetze' },
  { iso: '2026-12-21', key: 'schuetze', label: 'Schuetze' },
  { iso: '2026-12-22', key: 'steinbock', label: 'Steinbock' },
  { iso: '2027-01-19', key: 'steinbock', label: 'Steinbock' },
  { iso: '2026-01-20', key: 'wassermann', label: 'Wassermann' },
  { iso: '2026-02-18', key: 'wassermann', label: 'Wassermann' },
  { iso: '2026-02-19', key: 'fische', label: 'Fische' },
  { iso: '2026-03-20', key: 'fische', label: 'Fische' },
]

describe('getZodiacForDate', () => {
  it.each(MID_RANGE)('returns $label for mid-range date $iso', ({ iso, key, label }) => {
    const zodiac = getZodiacForDate(iso)
    expect(zodiac).not.toBeNull()
    expect(zodiac!.key).toBe(key)
    expect(zodiac!.label).toBe(label)
  })

  it.each(EDGES)('returns $label for boundary date $iso', ({ iso, key, label }) => {
    const zodiac = getZodiacForDate(iso)
    expect(zodiac).not.toBeNull()
    expect(zodiac!.key).toBe(key)
    expect(zodiac!.label).toBe(label)
  })

  it('every returned zodiac has an emoji and a short warm hint', () => {
    for (const { iso } of MID_RANGE) {
      const z = getZodiacForDate(iso)
      expect(z).not.toBeNull()
      expect(z!.emoji.trim().length).toBeGreaterThan(0)
      const words = z!.hint.trim().split(/\s+/)
      expect(words.length).toBeGreaterThanOrEqual(2)
      expect(words.length).toBeLessThanOrEqual(8)
    }
  })

  it('handles Steinbock across the year boundary', () => {
    expect(getZodiacForDate('2025-12-22')?.key).toBe('steinbock')
    expect(getZodiacForDate('2026-01-19')?.key).toBe('steinbock')
    expect(getZodiacForDate('2025-12-21')?.key).toBe('schuetze')
    expect(getZodiacForDate('2026-01-20')?.key).toBe('wassermann')
  })

  it('covers all 12 sign keys across the year', () => {
    const seen = new Set<ZodiacKey>()
    for (let m = 1; m <= 12; m++) {
      for (const day of [1, 15, 28]) {
        const iso = `2026-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const z = getZodiacForDate(iso)
        if (z) seen.add(z.key)
      }
    }
    expect(seen.size).toBe(12)
  })

  it('returns null for invalid or malformed input', () => {
    expect(getZodiacForDate('')).toBeNull()
    expect(getZodiacForDate('not-a-date')).toBeNull()
    expect(getZodiacForDate('2026-13-01')).toBeNull()
    expect(getZodiacForDate('2026-02-30')).toBeNull()
    expect(getZodiacForDate('2026-04-31')).toBeNull()
    expect(getZodiacForDate('2026-00-15')).toBeNull()
    expect(getZodiacForDate('2026-01-00')).toBeNull()
    expect(getZodiacForDate('2026/01/15')).toBeNull()
    expect(getZodiacForDate('26-01-15')).toBeNull()
    // Non-string input is technically prevented by TS, but the runtime
    // guard should still hold.
    expect(getZodiacForDate(null as unknown as string)).toBeNull()
    expect(getZodiacForDate(undefined as unknown as string)).toBeNull()
  })
})
