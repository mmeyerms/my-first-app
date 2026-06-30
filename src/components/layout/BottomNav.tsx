'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Sprout,
  CalendarDays,
  NotebookPen,
  UserCircle2,
} from 'lucide-react'
import { useT } from '@/lib/i18n/client'
import { cn } from '@/lib/utils'

const HIDE_ON_PATHS = ['/login', '/register', '/passwort-vergessen', '/onboarding', '/']
const HIDE_ON_PREFIXES = ['/partner/accept', '/helfen']

interface Tab {
  href: string
  Icon: typeof Home
  labelKey: 'home' | 'garden' | 'today' | 'diary' | 'profile'
  /** Mark active if pathname starts with one of these */
  matchPrefixes: string[]
}

const TABS: Tab[] = [
  { href: '/dashboard', Icon: Home, labelKey: 'home', matchPrefixes: ['/dashboard', '/woche'] },
  { href: '/kinderwunsch', Icon: Sprout, labelKey: 'garden', matchPrefixes: ['/kinderwunsch', '/trauer'] },
  { href: '/termine', Icon: CalendarDays, labelKey: 'today', matchPrefixes: ['/termine', '/tipps'] },
  { href: '/tagebuch', Icon: NotebookPen, labelKey: 'diary', matchPrefixes: ['/tagebuch'] },
  { href: '/profil', Icon: UserCircle2, labelKey: 'profile', matchPrefixes: ['/profil', '/geburtsplan', '/packliste', '/einkaufsliste', '/wochenbett', '/partner'] },
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
        {TABS.map((tab) => {
          const isActive = tab.matchPrefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
          const Icon = tab.Icon
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium uppercase tracking-wider transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={isActive ? 2 : 1.5}
                  aria-hidden="true"
                />
                <span>{labels[tab.labelKey]}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
