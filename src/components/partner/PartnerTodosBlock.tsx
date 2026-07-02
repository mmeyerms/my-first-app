'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { useT } from '@/lib/i18n/client'

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
  const t = useT()
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
    setTodos((prev) => prev.map((td) => (td.id === id ? { ...td, done } : td)))
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
      setTodos((prev) => prev.map((td) => (td.id === id ? { ...td, done: !done } : td)))
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
          {todos.map((td) => (
            <li
              key={td.id}
              className="flex items-start gap-3 rounded-xl border border-border p-3"
            >
              <button
                type="button"
                onClick={() => toggle(td.id, !td.done)}
                disabled={!!pending[td.id]}
                aria-label={td.done ? t.partner.todos.markOpen : t.partner.todos.markDone}
                aria-pressed={td.done}
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-primary hover:opacity-80 disabled:opacity-50"
              >
                {td.done ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={
                    td.done
                      ? 'text-sm font-medium text-muted-foreground line-through'
                      : 'text-sm font-medium text-foreground'
                  }
                >
                  {td.title}
                </p>
                {td.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{td.description}</p>
                )}
                {td.dueDate && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t.partner.todos.dueLabel.replace('{date}', td.dueDate)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
