'use client'

import { useEffect, useState } from 'react'
import { Plus, X, CheckCircle2, Circle } from 'lucide-react'
import { Input } from '@/components/ui/input'

export interface PartnerTodo {
  id: string
  userId: string
  pregnancyId: string | null
  title: string
  description: string | null
  dueDate: string | null
  done: boolean
  createdAt: string
  updatedAt: string
}

/**
 * PartnerTodosManager
 * Embedded inside the Einstellungen → Partner section. Lets the mother
 * add / remove / toggle todos that appear in the partner dashboard.
 */
export function PartnerTodosManager() {
  const [todos, setTodos] = useState<PartnerTodo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/partner-todos')
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.error ?? 'Fehler beim Laden')
        return (await r.json()) as PartnerTodo[]
      })
      .then((data) => {
        if (cancelled) return
        setTodos(data)
        setError(null)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function addTodo() {
    const trimmed = title.trim()
    if (!trimmed || saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/partner-todos', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: trimmed,
          description: description.trim(),
          due_date: dueDate || null,
        }),
      })
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(j?.error ?? 'Fehler beim Speichern')
      }
      const created = (await res.json()) as PartnerTodo
      setTodos((prev) => [created, ...prev])
      setTitle('')
      setDescription('')
      setDueDate('')
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    } finally {
      setSaving(false)
    }
  }

  async function toggle(id: string, done: boolean) {
    // optimistic
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done } : t)))
    try {
      const res = await fetch('/api/partner-todos', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, done }),
      })
      if (!res.ok) throw new Error('Fehler beim Aktualisieren')
    } catch {
      // revert
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !done } : t)))
    }
  }

  async function remove(id: string) {
    const backup = todos
    setTodos((prev) => prev.filter((t) => t.id !== id))
    try {
      const res = await fetch(`/api/partner-todos?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Fehler beim Löschen')
    } catch {
      setTodos(backup)
    }
  }

  return (
    <section aria-label="To-Dos für Partner:in">
      <h2 className="mb-1 text-sm font-semibold text-foreground">Eigene To-Dos für Partner:in</h2>
      <p className="mb-3 text-xs text-muted-foreground">
        Konkrete Aufgaben wie „Elternzeit-Antrag bis SSW 30" oder „Kurs anmelden". Partner:in
        sieht sie im Partner-Dashboard und kann sie abhaken.
      </p>

      <div className="mb-3 space-y-2 rounded-xl border border-border bg-card p-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 200))}
          placeholder="Titel — z.B. Elternzeit-Antrag stellen"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTodo()
            }
          }}
          aria-label="Titel"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
          placeholder="Beschreibung (optional)"
          aria-label="Beschreibung"
        />
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Fällig bis"
          />
          <button
            type="button"
            onClick={addTodo}
            disabled={!title.trim() || saving}
            aria-label="To-Do hinzufügen"
            className="inline-flex h-10 shrink-0 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Hinzufügen
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-2 text-xs text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-xs text-muted-foreground">Lade…</p>
      ) : todos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          Noch keine To-Dos. Leg eine erste Aufgabe für deine:n Partner:in an.
        </p>
      ) : (
        <ul className="space-y-2">
          {todos.map((t) => (
            <li
              key={t.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"
            >
              <button
                type="button"
                onClick={() => toggle(t.id, !t.done)}
                aria-label={t.done ? 'Als offen markieren' : 'Als erledigt markieren'}
                aria-pressed={t.done}
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-primary hover:opacity-80"
              >
                {t.done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={
                    t.done
                      ? 'text-sm font-medium text-muted-foreground line-through'
                      : 'text-sm font-medium text-foreground'
                  }
                >
                  {t.title}
                </p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
                )}
                {t.dueDate && (
                  <p className="mt-0.5 text-xs text-muted-foreground">Fällig: {t.dueDate}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(t.id)}
                aria-label="Entfernen"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
