'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useT } from '@/lib/i18n/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export function ForgotPasswordForm() {
  const t = useT()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().email(t.auth.register.validation.email),
      }),
    [t]
  )
  type FormData = z.infer<typeof schema>

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
        <h3 className="font-display text-xl font-medium text-foreground">{t.auth.forgotPassword.sentTitle}</h3>
        <p className="text-sm text-muted-foreground">
          {t.auth.forgotPassword.sentBody}
        </p>
        <Link href="/login" className="block text-sm font-medium text-primary hover:underline">
          {t.auth.forgotPassword.backToLogin}
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t.auth.forgotPassword.instructions}
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.auth.forgotPassword.email}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t.auth.forgotPassword.emailPlaceholder} autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t.auth.forgotPassword.submitting : t.auth.forgotPassword.submit}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t.auth.forgotPassword.backToLogin}
          </Link>
        </p>
      </form>
    </Form>
  )
}
