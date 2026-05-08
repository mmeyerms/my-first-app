import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const TERMIN_TYPE_IDS = [
  'erstgespraech',
  'erste_vorsorge',
  'nackenfaltenmessung',
  'triple_test',
  'feindiagnostik',
  'zuckertest',
  'dritter_ultraschall',
  'ctg',
  'hebammengespraech',
  'geburtsplangespraech',
  'klinikbesichtigung',
  'wochenbett_hebamme',
  'geburtsvorbereitung',
  'stillberatung',
  'zahnarzt',
  'custom',
] as const

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum')
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Ungültige Zeit')

const patchSchema = z
  .object({
    type: z.enum(TERMIN_TYPE_IDS).optional(),
    title: z.string().min(1).max(200).optional(),
    date: dateSchema.optional(),
    time: timeSchema.optional().or(z.literal('')).nullable().optional(),
    location: z.string().max(200).optional().or(z.literal('')).nullable().optional(),
    doctor: z.string().max(200).optional().or(z.literal('')).nullable().optional(),
    notes: z.string().max(2000).optional().or(z.literal('')).nullable().optional(),
    done: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Keine Felder zum Aktualisieren' })

function emptyToNull<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = { ...obj }
  for (const k of Object.keys(out)) {
    if (out[k] === '') out[k] = null
  }
  return out as T
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
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

  const updatePayload = emptyToNull(parsed.data as Record<string, unknown>)

  const { error } = await supabase
    .from('termine')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const url = new URL(request.url)
  const wantsSeries = url.searchParams.get('series') === 'true'

  if (wantsSeries) {
    // Look up the termin's group_id, then delete all rows in that group
    // belonging to this user.
    const { data: termin, error: lookupError } = await supabase
      .from('termine')
      .select('group_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (lookupError && (lookupError as { code?: string }).code !== 'PGRST116') {
      return NextResponse.json({ error: lookupError.message }, { status: 500 })
    }

    const groupId = (termin as { group_id: string | null } | null)?.group_id ?? null

    if (!groupId) {
      // No series — fall back to deleting just this row.
      const { error: deleteSingle } = await supabase
        .from('termine')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      if (deleteSingle) return NextResponse.json({ error: deleteSingle.message }, { status: 500 })
      return NextResponse.json({ ok: true, deletedSeries: false })
    }

    const { error: deleteSeries } = await supabase
      .from('termine')
      .delete()
      .eq('user_id', user.id)
      .eq('group_id', groupId)

    if (deleteSeries) {
      return NextResponse.json({ error: deleteSeries.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, deletedSeries: true })
  }

  const { error } = await supabase
    .from('termine')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
