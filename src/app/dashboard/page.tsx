import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UserCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getTipForDay } from '@/lib/tips'
import { DailyTipPopup } from '@/components/tipps/DailyTipPopup'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'
import { Logo } from '@/components/brand/Logo'
import { CompactWelcome } from '@/components/dashboard/CompactWelcome'
import { DailySnapshot } from '@/components/dashboard/DailySnapshot'
import {
  SectionsCollapsible,
  type SectionsCollapsibleItem,
  type SectionsCollapsibleSection,
} from '@/components/dashboard/SectionsCollapsible'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { getPreferences } from '@/lib/preferences/server'

interface Profile {
  name: string
  baby_name: string | null
  due_date: string | null
  mode: 'planning' | 'pregnant' | null
}

function pickGreeting(tone: 'warm' | 'sachlich' | 'locker' | 'liebevoll', name: string, timeOfDay: 'morning' | 'day' | 'evening') {
  const first = name.split(' ')[0]
  const timeMap = { morning: 'Guten Morgen', day: 'Hallo', evening: 'Guten Abend' } as const
  const timeCasual = { morning: 'Morgen', day: 'Hey', evening: 'Abend' } as const
  switch (tone) {
    case 'warm':
      return `${timeMap[timeOfDay]}, ${first} — schön, dass du da bist.`
    case 'sachlich':
      return `${timeMap[timeOfDay]}, ${first}.`
    case 'locker':
      return `${timeCasual[timeOfDay]}, ${first} 👋`
    case 'liebevoll':
      return `${timeMap[timeOfDay]}, liebe ${first} 💛`
  }
}

function currentTimeOfDay(): 'morning' | 'day' | 'evening' {
  const h = new Date().getHours()
  if (h < 11) return 'morning'
  if (h < 17) return 'day'
  return 'evening'
}

interface DbTermin {
  title: string
  date: string
  time: string | null
}

interface DbDiaryEntry {
  ssw: number
  rating: number | null
  word: string | null
  updated_at: string
}

function todayLocalISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, baby_name, due_date, mode')
    .eq('user_id', user.id)
    .single() as { data: Profile | null }

  if (!profile) {
    // No profile: check if this user is a partner (not a mother)
    const { data: partnerLink } = await supabase
      .from('partner_links')
      .select('mother_id')
      .eq('partner_user_id', user.id)
      .eq('active', true)
      .single()
    if (partnerLink) redirect('/partner/dashboard')
    redirect('/onboarding')
  }

  const mode: 'planning' | 'pregnant' = profile.mode ?? 'pregnant'
  const isPlanning = mode === 'planning'

  const active = await getActivePregnancy(supabase, user.id)
  const effectiveDueDate = active?.due_date ?? profile.due_date ?? null
  const effectiveBabyName = active?.baby_name ?? profile.baby_name ?? null
  const ssw = effectiveDueDate ? calculateSSW(effectiveDueDate) : null
  const tipSsw = ssw ?? 1
  const tip = getTipForDay(tipSsw)
  const locale = await getServerLocale()
  const t = getMessages(locale)
  const prefs = await getPreferences(supabase, user.id)
  const greeting = pickGreeting(prefs.greetingTone, profile.name, currentTimeOfDay())

  // -------- Snapshot data (only meaningful in pregnant mode) --------
  let nextTermin: { title: string; date: string; time?: string | null } | null = null
  let latestDiary: {
    ssw: number
    word: string | null
    rating: number | null
    updatedAt: string
  } | null = null
  let helpRequestsOpen = 0

  if (!isPlanning) {
    const today = todayLocalISO()

    // Next upcoming, not-done termin scoped to active pregnancy.
    if (active) {
      const { data: terminRows } = await supabase
        .from('termine')
        .select('title, date, time')
        .eq('user_id', user.id)
        .eq('pregnancy_id', active.id)
        .eq('done', false)
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(1)

      const first = (terminRows ?? [])[0] as DbTermin | undefined
      if (first) {
        nextTermin = {
          title: first.title,
          date: first.date,
          time: first.time,
        }
      }

      // Latest diary entry — highest SSW wins (freshest emotional snapshot).
      const { data: diaryRows } = await supabase
        .from('diary_entries')
        .select('ssw, rating, word, updated_at')
        .eq('user_id', user.id)
        .eq('pregnancy_id', active.id)
        .order('ssw', { ascending: false })
        .limit(1)

      const firstDiary = (diaryRows ?? [])[0] as DbDiaryEntry | undefined
      if (firstDiary) {
        latestDiary = {
          ssw: firstDiary.ssw,
          rating: firstDiary.rating,
          word: firstDiary.word,
          updatedAt: firstDiary.updated_at,
        }
      }

      // Count of open Wochenbett-Chef help_requests
      const { count } = await supabase
        .from('help_requests')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('pregnancy_id', active.id)
      helpRequestsOpen = count ?? 0
    }
  }

  // -------- Sections (existing behavior, reused for the collapsible menu) --------
  const reflectionItems: SectionsCollapsibleItem[] = [
    {
      href: '/kinderwunsch',
      emoji: '🌷',
      title: t.dashboard.cards.kinderwunsch.title,
      description: t.dashboard.cards.kinderwunsch.description,
      available: true,
    },
    {
      href: '/geburtsplan',
      emoji: '📋',
      title: t.dashboard.cards.geburtsplan.title,
      description: t.dashboard.cards.geburtsplan.description,
      available: !isPlanning,
    },
  ]

  const sections: SectionsCollapsibleSection[] = [
    {
      id: 'reflection',
      title: t.dashboard.sections.reflection.title,
      description: t.dashboard.sections.reflection.description,
      items: reflectionItems,
    },
  ]

  if (!isPlanning) {
    sections.push({
      id: 'daily',
      title: t.dashboard.sections.daily.title,
      description: t.dashboard.sections.daily.description,
      items: [
        {
          href: '/tipps',
          emoji: '💡',
          title: t.dashboard.cards.tipps.title,
          description: t.dashboard.cards.tipps.description.replace('{ssw}', String(tipSsw)),
          available: true,
        },
        {
          href: '/tagebuch',
          emoji: '📔',
          title: t.dashboard.cards.tagebuch.title,
          description: t.dashboard.cards.tagebuch.description,
          available: true,
        },
        {
          href: '/termine',
          emoji: '📅',
          title: t.dashboard.cards.termine.title,
          description: t.dashboard.cards.termine.description,
          available: true,
        },
      ],
    })

    sections.push({
      id: 'practical',
      title: t.dashboard.sections.practical.title,
      description: t.dashboard.sections.practical.description,
      items: [
        {
          href: '/einkaufsliste',
          emoji: '🛍️',
          title: t.dashboard.cards.einkaufsliste.title,
          description: t.dashboard.cards.einkaufsliste.description,
          available: true,
        },
        {
          href: '/packliste',
          emoji: '🏥',
          title: t.dashboard.cards.packliste.title,
          description: t.dashboard.cards.packliste.description,
          available: true,
        },
        {
          href: '/wochenbett',
          emoji: '💞',
          title: t.dashboard.cards.wochenbett.title,
          description: t.dashboard.cards.wochenbett.description,
          available: true,
        },
      ],
    })
  }

  sections.push({
    id: 'together',
    title: t.dashboard.sections.together.title,
    description: t.dashboard.sections.together.description,
    items: [
      {
        href: '/partner',
        emoji: '💑',
        title: t.dashboard.cards.partner.title,
        description: t.dashboard.cards.partner.description,
        available: true,
      },
    ],
  })

  const showSnapshot = !isPlanning

  return (
    <main className="min-h-screen bg-background">
      {/* Daily tip popup is only relevant for pregnant users with a known SSW. */}
      {!isPlanning && ssw !== null && <DailyTipPopup tip={tip} ssw={ssw} />}
      <div className="mx-auto max-w-sm px-4 py-8">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <LocaleSelector variant="compact" />
            <Link
              href="/profil"
              aria-label={t.nav.profileAria}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              <UserCircle2 className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          </div>
        </header>

        {/* Compact welcome (greeting + SSW line) */}
        <CompactWelcome
          name={profile.name}
          babyName={effectiveBabyName}
          ssw={ssw}
          dueDate={effectiveDueDate}
          mode={mode}
          customGreeting={greeting}
        />

        {/* Daily snapshot: tip · next termin · latest diary · ki-hebamme */}
        {showSnapshot && (
          <DailySnapshot
            tipEmoji={tip.emoji}
            tipTextDe={tip.text.de}
            tipTextEn={tip.text.en}
            nextTermin={nextTermin}
            latestDiary={latestDiary}
            ssw={ssw}
            dueDate={effectiveDueDate}
            helpRequestsOpen={helpRequestsOpen}
          />
        )}

        {/* All sections — collapsed by default on mobile, expanded on desktop via CSS could be added later */}
        <SectionsCollapsible
          sections={sections}
          isPlanning={isPlanning}
          defaultOpen={false}
        />
      </div>
    </main>
  )
}
