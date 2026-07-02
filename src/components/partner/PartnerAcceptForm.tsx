'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n/client'

interface Props {
  token: string
}

type Role = 'papa' | 'mama' | 'oma' | 'opa' | 'bestie' | 'andere'

const ROLE_KEYS: ReadonlyArray<{ key: Role; emoji: string }> = [
  { key: 'papa', emoji: '👨' },
  { key: 'mama', emoji: '👩' },
  { key: 'oma', emoji: '👵' },
  { key: 'opa', emoji: '👴' },
  { key: 'bestie', emoji: '💛' },
  { key: 'andere', emoji: '💞' },
]

export function PartnerAcceptForm({ token }: Props) {
  const t = useT()
  const [role, setRole] = useState<Role | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function accept() {
    if (!role || !displayName.trim()) {
      setError(t.partner.accept.errorMissing)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/partner/invite', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, role, displayName: displayName.trim() }),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(typeof body.error === 'string' ? body.error : t.partner.accept.errorGeneric)
        return
      }
      // Hard-redirect: middleware picks up the new partner_link and future
      // requests route to /partner/dashboard.
      window.location.href = '/partner/dashboard'
    } catch {
      setError(t.partner.accept.errorNetwork)
    } finally {
      setLoading(false)
    }
  }

  const selectedRoleLabel = role
    ? t.partner.accept.roles[role].label
    : t.partner.accept.previewFallback
  const previewText = t.partner.accept.previewText
    .replace('{role}', selectedRoleLabel)
    .replace('{name}', displayName.trim() || t.partner.accept.previewName)

  return (
    <Card className="card-elevated">
      <CardContent className="space-y-6 p-6">
        <div className="text-center">
          <p aria-hidden="true" className="mb-2 text-4xl">💑</p>
          <h1 className="font-display text-2xl font-medium text-foreground">
            {t.partner.accept.heading}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.partner.accept.subtitle}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t.partner.accept.whoLabel}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_KEYS.map((r) => {
              const isActive = role === r.key
              const roleMeta = t.partner.accept.roles[r.key]
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  aria-pressed={isActive}
                  className={cn(
                    'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all',
                    isActive
                      ? 'border-primary bg-secondary/60 ring-2 ring-primary/40'
                      : 'border-border bg-card hover:border-primary/40',
                  )}
                >
                  <span aria-hidden="true" className="text-2xl">{r.emoji}</span>
                  <span className="text-sm font-semibold text-foreground">{roleMeta.label}</span>
                  <span className="text-[11px] text-muted-foreground">{roleMeta.hint}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label htmlFor="pn-display-name" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t.partner.accept.nameLabel}
          </label>
          <Input
            id="pn-display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value.slice(0, 50))}
            placeholder={t.partner.accept.namePlaceholder}
            maxLength={50}
          />
          <p className="mt-1.5 text-[11px] italic text-muted-foreground">
            {previewText}
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button
          onClick={accept}
          disabled={loading || !role || !displayName.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.partner.accept.submitting}
            </>
          ) : (
            t.partner.accept.submit
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
