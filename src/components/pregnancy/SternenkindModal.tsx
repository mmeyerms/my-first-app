'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Star } from 'lucide-react'
import { useT } from '@/lib/i18n/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SternenkindModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pregnancyId: string
  babyName?: string | null
  onSuccess?: () => void
}

const TOTAL_STEPS = 4

export function SternenkindModal({
  open,
  onOpenChange,
  pregnancyId,
  babyName,
  onSuccess,
}: SternenkindModalProps) {
  const t = useT()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [endedDate, setEndedDate] = useState('')
  const [memorial, setMemorial] = useState('')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setStep(1)
      setEndedDate('')
      setMemorial('')
      setName('')
      setSuccess(false)
      setError(null)
    }
  }, [open])

  async function handleSubmit() {
    setSaving(true)
    setError(null)
    try {
      const payload: Record<string, unknown> = { status: 'sternenkind' }
      if (endedDate) payload.ended_date = endedDate
      if (memorial.trim()) payload.memorial_note = memorial.trim()
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
      }, 2200)
    } catch {
      setError(t.pregnancy.sternenkind.error)
    } finally {
      setSaving(false)
    }
  }

  function next() {
    if (step < TOTAL_STEPS) setStep(step + 1)
  }
  function back() {
    if (step > 1) setStep(step - 1)
    else onOpenChange(false)
  }

  const stepIndicator = t.pregnancy.sternenkind.stepIndicator
    .replace('{current}', String(step))
    .replace('{total}', String(TOTAL_STEPS))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md rounded-2xl border p-0 sm:rounded-2xl"
        style={{
          background:
            'linear-gradient(180deg, hsl(280 25% 97%) 0%, hsl(40 30% 97%) 100%)',
          borderColor: 'hsl(280 20% 86%)',
        }}
      >
        {success ? (
          <div className="px-7 py-12 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: 'hsl(280 25% 92%)' }}>
              <Star className="h-7 w-7" strokeWidth={1.2} style={{ color: 'hsl(280 25% 45%)' }} aria-hidden="true" />
            </div>
            <p className="font-display text-lg italic leading-relaxed" style={{ color: 'hsl(280 20% 30%)' }}>
              {t.pregnancy.sternenkind.successMessage}
            </p>
          </div>
        ) : (
          <div className="px-7 py-8">
            {/* Step indicator */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" strokeWidth={1.5} style={{ color: 'hsl(280 25% 50%)' }} aria-hidden="true" />
                <span className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: 'hsl(280 15% 45%)' }}>
                  {stepIndicator}
                </span>
              </div>
              <div className="flex gap-1.5" aria-hidden="true">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1 w-6 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        i < step ? 'hsl(280 25% 50%)' : 'hsl(280 20% 88%)',
                    }}
                  />
                ))}
              </div>
            </div>

            {step === 1 && (
              <>
                <DialogHeader className="space-y-3">
                  <DialogTitle
                    className="text-center font-display text-2xl font-medium leading-tight"
                    style={{ color: 'hsl(280 25% 28%)' }}
                  >
                    {t.pregnancy.sternenkind.step1.title}
                  </DialogTitle>
                  <DialogDescription
                    className="text-center font-display text-base leading-relaxed"
                    style={{ color: 'hsl(280 15% 35%)' }}
                  >
                    {t.pregnancy.sternenkind.step1.body}
                  </DialogDescription>
                </DialogHeader>
                <p
                  className="mt-6 rounded-xl px-5 py-4 text-center font-display text-sm italic leading-relaxed"
                  style={{
                    backgroundColor: 'hsl(280 30% 95%)',
                    color: 'hsl(280 20% 35%)',
                  }}
                >
                  {t.pregnancy.sternenkind.step1.reassurance}
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <DialogHeader>
                  <DialogTitle
                    className="text-center font-display text-2xl font-medium leading-tight"
                    style={{ color: 'hsl(280 25% 28%)' }}
                  >
                    {t.pregnancy.sternenkind.step2.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-6 space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="endedDate" className="text-sm" style={{ color: 'hsl(280 20% 35%)' }}>
                      {t.pregnancy.sternenkind.step2.dateLabel}
                    </Label>
                    <Input
                      id="endedDate"
                      type="date"
                      value={endedDate}
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setEndedDate(e.target.value)}
                      className="border-purple-200/60 bg-white/70"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="memorial" className="text-sm" style={{ color: 'hsl(280 20% 35%)' }}>
                      {t.pregnancy.sternenkind.step2.memorialLabel}
                    </Label>
                    <Textarea
                      id="memorial"
                      value={memorial}
                      maxLength={5000}
                      rows={4}
                      placeholder={t.pregnancy.sternenkind.step2.memorialPlaceholder}
                      onChange={(e) => setMemorial(e.target.value)}
                      className="resize-none border-purple-200/60 bg-white/70"
                    />
                  </div>
                  {!babyName && (
                    <div className="space-y-1.5">
                      <Label htmlFor="sternName" className="text-sm" style={{ color: 'hsl(280 20% 35%)' }}>
                        {t.pregnancy.sternenkind.step2.nameLabel}
                      </Label>
                      <Input
                        id="sternName"
                        type="text"
                        value={name}
                        maxLength={50}
                        placeholder={t.pregnancy.sternenkind.step2.namePlaceholder}
                        onChange={(e) => setName(e.target.value)}
                        className="border-purple-200/60 bg-white/70"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <DialogHeader className="space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: 'hsl(280 25% 92%)' }}>
                    <Heart className="h-6 w-6" strokeWidth={1.4} style={{ color: 'hsl(280 25% 45%)' }} aria-hidden="true" />
                  </div>
                  <DialogTitle
                    className="text-center font-display text-2xl font-medium leading-tight"
                    style={{ color: 'hsl(280 25% 28%)' }}
                  >
                    {t.pregnancy.sternenkind.step3.title}
                  </DialogTitle>
                  <DialogDescription
                    className="text-center font-display text-sm italic leading-relaxed"
                    style={{ color: 'hsl(280 15% 40%)' }}
                  >
                    {t.pregnancy.sternenkind.step3.body}
                  </DialogDescription>
                </DialogHeader>
                <ul
                  className="mt-6 space-y-3 rounded-xl px-5 py-4 text-sm leading-relaxed"
                  style={{ backgroundColor: 'hsl(280 30% 95%)', color: 'hsl(280 20% 30%)' }}
                >
                  <li className="flex gap-2">
                    <Star className="mt-1 h-3 w-3 shrink-0" strokeWidth={1.5} style={{ color: 'hsl(280 25% 50%)' }} aria-hidden="true" />
                    <span>{t.pregnancy.sternenkind.step3.hotline}</span>
                  </li>
                  <li className="flex gap-2">
                    <Star className="mt-1 h-3 w-3 shrink-0" strokeWidth={1.5} style={{ color: 'hsl(280 25% 50%)' }} aria-hidden="true" />
                    <span>{t.pregnancy.sternenkind.step3.regenbogen}</span>
                  </li>
                  <li className="flex gap-2">
                    <Star className="mt-1 h-3 w-3 shrink-0" strokeWidth={1.5} style={{ color: 'hsl(280 25% 50%)' }} aria-hidden="true" />
                    <button
                      type="button"
                      onClick={() => {
                        onOpenChange(false)
                        setTimeout(() => router.push('/trauer'), 50)
                      }}
                      className="underline-offset-2 transition-colors hover:underline text-left"
                      style={{ color: 'hsl(280 30% 38%)' }}
                    >
                      {t.pregnancy.sternenkind.step3.appLink}
                    </button>
                  </li>
                </ul>
              </>
            )}

            {step === 4 && (
              <>
                <DialogHeader className="space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: 'hsl(280 25% 92%)' }}>
                    <Star className="h-6 w-6" strokeWidth={1.2} style={{ color: 'hsl(280 25% 45%)' }} aria-hidden="true" />
                  </div>
                  <DialogTitle
                    className="text-center font-display text-xl font-medium leading-relaxed"
                    style={{ color: 'hsl(280 25% 28%)' }}
                  >
                    {t.pregnancy.sternenkind.step4.title}
                  </DialogTitle>
                  <DialogDescription
                    className="text-center font-display text-sm italic leading-relaxed"
                    style={{ color: 'hsl(280 15% 40%)' }}
                  >
                    {t.pregnancy.sternenkind.step4.body}
                  </DialogDescription>
                </DialogHeader>
                {error && (
                  <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                    {error}
                  </p>
                )}
              </>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={back}
                disabled={saving}
                className="text-sm"
                style={{ color: 'hsl(280 15% 45%)' }}
              >
                {step === 1 ? t.pregnancy.sternenkind.cancel : t.pregnancy.sternenkind.back}
              </Button>
              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={next}
                  className="text-sm"
                  style={{
                    backgroundColor: 'hsl(280 25% 50%)',
                    color: 'white',
                  }}
                >
                  {t.pregnancy.sternenkind.next}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="text-sm"
                  style={{
                    backgroundColor: 'hsl(280 25% 50%)',
                    color: 'white',
                  }}
                >
                  {saving ? t.pregnancy.sternenkind.saving : t.pregnancy.sternenkind.step4.confirm}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
