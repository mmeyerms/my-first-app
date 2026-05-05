'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const schema = z.object({
  email: z.string().email('Bitte eine gültige E-Mail-Adresse eingeben'),
})
type FormData = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const form = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/profil`,
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-3 text-center">
        <div className="text-4xl">💌</div>
        <h3 className="font-semibold text-gray-800">E-Mail verschickt</h3>
        <p className="text-sm text-gray-500">
          Schau in dein Postfach — dort findest du einen Link, um dein Passwort zurückzusetzen.
        </p>
        <Link href="/login" className="block text-sm font-medium text-rose-500 hover:underline">
          Zurück zum Login
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-gray-500">
          Gib deine E-Mail-Adresse ein und wir schicken dir einen Reset-Link.
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="deine@email.de" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Senden...' : 'Reset-Link senden'}
        </Button>
        <p className="text-center text-sm text-gray-500">
          <Link href="/login" className="font-medium text-rose-500 hover:underline">
            Zurück zum Login
          </Link>
        </p>
      </form>
    </Form>
  )
}
