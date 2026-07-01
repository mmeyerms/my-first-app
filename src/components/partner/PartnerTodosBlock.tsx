'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

export interface PartnerTodoItem {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  done: boolean
}

interface PartnerTodosBlockProps {
  initialTodos: PartnerTodoItem[]
  heading: string
  emptyText: string
  /**
   * Optional externally-managed list of todos. When provided, replaces the
   * component's internal state — used by the realtime dashboard client to push
   * live updates from Supabase into the block.
   */
  externalTodos?: PartnerTodoItem[]
  /**
   * Optional callback invoked whenever the partner toggles a todo. The parent
   * (PartnerDashboardClient) can use this to sync back into its live state so
   * both optimistic UI and realtime events stay in agreement.
   */
  onLocalToggle?: (id: string, done: boolean) => void
}

/**
 * PartnerTodosBlock — read-only-ish widget on the partner dashboard.
 * The partner can tick a todo done/undone; the mother's edits happen
 * from the Einstellungen page.
 *
 * Realtime (Feature 49): The parent can pass `externalTodos` to hand in a
 * live-synced list. When it changes, the block re-renders instantly.
 */
export function PartnerTodosBlock({
  initialTodos,
  heading,
  emptyText,
  externalTodos,
  onLocalToggle,
}: PartnerTodosBlockProps) {
  const [todos, setTodos] = useState<PartnerTodoItem[]>(initialTodos)
  const [pending, setPending] = useState<Record<string, boolean>>({})

  // Sync from parent (realtime) when a new list is pushed down.
  useEffect(() => {
    if (externalTodos) {
      setTodos(externalTodos)
    }
  }, [externalTodos])

  async function toggle(id: string, done: boolean) {
    setPending((p) => ({ ...p, [id]: true }))
    // optimistic
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done } : t)))
    onLocalToggle?.(id, done)
    try {
      const res = await fetch('/api/partner-todos', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, done }),
      })
      if (!res.ok) throw new Error('failed')
    } catch {
      // revert
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !done } : t)))
      onLocalToggle?.(id, !done)
    } finally {
      setPending((p) => {
        const next = { ...p }
        delete next[id]
        return next
      })
    }
  }

  return (
    <div className="mb-4 rounded-2xl bg-card p-5 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-foreground">{heading}</p>
      {todos.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((t) => (
            <li
              key={t.id}
              className="flex items-start gap-3 rounded-xl border border-border p-3"
            >
              <button
                type="button"
                onClick={() => toggle(t.id, !t.done)}
                disabled={!!pending[t.id]}
                aria-label={t.done ? 'Als offen markieren' : 'Als erledigt markieren'}
                aria-pressed={t.done}
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-primary hover:opacity-80 disabled:opacity-50"
              >
                {t.done ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
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
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
