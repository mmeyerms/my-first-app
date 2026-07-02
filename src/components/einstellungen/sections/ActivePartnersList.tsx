'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Trash2, UserCheck, UserPlus } from 'lucide-react'
import { useLocale, useT } from '@/lib/i18n/client'
import { cn } from '@/lib/utils'

interface PartnerEntry {
  partnerUserId: string
  role: 'papa' | 'mama' | 'oma' | 'opa' | 'bestie' | 'andere' | null
  displayName: string | null
  createdAt: string
}

interface FetchResult {
  hasPartner: boolean
  partners: PartnerEntry[]
  pendingToken: string | null
  pendingExpiry: string | null
}

function formatDate(iso: string, locale: 'de' | 'en'): string {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d)
  } catch {
    return iso
  }
}

export function ActivePartnersList() {
  const t = useT()
  const { locale } = useLocale()
  const ts = t.settings.partner.list
  const tsInvite = t.settings.partner.inviteLink

  const [state, setState] = useState<
    { status: 'loading' } | { status: 'ready'; data: FetchResult } | { status: 'error'; message: string }
  >({ status: 'loading' })
  const [removingId, setRemovingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const res = await fetch('/api/partner/invite', { cache: 'no-store' })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as FetchResult
      setState({ status: 'ready', data })
    } catch {
      setState({ status: 'error', message: ts.errorLoad })
    }
  }, [ts.errorLoad])

  useEffect(() => {
    void load()
  }, [load])

  async function remove(entry: PartnerEntry) {
    const displayName = entry.displayName?.trim() || ts.roleLabel[entry.role ?? 'unknown']
    const message = ts.removeConfirm.replace('{name}', displayName)
    if (!confirm(message)) return

    setRemovingId(entry.partnerUserId)
    try {
      const res = await fetch(
        `/api/partner/invite?partnerId=${encodeURIComponent(entry.partnerUserId)}`,
        { method: 'DELETE' },
      )
      if (!res.ok) throw new Error(String(res.status))
      await load()
    } catch {
      alert(ts.errorRemove)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <section aria-labelledby="active-partners-heading">
      <div className="mb-3">
        <h2
          id="active-partners-heading"
          className="text-sm font-semibold text-foreground"
        >
          {ts.title}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">{ts.description}</p>
      </div>

      {state.status === 'loading' && (
        <p className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-xs text-muted-foreground">
          {ts.loading}
        </p>
      )}

      {state.status === 'error' && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive">
          {state.message}
        </p>
      )}

      {state.status === 'ready' && state.data.partners.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-5 text-center">
          <span
            aria-hidden="true"
            className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground"
          >
            <UserPlus className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <p className="mb-3 text-xs text-muted-foreground">{ts.empty}</p>
          <Link
            href="/partner"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
          >
            {ts.emptyCta}
            <ArrowRight className="h-3 w-3" strokeWidth={2} />
          </Link>
        </div>
      )}

      {state.status === 'ready' && state.data.partners.length > 0 && (
        <ul className="space-y-2">
          {state.data.partners.map((entry) => {
            const roleLabel =
              ts.roleLabel[entry.role ?? 'unknown']
            const name = entry.displayName?.trim() || roleLabel
            const isRemoving = removingId === entry.partnerUserId
            return (
              <li
                key={entry.partnerUserId}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/70 text-primary"
                >
                  <UserCheck className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {name}
                    </span>
                    <span className="inline-flex shrink-0 items-center rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {roleLabel}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {ts.joinedOn.replace(
                      '{date}',
                      formatDate(entry.createdAt, locale),
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(entry)}
                  disabled={isRemoving}
                  aria-label={ts.removeAria}
                  className={cn(
                    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors',
                    'hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <Link
        href="/partner"
        className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-secondary/40"
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/70 text-primary"
        >
          <UserPlus className="h-4 w-4" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-foreground">
            {tsInvite.title}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {tsInvite.description}
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
      </Link>
    </section>
  )
}
