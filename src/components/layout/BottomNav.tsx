'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Sprout,
  CalendarDays,
  NotebookPen,
  MoreHorizontal,
} from 'lucide-react'
import { useT } from '@/lib/i18n/client'
import { cn } from '@/lib/utils'
import { MoreSheet } from './MoreSheet'

const HIDE_ON_PATHS = ['/login', '/register', '/passwort-vergessen', '/onboarding', '/']
const HIDE_ON_PREFIXES = ['/partner/accept', '/helfen']

type LabelKey = 'home' | 'garden' | 'today' | 'diary' | 'profile'

interface LinkTab {
  kind: 'link'
  href: string
  Icon: typeof Home
  labelKey: LabelKey
  /** Mark active if pathname starts with one of these */
  matchPrefixes: string[]
}

interface SheetTab {
  kind: 'sheet'
  Icon: typeof Home
  labelKey: LabelKey
  matchPrefixes: string[]
}

type Tab = LinkTab | SheetTab

const TABS: Tab[] = [
  { kind: 'link', href: '/dashboard', Icon: Home, labelKey: 'home', matchPrefixes: ['/dashboard', '/woche'] },
  { kind: 'link', href: '/kinderwunsch', Icon: Sprout, labelKey: 'garden', matchPrefixes: ['/kinderwunsch', '/trauer'] },
  { kind: 'link', href: '/termine', Icon: CalendarDays, labelKey: 'today', matchPrefixes: ['/termine', '/tipps'] },
  { kind: 'link', href: '/tagebuch', Icon: NotebookPen, labelKey: 'diary', matchPrefixes: ['/tagebuch'] },
  { kind: 'sheet', Icon: MoreHorizontal, labelKey: 'profile', matchPrefixes: ['/profil', '/geburtsplan', '/packliste', '/einkaufsliste', '/wochenbett', '/partner'] },
]

export function BottomNav() {
  const pathname = usePathname() ?? ''
  const t = useT()

  // Hide on public/auth/onboarding pages
  if (HIDE_ON_PATHS.includes(pathname)) return null
  if (HIDE_ON_PREFIXES.some((p) => pathname.startsWith(p))) return null

  const labels = t.bottomNav

  return (
    <nav
      aria-label={labels.aria}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur',
        'pb-[env(safe-area-inset-bottom)]',
        // Hide on >= md screens (desktop): keeps current chrome there
        'md:hidden',
      )}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((tab, idx) => {
          const isActive = tab.matchPrefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
          const Icon = tab.Icon
          const content = (
            <>
              <Icon
                className="h-5 w-5"
                strokeWidth={isActive ? 2 : 1.5}
                aria-hidden="true"
              />
              <span>{labels[tab.labelKey]}</span>
            </>
          )
          const className = cn(
            'flex w-full flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium uppercase tracking-wider transition-colors',
            isActive
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )

          if (tab.kind === 'sheet') {
            return (
              <li key={`sheet-${idx}`} className="flex-1">
                <MoreSheet
                  trigger={
                    <button
                      type="button"
                      aria-current={isActive ? 'page' : undefined}
                      className={className}
                    >
                      {content}
                    </button>
                  }
                />
              </li>
            )
          }

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={className}
              >
                {content}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
