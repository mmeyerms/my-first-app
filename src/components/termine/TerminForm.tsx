'use client'

import { useEffect, useMemo, useState } from 'react'
import { Trash2, Repeat } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useT, useLocale } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
import { localized } from '@/lib/i18n/localized'
import { TERMIN_TYPES } from '@/lib/termine/data'
import type { RecurrenceRhythm, Termin, TerminTypeId } from '@/lib/termine/types'

interface CustomCategory {
  slug: string
  label: string
  emoji: string | null
  color: string | null
  default_location: string | null
  default_reminder_hours: number | null
  notes_template: string | null
}
import {
  generateGroupId,
  generateOccurrenceDates,
} from '@/lib/termine/recurrence'

export type RecurrenceConfig = {
  enabled: boolean
  rhythm: RecurrenceRhythm
  count: number
}

interface TerminFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Partial<Termin> & { id?: string }
  onSave: (termin: Termin, recurrence?: RecurrenceConfig) => void
  onDelete?: (id: string, scope: 'one' | 'series') => void
}

function todayIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function generateId(): string {
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function TerminForm({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
}: TerminFormProps) {
  const t = useT()
  const { locale } = useLocale()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'
  const isEdit = Boolean(initial?.id)
  const isSeries = Boolean(initial?.groupId)

  const [type, setType] = useState<TerminTypeId>(initial?.type ?? 'custom')
  const [title, setTitle] = useState<string>(initial?.title ?? '')
  const [date, setDate] = useState<string>(initial?.date ?? todayIso())
  const [time, setTime] = useState<string>(initial?.time ?? '')
  const [location, setLocation] = useState<string>(initial?.location ?? '')
  const [doctor, setDoctor] = useState<string>(initial?.doctor ?? '')
  const [notes, setNotes] = useState<string>(initial?.notes ?? '')
  const [done, setDone] = useState<boolean>(initial?.done ?? false)
  const [errors, setErrors] = useState<{ title?: string; date?: string }>({})

  // Recurrence state — only relevant when adding (not when editing).
  const [recurrenceEnabled, setRecurrenceEnabled] = useState<boolean>(false)
  const [recurrenceRhythm, setRecurrenceRhythm] =
    useState<RecurrenceRhythm>('weekly')
  const [recurrenceCount, setRecurrenceCount] = useState<number>(6)

  // Custom categories loaded from DB
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])
  const [suggestions, setSuggestions] = useState<{ locations: string[]; doctors: string[] }>({
    locations: [],
    doctors: [],
  })

  useEffect(() => {
    if (!open) return
    fetch('/api/termin-categories')
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCustomCategories(data))
      .catch(() => {})
    fetch('/api/termine/suggestions')
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.locations) && Array.isArray(data.doctors)) {
          setSuggestions(data)
        }
      })
      .catch(() => {})
  }, [open])

  function applyCustomCategory(cat: CustomCategory) {
    setType('custom')
    setTitle((prev) => (prev ? prev : cat.label))
    if (cat.default_location) setLocation((prev) => prev || cat.default_location || '')
    if (cat.notes_template) setNotes((prev) => prev || cat.notes_template || '')
  }

  // Reset form when opened with new initial values
  useEffect(() => {
    if (open) {
      const initialType: TerminTypeId = initial?.type ?? 'custom'
      setType(initialType)
      const def = TERMIN_TYPES.find((x) => x.id === initialType)
      setTitle(initial?.title ?? (def ? localized(def.title, locale) : ''))
      setDate(initial?.date ?? todayIso())
      setTime(initial?.time ?? '')
      setLocation(initial?.location ?? '')
      setDoctor(initial?.doctor ?? '')
      setNotes(initial?.notes ?? '')
      setDone(initial?.done ?? false)
      setErrors({})
      setRecurrenceEnabled(false)
      setRecurrenceRhythm('weekly')
      setRecurrenceCount(6)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const sortedTypes = useMemo(() => {
    return [...TERMIN_TYPES].sort((a, b) =>
      localized(a.title, locale).localeCompare(localized(b.title, locale))
    )
  }, [locale])

  function handleTypeChange(next: string) {
    const id = next as TerminTypeId
    setType(id)
    const def = TERMIN_TYPES.find((x) => x.id === id)
    if (def) {
      // Replace title if untouched / clearly default
      setTitle(localized(def.title, locale))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!title.trim()) nextErrors.title = t.termine.form.titleRequired
    if (!date) nextErrors.date = t.termine.form.dateRequired
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const termin: Termin = {
      id: initial?.id ?? generateId(),
      type,
      title: title.trim(),
      date,
      time: time || undefined,
      location: location.trim() || undefined,
      doctor: doctor.trim() || undefined,
      notes: notes.trim() || undefined,
      done,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      groupId: initial?.groupId,
    }

    const useRecurrence = !isEdit && recurrenceEnabled && recurrenceCount > 1
    onSave(
      termin,
      useRecurrence
        ? { enabled: true, rhythm: recurrenceRhythm, count: recurrenceCount }
        : undefined
    )
    onOpenChange(false)
  }

  function handleDeleteOne() {
    if (!initial?.id || !onDelete) return
    if (typeof window !== 'undefined' && !window.confirm(t.termine.confirmDelete)) {
      return
    }
    onDelete(initial.id, 'one')
    onOpenChange(false)
  }

  function handleDeleteSeries() {
    if (!initial?.id || !onDelete) return
    if (
      typeof window !== 'undefined' &&
      !window.confirm(t.termine.confirmDeleteSeries)
    ) {
      return
    }
    onDelete(initial.id, 'series')
    onOpenChange(false)
  }

  const occurrencePreview = useMemo(() => {
    if (!recurrenceEnabled || !date) return []
    return generateOccurrenceDates(date, recurrenceRhythm, recurrenceCount)
  }, [recurrenceEnabled, date, recurrenceRhythm, recurrenceCount])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t.termine.form.editTitle : t.termine.form.addTitle}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit ? t.termine.form.editTitle : t.termine.form.addTitle}
          </DialogDescription>
        </DialogHeader>

        {isEdit && isSeries && (
          <p
            className={
              isClassic
                ? 'flex items-center gap-1.5 rounded-md bg-secondary/60 px-3 py-2 text-xs text-gray-700'
                : 'flex items-center gap-1.5 rounded-md bg-secondary/60 px-3 py-2 font-display text-xs italic text-muted-foreground'
            }
            role="note"
          >
            {isClassic ? (
              <span aria-hidden="true">🔁</span>
            ) : (
              <Repeat className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
            )}
            <span>{t.termine.form.seriesNotice}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="termin-type">{t.termine.form.type}</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger id="termin-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">{t.termine.form.typeCustom}</SelectItem>
                {sortedTypes.map((def) => (
                  <SelectItem key={def.id} value={def.id}>
                    {localized(def.title, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {customCategories.length > 0 && (
            <div className="space-y-1.5">
              <Label>Eigene Kategorien</Label>
              <div className="flex flex-wrap gap-1.5">
                {customCategories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => applyCustomCategory(c)}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-secondary/40 px-3 py-1 text-xs text-primary transition-colors hover:bg-secondary"
                    title={
                      c.default_location
                        ? `${c.default_location}${c.default_reminder_hours ? ` · ${c.default_reminder_hours}h vor` : ''}`
                        : undefined
                    }
                  >
                    <span>{c.emoji ?? '📅'}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] italic text-muted-foreground">
                Klick auf eine Kategorie füllt Titel/Ort/Notiz automatisch.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="termin-title">{t.termine.form.title}</Label>
            <Input
              id="termin-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.termine.form.titlePlaceholder}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="termin-date">{t.termine.form.date}</Label>
              <Input
                id="termin-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-invalid={Boolean(errors.date)}
              />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="termin-time">{t.termine.form.time}</Label>
              <Input
                id="termin-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="termin-location">{t.termine.form.location}</Label>
            <Input
              id="termin-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t.termine.form.locationPlaceholder}
              list="termin-locations"
              autoComplete="off"
            />
            <datalist id="termin-locations">
              {suggestions.locations.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
            {suggestions.locations.length > 0 && (
              <p className="text-[10px] italic text-muted-foreground">
                {suggestions.locations.length} vorherige Praxen als Vorschlag verfügbar
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="termin-doctor">{t.termine.form.doctor}</Label>
            <Input
              id="termin-doctor"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              placeholder={t.termine.form.doctorPlaceholder}
              list="termin-doctors"
              autoComplete="off"
            />
            <datalist id="termin-doctors">
              {suggestions.doctors.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="termin-notes">{t.termine.form.notes}</Label>
            <Textarea
              id="termin-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.termine.form.notesPlaceholder}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="termin-done"
              checked={done}
              onCheckedChange={(v) => setDone(v === true)}
            />
            <Label htmlFor="termin-done" className="cursor-pointer text-sm font-normal">
              {t.termine.form.done}
            </Label>
          </div>

          {/* Recurrence — only when adding a new termin */}
          {!isEdit && (
            <fieldset className="space-y-3 rounded-lg border border-border/60 p-3">
              <legend
                className={
                  isClassic
                    ? 'flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-gray-700'
                    : 'flex items-center gap-1.5 px-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground'
                }
              >
                {isClassic ? (
                  <span aria-hidden="true">🔁</span>
                ) : (
                  <Repeat className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                )}
                {t.termine.form.recurrence}
              </legend>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="termin-recur"
                  checked={recurrenceEnabled}
                  onCheckedChange={(v) => setRecurrenceEnabled(v === true)}
                />
                <Label
                  htmlFor="termin-recur"
                  className="cursor-pointer text-sm font-normal"
                >
                  {t.termine.form.recurrenceEnabled}
                </Label>
              </div>

              {recurrenceEnabled && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="termin-rhythm">
                        {t.termine.form.recurrenceRhythm}
                      </Label>
                      <Select
                        value={recurrenceRhythm}
                        onValueChange={(v) =>
                          setRecurrenceRhythm(v as RecurrenceRhythm)
                        }
                      >
                        <SelectTrigger id="termin-rhythm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">
                            {t.termine.form.recurrenceWeekly}
                          </SelectItem>
                          <SelectItem value="biweekly">
                            {t.termine.form.recurrenceBiweekly}
                          </SelectItem>
                          <SelectItem value="monthly">
                            {t.termine.form.recurrenceMonthly}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="termin-count">
                        {t.termine.form.recurrenceCount}
                      </Label>
                      <Input
                        id="termin-count"
                        type="number"
                        min={2}
                        max={20}
                        value={recurrenceCount}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10)
                          if (Number.isFinite(v))
                            setRecurrenceCount(Math.max(2, Math.min(20, v)))
                        }}
                      />
                    </div>
                  </div>
                  <p
                    className={
                      isClassic
                        ? 'text-xs text-gray-600'
                        : 'font-display text-xs italic text-muted-foreground'
                    }
                  >
                    {t.termine.form.recurrenceHint.replace(
                      '{count}',
                      String(occurrencePreview.length)
                    )}
                  </p>
                </div>
              )}
            </fieldset>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
            {isEdit && onDelete && (
              <div className="mr-auto flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteOne}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="mr-1.5 h-4 w-4" strokeWidth={1.5} />
                  {isSeries ? t.termine.form.deleteOne : t.termine.form.delete}
                </Button>
                {isSeries && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteSeries}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" strokeWidth={1.5} />
                    {t.termine.form.deleteSeries}
                  </Button>
                )}
              </div>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.termine.form.cancel}
            </Button>
            <Button type="submit">{t.termine.form.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
