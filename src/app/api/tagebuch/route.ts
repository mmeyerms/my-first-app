import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { getActivePregnancy } from '@/lib/pregnancy/server'

const schema = z.object({
  ssw: z.number().int().min(1).max(45),
  rating: z.number().int().min(1).max(5).optional(),
  word: z.string().max(100).optional(),
  surprise: z.string().max(500).optional(),
  photo_url: z.string().url().max(2048).nullable().optional(),
})

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const active = await getActivePregnancy(supabase, user.id)

  // Scope strictly to active pregnancy. No active pregnancy → empty list.
  if (!active) return NextResponse.json([])

  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('pregnancy_id', active.id)
    .order('ssw', { ascending: true })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function PUT(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const active = await getActivePregnancy(supabase, user.id)
  if (!active) {
    return NextResponse.json(
      { error: 'Keine aktive Schwangerschaft — bitte im Profil eine anlegen.' },
      { status: 400 },
    )
  }

  const { ssw, ...rest } = parsed.data
  const payload: Record<string, unknown> = {
    user_id: user.id,
    pregnancy_id: active.id,
    ssw,
    ...rest,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('diary_entries')
    .upsert(payload, { onConflict: 'user_id,pregnancy_id,ssw' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
