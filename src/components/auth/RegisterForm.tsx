'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { translateAuthError } from '@/lib/utils'
import { useT } from '@/lib/i18n/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export function RegisterForm() {
  const t = useT()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().email(t.auth.register.validation.email),
        password: z.string().min(8, t.auth.register.validation.passwordMin),
      }),
    [t]
  )
  type FormData = z.infer<typeof schema>

  const form = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: result, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { emailRedirectTo: `${window.location.origin}/onboarding` },
      })
      if (authError) throw authError
      if (result.user && !result.session) {
        setSuccess(true)
      } else if (result.session) {
        window.location.href = '/onboarding'
      }
    } catch (err: unknown) {
      setError(translateAuthError(err instanceof Error ? err.message : ''))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-3 text-center">
        <div className="text-4xl">📬</div>
        <h3 className="font-display text-xl font-medium text-foreground">{t.auth.register.verifyTitle}</h3>
        <p className="text-sm text-muted-foreground">
          {t.auth.register.verifyBody}
        </p>
        <Link href="/login" className="block text-sm font-medium text-primary hover:underline">
          {t.auth.register.backToLogin}
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.auth.register.email}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t.auth.register.emailPlaceholder} autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.auth.register.password}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t.auth.register.passwordPlaceholder} autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t.auth.register.submitting : t.auth.register.submit}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t.auth.register.hasAccount}{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t.auth.register.loginCta}
          </Link>
        </p>
      </form>
    </Form>
  )
}
