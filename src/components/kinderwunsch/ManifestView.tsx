'use client'

import { useEffect, useMemo, useState } from 'react'
import { Printer, ScrollText, Signature, X } from 'lucide-react'

import { MANIFEST_VORSCHLAEGE } from '@/lib/kinderwunsch/manifest'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ManifestCertificate } from './ManifestCertificate'
import { buildManifestCertificateHtml } from '@/lib/kinderwunsch/certificateHtml'
import { useLocale } from '@/lib/i18n/client'
import { localized } from '@/lib/i18n/localized'
import { useTheme } from '@/lib/theme/client'
import { useT } from '@/lib/i18n/client'

const STORAGE_KEY = 'mamamap-kw-manifest'
const ISLAND = 'manifest'

type CustomStatement = {
  id: string
  text: string
}

type ManifestState = {
  agreed: string[]
  custom: CustomStatement[]
  signedAt?: string
  mama?: string
  partner?: string
}

const EMPTY_STATE: ManifestState = {
  agreed: [],
  custom: [],
}

export function ManifestView() {
  const { locale } = useLocale()
  const { theme } = useTheme()
  const t = useT()
  const isClassic = theme === 'classic'
  const [state, setState] = useState<ManifestState>(EMPTY_STATE)
  const [hydrated, setHydrated] = useState(false)
  const [newCustom, setNewCustom] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  useEffect(() => {
    let cancelled = false

    function normalize(input: unknown): ManifestState {
      const v = input && typeof input === 'object' ? (input as Partial<ManifestState>) : {}
      const customRaw = Array.isArray(v.custom) ? v.custom : []
      const custom: CustomStatement[] = customRaw.filter(
        (c): c is CustomStatement =>
          !!c &&
          typeof c === 'object' &&
          typeof (c as CustomStatement).id === 'string' &&
          typeof (c as CustomStatement).text === 'string',
      )
      const agreedRaw = Array.isArray(v.agreed) ? v.agreed : []
      const agreed = agreedRaw.filter((x): x is string => typeof x === 'string')
      return {
        agreed,
        custom,
        signedAt: typeof v.signedAt === 'string' ? v.signedAt : undefined,
        mama: typeof v.mama === 'string' ? v.mama : undefined,
        partner: typeof v.partner === 'string' ? v.partner : undefined,
      }
    }

    function isEmpty(s: ManifestState): boolean {
      return (
        s.agreed.length === 0 &&
        s.custom.length === 0 &&
        !s.signedAt &&
        !s.mama &&
        !s.partner
      )
    }

    fetch('/api/kinderwunsch')
      .then((r) => r.json())
      .then(async (data) => {
        if (cancelled) return
        const apiState = normalize(data?.[ISLAND])

        if (isEmpty(apiState) && typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
              const parsed = normalize(JSON.parse(raw))
              if (!isEmpty(parsed)) {
                await fetch(`/api/kinderwunsch/${ISLAND}`, {
                  method: 'PUT',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ state: parsed }),
                })
                localStorage.removeItem(STORAGE_KEY)
                if (!cancelled) setState(parsed)
                return
              }
            }
          } catch {
            // ignore migration errors
          }
        }
        if (!cancelled) setState(apiState)
      })
      .catch(() => {
        // ignore fetch errors
      })
      .finally(() => {
        if (!cancelled) setHydrated(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const handle = setTimeout(() => {
      fetch(`/api/kinderwunsch/${ISLAND}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ state }),
      }).catch(() => {
        // ignore save errors
      })
    }, 500)
    return () => clearTimeout(handle)
  }, [state, hydrated])

  const isSigned = !!state.signedAt
  const totalSelected = state.agreed.length + state.custom.length

  const allStatements = useMemo<{ id: string; text: string }[]>(() => {
    const suggested = MANIFEST_VORSCHLAEGE.filter((s) =>
      state.agreed.includes(s.id),
    ).map((s) => ({ id: s.id, text: localized(s.text, locale) }))
    return [...suggested, ...state.custom]
  }, [state.agreed, state.custom, locale])

  function toggleAgreed(id: string) {
    if (isSigned) return
    setState((prev) => {
      const has = prev.agreed.includes(id)
      return {
        ...prev,
        agreed: has ? prev.agreed.filter((x) => x !== id) : [...prev.agreed, id],
      }
    })
  }

  function addCustom() {
    const trimmed = newCustom.trim()
    if (!trimmed || isSigned) return
    setState((prev) => ({
      ...prev,
      custom: [
        ...prev.custom,
        { id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text: trimmed },
      ],
    }))
    setNewCustom('')
    setShowCustomInput(false)
  }

  function removeCustom(id: string) {
    if (isSigned) return
    setState((prev) => ({
      ...prev,
      custom: prev.custom.filter((c) => c.id !== id),
    }))
  }

  function signManifest() {
    if (totalSelected === 0) return
    setState((prev) => ({ ...prev, signedAt: new Date().toISOString() }))
  }

  function breakSeal() {
    if (window.confirm(t.kinderwunsch.manifest.confirmEdit)) {
      setState((prev) => ({ ...prev, signedAt: undefined }))
    }
  }

  function handlePrint() {
    if (!state.signedAt) return
    const html = buildManifestCertificateHtml({
      statements: allStatements,
      signedAt: state.signedAt,
      mama: state.mama,
      partner: state.partner,
    })
    const win = window.open('', '_blank', 'width=900,height=1200,scrollbars=yes')
    if (!win) {
      alert(t.kinderwunsch.manifest.popupBlocked)
      return
    }
    win.document.open()
    win.document.write(html)
    win.document.close()
  }

  if (!hydrated) {
    return (
      <div className="rounded-2xl bg-card p-5 text-sm text-muted-foreground shadow-sm">
        Lade...
      </div>
    )
  }

  // Sealed view — Zertifikat-Design
  if (isSigned) {
    return (
      <div className="space-y-5">
        <ManifestCertificate
          statements={allStatements}
          signedAt={state.signedAt!}
          mama={state.mama}
          partner={state.partner}
        />

        {/* Action buttons (hidden in print) */}
        <div className="space-y-3 print:hidden">
          <Button
            onClick={handlePrint}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isClassic ? (
              <>🖨️ {t.kinderwunsch.manifest.printCta}</>
            ) : (
              <>
                <Printer className="mr-2 h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {t.kinderwunsch.manifest.printCta}
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {t.kinderwunsch.manifest.printTip}
          </p>
          <Button
            variant="outline"
            onClick={breakSeal}
            className="w-full border-primary/20 text-primary hover:bg-secondary hover:text-primary"
          >
            {t.kinderwunsch.manifest.editCta}
          </Button>
        </div>
      </div>
    )
  }

  // Editing view
  return (
    <div className="space-y-5">
      <section
        aria-label="Werte-Manifest Einleitung"
        className="rounded-2xl bg-card p-5 shadow-sm"
      >
        <h2
          className={
            isClassic
              ? 'flex items-center gap-2 text-base font-semibold text-foreground'
              : 'flex items-center gap-2 font-display text-xl font-medium text-foreground'
          }
        >
          {isClassic ? (
            <span aria-hidden="true">📜</span>
          ) : (
            <ScrollText className="h-5 w-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
          )}
          Werte-Manifest
        </h2>
        <p
          className={
            isClassic
              ? 'mt-2 text-sm text-muted-foreground'
              : 'mt-2 font-display text-sm italic text-muted-foreground'
          }
        >
          Welche Grundsätze wollt ihr als Eltern leben? Wählt 5 oder mehr — oder
          formuliert eigene.
        </p>
        <p className="mt-3 text-xs text-primary">
          {totalSelected === 0
            ? 'Noch nichts ausgewählt'
            : `${totalSelected} Grundsätze ausgewählt`}
        </p>
      </section>

      <section aria-label="Vorgeschlagene Grundsätze" className="space-y-3">
        {MANIFEST_VORSCHLAEGE.map((s) => {
          const checked = state.agreed.includes(s.id)
          return (
            <div
              key={s.id}
              className="rounded-2xl bg-card p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={s.id}
                  checked={checked}
                  onCheckedChange={() => toggleAgreed(s.id)}
                  className="mt-0.5 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label
                  htmlFor={s.id}
                  className={`flex-1 cursor-pointer text-sm leading-snug ${
                    checked ? 'font-medium text-foreground' : 'text-foreground/80'
                  }`}
                >
                  {localized(s.text, locale)}
                </Label>
              </div>
            </div>
          )
        })}
      </section>

      {state.custom.length > 0 && (
        <section aria-label="Eigene Grundsätze" className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Eure eigenen Grundsätze
          </p>
          {state.custom.map((c) => (
            <div
              key={c.id}
              className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-sm"
            >
              <span className="mt-0.5 text-primary" aria-hidden="true">
                •
              </span>
              <p className="flex-1 text-sm leading-snug text-foreground">{c.text}</p>
              <button
                type="button"
                onClick={() => removeCustom(c.id)}
                aria-label="Eigenen Grundsatz entfernen"
                className="text-muted-foreground/70 hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </section>
      )}

      <section aria-label="Eigene Verpflichtung hinzufügen">
        {showCustomInput ? (
          <div className="space-y-3 rounded-2xl bg-card p-4 shadow-sm">
            <Label htmlFor="new-custom" className="text-sm font-medium text-foreground/80">
              Eigene Verpflichtung
            </Label>
            <Input
              id="new-custom"
              value={newCustom}
              onChange={(e) => setNewCustom(e.target.value)}
              placeholder="z. B. Wir sind ehrlich, auch wenn es schwerfällt."
              className="border-border focus-visible:ring-ring"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustom()
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={addCustom}
                disabled={newCustom.trim().length === 0}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Speichern
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNewCustom('')
                  setShowCustomInput(false)
                }}
                className="border-primary/20 text-primary hover:bg-secondary hover:text-primary"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowCustomInput(true)}
            className="w-full border-primary/20 text-primary hover:bg-secondary hover:text-primary"
          >
            + Eigene Verpflichtung hinzufügen
          </Button>
        )}
      </section>

      <section
        aria-label="Manifest besiegeln"
        className="rounded-2xl bg-card p-5 shadow-sm"
      >
        <h3 className="text-base font-semibold text-foreground">
          Unser Manifest besiegeln
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Wenn ihr eure Grundsätze festhalten wollt, könnt ihr eure Namen ergänzen
          und das Manifest besiegeln.
        </p>
        <div className="mt-4 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="mama-name" className="text-sm font-medium text-foreground/80">
              Mama (Name)
            </Label>
            <Input
              id="mama-name"
              value={state.mama ?? ''}
              onChange={(e) => setState((prev) => ({ ...prev, mama: e.target.value }))}
              placeholder="optional"
              className="border-border focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="partner-name" className="text-sm font-medium text-foreground/80">
              Partner/in (Name)
            </Label>
            <Input
              id="partner-name"
              value={state.partner ?? ''}
              onChange={(e) => setState((prev) => ({ ...prev, partner: e.target.value }))}
              placeholder="optional"
              className="border-border focus-visible:ring-ring"
            />
          </div>
        </div>
        <Button
          onClick={signManifest}
          disabled={totalSelected === 0}
          className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isClassic ? (
            <>✍️ Wir verpflichten uns</>
          ) : (
            <>
              <Signature className="mr-2 h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Wir verpflichten uns
            </>
          )}
        </Button>
        {totalSelected === 0 && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Wählt mindestens einen Grundsatz aus, um das Manifest zu besiegeln.
          </p>
        )}
      </section>
    </div>
  )
}
