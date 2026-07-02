'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AlertOctagon,
  Baby,
  ChevronRight,
  HandHeart,
  Heart,
  Languages,
  ListChecks,
  LogOut,
  Package,
  Palette,
  PlayCircle,
  ShoppingBag,
  Sliders,
  Sparkles,
  Star,
  User,
  UserCircle2,
  Users,
} from 'lucide-react'
import { EmergencySheet } from '@/components/emergency/EmergencySheet'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useT } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'
import { THEMES, type Theme } from '@/lib/theme/types'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface MoreSheetProps {
  trigger: React.ReactNode
}

export function MoreSheet({ trigger }: MoreSheetProps) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [hasSternenkind, setHasSternenkind] = useState(false)
  const [replaying, setReplaying] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    fetch('/api/pregnancies')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Array<{ status?: string }>) => {
        if (cancelled) return
        if (Array.isArray(data)) {
          setHasSternenkind(data.some((p) => p?.status === 'sternenkind'))
        }
      })
      .catch(() => {
        // ignore
      })
    return () => {
      cancelled = true
    }
  }, [open])

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await createClient().auth.signOut()
    } catch {
      // proceed to redirect anyway
    }
    window.location.href = '/login'
  }

  async function handleReplayTour() {
    setReplaying(true)
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tour_completed: false }),
      })
    } catch {
      // ignore
    }
    window.location.href = '/dashboard'
  }

  const ms = t.moreSheet

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="text-left font-display text-lg font-medium text-foreground">
            {ms.title}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-5 py-5">
          {/* Emergency — sits at top so it's always instantly reachable. */}
          <EmergencySheet
            trigger={
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border-2 border-alert bg-alert/5 px-3 py-3 text-left text-sm font-semibold text-alert transition-colors hover:bg-alert/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alert"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-alert text-paper">
                  <AlertOctagon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span className="flex-1">Notfall &amp; Hilfe-Nummern</span>
                <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              </button>
            }
          />

          {/* Section: Meine Reise */}
          <MoreSection heading={ms.sections.journey}>
            <MoreLink
              href="/profil?tab=pregnancies"
              icon={<Baby className="h-4 w-4" strokeWidth={1.5} />}
              label={ms.pregnancies}
              onNavigate={() => setOpen(false)}
            />
            {hasSternenkind && (
              <MoreLink
                href="/trauer"
                icon={<Star className="h-4 w-4" strokeWidth={1.5} />}
                label={ms.sternenkinder}
                onNavigate={() => setOpen(false)}
              />
            )}
          </MoreSection>

          {/* Section: Zu zweit */}
          <MoreSection heading={ms.sections.together}>
            <MoreLink
              href="/partner"
              icon={<Users className="h-4 w-4" strokeWidth={1.5} />}
              label={ms.partner}
              onNavigate={() => setOpen(false)}
            />
          </MoreSection>

          {/* Section: Wochenbett */}
          <MoreSection heading={ms.sections.postpartum}>
            <MoreLink
              href="/wochenbett?tab=liste"
              icon={<ListChecks className="h-4 w-4" strokeWidth={1.5} />}
              label={ms.wochenbettList}
              onNavigate={() => setOpen(false)}
            />
            <MoreLink
              href="/wochenbett?tab=chef"
              icon={<HandHeart className="h-4 w-4" strokeWidth={1.5} />}
              label={ms.wochenbettChef}
              onNavigate={() => setOpen(false)}
            />
          </MoreSection>

          {/* Section: Deine Sammlungen */}
          <MoreSection heading={ms.sections.lists}>
            <MoreLink
              href="/einkaufsliste"
              icon={<ShoppingBag className="h-4 w-4" strokeWidth={1.5} />}
              label={ms.einkaufsliste}
              onNavigate={() => setOpen(false)}
            />
            <MoreLink
              href="/packliste"
              icon={<Package className="h-4 w-4" strokeWidth={1.5} />}
              label={ms.packliste}
              onNavigate={() => setOpen(false)}
            />
          </MoreSection>

          {/* Section: App & Einstellungen */}
          <MoreSection heading={ms.sections.app}>
            <MoreLink
              href="/profil"
              icon={<UserCircle2 className="h-4 w-4" strokeWidth={1.5} />}
              label={ms.profile}
              onNavigate={() => setOpen(false)}
            />
            <MoreLink
              href="/einstellungen"
              icon={<Sliders className="h-4 w-4" strokeWidth={1.5} />}
              label="Personalisierung"
              onNavigate={() => setOpen(false)}
            />
            <MoreButton
              icon={<PlayCircle className="h-4 w-4" strokeWidth={1.5} />}
              label={ms.replayTour}
              onClick={handleReplayTour}
              disabled={replaying}
            />

            {/* Sprache inline */}
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-muted-foreground">
                <Languages className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <div className="flex-1 text-sm font-medium text-foreground">
                {ms.language}
              </div>
              <div className="w-32 shrink-0">
                <LocaleSelector variant="compact" />
              </div>
            </div>

            {/* Erscheinungsbild inline */}
            <ThemeInline label={ms.theme} />

            <Separator className="my-2" />

            <MoreButton
              icon={<LogOut className="h-4 w-4" strokeWidth={1.5} />}
              label={ms.signOut}
              onClick={handleSignOut}
              disabled={signingOut}
              destructive
            />
          </MoreSection>

          {/* Legal — Impressum + DSE als kleine Links am Ende. */}
          <div className="pt-2 text-center text-[10px] leading-relaxed text-muted-foreground">
            <a href="/impressum" className="hover:text-primary hover:underline">Impressum</a>
            <span className="mx-2">·</span>
            <a href="/datenschutz" className="hover:text-primary hover:underline">Datenschutz</a>
            <p className="mt-1">MamaMap ist eine Lifestyle-App, keine medizinische Beratung.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MoreSectionProps {
  heading: string
  children: React.ReactNode
}

function MoreSection({ heading, children }: MoreSectionProps) {
  return (
    <section>
      <h3 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {heading}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </section>
  )
}

interface MoreLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  onNavigate?: () => void
}

function MoreLink({ href, icon, label, onNavigate }: MoreLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-muted-foreground">
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
    </Link>
  )
}

interface MoreButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
}

function MoreButton({ icon, label, onClick, disabled, destructive }: MoreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-60',
        destructive
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-foreground hover:bg-secondary/60',
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          destructive ? 'bg-destructive/10 text-destructive' : 'bg-secondary/60 text-muted-foreground',
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
    </button>
  )
}

function ThemeInline({ label }: { label: string }) {
  const t = useT()
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-muted-foreground">
        <Palette className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <div className="flex-1 text-sm font-medium text-foreground">{label}</div>
      <div className="flex shrink-0 gap-1" role="radiogroup" aria-label={label}>
        {THEMES.map((option: Theme) => {
          const isActive = theme === option
          const themeLabel =
            option === 'classic' ? t.theme.classic : t.theme.editorial
          return (
            <Button
              key={option}
              type="button"
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              role="radio"
              aria-checked={isActive}
              onClick={() => {
                if (!isActive) setTheme(option)
              }}
              className="h-8 gap-1 px-2 text-xs"
            >
              {isActive && <Sparkles className="h-3 w-3" strokeWidth={2} aria-hidden="true" />}
              {themeLabel}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

/* Suppress unused imports for icons kept in scope for readability */
void Heart
void User
