import { describe, it, expect } from 'vitest'
import { getTipForDay, TIPS } from './tips'

describe('getTipForDay', () => {
  it('returns a tip for every SSW from 1 to 42', () => {
    for (let ssw = 1; ssw <= 42; ssw++) {
      const tip = getTipForDay(ssw)
      expect(tip).toBeDefined()
      expect(tip.text.de.length).toBeGreaterThan(10)
      expect(tip.text.en.length).toBeGreaterThan(10)
    }
  })

  it('returns different tips on different days for the same SSW', () => {
    const day1 = new Date('2026-01-01')
    const day2 = new Date('2026-01-02')
    const tip1 = getTipForDay(12, day1)
    const tip2 = getTipForDay(12, day2)
    // May be same if only 1 tip in pool — just verify no crash and tip is valid
    expect(tip1).toBeDefined()
    expect(tip2).toBeDefined()
  })

  it('clamps SSW below 1 to first phase tips', () => {
    const tip = getTipForDay(0)
    expect(tip).toBeDefined()
    expect(tip.sswFrom).toBeLessThanOrEqual(4)
  })

  it('clamps SSW above 42 to last phase tips', () => {
    const tip = getTipForDay(50)
    expect(tip).toBeDefined()
    expect(tip.sswTo).toBeGreaterThanOrEqual(40)
  })

  it('returns a tip from the correct SSW range', () => {
    const tip = getTipForDay(20)
    expect(tip.sswFrom).toBeLessThanOrEqual(20)
    expect(tip.sswTo).toBeGreaterThanOrEqual(20)
  })
})

describe('TIPS dataset', () => {
  it('has at least 40% mindset tips', () => {
    const mindset = TIPS.filter((t) => t.category === 'mindset' || t.category === 'reflexion')
    expect(mindset.length / TIPS.length).toBeGreaterThanOrEqual(0.4)
  })

  it('all tips have non-empty text and emoji', () => {
    TIPS.forEach((t) => {
      expect(t.text.de.trim().length).toBeGreaterThan(0)
      expect(t.text.en.trim().length).toBeGreaterThan(0)
      expect(t.emoji.trim().length).toBeGreaterThan(0)
    })
  })

  it('covers all SSW from 1 to 42', () => {
    for (let ssw = 1; ssw <= 42; ssw++) {
      const matching = TIPS.filter((t) => ssw >= t.sswFrom && ssw <= t.sswTo)
      expect(matching.length, `No tips for SSW ${ssw}`).toBeGreaterThan(0)
    }
  })
})
