'use client'

import { useEffect, useState } from 'react'
import { Calendar, CalendarPlus, Clock, ExternalLink, Gift, Heart, HeartHandshake, Send, Wallet } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useT, useLocale } from '@/lib/i18n/client'
import type { HelpRequestWithSlots, HelpSlot } from '@/lib/wochenbett-chef/types'

interface Props {
  token: string
}

interface PublicHelpRequest extends Omit<HelpRequestWithSlots, 'user_id'> {
  user_id?: never
}

export function HelferView({ token }: Props) {
  const t = useT()
  const { locale } = useLocale()
  const [data, setData] = useState<PublicHelpRequest | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<HelpSlot | null>(null)
  const [helperName, setHelperName] = useState('')
  const [helperMessage, setHelperMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch(`/api/helfen/${token}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true)
          return null
        }
        return r.json()
      })
      .then((d) => {
        if (d) setData(d as PublicHelpRequest)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [token])

  function formatDate(iso: string | null): string {
    if (!iso) return ''
    try {
      return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(new Date(iso))
    } catch {
      return iso
    }
  }

  async function submitClaim() {
    if (!selectedSlot || !helperName.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/helfen/${token}/claim`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          helperName: helperName.trim(),
          helperMessage: helperMessage.trim() || undefined,
        }),
      })
      if (res.ok) {
        // Refresh data
        const refreshed = await fetch(`/api/helfen/${token}`).then((r) => r.json())
        setData(refreshed)
        setDone(true)
        // Kein Auto-Close mehr — der Success-Screen zeigt jetzt Aktionen
        // (Kalender-Download, Wunschzettel-Link, PayPal-Link). User schliesst
        // den Dialog manuell.
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true">
        <div className="h-32 animate-pulse rounded-2xl bg-muted/40" />
        <div className="h-24 animate-pulse rounded-2xl bg-muted/40" />
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="font-display text-lg text-foreground">{t.helfen.notFoundTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t.helfen.notFoundBody}</p>
      </div>
    )
  }

  const openSlots = data.slots.filter((s) => !s.helper_name)
  const claimedSlots = data.slots.filter((s) => !!s.helper_name)

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <p className="font-display text-2xl font-medium text-foreground">
          {t.helfen.welcome}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {data.intro || t.helfen.introFallback}
        </p>
      </section>

      {/* Open slots */}
      {openSlots.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-sm italic text-muted-foreground">
          {t.helfen.noSlots}
        </p>
      ) : (
        <ul className="space-y-3">
          {openSlots.map((slot) => {
            const slotType = slot.slot_type ?? 'task'
            const typeMeta = getSlotTypeMeta(slotType)
            const ts = t.helfen.slotType
            const cta =
              slotType === 'gift' ? ts.ctaGift
              : slotType === 'money' ? ts.ctaMoney
              : ts.ctaTask
            const typeLabel =
              slotType === 'gift' ? ts.gift
              : slotType === 'money' ? ts.money
              : ts.task
            return (
              <li
                key={slot.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary/70 text-primary"
                  >
                    {typeMeta.icon}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    {typeLabel}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-primary">
                      {t.helfen.categoryShort[slot.category]}
                    </p>
                    {slot.description && (
                      <p className="mt-1 text-sm text-foreground">{slot.description}</p>
                    )}
                    {slotType === 'money' && slot.suggested_amount != null && (
                      <p className="mt-1 text-xs font-medium text-primary">
                        {ts.suggestedAmount.replace('{amount}', String(slot.suggested_amount))}
                      </p>
                    )}
                    {(slot.date || slot.time) && (
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {slot.date && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" strokeWidth={1.5} />
                            {formatDate(slot.date)}
                          </span>
                        )}
                        {slot.time && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" strokeWidth={1.5} />
                            {slot.time}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setSelectedSlot(slot)}
                    className="shrink-0 gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Heart className="h-3 w-3" strokeWidth={2} />
                    {cta}
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Claimed slots */}
      {claimedSlots.length > 0 && (
        <section className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {/* simple inline label */}
            ❤️ {claimedSlots.length}
          </p>
          <ul className="space-y-2">
            {claimedSlots.map((slot) => (
              <li
                key={slot.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-4 py-2 text-sm"
              >
                <span className="text-muted-foreground">
                  {t.helfen.categoryShort[slot.category]}
                  {slot.date ? ` · ${formatDate(slot.date)}` : ''}
                </span>
                <span className="text-primary">
                  💛 {slot.helper_name}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Claim dialog */}
      <Dialog open={!!selectedSlot} onOpenChange={(o) => !o && setSelectedSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSlot ? t.helfen.categoryShort[selectedSlot.category] : ''}
            </DialogTitle>
            {selectedSlot?.description && (
              <DialogDescription>{selectedSlot.description}</DialogDescription>
            )}
          </DialogHeader>

          {done ? (
            <div className="space-y-3">
              <p className="rounded-xl bg-secondary p-4 text-center text-sm text-primary">
                {t.helfen.done}
              </p>
              {selectedSlot && (
                <div className="flex flex-col gap-2">
                  {/* Target-URL for gift/money slots */}
                  {selectedSlot.target_url && (selectedSlot.slot_type === 'gift' || selectedSlot.slot_type === 'money') && (
                    <a
                      href={selectedSlot.target_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-card px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-secondary/60"
                    >
                      {selectedSlot.slot_type === 'gift' ? (
                        <><Gift className="h-4 w-4" strokeWidth={1.5} /> {t.helfen.slotType.ctaGift}</>
                      ) : (
                        <><Wallet className="h-4 w-4" strokeWidth={1.5} /> {t.helfen.slotType.ctaMoney}</>
                      )}
                      <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                    </a>
                  )}
                  {/* iCal-Download for task slots with a date */}
                  {selectedSlot.date && (selectedSlot.slot_type ?? 'task') === 'task' && (
                    <a
                      href={`/api/helfen/${token}/ics/${selectedSlot.id}`}
                      aria-label={t.helfen.icalDownloadAria}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-secondary/60"
                    >
                      <CalendarPlus className="h-4 w-4" strokeWidth={1.5} />
                      {t.helfen.icalDownload}
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="helper-name">{t.helfen.yourName}</Label>
                <Input
                  id="helper-name"
                  value={helperName}
                  onChange={(e) => setHelperName(e.target.value)}
                  placeholder={t.helfen.yourNamePlaceholder}
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="helper-msg">{t.helfen.message}</Label>
                <Textarea
                  id="helper-msg"
                  value={helperMessage}
                  onChange={(e) => setHelperMessage(e.target.value)}
                  placeholder={t.helfen.messagePlaceholder}
                  rows={2}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {done ? (
              <Button
                variant="outline"
                onClick={() => {
                  setDone(false)
                  setSelectedSlot(null)
                  setHelperName('')
                  setHelperMessage('')
                }}
              >
                {t.helfen.closeDialog}
              </Button>
            ) : (
              <Button
                onClick={submitClaim}
                disabled={!helperName.trim() || submitting}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" strokeWidth={1.5} />
                {submitting ? t.helfen.submitting : t.helfen.submit}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/**
 * Icon + Label metadata for a slot's type. task=Aufgabe, gift=Geschenk,
 * money=Geldbeitrag. Consumed by the slot cards in the open-list.
 */
function getSlotTypeMeta(t: 'task' | 'gift' | 'money') {
  if (t === 'gift') return { icon: <Gift className="h-3.5 w-3.5" strokeWidth={1.5} /> }
  if (t === 'money') return { icon: <Wallet className="h-3.5 w-3.5" strokeWidth={1.5} /> }
  return { icon: <HeartHandshake className="h-3.5 w-3.5" strokeWidth={1.5} /> }
}
