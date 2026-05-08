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

interface Profile {
  name: string
  baby_name: string
  positive_test_date: string
  due_date: string
}

export function ProfilForm({ profile }: { profile: Profile }) {
  const t = useT()
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t.profile.sectionPersonal.validation.name).max(50),
        baby_name: z.string().min(1, t.profile.sectionPersonal.validation.babyName).max(50),
        positive_test_date: z.string().min(1, t.profile.sectionPersonal.validation.testDate),
        due_date: z.string().min(1, t.profile.sectionPersonal.validation.dueDate),
      }),
    [t]
  )
  type FormData = z.infer<typeof schema>

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: profile,
  })

  const dueDate = form.watch('due_date')
  const ssw = dueDate ? calculateSSW(dueDate) : null

  async function onSubmit(data: FormData) {
    setSaving(true)
    setSaveSuccess(false)
    setSaveError(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(typeof body.error === 'string' ? body.error : t.profile.saveError)
      }
      setSaveSuccess(true)
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

  return (
    <div className="space-y-8">
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
