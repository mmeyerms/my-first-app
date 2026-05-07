'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { KOERPER_KATEGORIEN } from '@/lib/kinderwunsch/koerper'
import { TEAM_FRAGEN } from '@/lib/kinderwunsch/teamFragen'
import { MANIFEST_VORSCHLAEGE } from '@/lib/kinderwunsch/manifest'

type IslandProgress = {
  text: string
  highlight: boolean
}

type IslandConfig = {
  href: string
  emoji: string
  title: string
  description: string
  storageKey: string
  computeProgress: (raw: string | null) => IslandProgress | null
}

const ISLANDS: IslandConfig[] = [
  {
    href: '/kinderwunsch/koerper',
    emoji: '🌱',
    title: 'Körper bereit?',
    description: 'Folsäure, Impfungen, Termine — Checkliste',
    storageKey: 'mamamap-kw-koerper',
    computeProgress: (raw) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) return null
        const total = KOERPER_KATEGORIEN.reduce((sum, c) => sum + c.items.length, 0)
        const checked = parsed.length
        if (checked === 0) return null
        return { text: `${checked} / ${total} erledigt`, highlight: checked === total }
      } catch {
        return null
      }
    },
  },
  {
    href: '/kinderwunsch/team',
    emoji: '💛',
    title: 'Wir als Team',
    description: '10 Pärchen-Fragen zu Werten und Erziehung',
    storageKey: 'mamamap-kw-team',
    computeProgress: (raw) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as Record<string, string>
        if (!parsed || typeof parsed !== 'object') return null
        const answered = Object.values(parsed).filter((v) => typeof v === 'string' && v.trim().length > 0).length
        if (answered === 0) return null
        return { text: `${answered} / ${TEAM_FRAGEN.length} beantwortet`, highlight: answered === TEAM_FRAGEN.length }
      } catch {
        return null
      }
    },
  },
  {
    href: '/kinderwunsch/aengste',
    emoji: '🤔',
    title: 'Was macht Angst?',
    description: 'Erlaubniskarten und Sorgen mit Fakten beruhigen',
    storageKey: 'mamamap-kw-aengste-read',
    computeProgress: (raw) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed) || parsed.length === 0) return null
        return { text: 'Begonnen', highlight: false }
      } catch {
        return null
      }
    },
  },
  {
    href: '/kinderwunsch/vorfreude',
    emoji: '✨',
    title: 'Vorfreude-Rituale',
    description: 'Brief, 30-Min-Box, Bucket List vor dem Baby',
    storageKey: 'mamamap-kw-vorfreude',
    computeProgress: (raw) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as { letter?: string; first30?: unknown[]; bucket?: unknown[] }
        if (!parsed || typeof parsed !== 'object') return null
        const hasLetter = typeof parsed.letter === 'string' && parsed.letter.trim().length > 0
        const first30 = Array.isArray(parsed.first30) ? parsed.first30.length : 0
        const bucket = Array.isArray(parsed.bucket) ? parsed.bucket.length : 0
        if (!hasLetter && first30 === 0 && bucket === 0) return null
        return { text: 'Begonnen', highlight: false }
      } catch {
        return null
      }
    },
  },
  {
    href: '/kinderwunsch/manifest',
    emoji: '📜',
    title: 'Werte-Manifest',
    description: 'Eure 5 Grundsätze als Eltern festhalten',
    storageKey: 'mamamap-kw-manifest',
    computeProgress: (raw) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as {
          agreed?: string[]
          custom?: { id: string; text: string }[]
          signedAt?: string
        }
        if (!parsed || typeof parsed !== 'object') return null
        const agreedCount = Array.isArray(parsed.agreed) ? parsed.agreed.length : 0
        const customCount = Array.isArray(parsed.custom) ? parsed.custom.length : 0
        const total = agreedCount + customCount
        if (total === 0) return null
        const totalSuggestions = MANIFEST_VORSCHLAEGE.length
        if (parsed.signedAt) {
          return { text: `Besiegelt — ${total} Grundsätze`, highlight: true }
        }
        return { text: `${total} ausgewählt (von ${totalSuggestions}+)`, highlight: false }
      } catch {
        return null
      }
    },
  },
  {
    href: '/kinderwunsch/arzt',
    emoji: '🩺',
    title: 'Beim Arzt',
    description: 'Fragenliste für die Kinderwunschsprechstunde',
    storageKey: 'mamamap-kw-arzt',
    computeProgress: (raw) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed) || parsed.length === 0) return null
        return { text: `${parsed.length} besprochen`, highlight: false }
      } catch {
        return null
      }
    },
  },
]

export function KinderwunschHub() {
  const [progressMap, setProgressMap] = useState<Record<string, IslandProgress | null>>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const next: Record<string, IslandProgress | null> = {}
    for (const island of ISLANDS) {
      try {
        const raw = localStorage.getItem(island.storageKey)
        next[island.storageKey] = island.computeProgress(raw)
      } catch {
        next[island.storageKey] = null
      }
    }
    setProgressMap(next)
    setHydrated(true)
  }, [])

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="text-sm text-rose-500 hover:underline"
        >
          ← Dashboard
        </Link>
      </div>

      <section
        aria-label="Kinderwunsch & Vorfreude"
        className="mb-6 rounded-2xl bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-gray-800">
          🌷 Kinderwunsch &amp; Vorfreude
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Vorbereitung &amp; Reflexion — vor und nach dem ersten positiven Test.
        </p>
      </section>

      <div className="space-y-3" aria-label="Inseln">
        {ISLANDS.map((island) => {
          const progress = hydrated ? progressMap[island.storageKey] : null
          return (
            <Link
              key={island.href}
              href={island.href}
              className="block rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl" aria-hidden="true">
                  {island.emoji}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{island.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{island.description}</p>
                  {progress && (
                    <p
                      className={`mt-2 text-xs font-medium ${
                        progress.highlight ? 'text-rose-500' : 'text-gray-600'
                      }`}
                    >
                      {progress.highlight ? '✓ ' : ''}
                      {progress.text}
                    </p>
                  )}
                </div>
                <span className="text-gray-300" aria-hidden="true">
                  ›
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
