'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { translateAuthError } from '@/lib/utils'
import { useT } from '@/lib/i18n/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

function safeNext(raw: string | null | undefined): string {
  if (typeof raw !== 'string') return '/dashboard'
  const cleaned = raw.replace(/[\s -]/g, '')
  if (!cleaned) return '/dashboard'
  if (!cleaned.startsWith('/')) return '/dashboard'
  if (cleaned.startsWith('//')) return '/dashboard'
  if (cleaned.includes('\\')) return '/dashboard'
  return cleaned
}

export function LoginForm() {
  const t = useT()
  const searchParams = useSearchParams()
  const nextUrl = safeNext(searchParams.get('next'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().email(t.auth.login.validation.email),
        password: z.string().min(1, t.auth.login.validation.password),
      }),
    [t]
  )
  type FormData = z.infer<typeof schema>

  const form = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    try {
      // Server-side rate check BEFORE we hit Supabase directly.
      // Prevents brute-force attempts against the client-side auth call.
      const rateRes = await fetch('/api/auth/rate-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket: 'login' }),
      })
      if (rateRes.status === 429) {
        setError('Zu viele Login-Versuche — bitte später erneut versuchen.')
        return
      }

      const supabase = createClient()
      const { data: result, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (authError) throw authError
      if (result.session) {
        window.location.href = nextUrl
      }
    } catch (err: unknown) {
      setError(translateAuthError(err instanceof Error ? err.message : ''))
    } finally {
      setLoading(false)
    }
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
              <FormLabel>{t.auth.login.email}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t.auth.login.emailPlaceholder} autoComplete="email" {...field} />
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
              <div className="flex items-center justify-between">
                <FormLabel>{t.auth.login.password}</FormLabel>
                <Link href="/passwort-vergessen" className="text-xs text-primary hover:underline">
                  {t.auth.login.forgotShort}
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder={t.auth.login.passwordPlaceholder} autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t.auth.login.submitting : t.auth.login.submit}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t.auth.login.noAccount}{' '}
          <Link
            href={nextUrl === '/dashboard' ? '/register' : `/register?next=${encodeURIComponent(nextUrl)}`}
            className="font-medium text-primary hover:underline"
          >
            {t.auth.login.registerCta}
          </Link>
        </p>
      </form>
    </Form>
  )
}
