import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum')
const babyGenderSchema = z.enum(['female', 'male', 'diverse', 'surprise', 'unknown'])
const statusSchema = z.enum(['planning', 'pregnant', 'born', 'sternenkind'])

const patchSchema = z
  .object({
    status: statusSchema.optional(),
    baby_name: z.string().min(1).max(50).optional().or(z.literal('')),
    baby_names: z.array(z.string().min(1).max(50)).max(10).optional(),
    is_multiple: z.boolean().optional(),
    baby_gender: babyGenderSchema.optional().or(z.literal('')),
    positive_test_date: dateSchema.optional().or(z.literal('')),
    due_date: dateSchema.optional().or(z.literal('')),
    birth_date: dateSchema.optional().or(z.literal('')),
    ended_date: dateSchema.optional().or(z.literal('')),
    memorial_note: z.string().max(5000).optional().or(z.literal('')),
    is_active: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Keine Felder zum Aktualisieren' })

function nullifyEmpty<T extends Record<string, unknown>>(data: T): T {
  const out: Record<string, unknown> = { ...data }
  for (const key of [
    'baby_name',
    'baby_gender',
    'positive_test_date',
    'due_date',
    'birth_date',
    'ended_date',
    'memorial_note',
  ]) {
    if (out[key] === '') out[key] = null
  }
  return out as T
}

async function ensureOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  pregnancyId: string,
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const { data, error } = await supabase
    .from('pregnancies')
    .select('id, user_id')
    .eq('id', pregnancyId)
    .eq('user_id', userId)
    .limit(1)
    .single()
  if (error) {
    if (error.code === 'PGRST116') {
      return { ok: false, status: 404, message: 'Schwangerschaft nicht gefunden' }
    }
    return { ok: false, status: 500, message: error.message }
  }
  if (!data) return { ok: false, status: 404, message: 'Schwangerschaft nicht gefunden' }
  return { ok: true }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { id } = await context.params
  if (!id) return NextResponse.json({ error: 'ID fehlt' }, { status: 400 })

  const ownership = await ensureOwnership(supabase, user.id, id)
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.message }, { status: ownership.status })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const updates = nullifyEmpty(parsed.data) as Record<string, unknown>

  // Normalize baby_names: trim + drop empty entries. If provided empty, set null.
  if ('baby_names' in updates) {
    const arr = updates.baby_names
    if (Array.isArray(arr)) {
      const trimmed = arr.map((n) => (typeof n === 'string' ? n.trim() : '')).filter((n) => n.length > 0)
      if (trimmed.length > 0) {
        updates.baby_names = trimmed
        // Keep baby_name in sync with first entry for legacy consumers unless
        // the caller explicitly set baby_name in the same request.
        if (updates.baby_name === undefined || updates.baby_name === null) {
          updates.baby_name = trimmed[0]
        }
      } else {
        updates.baby_names = null
      }
    }
  }

  // Activating this pregnancy: deactivate all OTHERS first to satisfy the
  // unique index idx_pregnancies_user_active.
  if (updates.is_active === true) {
    const { error: deactivateError } = await supabase
      .from('pregnancies')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('is_active', true)
    if (deactivateError) {
      return NextResponse.json({ error: deactivateError.message }, { status: 500 })
    }
  }

  const { data, error } = await supabase
    .from('pregnancies')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { id } = await context.params
  if (!id) return NextResponse.json({ error: 'ID fehlt' }, { status: 400 })

  const ownership = await ensureOwnership(supabase, user.id, id)
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.message }, { status: ownership.status })
  }

  const { error } = await supabase
    .from('pregnancies')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
