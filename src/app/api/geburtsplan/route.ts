import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'

const schema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
})

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const active = await getActivePregnancy(supabase, user.id)

  // When an active pregnancy exists, prefer the pregnancy-scoped row.
  // If nothing matches (e.g. legacy birth_plan rows pre-migration), fall back
  // to the user-scoped row so existing data keeps loading.
  if (active) {
    const { data: scoped, error: scopedErr } = await supabase
      .from('birth_plans')
      .select('answers, updated_at')
      .eq('user_id', user.id)
      .eq('pregnancy_id', active.id)
      .limit(1)
      .single()

    if (scoped) return NextResponse.json(scoped)
    if (scopedErr && scopedErr.code !== 'PGRST116') {
      return NextResponse.json({ error: scopedErr.message }, { status: 500 })
    }
    // fall through to legacy lookup
  }

  const { data, error } = await supabase
    .from('birth_plans')
    .select('answers, updated_at')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (error?.code === 'PGRST116') return NextResponse.json({ answers: {} })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
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

  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const active = await getActivePregnancy(supabase, user.id)

  const payload: Record<string, unknown> = {
    user_id: user.id,
    answers: result.data.answers,
  }
  if (active) payload.pregnancy_id = active.id

  const { error } = await supabase.from('birth_plans').upsert(payload)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
