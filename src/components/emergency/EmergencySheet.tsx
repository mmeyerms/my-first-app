'use client'

import Link from 'next/link'
import { AlertOctagon, ChevronRight, IdCard, Phone } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface Hotline {
  name: string
  number: string
  hours: string
  reason: string
  urgent?: boolean
}

const HOTLINES: Hotline[] = [
  {
    name: 'Rettungsdienst',
    number: '112',
    hours: 'Rund um die Uhr',
    reason: 'Lebensbedrohlicher Notfall — Sofort',
    urgent: true,
  },
  {
    name: 'Ärztlicher Bereitschaftsdienst',
    number: '116 117',
    hours: 'Rund um die Uhr',
    reason: 'Nichtnotfall außerhalb Sprechzeiten',
  },
  {
    name: 'Vergiftungszentrale (Berlin)',
    number: '030 19240',
    hours: 'Rund um die Uhr',
    reason: 'Bei Verdacht auf Vergiftung',
    urgent: true,
  },
  {
    name: 'Hilfetelefon „Schwangere in Not"',
    number: '0800 40 40 020',
    hours: 'Rund um die Uhr, mehrsprachig',
    reason: 'Anonym, kostenlos, vertraulich',
  },
  {
    name: 'Schatten &amp; Licht — Krise nach der Geburt',
    number: '0800 3776 0000',
    hours: 'Mo-Fr 8-18 Uhr',
    reason: 'Bei Postpartaler Depression / Angst',
  },
  {
    name: 'Telefonseelsorge',
    number: '0800 111 0 111',
    hours: 'Rund um die Uhr, anonym',
    reason: 'Bei allen Sorgen und Krisen',
  },
]

/**
 * EmergencySheet — global reachable via the "Notfall" entry in MoreSheet.
 *
 * Legal duty of care: because MamaMap touches health-adjacent content, we
 * must give users a low-friction path to real help when they need it.
 * Numbers are tap-to-call (`tel:` URI). Sheet opens from bottom so users
 * can act with one hand.
 */
interface Props {
  trigger: React.ReactNode
}

export function EmergencySheet({ trigger }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl border-t-4 border-alert p-0"
      >
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-left font-display text-lg font-medium text-foreground">
            <AlertOctagon className="h-5 w-5 text-alert" strokeWidth={1.5} />
            Notfall &amp; Hilfe
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-5 py-5">
          <p className="rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
            MamaMap ist keine medizinische App. Bei akuten Beschwerden, Verletzungen oder starken Sorgen wende dich immer an eine Fachperson.
          </p>

          <ul className="space-y-2">
            {HOTLINES.map((h) => (
              <li
                key={h.number}
                className={
                  h.urgent
                    ? 'rounded-lg border-2 border-alert bg-alert/5 p-3'
                    : 'rounded-lg border border-border bg-card p-3'
                }
              >
                <a
                  href={`tel:${h.number.replace(/\s/g, '')}`}
                  className="flex items-start gap-3"
                >
                  <span
                    className={
                      h.urgent
                        ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-alert text-paper'
                        : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/70 text-primary'
                    }
                  >
                    <Phone className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className="truncate text-sm font-semibold text-foreground"
                        dangerouslySetInnerHTML={{ __html: h.name }}
                      />
                      <span
                        className={
                          h.urgent
                            ? 'shrink-0 font-display text-lg font-medium text-alert'
                            : 'shrink-0 font-display text-lg font-medium text-primary'
                        }
                      >
                        {h.number}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {h.hours} · {h.reason}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {/* PROJ-13: Notfall-Karte einrichten */}
          <Link
            href="/notfall-karte"
            className="flex items-center gap-3 rounded-lg border border-primary/40 bg-secondary/40 p-3 text-sm font-medium text-primary transition-colors hover:bg-secondary/70"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <IdCard className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="flex-1">
              Meine Notfall-Karte
              <span className="block text-[11px] font-normal text-muted-foreground">
                Blutgruppe, Klinik &amp; Kontakte — als Sperrbildschirm-Bild
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          </Link>

          <p className="pt-2 text-center text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Nummern kostenlos aus dem deutschen Fest- und Mobilfunknetz
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
