import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { HELP_CATEGORIES } from '@/lib/wochenbett-chef/types'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum')
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Ungültige Zeit')

const patchSchema = z
  .object({
    category: z
      .enum(HELP_CATEGORIES as unknown as [string, ...string[]])
      .optional(),
    description: z.string().max(500).nullable().optional().or(z.literal('')),
    date: dateSchema.nullable().optional().or(z.literal('')),
    time: timeSchema.nullable().optional().or(z.literal('')),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'Keine Felder zum Aktualisieren',
  })

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; slotId: string }> },
) {
  const { id: requestId, slotId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!requestId || !slotId) {
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

  // Verify ownership of parent request
  const { data: parent } = await supabase
    .from('help_requests')
    .select('id')
    .eq('id', requestId)
    .eq('user_id', user.id)
    .limit(1)
    .single()
  if (!parent) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payload: Record<string, unknown> = {}
  if ('category' in parsed.data) payload.category = parsed.data.category
  if ('description' in parsed.data)
    payload.description =
      typeof parsed.data.description === 'string'
        ? parsed.data.description.trim() || null
        : parsed.data.description ?? null
  if ('date' in parsed.data) payload.date = parsed.data.date || null
  if ('time' in parsed.data) payload.time = parsed.data.time || null

  const { error } = await supabase
    .from('help_slots')
    .update(payload)
    .eq('id', slotId)
    .eq('request_id', requestId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; slotId: string }> },
) {
  const { id: requestId, slotId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!requestId || !slotId) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  // Ownership check via parent
  const { data: parent } = await supabase
    .from('help_requests')
    .select('id')
    .eq('id', requestId)
    .eq('user_id', user.id)
    .limit(1)
    .single()
  if (!parent) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase
    .from('help_slots')
    .delete()
    .eq('id', slotId)
    .eq('request_id', requestId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
