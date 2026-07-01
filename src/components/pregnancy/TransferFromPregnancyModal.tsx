'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ArrowRight, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Pregnancy } from '@/lib/pregnancy/server'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The pregnancy to copy INTO (target). Defaults to current active if omitted. */
  targetPregnancyId?: string
  /** Called after a successful transfer. */
  onSuccess?: () => void
}

interface TransferFlags {
  geburtsplanAnswers: boolean
  packliste: boolean
  einkaufsliste: boolean
  wochenbett: boolean
  kinderwunschManifest: boolean
  kinderwunschArzt: boolean
}

const DEFAULTS: TransferFlags = {
  geburtsplanAnswers: true,
  packliste: true,
  einkaufsliste: true,
  wochenbett: true,
  kinderwunschManifest: false,
  kinderwunschArzt: false,
}

const ITEMS: Array<{
  key: keyof TransferFlags
  label: string
  hint: string
}> = [
  {
    key: 'geburtsplanAnswers',
    label: 'Geburtsplan-Antworten',
    hint: 'Deine Antworten aus dem Wizard als Startpunkt',
  },
  {
    key: 'packliste',
    label: 'Packliste — Eigene Items',
    hint: 'Custom-Items + ausgeblendete Items (Häkchen zurückgesetzt)',
  },
  {
    key: 'einkaufsliste',
    label: 'Einkaufsliste — Eigene Items',
    hint: 'Custom-Items + ausgeblendete Items (Häkchen zurückgesetzt)',
  },
  {
    key: 'wochenbett',
    label: 'Wochenbett-Liste',
    hint: 'Custom-Items + ausgeblendete Items (Häkchen zurückgesetzt)',
  },
  {
    key: 'kinderwunschManifest',
    label: 'Kinderwunsch — Manifest',
    hint: 'Manifestations-Aussagen die du gewählt/geschrieben hast',
  },
  {
    key: 'kinderwunschArzt',
    label: 'Kinderwunsch — Arzt-Fragen',
    hint: 'Fragen die du bereits gestellt hast',
  },
]

export function TransferFromPregnancyModal({
  open,
  onOpenChange,
  targetPregnancyId,
  onSuccess,
}: Props) {
  const [pregnancies, setPregnancies] = useState<Pregnancy[]>([])
  const [fromId, setFromId] = useState<string>('')
  const [toId, setToId] = useState<string>(targetPregnancyId ?? '')
  const [flags, setFlags] = useState<TransferFlags>(DEFAULTS)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setFlags(DEFAULTS)
    fetch('/api/pregnancies', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: Pregnancy[]) => {
        if (!Array.isArray(data)) return
        setPregnancies(data)
        const active = data.find((p) => p.is_active)
        const initialTo = targetPregnancyId ?? active?.id ?? ''
        setToId(initialTo)
        // Default source = newest non-target
        const others = data
          .filter((p) => p.id !== initialTo)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setFromId(others[0]?.id ?? '')
      })
      .finally(() => setLoading(false))
  }, [open, targetPregnancyId])

  const sourceOptions = useMemo(
    () => pregnancies.filter((p) => p.id !== toId),
    [pregnancies, toId],
  )
  const targetOptions = useMemo(
    () => pregnancies.filter((p) => p.id !== fromId),
    [pregnancies, fromId],
  )

  function formatOption(p: Pregnancy): string {
    const name = p.baby_name?.trim() || 'ohne Namen'
    const year = p.due_date?.slice(0, 4) ?? p.birth_date?.slice(0, 4) ?? p.created_at.slice(0, 4)
    const status = {
      planning: 'Kinderwunsch',
      pregnant: 'Aktiv',
      born: 'Geboren',
      sternenkind: 'Sternenkind',
    }[p.status] ?? p.status
    return `${name} — ${status} · ${year}`
  }

  async function handleSubmit() {
    if (!fromId || !toId || fromId === toId) return
    const activeCount = Object.values(flags).filter(Boolean).length
    if (activeCount === 0) {
      toast.error('Wähle mindestens einen Bereich aus.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/pregnancies/transfer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fromPregnancyId: fromId,
          toPregnancyId: toId,
          transfer: flags,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(typeof err.error === 'string' ? err.error : 'Übernahme fehlgeschlagen')
      }
      const body = await res.json()
      const summary = (body?.summary ?? {}) as Record<string, boolean>
      const copied = Object.entries(summary).filter(([, v]) => v).length
      if (copied === 0) {
        toast.info('Nichts zu übernehmen — in der Quelle gab es keine Daten.')
      } else {
        toast.success(`${copied} Bereich${copied === 1 ? '' : 'e'} übernommen.`)
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Übernahme fehlgeschlagen')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = !!fromId && !!toId && fromId !== toId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-medium">
            Aus vorheriger Schwangerschaft übernehmen
          </DialogTitle>
          <DialogDescription className="font-display text-sm italic text-muted-foreground">
            Deine Personalisierung (Design, Anrede, Custom-Kategorien) ist automatisch für alle Schwangerschaften aktiv. Hier kannst du zusätzlich Daten aus einer alten SS in deine neue kopieren.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : pregnancies.length < 2 ? (
          <p className="rounded-xl border border-dashed border-border/60 bg-secondary/30 p-4 text-sm text-muted-foreground">
            Es gibt aktuell nur eine Schwangerschaft — nichts zum Übernehmen.
          </p>
        ) : (
          <div className="space-y-5">
            {/* Direction selectors */}
            <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-secondary/20 p-3 sm:grid-cols-[1fr_auto_1fr]">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Von</label>
                <Select value={fromId} onValueChange={setFromId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Quelle wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {formatOption(p)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ArrowRight className="mx-auto hidden self-end pb-3 text-muted-foreground sm:block" />
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Nach</label>
                <Select value={toId} onValueChange={setToId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ziel wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {formatOption(p)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggle list */}
            <ul className="space-y-2">
              {ITEMS.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.hint}</div>
                  </div>
                  <Switch
                    checked={flags[item.key]}
                    onCheckedChange={(v) => setFlags((prev) => ({ ...prev, [item.key]: v }))}
                  />
                </li>
              ))}
            </ul>

            <p className="text-xs italic text-muted-foreground">
              Nicht übernommen: Termine (praxisbezogene Vorschläge findest du direkt beim Anlegen als Autosuggest) und Tagebuch-Einträge (baby-spezifisch).
            </p>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting || loading}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Übernehme…
              </>
            ) : (
              'Übernehmen'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
