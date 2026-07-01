import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'

// Fields that exist on BOTH profiles and pregnancies — when a PUT updates
// these on the profile, mirror them onto the active pregnancy so the two
// sources of truth stay in sync during the gradual migration.
const MIRROR_KEYS = ['baby_name', 'baby_gender', 'positive_test_date', 'due_date'] as const

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

    // Mirror baby_gender (the only MIRROR_KEY that appears in partial updates)
    // onto the active pregnancy so both sources stay in sync.
    if ('baby_gender' in result.data) {
      const active = await getActivePregnancy(supabase, user.id)
      if (active) {
        await supabase
          .from('pregnancies')
          .update({ baby_gender: result.data.baby_gender })
          .eq('id', active.id)
          .eq('user_id', user.id)
      }
    }

    return NextResponse.json({ success: true })
  }

  const result = profileSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const cleaned = nullifyEmpty(result.data)

  // Auto-Transition: wenn positive_test_date gesetzt wird und der aktuelle
  // Modus 'planning' ist, automatisch auf 'pregnant' wechseln. Wir informieren
  // den Client via `modeTransitioned` in der Response, damit er das Glückwunsch-
  // Popup zeigen kann.
  let modeTransitioned: 'pregnant' | null = null
  if (cleaned.positive_test_date && !cleaned.mode) {
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('mode')
      .eq('user_id', user.id)
      .single() as { data: { mode: 'planning' | 'pregnant' | null } | null }
    if (currentProfile?.mode === 'planning') {
      ;(cleaned as Record<string, unknown>).mode = 'pregnant'
      modeTransitioned = 'pregnant'
    }
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ user_id: user.id, ...cleaned }, { onConflict: 'user_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mirror baby_name / baby_gender / positive_test_date / due_date onto the
  // user's active pregnancy. If no active pregnancy exists yet, silently skip;
  // we don't auto-create one here because POST /api/pregnancies is the
  // canonical creation path.
  const mirrorPayload: Record<string, unknown> = {}
  for (const key of MIRROR_KEYS) {
    if (key in cleaned) {
      mirrorPayload[key] = (cleaned as Record<string, unknown>)[key]
    }
  }
  if (Object.keys(mirrorPayload).length > 0 || modeTransitioned) {
    const active = await getActivePregnancy(supabase, user.id)
    if (active) {
      const pregnancyPayload = { ...mirrorPayload }
      if (modeTransitioned) pregnancyPayload.status = 'pregnant'
      await supabase
        .from('pregnancies')
        .update(pregnancyPayload)
        .eq('id', active.id)
        .eq('user_id', user.id)
    }
  }

  return NextResponse.json({ success: true, modeTransitioned })
}
