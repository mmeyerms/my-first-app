'use client'

import { useEffect, useState } from 'react'
import { useT } from '@/lib/i18n/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface NewPregnancyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (newPregnancyId?: string) => void
}

type CreateStatus = 'planning' | 'pregnant'
type BabyGender = 'female' | 'male' | 'diverse' | 'surprise' | 'unknown'

const NONE_VALUE = '__none__'

export function NewPregnancyModal({
  open,
  onOpenChange,
  onSuccess,
}: NewPregnancyModalProps) {
  const t = useT()
  const [status, setStatus] = useState<CreateStatus>('pregnant')
  const [babyName, setBabyName] = useState('')
  const [isMultiple, setIsMultiple] = useState(false)
  const [babyNames, setBabyNames] = useState<string[]>(['', ''])
  const [testDate, setTestDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [gender, setGender] = useState<BabyGender | ''>('')
  const [setActive, setSetActive] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setStatus('pregnant')
      setBabyName('')
      setIsMultiple(false)
      setBabyNames(['', ''])
      setTestDate('')
      setDueDate('')
      setGender('')
      setSetActive(true)
      setCreating(false)
      setError(null)
    }
  }, [open])

  function updateBabyName(index: number, value: string) {
    setBabyNames((prev) => prev.map((n, i) => (i === index ? value : n)))
  }

  function addBaby() {
    setBabyNames((prev) => (prev.length < 10 ? [...prev, ''] : prev))
  }

  function removeBaby(index: number) {
    setBabyNames((prev) => (prev.length > 2 ? prev.filter((_, i) => i !== index) : prev))
  }

  async function handleCreate() {
    setCreating(true)
    setError(null)
    try {
      const payload: Record<string, unknown> = {
        status,
        set_active: setActive,
        is_multiple: isMultiple,
      }
      if (isMultiple) {
        const trimmed = babyNames.map((n) => n.trim()).filter((n) => n.length > 0)
        if (trimmed.length > 0) {
          payload.baby_names = trimmed
          // Keep baby_name populated for legacy consumers (first entry).
          payload.baby_name = trimmed[0]
        }
      } else if (babyName.trim()) {
        payload.baby_name = babyName.trim()
      }
      if (testDate) payload.positive_test_date = testDate
      if (dueDate) payload.due_date = dueDate
      if (gender) payload.baby_gender = gender
      const res = await fetch('/api/pregnancies', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed')
      const created = await res.json().catch(() => ({}))
      const newId = typeof created?.id === 'string' ? created.id : undefined
      onSuccess?.(newId)
      onOpenChange(false)
    } catch {
      setError(t.pregnancy.newPregnancy.error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto rounded-2xl bg-card p-7 sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-medium leading-tight text-foreground">
            {t.pregnancy.newPregnancy.title}
          </DialogTitle>
          <DialogDescription className="font-display text-sm italic text-muted-foreground">
            {t.pregnancy.newPregnancy.body}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="np-status" className="text-sm font-medium">
              {t.pregnancy.newPregnancy.statusLabel}
            </Label>
            <Select value={status} onValueChange={(v) => setStatus(v as CreateStatus)}>
              <SelectTrigger id="np-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">
                  {t.pregnancy.newPregnancy.statusPlanning}
                </SelectItem>
                <SelectItem value="pregnant">
                  {t.pregnancy.newPregnancy.statusPregnant}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={isMultiple}
              onChange={(e) => setIsMultiple(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/40"
              aria-label="Zwillinge oder Drillinge"
            />
            <span className="text-foreground">Zwillinge / Drillinge?</span>
          </label>

          {!isMultiple && (
            <div className="space-y-1.5">
              <Label htmlFor="np-baby-name" className="text-sm font-medium">
                {t.pregnancy.newPregnancy.babyNameLabel}
              </Label>
              <Input
                id="np-baby-name"
                type="text"
                value={babyName}
                maxLength={50}
                placeholder={t.pregnancy.newPregnancy.babyNamePlaceholder}
                onChange={(e) => setBabyName(e.target.value)}
              />
            </div>
          )}

          {isMultiple && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Baby-Namen</Label>
              <div className="space-y-2">
                {babyNames.map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      id={`np-baby-name-${i}`}
                      type="text"
                      value={name}
                      maxLength={50}
                      placeholder={`Baby ${i + 1} Name`}
                      aria-label={`Baby ${i + 1} Name`}
                      onChange={(e) => updateBabyName(i, e.target.value)}
                    />
                    {babyNames.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBaby(i)}
                        aria-label={`Baby ${i + 1} entfernen`}
                        className="shrink-0 text-xs text-muted-foreground hover:text-destructive"
                      >
                        Entfernen
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {babyNames.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBaby}
                  className="text-xs"
                >
                  + Weiteres Baby
                </Button>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="np-test-date" className="text-sm font-medium">
              {t.pregnancy.newPregnancy.testDateLabel}
            </Label>
            <Input
              id="np-test-date"
              type="date"
              value={testDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setTestDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="np-due-date" className="text-sm font-medium">
              {t.pregnancy.newPregnancy.dueDateLabel}
            </Label>
            <Input
              id="np-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="np-gender" className="text-sm font-medium">
              {t.pregnancy.newPregnancy.genderLabel}
            </Label>
            <Select
              value={gender || NONE_VALUE}
              onValueChange={(v) =>
                setGender(v === NONE_VALUE ? '' : (v as BabyGender))
              }
            >
              <SelectTrigger id="np-gender">
                <SelectValue placeholder={t.profile.babyGenderOptions.none} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>{t.profile.babyGenderOptions.none}</SelectItem>
                <SelectItem value="female">{t.profile.babyGenderOptions.female}</SelectItem>
                <SelectItem value="male">{t.profile.babyGenderOptions.male}</SelectItem>
                <SelectItem value="diverse">{t.profile.babyGenderOptions.diverse}</SelectItem>
                <SelectItem value="surprise">{t.profile.babyGenderOptions.surprise}</SelectItem>
                <SelectItem value="unknown">{t.profile.babyGenderOptions.unknown}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={setActive}
              onChange={(e) => setSetActive(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/40"
            />
            <span className="text-foreground">{t.pregnancy.newPregnancy.activate}</span>
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={creating}
            >
              {t.pregnancy.newPregnancy.cancel}
            </Button>
            <Button type="button" onClick={handleCreate} disabled={creating}>
              {creating ? t.pregnancy.newPregnancy.creating : t.pregnancy.newPregnancy.create}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
