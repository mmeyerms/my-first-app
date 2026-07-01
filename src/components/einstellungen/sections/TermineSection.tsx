'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface TerminCategory {
  id: string
  slug: string
  label: string
  emoji: string | null
  color: string | null
  default_location: string | null
  default_reminder_hours: number | null
  notes_template: string | null
  is_builtin: boolean
}

const COLORS = ['#a05a5a', '#a07a55', '#8a8f5c', '#5f8a7a', '#5570a5', '#7a5aa0', '#a05a80']
const REMINDER_OPTIONS = [
  { value: 0, label: 'Keine' },
  { value: 1, label: '1 Stunde' },
  { value: 3, label: '3 Stunden' },
  { value: 24, label: '1 Tag' },
  { value: 72, label: '3 Tage' },
]

export function TermineSection() {
  const [categories, setCategories] = useState<TerminCategory[]>([])
  const [label, setLabel] = useState('')
  const [emoji, setEmoji] = useState('📅')
  const [color, setColor] = useState<string>(COLORS[0])
  const [defaultLocation, setDefaultLocation] = useState('')
  const [reminderHours, setReminderHours] = useState<number>(24)
  const [notesTemplate, setNotesTemplate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/termin-categories')
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCategories(data))
      .catch(() => {})
  }, [])

  async function save() {
    if (!label.trim()) return
    const slug = label
      .toLowerCase()
      .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' })[c] ?? c)
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 60) || `cat_${Date.now()}`
    setSaving(true)
    try {
      const res = await fetch('/api/termin-categories', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug,
          label: label.trim(),
          emoji: emoji || null,
          color,
          default_location: defaultLocation.trim() || null,
          default_reminder_hours: reminderHours,
          notes_template: notesTemplate.trim() || null,
        }),
      })
      if (res.ok) {
        const created = await res.json()
        setCategories((prev) => {
          const filtered = prev.filter((c) => c.slug !== created.slug)
          return [...filtered, created].sort((a, b) => a.label.localeCompare(b.label))
        })
        setLabel('')
        setDefaultLocation('')
        setNotesTemplate('')
      }
    } finally {
      setSaving(false)
    }
  }

  async function remove(slug: string) {
    if (!confirm('Kategorie löschen?')) return
    const res = await fetch(`/api/termin-categories?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' })
    if (res.ok) setCategories((prev) => prev.filter((c) => c.slug !== slug))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Eigene Termin-Kategorien</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Definiere eigene Kategorien wie „Akupunktur" oder „Yoga" — inklusive Standardort, Erinnerung und Notiz-Template.
        </p>

        <div className="mb-4 space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Emoji</label>
              <Input value={emoji} onChange={(e) => setEmoji(e.target.value.slice(0, 3))} maxLength={3} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Name</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="z.B. Akupunktur" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Farbe</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-pressed={color === c}
                  aria-label={`Farbe ${c}`}
                  className={cn('h-8 w-8 rounded-full ring-offset-2 transition-all', color === c && 'ring-2 ring-primary')}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Standard-Ort</label>
            <Input value={defaultLocation} onChange={(e) => setDefaultLocation(e.target.value)} placeholder="z.B. Praxis Dr. Müller" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Standard-Erinnerung</label>
            <div className="flex flex-wrap gap-2">
              {REMINDER_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setReminderHours(o.value)}
                  aria-pressed={reminderHours === o.value}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs transition-all',
                    reminderHours === o.value ? 'border-primary bg-secondary text-primary' : 'border-border bg-card text-muted-foreground',
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Notiz-Template</label>
            <Textarea
              value={notesTemplate}
              onChange={(e) => setNotesTemplate(e.target.value)}
              placeholder={'z.B.\nFragen an die Ärztin:\n- \n- \nErgebnisse:\n'}
              className="min-h-[100px] text-sm"
            />
          </div>
          <Button onClick={save} disabled={saving || !label.trim()} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {saving ? 'Speichere…' : 'Kategorie speichern'}
          </Button>
        </div>

        {categories.length > 0 && (
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <span className="text-xl" aria-hidden="true">{c.emoji ?? '📅'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{c.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.default_location ? `${c.default_location} · ` : ''}
                    {c.default_reminder_hours != null && c.default_reminder_hours > 0
                      ? `${c.default_reminder_hours}h vorher`
                      : 'keine Erinnerung'}
                  </div>
                </div>
                {c.color && <span className="h-4 w-4 rounded-full" style={{ backgroundColor: c.color }} />}
                <button
                  type="button"
                  onClick={() => remove(c.slug)}
                  aria-label="Löschen"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
