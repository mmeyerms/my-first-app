'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sprout, HeartPulse } from 'lucide-react'
import { calculateSSW, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLocale, useT } from '@/lib/i18n/client'
import type { Locale } from '@/lib/i18n/types'
import { AppDisclaimerNote } from '@/components/legal/AppDisclaimerNote'

type Mode = 'planning' | 'pregnant'
type BabyGender = 'female' | 'male' | 'diverse' | 'surprise' | 'unknown'

type WizardData = {
  name: string
  mode: Mode
  baby_name?: string
  positive_test_date?: string
  due_date?: string
  baby_gender?: BabyGender
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

function Step1Name({ defaultValue, onNext }: { defaultValue: string; onNext: (name: string) => void }) {
  const t = useT()
  const schema = useMemo(
    () => z.object({ name: z.string().min(1, t.onboarding.step1.nameRequired).max(50) }),
    [t],
  )
  const form = useForm<{ name: string }>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultValue },
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((d) => onNext(d.name))} className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-medium text-foreground">
            {t.onboarding.step1.title}
          </h2>
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
        <Button type="submit" className="w-full">
          {t.onboarding.step1.next}
        </Button>
      </form>
    </Form>
  )
}

function Step2Mode({
  defaultValue,
  onNext,
  onBack,
}: {
  defaultValue: Mode | null
  onNext: (mode: Mode) => void
  onBack: () => void
}) {
  const t = useT()
  const [selected, setSelected] = useState<Mode | null>(defaultValue)

  const choices: Array<{
    value: Mode
    title: string
    hint: string
    emoji: string
    icon: typeof Sprout
  }> = [
    {
      value: 'planning',
      title: t.onboarding.step2.planningTitle,
      hint: t.onboarding.step2.planningHint,
      emoji: '💛',
      icon: Sprout,
    },
    {
      value: 'pregnant',
      title: t.onboarding.step2.pregnantTitle,
      hint: t.onboarding.step2.pregnantHint,
      emoji: '🌸',
      icon: HeartPulse,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-medium text-foreground">
          {t.onboarding.step2.title}
        </h2>
        <p className="mt-2 font-display text-sm italic text-muted-foreground">
          {t.onboarding.step2.intro}
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">{t.onboarding.step2.title}</legend>
        {choices.map((c) => {
          const isActive = selected === c.value
          const Icon = c.icon
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelected(c.value)}
              aria-pressed={isActive}
              className={cn(
                'card-elevated w-full rounded-2xl border-2 bg-card p-5 text-left transition-all',
                isActive
                  ? 'border-primary shadow-md'
                  : 'border-border/60 hover:-translate-y-0.5 hover:border-border hover:shadow-md',
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary"
                >
                  <span className="text-2xl leading-none">{c.emoji}</span>
                  <Icon className="sr-only h-5 w-5 text-primary" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-semibold leading-tight text-foreground">
                    {c.title}
                  </p>
                  <p className="mt-1 font-display text-sm italic text-muted-foreground">
                    {c.hint}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </fieldset>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
          {t.onboarding.step2.back}
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
        >
          {t.onboarding.step2.next}
        </Button>
      </div>
    </div>
  )
}

function StepBabyDetails({
  onSubmit,
  onBack,
  loading,
  error,
  defaults,
}: {
  onSubmit: (data: {
    baby_name?: string
    positive_test_date?: string
    due_date?: string
    baby_gender?: BabyGender
  }) => void
  onBack: () => void
  loading: boolean
  error: string | null
  defaults: {
    baby_name?: string
    positive_test_date?: string
    due_date?: string
    baby_gender?: BabyGender
  }
}) {
  const t = useT()

  // All fields optional; only soft validation on date format if provided.
  const schema = useMemo(
    () =>
      z.object({
        baby_name: z.string().max(50).optional(),
        positive_test_date: z.string().optional(),
        due_date: z.string().optional(),
        baby_gender: z
          .enum(['female', 'male', 'diverse', 'surprise', 'unknown'])
          .optional(),
      }),
    [],
  )
  type FormData = z.infer<typeof schema>

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      baby_name: defaults.baby_name ?? '',
      positive_test_date: defaults.positive_test_date ?? '',
      due_date: defaults.due_date ?? '',
      baby_gender: defaults.baby_gender,
    },
  })

  const dueDate = form.watch('due_date')
  const ssw = dueDate ? calculateSSW(dueDate) : null
  const sswLabel =
    ssw !== null ? t.onboarding.stepBaby.sswLabel.replace('{ssw}', String(ssw)) : ''

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) =>
          onSubmit({
            baby_name: d.baby_name?.trim() || undefined,
            positive_test_date: d.positive_test_date || undefined,
            due_date: d.due_date || undefined,
            baby_gender: d.baby_gender,
          }),
        )}
        className="space-y-6"
      >
        <div>
          <h2 className="font-display text-3xl font-medium text-foreground">
            {t.onboarding.stepBaby.title}
          </h2>
          <p className="mt-2 font-display text-sm italic text-muted-foreground">
            {t.onboarding.stepBaby.intro}
          </p>
        </div>

        <FormField
          control={form.control}
          name="baby_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.stepBaby.babyNameLabel}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t.onboarding.stepBaby.babyNamePlaceholder}
                  autoFocus
                  {...field}
                />
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
              <FormLabel>{t.onboarding.stepBaby.testDateLabel}</FormLabel>
              <FormControl>
                <Input type="date" max={new Date().toISOString().split('T')[0]} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.stepBaby.dueDateLabel}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <p className="mt-1 font-display text-xs italic text-muted-foreground">
                {t.onboarding.stepBaby.dueDateHint}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {ssw !== null && (
          <div className="rounded-xl bg-secondary px-4 py-3 text-center">
            <p className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t.onboarding.stepBaby.sswPrefix}
            </p>
            <p className="mt-1 font-display text-3xl font-medium text-primary">{sswLabel}</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="baby_gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.stepBaby.genderLabel}</FormLabel>
              <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v || undefined)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="female">{t.onboarding.stepBaby.genderOptions.female}</SelectItem>
                  <SelectItem value="male">{t.onboarding.stepBaby.genderOptions.male}</SelectItem>
                  <SelectItem value="diverse">
                    {t.onboarding.stepBaby.genderOptions.diverse}
                  </SelectItem>
                  <SelectItem value="surprise">
                    {t.onboarding.stepBaby.genderOptions.surprise}
                  </SelectItem>
                  <SelectItem value="unknown">
                    {t.onboarding.stepBaby.genderOptions.unknown}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
            disabled={loading}
          >
            {t.onboarding.stepBaby.back}
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? t.onboarding.stepBaby.saving : t.onboarding.stepBaby.finish}
          </Button>
        </div>
      </form>
    </Form>
  )
}

