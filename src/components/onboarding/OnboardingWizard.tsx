'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { calculateSSW } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useLocale, useT } from '@/lib/i18n/client'
import type { Locale } from '@/lib/i18n/types'
import type { Messages } from '@/lib/i18n/messages'

type WizardData = {
  name: string
  baby_name: string
  positive_test_date: string
  due_date: string
  locale: Locale
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  const t = useT()
  const label = t.onboarding.stepIndicator
    .replace('{current}', String(current))
    .replace('{total}', String(total))
  return (
    <div className="mb-8 space-y-2">
      <div className="flex justify-between font-display text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>{label}</span>
      </div>
      <Progress value={(current / total) * 100} className="h-1.5" />
    </div>
  )
}

function Step1({ onNext }: { onNext: (name: string) => void }) {
  const t = useT()
  const schema = useMemo(
    () => z.object({ name: z.string().min(1, t.onboarding.step1.nameRequired).max(50) }),
    [t]
  )
  const form = useForm<{ name: string }>({ resolver: zodResolver(schema), defaultValues: { name: '' } })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((d) => onNext(d.name))} className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-medium text-foreground">{t.onboarding.step1.title}</h2>
          <p className="mt-2 font-display text-sm italic text-muted-foreground">
            {t.onboarding.step1.intro}
          </p>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.step1.nameLabel}</FormLabel>
              <FormControl>
                <Input placeholder={t.onboarding.step1.namePlaceholder} autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">{t.onboarding.step1.next}</Button>
      </form>
    </Form>
  )
}

function Step2({ name, onNext, onBack }: { name: string; onNext: (data: Pick<WizardData, 'baby_name' | 'positive_test_date'>) => void; onBack: () => void }) {
  const t = useT()
  const schema = useMemo(
    () =>
      z.object({
        baby_name: z.string().min(1, t.onboarding.step2.babyNameRequired).max(50),
        positive_test_date: z.string().min(1, t.onboarding.step2.testDateRequired),
      }),
    [t]
  )
  const form = useForm<{ baby_name: string; positive_test_date: string }>({
    resolver: zodResolver(schema),
    defaultValues: { baby_name: '', positive_test_date: '' },
  })
  const title = t.onboarding.step2.title.replace('{name}', name)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-medium text-foreground">{title}</h2>
          <p className="mt-2 font-display text-sm italic text-muted-foreground">{t.onboarding.step2.intro}</p>
        </div>
        <FormField
          control={form.control}
          name="baby_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.step2.babyNameLabel}</FormLabel>
              <FormControl>
                <Input placeholder={t.onboarding.step2.babyNamePlaceholder} autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="positive_test_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.step2.testDateLabel}</FormLabel>
              <FormControl>
                <Input type="date" max={new Date().toISOString().split('T')[0]} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onBack}>{t.onboarding.step2.back}</Button>
          <Button type="submit" className="flex-1">{t.onboarding.step2.next}</Button>
        </div>
      </form>
    </Form>
  )
}

function Step3({
  onSubmit,
  onBack,
  loading,
  error,
}: {
  accumulated: Omit<WizardData, 'due_date'>
  onSubmit: (due_date: string) => void
  onBack: () => void
  loading: boolean
  error: string | null
}) {
  const t: Messages = useT()
  const schema = useMemo(
    () => z.object({ due_date: z.string().min(1, t.onboarding.step3.dueDateRequired) }),
    [t]
  )
  const form = useForm<{ due_date: string }>({ resolver: zodResolver(schema), defaultValues: { due_date: '' } })
  const dueDate = form.watch('due_date')
  const ssw = dueDate ? calculateSSW(dueDate) : null
  const sswLabel = ssw !== null ? t.onboarding.step3.sswLabel.replace('{ssw}', String(ssw)) : ''

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((d) => onSubmit(d.due_date))} className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-medium text-foreground">{t.onboarding.step3.title}</h2>
          <p className="mt-2 font-display text-sm italic text-muted-foreground">
            {t.onboarding.step3.intro}
          </p>
        </div>
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.step3.dueDateLabel}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {ssw !== null && (
          <div className="rounded-xl bg-secondary px-4 py-3 text-center">
            <p className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t.onboarding.step3.sswPrefix}
            </p>
            <p className="mt-1 font-display text-3xl font-medium text-primary">{sswLabel}</p>
          </div>
        )}
        {error && (
          <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onBack} disabled={loading}>
            {t.onboarding.step3.back}
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? t.onboarding.step3.saving : t.onboarding.step3.finish}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function OnboardingWizard() {
  const t = useT()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Partial<WizardData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { locale } = useLocale()

  async function handleFinish(due_date: string) {
    const fullData: WizardData = {
      name: data.name!,
      baby_name: data.baby_name!,
      positive_test_date: data.positive_test_date!,
      due_date,
      locale,
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(fullData),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(typeof body.error === 'string' ? body.error : t.onboarding.step3.error)
      }
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.onboarding.step3.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <StepIndicator current={step} total={3} />
      {step === 1 && (
        <Step1
          onNext={(name) => {
            setData((d) => ({ ...d, name }))
            setStep(2)
          }}
        />
      )}
      {step === 2 && (
        <Step2
          name={data.name!}
          onNext={(d) => {
            setData((prev) => ({ ...prev, ...d }))
            setStep(3)
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3
          accumulated={data as Omit<WizardData, 'due_date'>}
          onSubmit={handleFinish}
          onBack={() => setStep(2)}
          loading={loading}
          error={error}
        />
      )}
    </div>
  )
}
