'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { calculateSSW } from '@/lib/utils'
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

const schema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(50),
  baby_name: z.string().min(1, 'Arbeitsname ist erforderlich').max(50),
  positive_test_date: z.string().min(1, 'Datum ist erforderlich'),
  due_date: z.string().min(1, 'Geburtstermin ist erforderlich'),
})
type FormData = z.infer<typeof schema>

export function ProfilForm({ profile }: { profile: Profile }) {
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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
        throw new Error(typeof body.error === 'string' ? body.error : 'Fehler beim Speichern')
      }
      setSaveSuccess(true)
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Fehler beim Speichern')
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
                <FormLabel>Dein Vorname</FormLabel>
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
                <FormLabel>Arbeitsname des Babys</FormLabel>
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
                <FormLabel>Datum des positiven Tests</FormLabel>
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
                <FormLabel>Errechneter Geburtstermin (ET)</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
                {ssw !== null && (
                  <p className="text-xs text-primary">Aktuell SSW {ssw}</p>
                )}
              </FormItem>
            )}
          />
          {saveSuccess && (
            <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-600">
              Änderungen gespeichert ✓
            </p>
          )}
          {saveError && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{saveError}</p>
          )}
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Speichern...' : 'Speichern'}
          </Button>
        </form>
      </Form>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Gefahrenzone</h3>
        <p className="text-xs text-gray-500">
          Wenn du deinen Account löschst, werden alle deine Daten dauerhaft entfernt.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full" disabled={deleting}>
              {deleting ? 'Löschen...' : 'Account löschen'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Account wirklich löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                Diese Aktion kann nicht rückgängig gemacht werden. Dein Profil, dein Geburtsplan
                und alle gespeicherten Daten werden dauerhaft gelöscht.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Ja, Account löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
