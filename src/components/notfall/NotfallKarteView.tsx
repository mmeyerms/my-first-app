'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Printer, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePreferences } from '@/lib/preferences/client'
import { useT } from '@/lib/i18n/client'
import type { NotfallKarte } from '@/lib/preferences/types'

interface Props {
  motherName: string
  dueDate: string | null
  ssw: number | null
}

/**
 * PROJ-13 Notfall-Karte.
 *
 * Form (persisted in user_preferences.settings.notfallKarte) + live preview
 * + two exports:
 *   1. PNG 1080×1920 for the phone lock screen — drawn on a hidden canvas,
 *      no external libs. Card sits in the lower half so the OS clock stays
 *      readable at the top.
 *   2. window.print() with a print stylesheet that isolates the wallet card
 *      at 85.6×53.98 mm (ISO credit-card size).
 */
export function NotfallKarteView({ motherName, dueDate, ssw }: Props) {
  const t = useT()
  const nk = t.notfallKarte
  const { prefs, update } = usePreferences()
  const [draft, setDraft] = useState<NotfallKarte>(prefs.notfallKarte)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sync draft when prefs load in (initial fetch may arrive after mount).
  useEffect(() => {
    setDraft(prefs.notfallKarte)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(prefs.notfallKarte)])

  function setField(key: keyof NotfallKarte, value: string) {
    const next = { ...draft, [key]: value }
    setDraft(next)
    // Debounced auto-save — 800ms after the last keystroke.
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveState('saving')
    saveTimer.current = setTimeout(() => {
      update({ notfallKarte: next })
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    }, 800)
  }

  const etLabel = dueDate
    ? new Date(dueDate + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : nk.card.none

  /** Rows shown on preview + exports — only non-empty ones. */
  const rows: Array<[string, string]> = [
    [nk.card.bloodType, draft.bloodType],
    [nk.card.allergies, draft.allergies],
    [nk.card.medications, draft.medications],
    [nk.card.conditions, draft.conditions],
    [nk.card.clinic, [draft.clinicName, draft.clinicAddress, draft.clinicPhone].filter(Boolean).join(' · ')],
    [nk.card.contact, [draft.emergencyContactName, draft.emergencyContactPhone].filter(Boolean).join(' · ')],
  ].filter(([, v]) => v.trim() !== '') as Array<[string, string]>

  function downloadImage() {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = 1080
    const H = 1920
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Paper background
    ctx.fillStyle = '#F5F0E9'
    ctx.fillRect(0, 0, W, H)
    // Subtle dot grid
    ctx.fillStyle = 'rgba(216, 205, 187, 0.6)'
    for (let y = 0; y < H; y += 36) {
      for (let x = 0; x < W; x += 36) {
        ctx.beginPath()
        ctx.arc(x, y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Card area — lower 60% so the OS clock has room on top.
    const cardX = 60
    const cardY = 700
    const cardW = W - 120
    const cardH = 1050
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#614141'
    ctx.lineWidth = 4
    roundRect(ctx, cardX, cardY, cardW, cardH, 32)
    ctx.fill()
    ctx.stroke()

    // Header bar
    ctx.fillStyle = '#614141'
    roundRectTop(ctx, cardX, cardY, cardW, 150, 32)
    ctx.fill()

    ctx.fillStyle = '#F5F0E9'
    ctx.font = '600 52px Georgia, serif'
    ctx.fillText(nk.card.title, cardX + 48, cardY + 72)
    ctx.font = 'italic 34px Georgia, serif'
    ctx.fillStyle = '#E4CBA6'
    ctx.fillText(nk.card.subtitle, cardX + 48, cardY + 122)

    // Body
    let y = cardY + 230
    ctx.fillStyle = '#2A1F1F'
    ctx.font = '600 44px Georgia, serif'
    ctx.fillText(motherName, cardX + 48, y)
    y += 56
    ctx.font = '34px -apple-system, sans-serif'
    ctx.fillStyle = '#6E5A5A'
    ctx.fillText(`${nk.card.et}: ${etLabel}${ssw ? `   ·   ${nk.card.ssw} ${ssw}` : ''}`, cardX + 48, y)
    y += 40

    for (const [label, value] of rows) {
      y += 52
      if (y > cardY + cardH - 60) break
      ctx.font = '600 28px -apple-system, sans-serif'
      ctx.fillStyle = '#A08F8F'
      ctx.fillText(label.toUpperCase(), cardX + 48, y)
      y += 44
      ctx.font = '36px -apple-system, sans-serif'
      ctx.fillStyle = '#2A1F1F'
      // Simple wrap at ~44 chars
      const wrapped = wrapText(value, 46)
      for (const line of wrapped.slice(0, 2)) {
        ctx.fillText(line, cardX + 48, y)
        y += 44
      }
      y -= 44
    }

    // 112 footer
    ctx.font = '600 40px -apple-system, sans-serif'
    ctx.fillStyle = '#A56347'
    ctx.fillText('Notruf: 112', cardX + 48, cardY + cardH - 48)

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mamamap-notfallkarte.png'
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm print:hidden">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-base font-medium text-foreground">{nk.form.heading}</h2>
          <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground" aria-live="polite">
            {saveState === 'saving' ? nk.form.saving : saveState === 'saved' ? (
              <span className="inline-flex items-center gap-1 text-sage"><Check className="h-3 w-3" /> {nk.form.saved}</span>
            ) : ''}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ['bloodType', nk.form.bloodType, nk.form.bloodTypePlaceholder],
              ['allergies', nk.form.allergies, nk.form.allergiesPlaceholder],
              ['medications', nk.form.medications, nk.form.medicationsPlaceholder],
              ['conditions', nk.form.conditions, nk.form.conditionsPlaceholder],
              ['clinicName', nk.form.clinicName, nk.form.clinicNamePlaceholder],
              ['clinicAddress', nk.form.clinicAddress, nk.form.clinicAddressPlaceholder],
              ['clinicPhone', nk.form.clinicPhone, nk.form.clinicPhonePlaceholder],
              ['emergencyContactName', nk.form.emergencyContactName, nk.form.emergencyContactNamePlaceholder],
              ['emergencyContactPhone', nk.form.emergencyContactPhone, nk.form.emergencyContactPhonePlaceholder],
            ] as Array<[keyof NotfallKarte, string, string]>
          ).map(([key, label, placeholder]) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`nk-${key}`} className="text-xs">{label}</Label>
              <Input
                id={`nk-${key}`}
                value={draft[key]}
                onChange={(e) => setField(key, e.target.value.slice(0, 120))}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Preview — this is also the print target */}
      <section aria-label={nk.card.heading}>
        <h2 className="mb-3 font-display text-base font-medium text-foreground print:hidden">{nk.card.heading}</h2>
        <div
          id="notfall-card-print"
          className="overflow-hidden rounded-2xl border-2 border-primary bg-white shadow-md print:rounded-none print:border print:shadow-none"
        >
          <div className="bg-primary px-5 py-3">
            <p className="font-display text-lg font-semibold tracking-wide text-primary-foreground">{nk.card.title}</p>
            <p className="font-display text-xs italic text-accent">{nk.card.subtitle}</p>
          </div>
          <div className="space-y-2.5 px-5 py-4">
            <div>
              <p className="font-display text-base font-semibold text-ink">{motherName}</p>
              <p className="text-xs text-muted-foreground">
                {nk.card.et}: {etLabel}{ssw ? ` · ${nk.card.ssw} ${ssw}` : ''}
              </p>
            </div>
            {rows.map(([label, value]) => (
              <div key={label}>
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
                <p className="text-sm text-foreground">{value}</p>
              </div>
            ))}
            <p className="pt-1 text-sm font-semibold text-alert">Notruf: 112</p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="space-y-3 print:hidden">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={downloadImage} className="flex-1 gap-2">
            <Download className="h-4 w-4" strokeWidth={1.5} />
            {nk.actions.downloadImage}
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="flex-1 gap-2">
            <Printer className="h-4 w-4" strokeWidth={1.5} />
            {nk.actions.print}
          </Button>
        </div>
        <p className="font-display text-xs italic text-muted-foreground">{nk.actions.imageHint}</p>
      </section>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Print isolation: hide everything except the card */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #notfall-card-print, #notfall-card-print * { visibility: visible; }
          #notfall-card-print {
            position: fixed; left: 0; top: 0;
            width: 85.6mm; min-height: 53.98mm;
          }
        }
      `}</style>
    </div>
  )
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function roundRectTop(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) lines.push(current.trim())
      current = word
    } else {
      current = (current + ' ' + word).trim()
    }
  }
  if (current) lines.push(current)
  return lines
}
