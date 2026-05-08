'use client'

import { useEffect, useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'

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
import { localized } from '@/lib/i18n/localized'
import { TERMIN_TYPES } from '@/lib/termine/data'
import type { Termin, TerminTypeId } from '@/lib/termine/types'

interface TerminFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Partial<Termin> & { id?: string }
  onSave: (termin: Termin) => void
  onDelete?: (id: string) => void
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
  const isEdit = Boolean(initial?.id)

  const [type, setType] = useState<TerminTypeId>(initial?.type ?? 'custom')
  const [title, setTitle] = useState<string>(initial?.title ?? '')
  const [date, setDate] = useState<string>(initial?.date ?? todayIso())
  const [time, setTime] = useState<string>(initial?.time ?? '')
  const [location, setLocation] = useState<string>(initial?.location ?? '')
  const [doctor, setDoctor] = useState<string>(initial?.doctor ?? '')
  const [notes, setNotes] = useState<string>(initial?.notes ?? '')
  const [done, setDone] = useState<boolean>(initial?.done ?? false)
  const [errors, setErrors] = useState<{ title?: string; date?: string }>({})

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
    }
    onSave(termin)
    onOpenChange(false)
  }

  function handleDelete() {
    if (!initial?.id || !onDelete) return
    if (typeof window !== 'undefined' && !window.confirm(t.termine.confirmDelete)) {
      return
    }
    onDelete(initial.id)
    onOpenChange(false)
  }

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
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="termin-doctor">{t.termine.form.doctor}</Label>
            <Input
              id="termin-doctor"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              placeholder={t.termine.form.doctorPlaceholder}
            />
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

          <DialogFooter className="gap-2 sm:gap-2">
            {isEdit && onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="mr-1.5 h-4 w-4" strokeWidth={1.5} />
                {t.termine.form.delete}
              </Button>
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
