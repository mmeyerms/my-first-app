'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { calculateSSW } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useLocale } from '@/lib/i18n/client'
import type { Locale } from '@/lib/i18n/types'

type WizardData = {
  name: string
  baby_name: string
  positive_test_date: string
  due_date: string
  locale: Locale
}

const step1Schema = z.object({
  name: z.string().min(1, 'Dein Name ist erforderlich').max(50),
})

const step2Schema = z.object({
  baby_name: z.string().min(1, 'Ein Arbeitsname ist erforderlich').max(50),
  positive_test_date: z.string().min(1, 'Das Datum ist erforderlich'),
})

const step3Schema = z.object({
  due_date: z.string().min(1, 'Der Geburtstermin ist erforderlich'),
})

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8 space-y-2">
      <div className="flex justify-between text-xs text-gray-400">
        <span>Schritt {current} von {total}</span>
      </div>
      <Progress value={(current / total) * 100} className="h-1.5" />
    </div>
  )
}

function Step1({ onNext }: { onNext: (name: string) => void }) {
  const form = useForm<{ name: string }>({ resolver: zodResolver(step1Schema), defaultValues: { name: '' } })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((d) => onNext(d.name))} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Herzlich Willkommen 🌸</h2>
          <p className="mt-2 text-sm text-gray-500">
            Wir begleiten dich durch deine Schwangerschaft. Lass uns starten!
          </p>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wie heißt du?</FormLabel>
              <FormControl>
                <Input placeholder="Dein Vorname" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Weiter →</Button>
      </form>
    </Form>
  )
}

function Step2({ name, onNext, onBack }: { name: string; onNext: (data: Pick<WizardData, 'baby_name' | 'positive_test_date'>) => void; onBack: () => void }) {
  const form = useForm<{ baby_name: string; positive_test_date: string }>({
    resolver: zodResolver(step2Schema),
    defaultValues: { baby_name: '', positive_test_date: '' },
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hallo, {name}! 💛</h2>
          <p className="mt-2 text-sm text-gray-500">Erzähl uns ein bisschen über dein Baby.</p>
        </div>
        <FormField
          control={form.control}
          name="baby_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arbeitsname des Babys</FormLabel>
              <FormControl>
                <Input placeholder="z.B. Reiskorn, Erdnuss, Luna ..." autoFocus {...field} />
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
              <FormLabel>Datum des positiven Tests</FormLabel>
              <FormControl>
                <Input type="date" max={new Date().toISOString().split('T')[0]} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onBack}>← Zurück</Button>
          <Button type="submit" className="flex-1">Weiter →</Button>
        </div>
      </form>
    </Form>
  )
}

function Step3({
  accumulated,
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
  const form = useForm<{ due_date: string }>({ resolver: zodResolver(step3Schema), defaultValues: { due_date: '' } })
  const dueDate = form.watch('due_date')
  const ssw = dueDate ? calculateSSW(dueDate) : null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((d) => onSubmit(d.due_date))} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fast geschafft! 🎉</h2>
          <p className="mt-2 text-sm text-gray-500">
            Der errechnete Geburtstermin hilft uns, dir die richtigen Inhalte zu zeigen.
          </p>
        </div>
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Errechneter Geburtstermin (ET)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {ssw !== null && (
          <div className="rounded-xl bg-rose-50 px-4 py-3 text-center">
            <p className="text-sm text-gray-500">Du bist aktuell in</p>
            <p className="text-3xl font-bold text-rose-500">SSW {ssw}</p>
          </div>
        )}
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onBack} disabled={loading}>
            ← Zurück
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Speichern...' : 'Los geht\'s! 🌸'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function OnboardingWizard() {
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
        throw new Error(typeof body.error === 'string' ? body.error : 'Fehler beim Speichern')
      }
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
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
