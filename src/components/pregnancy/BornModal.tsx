'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
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

interface BornModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pregnancyId: string
  babyName?: string | null
  onSuccess?: () => void
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function BornModal({
  open,
  onOpenChange,
  pregnancyId,
  babyName,
  onSuccess,
}: BornModalProps) {
  const t = useT()
  const [birthDate, setBirthDate] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setBirthDate(todayIso())
      setName('')
      setSuccess(false)
      setError(null)
    }
  }, [open])

  async function handleSubmit() {
    setSaving(true)
    setError(null)
    try {
      const payload: Record<string, unknown> = { status: 'born' }
      if (birthDate) payload.birth_date = birthDate
      if (!babyName && name.trim()) payload.baby_name = name.trim()
      const res = await fetch(`/api/pregnancies/${pregnancyId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed')
      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        onOpenChange(false)
      }, 1600)
    } catch {
      setError(t.pregnancy.born.error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-primary/20 bg-card p-7 sm:rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <DialogTitle className="text-center font-display text-2xl font-medium leading-tight text-foreground">
            {t.pregnancy.born.title}
          </DialogTitle>
          <DialogDescription className="text-center font-display text-sm italic text-muted-foreground">
            {t.pregnancy.born.body}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="rounded-xl bg-secondary/60 px-4 py-6 text-center">
            <p className="font-display text-base italic leading-relaxed text-foreground">
              {t.pregnancy.born.successMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="birthDate" className="text-sm font-medium">
                {t.pregnancy.born.birthDateLabel}
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                max={todayIso()}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            {!babyName && (
              <div className="space-y-1.5">
                <Label htmlFor="babyName" className="text-sm font-medium">
                  {t.pregnancy.born.babyNameLabel}
                </Label>
                <Input
                  id="babyName"
                  type="text"
                  value={name}
                  maxLength={50}
                  placeholder={t.pregnancy.born.babyNamePlaceholder}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                {t.pregnancy.born.cancel}
              </Button>
              <Button type="button" onClick={handleSubmit} disabled={saving}>
                {saving ? t.pregnancy.born.saving : t.pregnancy.born.confirm}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
