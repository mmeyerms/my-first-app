'use client'

import { useEffect, useState } from 'react'
import { Check, Pencil, X as XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NOTE_MAX_LENGTH } from '@/hooks/useChecklistState'

interface Props {
  /** Item ID (built-in or custom). Used for the input id + aria linking. */
  itemId: string
  /** Currently stored note (empty string when none). */
  note: string
  /** Persists the trimmed note. Empty string clears the note. */
  onSave: (next: string) => void
}

/**
 * Compact per-item note UI used by Packliste / Einkaufsliste / Wochenbett
 * rows. When collapsed it renders either:
 *   - the note inline (small muted text) + a small pencil button, or
 *   - only a pencil button when no note is present.
 * When expanded it renders an inline Input with save/cancel controls and
 * enforces a max length of NOTE_MAX_LENGTH characters.
 */
export function ChecklistItemNote({ itemId, note, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note)

  // Keep local draft in sync when the persisted note changes externally
  // (e.g. hydration from the API, or transfer from previous pregnancy).
  useEffect(() => {
    if (!editing) setDraft(note)
  }, [note, editing])

  function startEdit() {
    setDraft(note)
    setEditing(true)
  }

  function commit() {
    const trimmed = draft.trim().slice(0, NOTE_MAX_LENGTH)
    onSave(trimmed)
    setEditing(false)
  }

  function cancel() {
    setDraft(note)
    setEditing(false)
  }

  function clear() {
    onSave('')
    setDraft('')
    setEditing(false)
  }

  const hasNote = note.length > 0
  const inputId = `note-${itemId}`

  if (editing) {
    return (
      <div className="mt-1.5 flex flex-col gap-1.5">
        <Input
          id={inputId}
          autoFocus
          value={draft}
          maxLength={NOTE_MAX_LENGTH}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={'z.B. „3 Stück", „Marke Pampers"'}
          aria-label={'Notiz eingeben'}
          className="h-8 text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commit()
            } else if (e.key === 'Escape') {
              e.preventDefault()
              cancel()
            }
          }}
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={commit}
            className="h-7 px-2 text-xs"
          >
            <Check className="mr-1 h-3.5 w-3.5" strokeWidth={2} />
            {'Speichern'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={cancel}
            className="h-7 px-2 text-xs"
          >
            {'Abbrechen'}
          </Button>
          {hasNote && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={clear}
              className="h-7 px-2 text-xs text-muted-foreground"
            >
              <XIcon className="mr-1 h-3.5 w-3.5" strokeWidth={1.5} />
              {'Löschen'}
            </Button>
          )}
          <span
            className="ml-auto text-[11px] tabular-nums text-muted-foreground"
            aria-live="polite"
          >
            {draft.length} / {NOTE_MAX_LENGTH}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-1 flex items-start gap-1.5">
      {hasNote && (
        <p className="flex-1 text-xs italic text-muted-foreground">
          <span className="mr-1" aria-hidden="true">📝</span>
          <span className="break-words">{note}</span>
        </p>
      )}
      <button
        type="button"
        onClick={startEdit}
        aria-label={hasNote ? 'Notiz bearbeiten' : 'Notiz'}
        title={hasNote ? 'Notiz bearbeiten' : 'Notiz'}
        className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium transition-colors ${
          hasNote
            ? 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            : 'text-primary hover:bg-secondary hover:text-primary/80'
        }`}
      >
        <Pencil className="h-3 w-3" strokeWidth={1.75} />
        {!hasNote && <span>{'Notiz'}</span>}
      </button>
    </div>
  )
}
