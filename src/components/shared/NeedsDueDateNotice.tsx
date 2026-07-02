import Link from 'next/link'
import { CalendarPlus, Sparkles, Star } from 'lucide-react'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import type { PregnancyStatus } from '@/lib/pregnancy/server'

/**
 * Shown on section pages (Termine / Woche / Tagebuch / Geburtsplan / Tipps)
 * when the user has NO active pregnancy with a due date. Replaces the
 * previous hard `redirect('/profil')` which felt like a dead-end for the
 * user: they'd tap a Home tile and silently land on the profile page with
 * no context why.
 *
 * The wording adapts to the pregnancy status so a 'planning' user isn't
 * told to enter a due date they don't have yet.
 */
interface Props {
  sectionKey: 'termine' | 'woche' | 'tagebuch' | 'geburtsplan' | 'tipps'
  status: PregnancyStatus | null
}

const SECTION_HEADINGS_DE: Record<Props['sectionKey'], string> = {
  termine: 'Termine',
  woche: 'Deine Woche',
  tagebuch: 'Tagebuch',
  geburtsplan: 'Geburtsplan',
  tipps: 'Tipp des Tages',
}
const SECTION_HEADINGS_EN: Record<Props['sectionKey'], string> = {
  termine: 'Appointments',
  woche: 'Your week',
  tagebuch: 'Diary',
  geburtsplan: 'Birth Plan',
  tipps: 'Tip of the day',
}

export async function NeedsDueDateNotice({ sectionKey, status }: Props) {
  const locale = await getServerLocale()
  const t = getMessages(locale)
  const isDe = locale === 'de'
  const heading =
    isDe ? SECTION_HEADINGS_DE[sectionKey] : SECTION_HEADINGS_EN[sectionKey]

  const isPlanning = status === 'planning'
  const isSternenkind = status === 'sternenkind'

  const sectionLabel = isDe ? SECTION_HEADINGS_DE[sectionKey] : SECTION_HEADINGS_EN[sectionKey]

  const title = isPlanning
    ? isDe
      ? `${sectionLabel} — passt zu deinem Kinderwunsch-Modus`
      : `${sectionLabel} — matches your planning mode`
    : isSternenkind
      ? isDe
        ? `${sectionLabel} — für einen späteren Weg gedacht`
        : `${sectionLabel} — meant for a later path`
      : isDe
        ? `Genauere Empfehlungen mit ET`
        : `More precise recommendations with a due date`

  const body = isPlanning
    ? isDe
      ? 'Sobald du ein Wunsch-ET in deinem Profil hinterlegst, können wir dir passgenauere Tipps, Termine und Wochen-Inhalte anzeigen. Vorher ist dieser Bereich noch etwas leer.'
      : "Once you set a target due date in your profile, we can show you more tailored tips, appointments and weekly content. Until then, this section stays light."
    : isSternenkind
      ? isDe
        ? 'Diese Seite bezieht sich auf eine laufende Schwangerschaft. Wenn du bereit bist, kannst du in deinem Profil eine neue anlegen.'
        : 'This page relates to an ongoing pregnancy. When you feel ready, you can start a new one in your profile.'
      : isDe
        ? 'Sobald dein ET in deinem Profil hinterlegt ist, geben wir dir hier genauere Tipps und passgenauere Empfehlungen für deine aktuelle SSW.'
        : 'Once your due date is saved in your profile, we can give you more precise tips and tailored recommendations for your current week here.'

  const primaryLabel = isPlanning
    ? isDe
      ? 'Zu meinem Kinderwunsch'
      : 'To my planning'
    : isSternenkind
      ? isDe
        ? 'Neue Schwangerschaft anlegen'
        : 'Start new pregnancy'
      : isDe
        ? 'Jetzt ET eintragen'
        : 'Add due date now'

  const backLabel = t.common?.backToDashboard ?? (isDe ? 'Zurück' : 'Back')

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-block shrink-0 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← {backLabel}
        </Link>
        <header className="mb-6">
          <h1 className="font-display text-2xl font-medium text-foreground">
            {heading}
          </h1>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <span
            aria-hidden="true"
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60 text-primary"
          >
            {isPlanning ? (
              <Sparkles className="h-6 w-6" strokeWidth={1.5} />
            ) : isSternenkind ? (
              <Star className="h-6 w-6" strokeWidth={1.5} />
            ) : (
              <CalendarPlus className="h-6 w-6" strokeWidth={1.5} />
            )}
          </span>
          <h2 className="mb-2 font-display text-lg font-medium text-foreground">
            {title}
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">{body}</p>
          <Link
            href="/profil"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {primaryLabel}
          </Link>
        </div>
      </div>
    </main>
  )
}
