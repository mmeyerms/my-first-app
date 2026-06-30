import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { HELP_CATEGORIES, type HelpSlot } from '@/lib/wochenbett-chef/types'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum')
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Ungültige Zeit')

const postSchema = z.object({
  category: z.enum(HELP_CATEGORIES as unknown as [string, ...string[]]),
  description: z.string().max(500).optional().or(z.literal('')),
  date: dateSchema.optional().or(z.literal('')),
  time: timeSchema.optional().or(z.literal('')),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: requestId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!requestId || typeof requestId !== 'string') {
    return NextResponse.json({ error: 'Missing request id' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Verify ownership of parent request before insert (RLS would also catch
  // this, but explicit check returns a clearer 403).
  const { data: parent } = await supabase
    .from('help_requests')
    .select('id, user_id')
    .eq('id', requestId)
    .eq('user_id', user.id)
    .limit(1)
    .single()
  if (!parent) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const row = {
    request_id: requestId,
    category: parsed.data.category,
    description: parsed.data.description?.trim() || null,
    date: parsed.data.date || null,
    time: parsed.data.time || null,
    helper_name: null,
    helper_message: null,
  }

  const { data, error } = await supabase
    .from('help_slots')
    .insert(row)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data as HelpSlot, { status: 201 })
}
