import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const kindSchema = z.enum(['kicks', 'symptom'])
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const kicksPayload = z.object({
  count: z.number().int().min(0).max(200),
  durationMin: z.number().min(0).max(600).nullable().optional(),
  startedAt: z.string().max(30).nullable().optional(),
})

const symptomPayload = z.object({
  weight: z.number().min(30).max(250).nullable().optional(),
  mood: z.number().int().min(1).max(5).nullable().optional(),
  symptoms: z.array(z.string().max(40)).max(20).optional(),
  note: z.string().max(500).nullable().optional(),
})

const postSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('kicks'), date: dateSchema, payload: kicksPayload }),
  z.object({ kind: z.literal('symptom'), date: dateSchema, payload: symptomPayload }),
])

/**
 * GET /api/tracking?kind=kicks|symptom&from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns the caller's entries, newest first, max 120 rows.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const kindResult = kindSchema.safeParse(searchParams.get('kind'))
  if (!kindResult.success) {
    return NextResponse.json({ error: 'kind erforderlich (kicks|symptom)' }, { status: 400 })
  }

  let q = supabase
    .from('tracking_entries')
    .select('id, date, kind, payload')
    .eq('user_id', user.id)
    .eq('kind', kindResult.data)
    .order('date', { ascending: false })
    .limit(120)

  const from = searchParams.get('from')
  const to = searchParams.get('to')
  if (from && dateSchema.safeParse(from).success) q = q.gte('date', from)
  if (to && dateSchema.safeParse(to).success) q = q.lte('date', to)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

/**
 * POST /api/tracking — upsert one entry (user+date+kind unique).
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Anfrage', details: parsed.error.flatten() }, { status: 400 })
  }

  // Attach active pregnancy when present (optional analytics dimension).
  const { data: preg } = await supabase
    .from('pregnancies')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  const { data, error } = await supabase
    .from('tracking_entries')
    .upsert(
      {
        user_id: user.id,
        pregnancy_id: (preg as { id: string } | null)?.id ?? null,
        date: parsed.data.date,
        kind: parsed.data.kind,
        payload: parsed.data.payload,
      },
      { onConflict: 'user_id,date,kind' },
    )
    .select('id, date, kind, payload')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
