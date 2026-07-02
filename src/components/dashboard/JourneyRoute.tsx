'use client'

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

/**
 * JourneyRoute — Stufe 2 des Route-Konzepts (2026-07 Design-Vergleich).
 *
 * Rendert die Schwangerschafts-Reise als geschwungene Linie von "Start"
 * (positive Linie) bis "Wochenbett" mit sechs Stationen. Die aktuelle
 * Position der Nutzerin wird als größerer Pin-Marker gezeichnet, mit
 * "DU"-Beschriftung. Vor-DU-Stationen sind burgunder-solide gezeichnet,
 * nach-DU-Stationen champagne-verblasst.
 *
 * Interaktion: Klick auf Station → Navigation zum passenden Bereich.
 * Klick auf DU-Marker → Woche-Ansicht (bzw. Wochenbett wenn nach Geburt).
 *
 * Stufe 2 verändert NICHT die bestehende Feature-Anordnung — die Route ist
 * ein neues Hero-Element zwischen Greeting und Snapshot. Stufe 3 (später)
 * würde die Sections zusätzlich zeitlich filtern.
 */

interface Props {
  /** SSW oder null (planning / sternenkind / no due date). */
  ssw: number | null
  mode: 'planning' | 'pregnant'
  /** Optional zusätzliche Klassen für Positions-Anpassungen. */
  className?: string
}

interface Station {
  id: string
  label: string
  eyebrow: string
  ssw: number
  href: string
  /** X-Koordinate 0-100 auf der Route */
  x: number
  y: number
}

/**
 * Die 6 Stationen der Reise. Werte für X/Y so gewählt, dass die Linie
 * links unten startet, sanft nach rechts oben verläuft und mit einem Pin
 * am Wochenbett-Ende ankommt.
 */
const STATIONS: Station[] = [
  { id: 'start', label: 'Positive Linie', eyebrow: 'Start', ssw: 4, href: '/dashboard', x: 5, y: 82 },
  { id: 's1', label: 'Ankommen', eyebrow: 'SSW 4–12', ssw: 8, href: '/woche', x: 22, y: 68 },
  { id: 's2', label: 'Wachsen', eyebrow: 'SSW 13–27', ssw: 20, href: '/woche', x: 44, y: 50 },
  { id: 's3', label: 'Vorbereiten', eyebrow: 'SSW 28–36', ssw: 32, href: '/packliste', x: 66, y: 34 },
  { id: 's4', label: 'Zielgerade', eyebrow: 'SSW 37–40', ssw: 39, href: '/geburtsplan', x: 82, y: 20 },
  { id: 'wochenbett', label: 'Wochenbett', eyebrow: 'Die ersten Wochen', ssw: 45, href: '/wochenbett-chef', x: 95, y: 10 },
]

/** Der Pfad der Route — kubische Bezier von Start zu Wochenbett. */
const ROUTE_PATH =
  'M 10 165 Q 90 130, 175 100 T 340 45 T 480 15'
const ROUTE_PATH_VIEWBOX = { w: 500, h: 200 }

function scaleX(x: number): number {
  return (x / 100) * ROUTE_PATH_VIEWBOX.w
}
function scaleY(y: number): number {
  return (y / 100) * ROUTE_PATH_VIEWBOX.h
}

