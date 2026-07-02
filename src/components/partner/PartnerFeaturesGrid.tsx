'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Sparkles, MessagesSquare, FileSignature, HeartHandshake, Clock, PlaneTakeoff,
  DoorClosed, CalendarHeart, Gift, AlertOctagon, ChevronDown, ChevronUp,
  ExternalLink, Copy, Check,
} from 'lucide-react'
import {
  WEEKLY_IMPULSES, PARTNER_QUESTIONS, ELTERNZEIT_STEPS, ELTERNZEIT_LETTER_TEMPLATE,
  PAPA_PEER_TEXTS, DAMALS_HEUTE, FERNHILFE_IDEEN, BESUCH_SIGNAL_META,
  BESTIE_RITUALE, GESCHENKE, PPD_SIGNALE, PPD_HOTLINES,
  type PartnerRoleKey,
} from '@/lib/partner/features-content'
import { cn } from '@/lib/utils'

interface Props {
  partnerRole: PartnerRoleKey | null
  ssw: number
  motherName: string
}

/**
 * Rolls all 10 Partner-Features (PROJ-12 Konzept 2.0) into one dashboard
 * component. Each feature is a collapsible <details> block, filtered by
 * relevance for the current partner role. The Papa/Mama-2 profile sees
 * different content than Oma/Opa or Bestie — a "one-size-fits-all"
 * approach would dilute value.
 *
 * Content lives in @/lib/partner/features-content — this component only
 * renders it.
 */
