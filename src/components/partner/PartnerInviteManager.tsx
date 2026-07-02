'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Copy, Check, Plus, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Partner {
  partnerUserId: string
  role: 'papa' | 'mama' | 'oma' | 'opa' | 'bestie' | 'andere' | null
  displayName: string | null
  createdAt: string
}

interface PartnerStatus {
  hasPartner: boolean
  partners: Partner[]
  pendingToken: string | null
  pendingExpiry: string | null
}

interface Props {
  initialStatus?: PartnerStatus
}

const ROLE_META: Record<NonNullable<Partner['role']>, { label: string; emoji: string }> = {
  papa: { label: 'Papa', emoji: '👨' },
  mama: { label: 'Mama', emoji: '👩' },
  oma: { label: 'Oma', emoji: '👵' },
  opa: { label: 'Opa', emoji: '👴' },
  bestie: { label: 'Bestie', emoji: '💛' },
  andere: { label: 'Andere', emoji: '💞' },
}

export function PartnerInviteManager({ initialStatus }: Props) {
  const [status, setStatus] = useState<PartnerStatus>(
    initialStatus ?? { hasPartner: false, partners: [], pendingToken: null, pendingExpiry: null },
  )
  const [loading, setLoading] = useState(!initialStatus)
  const [copied, setCopied] = useState(false)
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const inviteUrl = status.pendingToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/partner/accept/${status.pendingToken}`
    : null

  async function reload() {
    try {
      const res = await fetch('/api/partner/invite')
      const data = await res.json()
      setStatus(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialStatus) void reload()
  }, [initialStatus])

  async function createInvite() {
    setBusy(true)
    try {
      const res = await fetch('/api/partner/invite', { method: 'POST' })
      if (res.ok) await reload()
    } finally {
      setBusy(false)
    }
  }

  async function revokePartner(partnerId: string) {
    setBusy(true)
    try {
      await fetch(`/api/partner/invite?partnerId=${encodeURIComponent(partnerId)}`, {
        method: 'DELETE',
      })
      await reload()
    } finally {
      setBusy(false)
      setConfirmRevokeId(null)
    }
  }

  async function revokeInvite() {
    setBusy(true)
    try {
      await fetch('/api/partner/invite', { method: 'DELETE' })
      await reload()
    } finally {
      setBusy(false)
    }
  }

  async function copyLink() {
    if (inviteUrl) {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/30 p-4 text-sm italic text-muted-foreground">
        Lade Partner…
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Connected partners list */}
      {status.partners.length > 0 && (
        <section>
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Verbundene Partner ({status.partners.length})
          </p>
          <ul className="space-y-2">
            {status.partners.map((p) => {
              const meta = p.role ? ROLE_META[p.role] : null
              const displayName = p.displayName?.trim() || meta?.label || 'Unbekannt'
              return (
                <li
                  key={p.partnerUserId}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-lg"
                  >
                    {meta?.emoji ?? '💑'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground">{displayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {meta?.label ?? 'Andere'} · verbunden seit{' '}
                      {new Date(p.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmRevokeId(p.partnerUserId)}
                    disabled={busy}
                    aria-label={`${displayName} entfernen`}
                    title="Verbindung entfernen"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="mt-2 px-1 text-[11px] italic text-muted-foreground">
            Deine Partner sehen nur die Bereiche die du in{' '}
            <Link href="/einstellungen" className="underline decoration-dotted hover:text-primary">
              Einstellungen
            </Link>{' '}
            freigegeben hast.
          </p>
        </section>
      )}

      {/* Pending invite link */}
      {status.pendingToken && inviteUrl && (
        <Card className="border-dashed">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm font-semibold">Einladungslink aktiv</p>
              <Badge variant="secondary" className="text-[10px]">Offen</Badge>
            </div>
            <div className="rounded-lg bg-secondary/40 p-2 font-mono text-[11px] leading-relaxed text-muted-foreground break-all">
              {inviteUrl}
            </div>
            {status.pendingExpiry && (
              <p className="text-[11px] italic text-muted-foreground">
                Gültig bis:{' '}
                {new Date(status.pendingExpiry).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            )}
            <div className="flex gap-2">
              <Button onClick={copyLink} variant="outline" size="sm" className="flex-1 gap-1.5">
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Kopiert
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Link kopieren
                  </>
                )}
              </Button>
              <Button
                onClick={revokeInvite}
                variant="ghost"
                size="sm"
                disabled={busy}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Widerrufen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create new invite */}
      {!status.pendingToken && (
        <Button
          onClick={createInvite}
          disabled={busy}
          variant="outline"
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          {status.partners.length === 0 ? 'Ersten Partner einladen' : 'Weiteren Partner einladen'}
        </Button>
      )}

      {/* Empty state hint */}
      {status.partners.length === 0 && !status.pendingToken && (
        <p className="rounded-xl border border-dashed border-border/60 bg-secondary/30 p-3 text-xs italic text-muted-foreground">
          Papa, Mama, Oma, Opa, deine Bestie — jede:r kann sich mit einem eigenen Namen und Rolle
          verbinden. Sie sehen nur was du in den Einstellungen freigibst.
        </p>
      )}

      <AlertDialog open={confirmRevokeId !== null} onOpenChange={(o) => !o && setConfirmRevokeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verbindung entfernen?</AlertDialogTitle>
            <AlertDialogDescription>
              Die Person verliert sofort den Zugriff auf deine App-Inhalte. Sie kann jederzeit neu
              eingeladen werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmRevokeId && revokePartner(confirmRevokeId)}
              disabled={busy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Entfernen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