export function JourneyRoute({ ssw, mode, className }: Props) {
  const router = useRouter()

  // Aktuelle Station und Position auf der Route ableiten.
  const { currentX, currentY, currentStation } = useMemo(() => {
    // Planning-Mode → am Start, vor Station 1
    if (mode === 'planning' || ssw === null) {
      return { currentX: scaleX(3), currentY: scaleY(85), currentStation: 'planning' }
    }
    // Nach Geburt (SSW > 42): am Wochenbett-Pin
    if (ssw > 42) {
      const last = STATIONS[STATIONS.length - 1]
      return { currentX: scaleX(last.x), currentY: scaleY(last.y), currentStation: 'wochenbett' }
    }
    // Zwischen Stationen linear interpolieren.
    let prev = STATIONS[0]
    let next = STATIONS[1]
    for (let i = 0; i < STATIONS.length - 1; i++) {
      if (ssw >= STATIONS[i].ssw && ssw < STATIONS[i + 1].ssw) {
        prev = STATIONS[i]
        next = STATIONS[i + 1]
        break
      }
      if (ssw >= STATIONS[STATIONS.length - 1].ssw) {
        prev = STATIONS[STATIONS.length - 2]
        next = STATIONS[STATIONS.length - 1]
      }
    }
    const range = next.ssw - prev.ssw
    const t = range > 0 ? Math.max(0, Math.min(1, (ssw - prev.ssw) / range)) : 0
    return {
      currentX: scaleX(prev.x + (next.x - prev.x) * t),
      currentY: scaleY(prev.y + (next.y - prev.y) * t),
      currentStation: prev.id,
    }
  }, [ssw, mode])

  // Progress-Portion des Pfads vor DU (grob abgeschätzt am X-Anteil).
  const progressPercent = useMemo(() => {
    if (mode === 'planning' || ssw === null) return 0
    if (ssw > 42) return 100
    // Näherungswert — nutzt X-Position als Proxy für Progress
    return Math.min(100, Math.max(0, (currentX / ROUTE_PATH_VIEWBOX.w) * 100))
  }, [currentX, mode, ssw])

  const caption = useMemo(() => {
    if (mode === 'planning' || ssw === null) return 'Kinderwunsch · Weg nach vorne'
    if (ssw > 42) return 'Wochenbett · Angekommen'
    return `SSW ${ssw} / 40 · ${describeTrimester(ssw)}`
  }, [ssw, mode])

  function goTo(href: string) {
    router.push(href)
  }

  return (
    <section
      aria-label="Deine Reise"
      className={cn(
        'mb-6 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm',
        className,
      )}
    >
      <div className="mb-2 flex items-baseline justify-between gap-2 px-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Deine Reise
        </span>
        <span className="font-display text-xs italic text-primary">{caption}</span>
      </div>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${ROUTE_PATH_VIEWBOX.w} ${ROUTE_PATH_VIEWBOX.h}`}
          className="h-auto w-full"
          role="img"
          aria-label="Route der Schwangerschafts-Reise mit deiner aktuellen Position"
        >
          {/* Full route — dashed champagne outline for the not-yet-walked portion */}
          <path
            d={ROUTE_PATH}
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="1.75"
            strokeDasharray="4 5"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Progress overlay — solid burgundy up to current position.
              Clip via a rectangular mask on the same path. */}
          <defs>
            <clipPath id="journey-progress-clip">
              <rect x="0" y="0" width={currentX + 8} height={ROUTE_PATH_VIEWBOX.h} />
            </clipPath>
          </defs>
          <path
            d={ROUTE_PATH}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3.5"
            strokeLinecap="round"
            clipPath="url(#journey-progress-clip)"
          />

          {/* Stations — smaller circles at each. Click → navigate. */}
          {STATIONS.map((s, i) => {
            const stationScaledX = scaleX(s.x)
            const isPast = stationScaledX <= currentX
            const isEndPin = s.id === 'wochenbett'
            return (
              <g
                key={s.id}
                role="link"
                tabIndex={0}
                onClick={() => goTo(s.href)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    goTo(s.href)
                  }
                }}
                className="cursor-pointer focus:outline-none"
                aria-label={`${s.eyebrow}: ${s.label}`}
              >
                {isEndPin ? (
                  <>
                    {/* Wochenbett as a small pin mark echoing the app logo */}
                    <path
                      d={`M ${stationScaledX} ${scaleY(s.y) - 8} C ${stationScaledX - 7} ${scaleY(s.y) - 8}, ${stationScaledX - 12} ${scaleY(s.y) - 3}, ${stationScaledX - 12} ${scaleY(s.y) + 5} C ${stationScaledX - 12} ${scaleY(s.y) + 15}, ${stationScaledX} ${scaleY(s.y) + 25}, ${stationScaledX} ${scaleY(s.y) + 25} C ${stationScaledX} ${scaleY(s.y) + 25}, ${stationScaledX + 12} ${scaleY(s.y) + 15}, ${stationScaledX + 12} ${scaleY(s.y) + 5} C ${stationScaledX + 12} ${scaleY(s.y) - 3}, ${stationScaledX + 7} ${scaleY(s.y) - 8}, ${stationScaledX} ${scaleY(s.y) - 8} Z`}
                      fill={isPast ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
                    />
                  </>
                ) : (
                  <circle
                    cx={stationScaledX}
                    cy={scaleY(s.y)}
                    r={i === 0 ? 6 : 4.5}
                    fill={isPast ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
                    opacity={isPast ? 1 : 0.55}
                  />
                )}
                {/* Station label above/below alternately for spacing */}
                <text
                  x={stationScaledX}
                  y={scaleY(s.y) + (i % 2 === 0 ? -14 : 20)}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  letterSpacing="1"
                  fill="hsl(var(--muted-foreground))"
                  className="uppercase"
                >
                  {s.eyebrow}
                </text>
              </g>
            )
          })}

          {/* Current position — DU marker (larger, primary, always on top) */}
          <g>
            <circle
              cx={currentX}
              cy={currentY}
              r="10"
              fill="hsl(var(--primary))"
              opacity="0.15"
            />
            <circle
              cx={currentX}
              cy={currentY}
              r="6"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--card))"
              strokeWidth="1.5"
            />
            <text
              x={currentX}
              y={currentY - 14}
              textAnchor="middle"
              fontSize="11"
              fontFamily="Georgia, 'Iowan Old Style', serif"
              fontStyle="italic"
              fill="hsl(var(--primary))"
            >
              DU
            </text>
          </g>
        </svg>
      </div>

      {/* Screen-reader-friendly progress + jump buttons */}
      <div className="mt-2 flex items-center justify-between gap-3 px-1">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {progressPercent > 0 && progressPercent < 100 ? `${Math.round(progressPercent)}% des Weges` : progressPercent === 100 ? 'Angekommen' : 'Am Start'}
        </div>
        <button
          type="button"
          onClick={() => goTo(currentStation === 'wochenbett' ? '/wochenbett-chef' : mode === 'planning' ? '/kinderwunsch' : '/woche')}
          className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          {mode === 'planning' ? 'Zum Kinderwunsch-Garten →' : currentStation === 'wochenbett' ? 'Wochenbett öffnen →' : 'Zu deiner Woche →'}
        </button>
      </div>
    </section>
  )
}

function describeTrimester(ssw: number): string {
  if (ssw <= 12) return 'Erstes Trimester'
  if (ssw <= 27) return 'Zweites Trimester'
  if (ssw <= 36) return 'Drittes Trimester'
  return 'Zielgerade'
}
