'use client'

import Link from 'next/link'
import { Settings2 } from 'lucide-react'

import type { ChecklistPresets } from '@/lib/preferences/types'

const LOCATION_LABELS: Record<string, string> = {
  klinik: 'Klinik',
  hausgeburt: 'Hausgeburt',
  geburtshaus: 'Geburtshaus',
}

const SEASON_LABELS: Record<string, string> = {
  sommer: 'Sommer',
  winter: 'Winter',
}

const SETUP_LABELS: Record<string, string> = {
  solo: 'Solo',
  duo: 'Zu zweit',
}

export function presetLabels(presets: ChecklistPresets): string[] {
  const parts: string[] = []
  if (presets.location) parts.push(LOCATION_LABELS[presets.location] ?? presets.location)
  if (presets.season) parts.push(SEASON_LABELS[presets.season] ?? presets.season)
  if (presets.setup) parts.push(SETUP_LABELS[presets.setup] ?? presets.setup)
  return parts
}

interface Props {
  presets: ChecklistPresets
}

export function ChecklistPresetBanner({ presets }: Props) {
  const parts = presetLabels(presets)
  if (parts.length === 0) return null

  return (
    <section
      aria-label="Aktive Vorlage"
      className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Settings2 className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        <span className="min-w-0">
          <span className="font-medium text-foreground">Aktive Vorlage:</span>{' '}
          <span className="text-muted-foreground">{parts.join(', ')}</span>
        </span>
      </div>
      <Link
        href="/einstellungen"
        className="shrink-0 text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Ändern
      </Link>
    </section>
  )
}
