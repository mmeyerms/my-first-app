'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronRight,
  Map as MapIcon,
  Sprout,
  ScrollText,
  Sparkle,
  NotebookPen,
  CalendarDays,
  ShoppingBag,
  Briefcase,
  HandHeart,
  HeartHandshake,
  type LucideIcon,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useT } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
import { cn } from '@/lib/utils'

export interface SectionsCollapsibleItem {
  href: string
  emoji: string
  title: string
  description: string
  available: boolean
}

// Map hrefs to Lucide icons for the editorial theme. Emojis are kept for
// the classic theme via item.emoji.
const HREF_ICON: Record<string, LucideIcon> = {
  '/kinderwunsch': Sprout,
  '/geburtsplan': ScrollText,
  '/tipps': Sparkle,
  '/tagebuch': NotebookPen,
  '/termine': CalendarDays,
  '/einkaufsliste': ShoppingBag,
  '/packliste': Briefcase,
  '/wochenbett': HandHeart,
  '/partner': HeartHandshake,
}

export interface SectionsCollapsibleSection {
  id: string
  title: string
  description: string
  items: SectionsCollapsibleItem[]
}

interface Props {
  sections: SectionsCollapsibleSection[]
  isPlanning: boolean
  defaultOpen?: boolean
}

/**
 * Collapsible "Alle Bereiche" section for the dashboard. On desktop we render
 * it open by default (defaultOpen = true). On mobile we collapse to keep the
 * home surface calm; the header itself is tappable.
 */
const STORAGE_KEY = 'mamamap:dashboard:showAllSections'

export function SectionsCollapsible({
  sections,
  isPlanning,
  defaultOpen = false,
}: Props) {
  const t = useT()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'
  const [open, setOpenState] = useState<boolean>(defaultOpen)

  // Restore persisted preference on mount. Kept in localStorage so a user
  // who prefers the "all sections" view doesn't have to re-open it every
  // session — while the default (closed) still respects the Timeline focus.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'true') setOpenState(true)
      else if (stored === 'false') setOpenState(false)
    } catch {
      // localStorage may throw in private mode — silently ignore
    }
  }, [])

  function setOpen(next: boolean) {
    setOpenState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'true' : 'false')
    } catch {
      // ignore
    }
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            'flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3.5',
            'text-left outline-none transition-colors hover:bg-secondary/50',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/60 text-primary">
            <MapIcon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="flex-1 min-w-0">
            <span
              className={cn(
                'block text-xs font-semibold uppercase tracking-[0.18em] text-primary',
                isClassic ? '' : 'tracking-[0.22em]',
              )}
            >
              {open ? t.dashboard.allSectionsHide : t.dashboard.allSections}
            </span>
            <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
              {open ? t.dashboard.allSectionsHideHint : t.dashboard.allSectionsHint}
            </span>
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-4 data-[state=closed]:animate-none">
        <nav aria-label={t.nav.sectionsAria} className="space-y-6">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={`section-${section.id}`}>
              <header className="mb-2 px-1">
                <h2
                  id={`section-${section.id}`}
                  className={
                    isClassic
                      ? 'text-xs font-semibold uppercase tracking-[0.18em] text-primary'
                      : 'text-[10px] font-semibold uppercase tracking-[0.22em] text-primary'
                  }
                >
                  {section.title}
                </h2>
                <p
                  className={
                    isClassic
                      ? 'mt-0.5 text-xs text-muted-foreground'
                      : 'mt-0.5 font-display text-xs italic text-muted-foreground'
                  }
                >
                  {section.description}
                </p>
              </header>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = HREF_ICON[item.href]
                  const row = (
                    <CardContent className="flex items-center gap-3 p-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-base"
                      >
                        {isClassic || !Icon ? (
                          item.emoji
                        ) : (
                          <Icon
                            className="h-4 w-4 text-primary"
                            strokeWidth={1.5}
                          />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              'truncate text-sm font-semibold leading-tight text-foreground',
                              isClassic ? '' : 'font-display',
                            )}
                          >
                            {item.title}
                          </p>
                          {!item.available && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] uppercase tracking-wider"
                            >
                              {isPlanning ? t.dashboard.lockedNote : t.dashboard.soonBadge}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </CardContent>
                  )
                  return item.available ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-label={item.title}
                    >
                      <Card className="card-elevated cursor-pointer border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-md">
                        {row}
                      </Card>
                    </Link>
                  ) : (
                    <Card
                      key={item.href}
                      className="card-elevated border-border/60 bg-card opacity-60"
                    >
                      {row}
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}
        </nav>
      </CollapsibleContent>
    </Collapsible>
  )
}
