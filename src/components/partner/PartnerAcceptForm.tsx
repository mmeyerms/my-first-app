'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Props {
  token: string
}

type Role = 'papa' | 'mama' | 'oma' | 'opa' | 'bestie' | 'andere'

const ROLES: Array<{ key: Role; label: string; emoji: string; hint: string }> = [
  { key: 'papa', label: 'Papa', emoji: '👨', hint: 'Der zweite Elternteil' },
  { key: 'mama', label: 'Mama', emoji: '👩', hint: 'Zweite Mama / Co-Elternteil' },
  { key: 'oma', label: 'Oma', emoji: '👵', hint: 'Zukünftige Oma' },
  { key: 'opa', label: 'Opa', emoji: '👴', hint: 'Zukünftiger Opa' },
  { key: 'bestie', label: 'Bestie', emoji: '💛', hint: 'Enge Vertrauensperson' },
  { key: 'andere', label: 'Andere', emoji: '💞', hint: 'Frei wählbar' },
]

export function PartnerAcceptForm({ token }: Props) {
  const [role, setRole] = useState<Role | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function accept() {
    if (!role || !displayName.trim()) {
      setError('Bitte wähle eine Rolle und trage deinen Namen ein')
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
        setError(typeof body.error === 'string' ? body.error : 'Etwas ist schiefgelaufen')
        return
      }
      // Hard-redirect: middleware picks up the new partner_link and future
      // requests route to /partner/dashboard.
      window.location.href = '/partner/dashboard'
    } catch {
      setError('Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="card-elevated">
      <CardContent className="space-y-6 p-6">
        <div className="text-center">
          <p aria-hidden="true" className="mb-2 text-4xl">💑</p>
          <h1 className="font-display text-2xl font-medium text-foreground">
            Du wurdest eingeladen
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sag der werdenden Mama, wer du bist. Dein Name erscheint bei ihr in der App.
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Wer bist du?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => {
              const isActive = role === r.key
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
                  <span className="text-sm font-semibold text-foreground">{r.label}</span>
                  <span className="text-[11px] text-muted-foreground">{r.hint}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label htmlFor="pn-display-name" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Dein Name
          </label>
          <Input
            id="pn-display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value.slice(0, 50))}
            placeholder="z.B. Sarah, Max, Uwe…"
            maxLength={50}
          />
          <p className="mt-1.5 text-[11px] italic text-muted-foreground">
            So wird sie dich sehen: „{role ? ROLES.find((r) => r.key === role)!.label : 'Rolle'} {displayName.trim() || '…'}"
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verbinde…
            </>
          ) : (
            'Verbindung annehmen'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