function StepPlanning({
  onSubmit,
  onBack,
  loading,
  error,
}: {
  onSubmit: () => void
  onBack: () => void
  loading: boolean
  error: string | null
}) {
  const t = useT()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-medium text-foreground">
          {t.onboarding.stepPlanning.title}
        </h2>
        <p className="mt-3 font-display text-sm italic leading-relaxed text-muted-foreground">
          {t.onboarding.stepPlanning.body}
        </p>
      </div>

      <div className="card-elevated rounded-2xl bg-card p-6 text-center">
        <span aria-hidden="true" className="text-4xl">
          🌷
        </span>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={loading}
        >
          {t.onboarding.stepPlanning.back}
        </Button>
        <Button type="button" className="flex-1" onClick={onSubmit} disabled={loading}>
          {loading ? t.onboarding.stepPlanning.saving : t.onboarding.stepPlanning.finish}
        </Button>
      </div>
    </div>
  )
}

export function OnboardingWizard() {
  const t = useT()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [data, setData] = useState<Partial<WizardData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { locale } = useLocale()

  // Total steps is always 3:
  // 1 = Name, 2 = Mode, 3 = Mode-specific (baby details OR planning confirmation)
  const TOTAL_STEPS = 3

  async function persist(payload: Record<string, unknown>, redirectTo: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(
          typeof body.error === 'string' ? body.error : t.onboarding.stepBaby.error,
        )
      }
      window.location.href = redirectTo
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.onboarding.stepBaby.error)
    } finally {
      setLoading(false)
    }
  }

  async function handleFinishPregnant(details: {
    baby_name?: string
    positive_test_date?: string
    due_date?: string
    baby_gender?: BabyGender
  }) {
    await persist(
      {
        name: data.name!,
        mode: 'pregnant' as const,
        ...(details.baby_name ? { baby_name: details.baby_name } : {}),
        ...(details.positive_test_date
          ? { positive_test_date: details.positive_test_date }
          : {}),
        ...(details.due_date ? { due_date: details.due_date } : {}),
        ...(details.baby_gender ? { baby_gender: details.baby_gender } : {}),
        locale,
      },
      '/dashboard',
    )
  }

  async function handleFinishPlanning() {
    await persist(
      {
        name: data.name!,
        mode: 'planning' as const,
        locale,
      },
      '/kinderwunsch',
    )
  }

  return (
    <div>
      <StepIndicator current={step} total={TOTAL_STEPS} />
      <div className="mb-6">
        <AppDisclaimerNote />
      </div>

      {step === 1 && (
        <Step1Name
          defaultValue={data.name ?? ''}
          onNext={(name) => {
            setData((d) => ({ ...d, name }))
            setStep(2)
          }}
        />
      )}

      {step === 2 && (
        <Step2Mode
          defaultValue={data.mode ?? null}
          onNext={(mode) => {
            setData((d) => ({ ...d, mode }))
            setStep(3)
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && data.mode === 'pregnant' && (
        <StepBabyDetails
          defaults={{
            baby_name: data.baby_name,
            positive_test_date: data.positive_test_date,
            due_date: data.due_date,
            baby_gender: data.baby_gender,
          }}
          onSubmit={(details) => {
            setData((d) => ({ ...d, ...details }))
            handleFinishPregnant(details)
          }}
          onBack={() => setStep(2)}
          loading={loading}
          error={error}
        />
      )}

      {step === 3 && data.mode === 'planning' && (
        <StepPlanning
          onSubmit={handleFinishPlanning}
          onBack={() => setStep(2)}
          loading={loading}
          error={error}
        />
      )}
    </div>
  )
}
