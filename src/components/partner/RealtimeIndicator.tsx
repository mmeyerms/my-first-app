'use client'

/**
 * RealtimeIndicator — kleiner pulsierender Live-Status-Punkt (Feature 49).
 *
 * Zeigt an, ob die Realtime-Subscription aktuell verbunden ist. Die Farbe wechselt
 * je nach Verbindungszustand:
 *   - live: grün, sanft pulsierend
 *   - connecting: bernstein, pulsierend
 *   - offline: neutraler grauer Punkt (kein Puls)
 *
 * Barrierefrei ueber aria-live="polite" — Screenreader kuendigen den Status nur an,
 * wenn er sich aendert. Textueberschrift "Live" ist auf Wunsch ausblendbar.
 */
export type RealtimeStatus = 'live' | 'connecting' | 'offline'

interface RealtimeIndicatorProps {
  status: RealtimeStatus
  /** Optional label; defaults to a locale-neutral fallback. */
  label?: string
  /** Additional Tailwind classes for positioning. */
  className?: string
}

const STATUS_STYLES: Record<
  RealtimeStatus,
  { dot: string; text: string; label: string; pulse: boolean }
> = {
  live: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'Live',
    pulse: true,
  },
  connecting: {
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'Verbindet…',
    pulse: true,
  },
  offline: {
    dot: 'bg-muted-foreground',
    text: 'text-muted-foreground',
    label: 'Offline',
    pulse: false,
  },
}

export function RealtimeIndicator({
  status,
  label,
  className = '',
}: RealtimeIndicatorProps) {
  const style = STATUS_STYLES[status]
  const text = label ?? style.label

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-xs backdrop-blur ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`Realtime-Status: ${text}`}
    >
      <span className="relative inline-flex h-2 w-2 shrink-0">
        {style.pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${style.dot}`}
            aria-hidden
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${style.dot}`}
          aria-hidden
        />
      </span>
      <span className={`font-medium ${style.text}`}>{text}</span>
    </div>
  )
}