export function PartnerFeaturesGrid({ partnerRole, ssw, motherName }: Props) {
  const role: PartnerRoleKey = partnerRole ?? 'andere'

  // ── F01 · Weekly Impulse — pick closest SSW that matches role ───────────────
  const currentImpulse = useMemo(() => {
    const matching = WEEKLY_IMPULSES
      .filter((i) => i.roles.includes(role) || i.roles.includes('andere'))
      .sort((a, b) => Math.abs(a.ssw - ssw) - Math.abs(b.ssw - ssw))
    return matching[0] ?? null
  }, [role, ssw])

  const relevantQuestions = useMemo(
    () => PARTNER_QUESTIONS.filter((q) => q.roles.includes(role)),
    [role],
  )

  const showFor = (roles: PartnerRoleKey[]) =>
    roles.includes(role) || (role === 'andere' && roles.length === 6)

  return (
    <section className="space-y-4">
      <header className="mb-2">
        <h2 className="font-display text-xl font-medium text-foreground">
          Für dich als {roleLabel(role)}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Rollen-spezifische Impulse, Antworten und Werkzeuge für die Reise mit {motherName}.
        </p>
      </header>

      {/* ═══ F01 · Wochen-Impuls ═══════════════════════════════════════════ */}
      {currentImpulse && (
        <FeatureCard
          icon={<Sparkles className="h-4 w-4" strokeWidth={1.5} />}
          title="Diese Woche für dich"
          subtitle={`SSW ${ssw}`}
          emphasis
          defaultOpen
        >
          <h3 className="mb-2 font-display text-lg text-foreground">
            {currentImpulse.headline}
          </h3>
          <p className="text-sm leading-relaxed text-ink-body">{currentImpulse.body}</p>
          {currentImpulse.cta && (
            <p className="mt-2 text-xs font-medium text-primary">→ {currentImpulse.cta}</p>
          )}
        </FeatureCard>
      )}

      {/* ═══ F02 · Fragen-Bibliothek ═══════════════════════════════════════ */}
      <FeatureCard
        icon={<MessagesSquare className="h-4 w-4" strokeWidth={1.5} />}
        title="Fragen die andere sich stellen"
        subtitle={`${relevantQuestions.length} für ${roleLabel(role)}`}
      >
        <QuestionsBrowser questions={relevantQuestions} />
      </FeatureCard>

      {/* ═══ F03 · Elternzeit-Assistent (Papa + Mama-2) ═══════════════════ */}
      {showFor(['papa', 'mama']) && (
        <FeatureCard
          icon={<FileSignature className="h-4 w-4" strokeWidth={1.5} />}
          title="Elternzeit anmelden"
          subtitle={`${ELTERNZEIT_STEPS.length} Schritte + Vorlage`}
        >
          <ElternzeitBlock />
        </FeatureCard>
      )}

      {/* ═══ F04 · Vater-zu-Vater Peer-Texte ═════════════════════════════ */}
      {showFor(['papa']) && (
        <FeatureCard
          icon={<HeartHandshake className="h-4 w-4" strokeWidth={1.5} />}
          title="Andere Väter über ihre Erfahrung"
          subtitle="Kein Ratgeber. Echte Berichte."
        >
          <ul className="space-y-3">
            {PAPA_PEER_TEXTS.map((t) => (
              <li key={t.id} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{t.from}</div>
                <h4 className="mt-0.5 font-display text-base text-foreground">{t.title}</h4>
                <p className="mt-1 text-sm text-ink-body">{t.body}</p>
              </li>
            ))}
          </ul>
        </FeatureCard>
      )}

      {/* ═══ F05 · Damals-Heute (Oma/Opa) ═══════════════════════════════════ */}
      {showFor(['oma', 'opa']) && (
        <FeatureCard
          icon={<Clock className="h-4 w-4" strokeWidth={1.5} />}
          title="Was hat sich verändert"
          subtitle={`${DAMALS_HEUTE.length} Themen seit damals`}
        >
          <ul className="space-y-3">
            {DAMALS_HEUTE.map((d) => (
              <li key={d.topic} className="rounded-lg border border-border p-3">
                <h4 className="mb-2 font-display text-base text-foreground">{d.topic}</h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded border border-dashed border-border bg-paper-soft p-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Damals</div>
                    <p className="mt-0.5 text-xs text-ink-body">{d.damals}</p>
                  </div>
                  <div className="rounded border border-primary/30 bg-secondary/30 p-2">
                    <div className="text-[10px] uppercase tracking-wider text-primary">Heute</div>
                    <p className="mt-0.5 text-xs text-ink-body">{d.heute}</p>
                  </div>
                </div>
                {d.quelle && (
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Quelle: {d.quelle}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </FeatureCard>
      )}

      {/* ═══ F06 · Fernhilfe (Oma/Opa) ═════════════════════════════════════ */}
      {showFor(['oma', 'opa']) && (
        <FeatureCard
          icon={<PlaneTakeoff className="h-4 w-4" strokeWidth={1.5} />}
          title="Wenn du weit weg wohnst"
          subtitle={`${FERNHILFE_IDEEN.length} konkrete Ideen`}
        >
          <ul className="space-y-2">
            {FERNHILFE_IDEEN.map((idee) => (
              <li key={idee.id} className="rounded-lg border border-border p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-display text-sm font-semibold text-foreground">{idee.title}</h4>
                  <span className={cn(
                    'shrink-0 rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider',
                    idee.aufwand === 'niedrig' && 'border-sage text-sage',
                    idee.aufwand === 'mittel' && 'border-champagne text-primary',
                    idee.aufwand === 'hoch' && 'border-alert text-alert',
                  )}>{idee.aufwand}</span>
                </div>
                <p className="mt-1 text-xs text-ink-body">{idee.detail}</p>
              </li>
            ))}
          </ul>
        </FeatureCard>
      )}

      {/* ═══ F07 · Besuchs-Etikette (Oma/Opa + Bestie) ════════════════════ */}
      {showFor(['oma', 'opa', 'bestie']) && (
        <FeatureCard
          icon={<DoorClosed className="h-4 w-4" strokeWidth={1.5} />}
          title="Besuchs-Etikette Wochenbett"
          subtitle="Ampel-System für Besuche"
        >
          <BesuchAmpel motherName={motherName} />
        </FeatureCard>
      )}

      {/* ═══ F08 · Bestie-Rituale ═════════════════════════════════════════ */}
      {showFor(['bestie']) && (
        <FeatureCard
          icon={<CalendarHeart className="h-4 w-4" strokeWidth={1.5} />}
          title="Rituale die eure Verbindung halten"
          subtitle={`${BESTIE_RITUALE.length} Ideen entlang der SSW`}
        >
          <ul className="space-y-2">
            {BESTIE_RITUALE.map((r) => (
              <li key={r.id} className="rounded-lg border border-border p-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{r.moment}</div>
                <p className="mt-0.5 text-sm text-ink-body">{r.suggestion}</p>
              </li>
            ))}
          </ul>
        </FeatureCard>
      )}

      {/* ═══ F09 · Geschenke-Kurator (alle) ═══════════════════════════════ */}
      <FeatureCard
        icon={<Gift className="h-4 w-4" strokeWidth={1.5} />}
        title="Geschenke die wirklich helfen"
        subtitle={`${GESCHENKE.length} kuratierte Ideen`}
      >
        <ul className="space-y-2">
          {GESCHENKE.map((g) => (
            <li key={g.id} className="rounded-lg border border-border p-3">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-display text-sm font-semibold text-foreground">{g.title}</h4>
                <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {g.priceRange}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-body">{g.why}</p>
              {g.affiliate?.asin && (
                <p className="mt-2 text-[10px] uppercase tracking-wider text-primary">
                  › Werbung · Amazon-Affiliate (bald verfügbar)
                </p>
              )}
            </li>
          ))}
        </ul>
      </FeatureCard>

      {/* ═══ F10 · PPD-Awareness (alle) ═══════════════════════════════════ */}
      <FeatureCard
        icon={<AlertOctagon className="h-4 w-4" strokeWidth={1.5} />}
        title="Wenn es ihr nicht gut geht"
        subtitle="Postpartale Depression erkennen"
      >
        <PPDBlock />
      </FeatureCard>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
 * Sub-components
 * ══════════════════════════════════════════════════════════════════════════ */

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  children: React.ReactNode
  emphasis?: boolean
  defaultOpen?: boolean
}

function FeatureCard({ icon, title, subtitle, children, emphasis, defaultOpen }: FeatureCardProps) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div
      className={cn(
        'rounded-2xl border bg-card p-4 shadow-sm transition-all',
        emphasis ? 'border-primary/30 bg-secondary/30' : 'border-border',
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 text-left"
        aria-expanded={open}
      >
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            emphasis ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-primary',
          )}
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  )
}

function QuestionsBrowser({ questions }: { questions: typeof PARTNER_QUESTIONS }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? questions.filter((q) => q.question.toLowerCase().includes(query.toLowerCase()))
    : questions

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Frage suchen…"
        className="mb-3 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40"
      />
      <ul className="space-y-2">
        {filtered.map((q) => (
          <li key={q.id} className="rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setExpanded((e) => (e === q.id ? null : q.id))}
              className="flex w-full items-center justify-between gap-3 p-3 text-left"
            >
              <span className="text-sm font-medium text-foreground">{q.question}</span>
              <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', expanded === q.id && 'rotate-180')} />
            </button>
            {expanded === q.id && (
              <div className="border-t border-border p-3 pt-2">
                {q.context && (
                  <p className="mb-2 text-xs italic text-muted-foreground">{q.context}</p>
                )}
                <ul className="space-y-2">
                  {q.peerAnswers.map((a, i) => (
                    <li key={i} className="text-xs">
                      <span className="font-semibold text-muted-foreground">{a.from}:</span>{' '}
                      <span className="text-ink-body">„{a.text}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ElternzeitBlock() {
  const [copied, setCopied] = useState(false)

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(ELTERNZEIT_LETTER_TEMPLATE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked — offer manual selection
    }
  }

  return (
    <div className="space-y-4">
      <ol className="space-y-3">
        {ELTERNZEIT_STEPS.map((s, i) => (
          <li key={s.id} className="rounded-lg border border-border p-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display italic text-champagne text-sm">§ {i + 1}</span>
              <h4 className="font-display text-sm font-semibold text-foreground">{s.title}</h4>
              {s.optional && (
                <span className="ml-auto shrink-0 rounded-full border border-border px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">optional</span>
              )}
            </div>
            <p className="mt-1 text-xs text-ink-body">{s.detail}</p>
            {s.deadline && (
              <p className="mt-1.5 text-[10px] uppercase tracking-wider text-primary">Frist: {s.deadline}</p>
            )}
          </li>
        ))}
      </ol>

      <div className="rounded-lg border border-dashed border-primary bg-paper-soft p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h4 className="font-display text-sm font-semibold text-foreground">Anschreiben-Vorlage</h4>
          <button
            type="button"
            onClick={copyTemplate}
            className="inline-flex items-center gap-1 rounded border border-primary/40 bg-card px-2 py-1 text-[11px] font-medium text-primary hover:bg-secondary/60"
          >
            {copied ? <><Check className="h-3 w-3" /> Kopiert</> : <><Copy className="h-3 w-3" /> Kopieren</>}
          </button>
        </div>
        <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed text-ink-body">{ELTERNZEIT_LETTER_TEMPLATE}</pre>
      </div>
    </div>
  )
}

function BesuchAmpel({ motherName }: { motherName: string }) {
  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">
        {motherName} kann in ihrem Profil ein Signal setzen. Aktuell steht es auf:
        <strong className="ml-1 text-foreground">Grün — bitte kommt.</strong>
      </p>
      <ul className="space-y-2">
        {BESUCH_SIGNAL_META.map((m) => (
          <li key={m.key} className="rounded-lg border border-border p-3">
            <div className="flex items-baseline gap-2">
              <span aria-hidden="true">{m.emoji}</span>
              <h4 className="font-display text-sm font-semibold text-foreground">{m.label}</h4>
            </div>
            <p className="mt-1 text-xs italic text-ink-body">„{m.partnerPrompt}"</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PPDBlock() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-alert/30 bg-alert/5 p-3 text-xs text-ink-body">
        <strong className="text-alert">Wichtig:</strong> Dieses Modul ersetzt keine medizinische Diagnose. Wenn du dir Sorgen machst, ist das schon ein guter Grund weiterzugehen — mit ihr oder für sie.
      </div>

      <div>
        <h4 className="mb-2 font-display text-sm font-semibold text-foreground">Signale</h4>
        <ul className="space-y-2">
          {PPD_SIGNALE.map((s) => (
            <li key={s.id} className={cn(
              'rounded-lg border p-3',
              s.severity === 'urgent' && 'border-alert bg-alert/10',
              s.severity === 'concern' && 'border-champagne bg-paper-soft',
              s.severity === 'watch' && 'border-border',
            )}>
              <div className="text-sm font-semibold text-foreground">{s.label}</div>
              <p className="mt-0.5 text-xs text-ink-body">{s.detail}</p>
              {s.severity === 'urgent' && (
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-alert">Sofort handeln — Notaufnahme oder 112</p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-2 font-display text-sm font-semibold text-foreground">Anlaufstellen (kostenlos)</h4>
        <ul className="space-y-1">
          {PPD_HOTLINES.map((h) => (
            <li key={h.phone} className="rounded-lg border border-border bg-card p-2 text-xs">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium text-foreground" dangerouslySetInnerHTML={{ __html: h.name }} />
                <a href={`tel:${h.phone.replace(/\s/g, '')}`} className="font-semibold text-primary">
                  {h.phone}
                </a>
              </div>
              <div className="text-[11px] text-muted-foreground">{h.hours}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function roleLabel(r: PartnerRoleKey): string {
  const M: Record<PartnerRoleKey, string> = {
    papa: 'Papa', mama: 'Mama',
    oma: 'Oma', opa: 'Opa',
    bestie: 'Bestie', andere: 'Partner:in',
  }
  return M[r]
}
