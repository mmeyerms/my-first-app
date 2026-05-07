import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const localeSchema = z.enum(['de', 'en'])

const profileSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(50),
  baby_name: z.string().min(1, 'Arbeitsname ist erforderlich').max(50),
  positive_test_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum'),
  locale: localeSchema.optional(),
}).refine(
  (d) => new Date(d.due_date) > new Date(d.positive_test_date),
  { message: 'Geburtstermin muss nach dem Test-Datum liegen', path: ['due_date'] }
)

// Partial update schema — used when ONLY locale changes (e.g. from LocaleSelector).
const localeOnlySchema = z.object({
  locale: localeSchema,
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select('name, baby_name, positive_test_date, due_date, locale, updated_at')
    .eq('user_id', user.id)
    .single()

  if (error?.code === 'PGRST116') {
    return NextResponse.json({ error: 'Kein Profil gefunden' }, { status: 404 })
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  await supabase.from('profiles').delete().eq('user_id', user.id)
  await supabase.from('birth_plans').delete().eq('user_id', user.id)

  return NextResponse.json({ success: true })
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  // Detect locale-only updates: body has `locale` and no other profile keys.
  const isLocaleOnly =
    typeof body === 'object' &&
    body !== null &&
    'locale' in body &&
    Object.keys(body as Record<string, unknown>).every((k) => k === 'locale')

  if (isLocaleOnly) {
    const result = localeOnlySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    // Update only the locale; the row must already exist (locale-only is for logged-in users
    // who have completed onboarding). If no row exists, the update is a no-op — that's fine.
    const { error } = await supabase
      .from('profiles')
      .update({ locale: result.data.locale })
      .eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  const result = profileSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const { error } = await supabase.from('profiles').upsert({
    user_id: user.id,
    ...result.data,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
