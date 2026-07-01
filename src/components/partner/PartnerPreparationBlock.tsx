'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Check, Clock } from 'lucide-react'
import { toast } from 'sonner'
import {
  PREPARATION_TASKS,
  PREP_CATEGORY_LABELS,
  PREP_CATEGORY_COLORS,
  activeTasks,
  sortByRelevance,
  type PreparationTask,
} from '@/lib/partnerPreparation'

interface Props {
  ssw: number
  /**
   * Existing partner_todos titles from the mother's account, so we can
   * mark preparation items as "already adopted" and hide the "Add"-button.
   */
  existingTodoTitles: Set<string>
  /**
   * Called when the partner taps "Übernehmen" — should POST to
   * /api/partner-todos and refresh the todos list. Returns Promise so we
   * can show optimistic UI + rollback on failure.
   */
  onAdopt: (task: PreparationTask) => Promise<void>
}

/**
 * Kuratierte Vorbereitungs-Aufgaben für den Partner, sortiert nach Fälligkeit
 * relativ zur aktuellen SSW. Der Partner kann Aufgaben "übernehmen" — dabei
 * wird ein partner_todos-Row angelegt, das dann von der Mama gesehen wird.
 */
export function PartnerPreparationBlock({ ssw, existingTodoTitles, onAdopt }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [pending, setPending] = useState<Set<string>>(new Set())

  const tasks = useMemo(() => {
    const active = activeTasks(ssw)
    return sortByRelevance(active, ssw)
  }, [ssw])

  const visible = expanded ? tasks : tasks.slice(0, 4)
  const remaining = tasks.length - visible.length

  async function adopt(task: PreparationTask) {
    setPending((prev) => new Set(prev).add(task.id))
    try {
      await onAdopt(task)
      toast.success(`„${task.title}" ist jetzt auf deiner Liste.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Konnte nicht übernommen werden')
    } finally {
      setPending((prev) => {
        const next = new Set(prev)
        next.delete(task.id)
        return next
      })
    }
  }

  if (tasks.length === 0) return null

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-lg font-medium text-foreground">
            Deine Vorbereitungen
          </h2>
          <p className="mt-0.5 font-display text-xs italic text-muted-foreground">
            Sortiert nach was gerade dran ist
          </p>
        </div>
        {tasks.length > 4 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground underline decoration-dotted hover:text-primary"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3" /> Weniger
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Alle {tasks.length}
              </>
            )}
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {visible.map((task) => {
          const alreadyAdded = existingTodoTitles.has(task.title)
          const isPending = pending.has(task.id)
          const isOverdue = task.deadlineSsw < ssw
          const weeksUntil = task.deadlineSsw - ssw

          return (
            <li
              key={task.id}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                style={{ backgroundColor: `${PREP_CATEGORY_COLORS[task.category]}15` }}
              >
                {task.emoji}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-semibold leading-snug text-foreground">
                    {task.title}
                  </p>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {task.description}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: `${PREP_CATEGORY_COLORS[task.category]}15`,
                      color: PREP_CATEGORY_COLORS[task.category],
                    }}
                  >
                    {PREP_CATEGORY_LABELS[task.category]}
                  </span>
                  {isOverdue ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-destructive">
                      <Clock className="h-3 w-3" strokeWidth={2} />
                      Überfällig · SSW {task.deadlineSsw}
                    </span>
                  ) : weeksUntil <= 2 ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary">
                      <Clock className="h-3 w-3" strokeWidth={2} />
                      Bald · SSW {task.deadlineSsw}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      bis SSW {task.deadlineSsw}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => adopt(task)}
                disabled={alreadyAdded || isPending}
                aria-label={alreadyAdded ? 'Bereits übernommen' : 'Als eigene Aufgabe übernehmen'}
                title={alreadyAdded ? 'Bereits übernommen' : 'Übernehmen'}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-primary transition-colors hover:bg-secondary disabled:opacity-40"
              >
                {alreadyAdded ? (
                  <Check className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <Plus className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {!expanded && remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 w-full rounded-xl border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          + {remaining} weitere Aufgaben
        </button>
      )}

      <p className="mt-3 text-[10px] italic text-muted-foreground">
        Aus{' '}
        <span className="font-medium not-italic text-foreground">
          {PREPARATION_TASKS.length}
        </span>{' '}
        kuratierten Aufgaben. Übernommene erscheinen bei dir und werden von {' '}
        {`der Mama`} gesehen.
      </p>
    </section>
  )
}
