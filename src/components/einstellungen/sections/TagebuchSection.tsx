'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { usePreferences } from '@/lib/preferences/client'

const SUGGESTED = [
  'Was war heute das Schönste?',
  'Wofür bin ich heute dankbar?',
  'Wie hat sich mein Bauch heute angefühlt?',
  'Was möchte ich meinem Baby später erzählen?',
  'Womit habe ich mich heute überrascht?',
]

export function TagebuchSection() {
  const { prefs, update } = usePreferences()
  const [draft, setDraft] = useState('')

  function add(prompt: string) {
    const trimmed = prompt.trim()
    if (!trimmed) return
    if (prefs.tagebuchCustomPrompts.includes(trimmed)) return
    update({ tagebuchCustomPrompts: [...prefs.tagebuchCustomPrompts, trimmed] })
    setDraft('')
  }

  function remove(prompt: string) {
    update({ tagebuchCustomPrompts: prefs.tagebuchCustomPrompts.filter((p) => p !== prompt) })
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Eigene Impuls-Fragen</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Deine eigenen Fragen erscheinen als Vorschläge im Tagebuch-Eintrag.
        </p>

        <div className="mb-3 flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="z.B. Wofür bin ich heute dankbar?"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                add(draft)
              }
            }}
          />
          <button
            type="button"
            onClick={() => add(draft)}
            aria-label="Hinzufügen"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
            disabled={!draft.trim()}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {prefs.tagebuchCustomPrompts.length > 0 && (
          <ul className="mb-4 space-y-2">
            {prefs.tagebuchCustomPrompts.map((p) => (
              <li key={p} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
                <span className="flex-1 text-sm">{p}</span>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  aria-label="Entfernen"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Vorschläge</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.filter((s) => !prefs.tagebuchCustomPrompts.includes(s)).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Plus className="h-3 w-3" /> {s}
            </button>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
        <div>
          <div className="text-sm font-semibold">Prompt-Rotation</div>
          <div className="text-xs text-muted-foreground">Wechselnde Frage bei jedem Öffnen</div>
        </div>
        <Switch
          checked={prefs.tagebuchPromptRotation}
          onCheckedChange={(v) => update({ tagebuchPromptRotation: v })}
        />
      </section>

      <section className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
        <div>
          <div className="text-sm font-semibold">Rückblick anzeigen</div>
          <div className="text-xs text-muted-foreground">„Vor 4 Wochen fühltest du dich…"</div>
        </div>
        <Switch
          checked={prefs.tagebuchShowRueckblick}
          onCheckedChange={(v) => update({ tagebuchShowRueckblick: v })}
        />
      </section>
    </div>
  )
}
