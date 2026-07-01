'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
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
export function SectionsCollapsible({
  sections,
  isPlanning,
  defaultOpen = false,
}: Props) {
  const t = useT()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'
  const [open, setOpen] = useState<boolean>(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            'flex w-full items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3',
            'text-left outline-none transition-colors hover:bg-secondary/50',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          )}
        >
          <span
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.18em] text-primary',
              isClassic ? '' : 'tracking-[0.22em]',
            )}
          >
            {t.dashboard.allSections}
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
                  const row = (
                    <CardContent className="flex items-center gap-3 p-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-base"
                      >
                        {item.emoji}
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
