import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const localeSchema = z.enum(['de', 'en'])
const modeSchema = z.enum(['planning', 'pregnant'])
const babyGenderSchema = z.enum(['female', 'male', 'diverse', 'surprise', 'unknown'])
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum')

// Full profile schema — used by onboarding & full profile edits.
// Only `name` is strictly required; everything else is optional and filled in over time.
const profileSchema = z
  .object({
    name: z.string().min(1, 'Name ist erforderlich').max(50),
    baby_name: z.string().min(1).max(50).optional().or(z.literal('')),
    positive_test_date: dateSchema.optional().or(z.literal('')),
    due_date: dateSchema.optional().or(z.literal('')),
    mode: modeSchema.optional(),
    baby_gender: babyGenderSchema.optional().or(z.literal('')),
    tour_completed: z.boolean().optional(),
    locale: localeSchema.optional(),
  })
  .refine(
    (d) => {
      // Only validate due > test when both are present and non-empty.
      if (!d.positive_test_date || !d.due_date) return true
      return new Date(d.due_date) > new Date(d.positive_test_date)
    },
    { message: 'Geburtstermin muss nach dem Test-Datum liegen', path: ['due_date'] },
  )

// Partial-update schema for incremental updates (locale, baby_gender,
// tour_completed, mode toggles). All fields optional; the request must contain
// at least one of the recognised partial-update keys.
const partialUpdateSchema = z
  .object({
    locale: localeSchema.optional(),
    mode: modeSchema.optional(),
    baby_gender: babyGenderSchema.optional(),
    tour_completed: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Keine Felder zum Aktualisieren' })

const PARTIAL_KEYS = new Set(['locale', 'mode', 'baby_gender', 'tour_completed'])

// Sanitise outgoing data: turn empty-string optional fields into `null` so the
// database stores SQL NULL rather than an empty string.
function nullifyEmpty<T extends Record<string, unknown>>(data: T): T {
  const out: Record<string, unknown> = { ...data }
  for (const key of ['baby_name', 'positive_test_date', 'due_date', 'baby_gender']) {
    if (out[key] === '') out[key] = null
  }
  return out as T
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select(
      'name, baby_name, positive_test_date, due_date, mode, baby_gender, tour_completed, locale, updated_at',
    )
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

  // Detect partial updates: body has only recognised partial keys (locale,
  // mode, baby_gender, tour_completed) and no other profile keys (no name).
  const isPartial =
    typeof body === 'object' &&
    body !== null &&
    Object.keys(body as Record<string, unknown>).length > 0 &&
    Object.keys(body as Record<string, unknown>).every((k) => PARTIAL_KEYS.has(k))

  if (isPartial) {
    const result = partialUpdateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const { error } = await supabase
      .from('profiles')
      .update(result.data)
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
    ...nullifyEmpty(result.data),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
