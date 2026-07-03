'use client'

import Link from 'next/link'
import { Heart, HandHeart } from 'lucide-react'
import { usePreferences } from '@/lib/preferences/client'
import { useT } from '@/lib/i18n/client'

type SituationContext = 'dashboard' | 'woche' | 'geburtsplan' | 'wochenbett' | 'kinderwunsch'

interface Props {
  context: SituationContext
  /** SSW — afterLoss-Note erscheint nur in der Fruehphase (<= 16). */
  ssw?: number | null
}

/**
 * Kontextsensitive Lebensumstands-Hinweise (Sonderfaelle-Konzept).
 *
 * Liest prefs.lifeCircumstances und rendert pro Kontext die passenden,
 * warm formulierten Notizen. Bewusst als ruhige Editorial-Bloecke —
 * KEINE Alarm-Farben ausser beim medizinisch-kritischen prenatalFinding,
 * das dezent-wuerdevoll (nicht rot) gehalten ist.
 *
 * Sichtbarkeitsmatrix:
 *   afterLoss        → woche (nur SSW <= 16)
 *   prenatalFinding  → woche
 *   riskPregnancy    → woche
 *   bedRest          → dashboard (mit CTA zum Wochenbett-Chef)
 *   premature        → dashboard + wochenbett
 *   soloMama         → dashboard
 *   plannedSectio    → geburtsplan + wochenbett
 *   ivf              → kinderwunsch
 */
export function SituationNotes({ context, ssw = null }: Props) {
  const { prefs } = usePreferences()
  const t = useT()
  const lc = prefs.lifeCircumstances
  const n = t.situation.notes

  const blocks: Array<{ key: string; text: string; cta?: { href: string; label: string } }> = []

  if (context === 'woche') {
    if (lc.afterLoss && (ssw === null || ssw <= 16)) {
      blocks.push({ key: 'afterLoss', text: n.afterLossWoche })
    }
    if (lc.prenatalFinding) {
      blocks.push({ key: 'prenatalFinding', text: n.prenatalFindingWoche })
    }
    if (lc.riskPregnancy || lc.bedRest) {
      blocks.push({ key: 'risk', text: n.riskWoche })
    }
  }

  if (context === 'dashboard') {
    if (lc.bedRest) {
      blocks.push({
        key: 'bedRest',
        text: n.bedRestDashboard,
        cta: { href: '/wochenbett-chef', label: n.bedRestCta },
      })
    }
    if (lc.premature) {
      blocks.push({ key: 'premature', text: n.prematureDashboard })
    }
    if (lc.soloMama) {
      blocks.push({ key: 'solo', text: n.soloDashboard })
    }
  }

  if (context === 'geburtsplan' && lc.plannedSectio) {
    blocks.push({ key: 'sectio', text: n.sectioGeburtsplan })
  }

  if (context === 'wochenbett') {
    if (lc.plannedSectio) {
      blocks.push({ key: 'sectio', text: n.sectioWochenbett })
    }
    if (lc.premature) {
      blocks.push({ key: 'premature', text: n.prematureWochenbett })
    }
  }

  if (context === 'kinderwunsch' && lc.ivf) {
    blocks.push({ key: 'ivf', text: n.ivfKinderwunsch })
  }

  if (blocks.length === 0) return null

  return (
    <div className="mb-6 space-y-3">
      {blocks.map((b) => (
        <aside
          key={b.key}
          className="rounded-2xl border border-accent/50 bg-secondary/30 p-4"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-primary"
            >
              {b.key === 'bedRest' || b.key === 'premature' ? (
                <HandHeart className="h-3.5 w-3.5" strokeWidth={1.5} />
              ) : (
                <Heart className="h-3.5 w-3.5" strokeWidth={1.5} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm italic leading-relaxed text-ink-body">
                {b.text}
              </p>
              {b.cta && (
                <Link
                  href={b.cta.href}
                  className="mt-2 inline-block text-xs font-medium text-primary hover:text-primary/80"
                >
                  {b.cta.label} →
                </Link>
              )}
            </div>
          </div>
        </aside>
      ))}
    </div>
  )
}
