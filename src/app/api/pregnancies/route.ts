import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getAllPregnancies } from '@/lib/pregnancy/server'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum')
const babyGenderSchema = z.enum(['female', 'male', 'diverse', 'surprise', 'unknown'])
const createStatusSchema = z.enum(['planning', 'pregnant'])

const createSchema = z.object({
  status: createStatusSchema.optional(),
  baby_name: z.string().min(1).max(50).optional().or(z.literal('')),
  baby_names: z.array(z.string().min(1).max(50)).max(10).optional(),
  is_multiple: z.boolean().optional(),
  baby_gender: babyGenderSchema.optional().or(z.literal('')),
  positive_test_date: dateSchema.optional().or(z.literal('')),
  due_date: dateSchema.optional().or(z.literal('')),
  set_active: z.boolean().optional(),
})

function nullifyEmpty<T extends Record<string, unknown>>(data: T): T {
  const out: Record<string, unknown> = { ...data }
  for (const key of ['baby_name', 'baby_gender', 'positive_test_date', 'due_date']) {
    if (out[key] === '') out[key] = null
  }
  return out as T
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const pregnancies = await getAllPregnancies(supabase, user.id)
  return NextResponse.json(pregnancies)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { set_active = true, status = 'pregnant', ...rest } = parsed.data

  // If activating, deactivate all others first. The unique index
  // idx_pregnancies_user_active enforces only one active row per user, so we
  // must clear the previous active row BEFORE inserting a new active one.
  if (set_active) {
    const { error: deactivateError } = await supabase
      .from('pregnancies')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('is_active', true)
    if (deactivateError) {
      return NextResponse.json({ error: deactivateError.message }, { status: 500 })
    }
  }

  // Normalize multiples: keep baby_name as first entry of baby_names for
  // backward compat with legacy consumers.
  const cleaned = nullifyEmpty(rest) as Record<string, unknown>
  const trimmedNames = Array.isArray(cleaned.baby_names)
    ? (cleaned.baby_names as string[]).map((n) => n.trim()).filter((n) => n.length > 0)
    : null
  if (trimmedNames && trimmedNames.length > 0) {
    cleaned.baby_names = trimmedNames
    if (!cleaned.baby_name) cleaned.baby_name = trimmedNames[0]
  } else {
    cleaned.baby_names = null
  }
  if (typeof cleaned.is_multiple !== 'boolean') cleaned.is_multiple = false

  const insertPayload = {
    user_id: user.id,
    status,
    is_active: set_active,
    ...cleaned,
  }

  const { data, error } = await supabase
    .from('pregnancies')
    .insert(insertPayload)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
