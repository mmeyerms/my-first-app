import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'

const KINDS = ['packliste', 'einkaufsliste', 'wochenbett'] as const
type Kind = (typeof KINDS)[number]

function isKind(v: string): v is Kind {
  return (KINDS as readonly string[]).includes(v)
}

const customItemSchema = z.object({
  id: z.string().min(1).max(100),
  categoryId: z.string().min(1).max(100),
  label: z.string().min(1).max(300),
  tip: z.string().max(1000).optional(),
})

const stateSchema = z.object({
  checked: z.array(z.string().max(200)).max(2000),
  custom: z.array(customItemSchema).max(500),
  excluded: z.array(z.string().max(200)).max(2000),
})

const putSchema = z.object({
  state: stateSchema,
})

const DEFAULT_STATE = { checked: [], custom: [], excluded: [] }

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params
  if (!isKind(kind)) {
    return NextResponse.json({ error: 'Unbekannter kind-Parameter' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const active = await getActivePregnancy(supabase, user.id)

  let query = supabase
    .from('checklists')
    .select('state')
    .eq('user_id', user.id)
    .eq('kind', kind)
    .limit(1)

  if (active) query = query.eq('pregnancy_id', active.id)

  const { data, error } = await query.single()

  if (error && (error as { code?: string }).code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const state = (data as { state?: typeof DEFAULT_STATE } | null)?.state ?? DEFAULT_STATE
  return NextResponse.json(state)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params
  if (!isKind(kind)) {
    return NextResponse.json({ error: 'Unbekannter kind-Parameter' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = putSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const active = await getActivePregnancy(supabase, user.id)

  const payload: Record<string, unknown> = {
    user_id: user.id,
    kind,
    state: parsed.data.state,
  }
  if (active) payload.pregnancy_id = active.id

  const { error } = await supabase
    .from('checklists')
    .upsert(payload, { onConflict: 'user_id,pregnancy_id,kind' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
