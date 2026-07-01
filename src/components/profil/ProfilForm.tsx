'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { calculateSSW } from '@/lib/utils'
import { useT } from '@/lib/i18n/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { PregnancyCelebrationModal } from './PregnancyCelebrationModal'

type Mode = 'planning' | 'pregnant'
type BabyGender = 'female' | 'male' | 'diverse' | 'surprise' | 'unknown'

interface Profile {
  name: string
  baby_name: string | null
  positive_test_date: string | null
  due_date: string | null
  mode: Mode | null
  baby_gender: BabyGender | null
}

const NONE_VALUE = '__none__'

export function ProfilForm({ profile }: { profile: Profile }) {
  const t = useT()
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [modeUpdating, setModeUpdating] = useState(false)
  const [replaying, setReplaying] = useState(false)
  const [celebrateOpen, setCelebrateOpen] = useState(false)

  const currentMode: Mode = profile.mode ?? 'pregnant'

  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(1, t.profile.sectionPersonal.validation.name).max(50),
          baby_name: z.string().max(50).optional(),
          positive_test_date: z.string().optional(),
          due_date: z.string().optional(),
          baby_gender: z
            .enum(['female', 'male', 'diverse', 'surprise', 'unknown'])
            .optional(),
        })
        .refine(
          (d) => {
            if (!d.positive_test_date || !d.due_date) return true
            return new Date(d.due_date) > new Date(d.positive_test_date)
          },
          {
            message: t.profile.sectionPersonal.validation.dueDate,
            path: ['due_date'],
          },
        ),
    [t],
  )
  type FormData = z.infer<typeof schema>

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name ?? '',
      baby_name: profile.baby_name ?? '',
      positive_test_date: profile.positive_test_date ?? '',
      due_date: profile.due_date ?? '',
      baby_gender: profile.baby_gender ?? undefined,
    },
  })

  const dueDate = form.watch('due_date')
  const ssw = dueDate ? calculateSSW(dueDate) : null

  async function onSubmit(data: FormData) {
    setSaving(true)
    setSaveSuccess(false)
    setSaveError(null)
    try {
      // Send only non-empty fields so optional date columns become NULL when cleared.
      const payload: Record<string, unknown> = {
        name: data.name,
        baby_name: data.baby_name?.trim() ?? '',
        positive_test_date: data.positive_test_date ?? '',
        due_date: data.due_date ?? '',
      }
      if (data.baby_gender) payload.baby_gender = data.baby_gender
      else payload.baby_gender = ''
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(typeof body.error === 'string' ? body.error : t.profile.saveError)
      }
      const body = await res.json().catch(() => ({}))
      setSaveSuccess(true)
      if (body?.modeTransitioned === 'pregnant') {
        setCelebrateOpen(true)
      }
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : t.profile.saveError)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await fetch('/api/profile', { method: 'DELETE' })
      window.location.href = '/login'
    } finally {
      setDeleting(false)
    }
  }

  async function toggleMode() {
    const next: Mode = currentMode === 'pregnant' ? 'planning' : 'pregnant'
    setModeUpdating(true)
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: next }),
      })
      window.location.reload()
    } finally {
      setModeUpdating(false)
    }
  }

  async function handleReplayTour() {
    setReplaying(true)
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tour_completed: false }),
      })
      window.location.href = '/dashboard'
    } finally {
      setReplaying(false)
    }
  }

  return (
    <div className="space-y-8">
      <PregnancyCelebrationModal
        open={celebrateOpen}
        onOpenChange={setCelebrateOpen}
        babyName={form.watch('baby_name') || profile.baby_name}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.profile.sectionPersonal.name}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baby_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.profile.sectionPersonal.babyName}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="positive_test_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.profile.sectionPersonal.testDate}</FormLabel>
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
                <FormLabel>{t.profile.sectionPersonal.dueDate}</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
                {ssw !== null && (
                  <p className="text-xs text-primary">{t.profile.sectionPersonal.ssw.replace('{ssw}', String(ssw))}</p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baby_gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.profile.babyGender}</FormLabel>
                <Select
                  value={field.value ?? NONE_VALUE}
                  onValueChange={(v) => field.onChange(v === NONE_VALUE ? undefined : v)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.profile.babyGenderOptions.none} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE}>{t.profile.babyGenderOptions.none}</SelectItem>
                    <SelectItem value="female">{t.profile.babyGenderOptions.female}</SelectItem>
                    <SelectItem value="male">{t.profile.babyGenderOptions.male}</SelectItem>
                    <SelectItem value="diverse">{t.profile.babyGenderOptions.diverse}</SelectItem>
                    <SelectItem value="surprise">{t.profile.babyGenderOptions.surprise}</SelectItem>
                    <SelectItem value="unknown">{t.profile.babyGenderOptions.unknown}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {saveSuccess && (
            <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-600">
              {t.profile.saved}
            </p>
          )}
          {saveError && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{saveError}</p>
          )}
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? t.profile.saving : t.profile.save}
          </Button>
        </form>
      </Form>

      <Separator />

      {/* Mode toggle */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-foreground">{t.profile.modeLabel}</h3>
          <span className="text-xs text-muted-foreground">
            {currentMode === 'planning' ? t.profile.modePlanning : t.profile.modePregnant}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={toggleMode}
          disabled={modeUpdating}
        >
          {currentMode === 'planning'
            ? t.profile.modeSwitchToPregnant
            : t.profile.modeSwitchToPlanning}
        </Button>
      </div>

      <Separator />

      {/* Replay tour */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleReplayTour}
          disabled={replaying}
        >
          {t.profile.replayTour}
        </Button>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">{t.profile.sectionDanger.title}</h3>
        <p className="text-xs text-gray-500">
          {t.profile.sectionDanger.description}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full" disabled={deleting}>
              {deleting ? t.profile.sectionDanger.deleting : t.profile.sectionDanger.deleteAccount}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.profile.sectionDanger.confirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.profile.sectionDanger.confirmDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.profile.sectionDanger.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t.profile.sectionDanger.confirmDelete}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
