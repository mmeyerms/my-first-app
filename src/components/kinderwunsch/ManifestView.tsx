'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'

import { MANIFEST_VORSCHLAEGE } from '@/lib/kinderwunsch/manifest'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const STORAGE_KEY = 'mamamap-kw-manifest'

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

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}.${mm}.${yyyy}`
  } catch {
    return ''
  }
}

export function ManifestView() {
  const [state, setState] = useState<ManifestState>(EMPTY_STATE)
  const [hydrated, setHydrated] = useState(false)
  const [newCustom, setNewCustom] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ManifestState
        if (parsed && typeof parsed === 'object') {
          setState({
            agreed: Array.isArray(parsed.agreed) ? parsed.agreed : [],
            custom: Array.isArray(parsed.custom) ? parsed.custom : [],
            signedAt: typeof parsed.signedAt === 'string' ? parsed.signedAt : undefined,
            mama: typeof parsed.mama === 'string' ? parsed.mama : undefined,
            partner: typeof parsed.partner === 'string' ? parsed.partner : undefined,
          })
        }
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated])

  const isSigned = !!state.signedAt
  const totalSelected = state.agreed.length + state.custom.length

  const allStatements = useMemo(() => {
    const suggested = MANIFEST_VORSCHLAEGE.filter((s) => state.agreed.includes(s.id))
    return [...suggested, ...state.custom]
  }, [state.agreed, state.custom])

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
    if (window.confirm('Möchtet ihr das Manifest wirklich wieder bearbeiten?')) {
      setState((prev) => ({ ...prev, signedAt: undefined }))
    }
  }

  function handlePrint() {
    window.print()
  }

  // Sealed view (also styled for print)
  if (isSigned) {
    return (
      <div className="space-y-5 print:space-y-8">
        {/* Sealed card (screen) */}
        <section
          aria-label="Besiegeltes Manifest"
          className="rounded-2xl border-2 border-rose-200 bg-white p-6 shadow-sm print:border-0 print:p-0 print:shadow-none"
        >
          <div className="text-center print:mb-8">
            <p className="text-xs uppercase tracking-widest text-rose-500 print:text-base print:tracking-wider">
              Unser Eltern-Manifest
            </p>
            <div className="mt-2 text-4xl print:hidden">📜</div>
            <h2 className="mt-2 text-lg font-bold text-gray-800 print:mt-6 print:text-3xl">
              Wir verpflichten uns
            </h2>
          </div>

          <ol className="mt-6 space-y-3 print:mt-10 print:space-y-5">
            {allStatements.map((s, idx) => (
              <li
                key={s.id}
                className="flex gap-3 text-sm leading-relaxed text-gray-800 print:text-base"
              >
                <span className="font-semibold text-rose-500 print:text-black">
                  {idx + 1}.
                </span>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 border-t border-rose-100 pt-4 text-center text-xs text-gray-500 print:mt-12 print:border-t-2 print:border-black print:pt-6 print:text-sm print:text-black">
            <p>
              Besiegelt am {formatDate(state.signedAt!)}
              {(state.mama || state.partner) && (
                <>
                  {' — '}
                  {[state.mama, state.partner].filter(Boolean).join(' & ')}
                </>
              )}
            </p>
          </div>

          {/* Print-only signature lines */}
          <div className="mt-8 hidden grid-cols-2 gap-8 print:grid">
            <div className="text-center text-sm">
              <div className="border-b-2 border-black pb-1">&nbsp;</div>
              <p className="mt-2">{state.mama || 'Mama'}</p>
            </div>
            <div className="text-center text-sm">
              <div className="border-b-2 border-black pb-1">&nbsp;</div>
              <p className="mt-2">{state.partner || 'Partner/in'}</p>
            </div>
          </div>
        </section>

        {/* Action buttons (hidden in print) */}
        <div className="space-y-3 print:hidden">
          <Button
            onClick={handlePrint}
            className="w-full bg-rose-500 text-white hover:bg-rose-600"
          >
            🖨️ Drucken / Als PDF speichern
          </Button>
          <Button
            variant="outline"
            onClick={breakSeal}
            className="w-full border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          >
            Bearbeiten
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
        className="rounded-2xl bg-white p-5 shadow-sm"
      >
        <h2 className="text-base font-semibold text-gray-800">📜 Werte-Manifest</h2>
        <p className="mt-2 text-sm text-gray-600">
          Welche Grundsätze wollt ihr als Eltern leben? Wählt 5 oder mehr — oder
          formuliert eigene.
        </p>
        <p className="mt-3 text-xs text-rose-500">
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
              className="rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={s.id}
                  checked={checked}
                  onCheckedChange={() => toggleAgreed(s.id)}
                  className="mt-0.5 data-[state=checked]:border-rose-500 data-[state=checked]:bg-rose-500"
                />
                <Label
                  htmlFor={s.id}
                  className={`flex-1 cursor-pointer text-sm leading-snug ${
                    checked ? 'font-medium text-gray-800' : 'text-gray-700'
                  }`}
                >
                  {s.text}
                </Label>
              </div>
            </div>
          )
        })}
      </section>

      {state.custom.length > 0 && (
        <section aria-label="Eigene Grundsätze" className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Eure eigenen Grundsätze
          </p>
          {state.custom.map((c) => (
            <div
              key={c.id}
              className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
            >
              <span className="mt-0.5 text-rose-500" aria-hidden="true">
                •
              </span>
              <p className="flex-1 text-sm leading-snug text-gray-800">{c.text}</p>
              <button
                type="button"
                onClick={() => removeCustom(c.id)}
                aria-label="Eigenen Grundsatz entfernen"
                className="text-gray-400 hover:text-rose-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </section>
      )}

      <section aria-label="Eigene Verpflichtung hinzufügen">
        {showCustomInput ? (
          <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
            <Label htmlFor="new-custom" className="text-sm font-medium text-gray-700">
              Eigene Verpflichtung
            </Label>
            <Input
              id="new-custom"
              value={newCustom}
              onChange={(e) => setNewCustom(e.target.value)}
              placeholder="z. B. Wir sind ehrlich, auch wenn es schwerfällt."
              className="border-rose-100 focus-visible:ring-rose-500"
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
                className="flex-1 bg-rose-500 text-white hover:bg-rose-600"
              >
                Speichern
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNewCustom('')
                  setShowCustomInput(false)
                }}
                className="border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowCustomInput(true)}
            className="w-full border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          >
            + Eigene Verpflichtung hinzufügen
          </Button>
        )}
      </section>

      <section
        aria-label="Manifest besiegeln"
        className="rounded-2xl bg-white p-5 shadow-sm"
      >
        <h3 className="text-base font-semibold text-gray-800">
          Unser Manifest besiegeln
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Wenn ihr eure Grundsätze festhalten wollt, könnt ihr eure Namen ergänzen
          und das Manifest besiegeln.
        </p>
        <div className="mt-4 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="mama-name" className="text-sm font-medium text-gray-700">
              Mama (Name)
            </Label>
            <Input
              id="mama-name"
              value={state.mama ?? ''}
              onChange={(e) => setState((prev) => ({ ...prev, mama: e.target.value }))}
              placeholder="optional"
              className="border-rose-100 focus-visible:ring-rose-500"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="partner-name" className="text-sm font-medium text-gray-700">
              Partner/in (Name)
            </Label>
            <Input
              id="partner-name"
              value={state.partner ?? ''}
              onChange={(e) => setState((prev) => ({ ...prev, partner: e.target.value }))}
              placeholder="optional"
              className="border-rose-100 focus-visible:ring-rose-500"
            />
          </div>
        </div>
        <Button
          onClick={signManifest}
          disabled={totalSelected === 0}
          className="mt-5 w-full bg-rose-500 text-white hover:bg-rose-600"
        >
          ✍️ Wir verpflichten uns
        </Button>
        {totalSelected === 0 && (
          <p className="mt-2 text-center text-xs text-gray-500">
            Wählt mindestens einen Grundsatz aus, um das Manifest zu besiegeln.
          </p>
        )}
      </section>
    </div>
  )
}
