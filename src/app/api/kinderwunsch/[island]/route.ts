import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { apiError } from '@/lib/apiError'

const ISLANDS = ['koerper', 'team', 'aengste', 'vorfreude', 'manifest', 'arzt'] as const
type Island = (typeof ISLANDS)[number]

function isIsland(v: string): v is Island {
  return (ISLANDS as readonly string[]).includes(v)
}

// Per-island schemas. Inputs are intentionally permissive at the leaf level
// (the islands evolve independently), but enforce the top-level shape.
const islandSchemas: Record<Island, z.ZodTypeAny> = {
  koerper: z.array(z.string().max(200)).max(500),
  team: z.record(z.string().max(200), z.string().max(2000)),
  aengste: z.object({
    fav: z.array(z.string().max(200)).max(500),
    read: z.array(z.string().max(200)).max(500),
  }),
  vorfreude: z.object({
    letter: z
      .object({
        content: z.string().max(20000),
        writtenAt: z.string().max(64),
        sealed: z.boolean(),
      })
      .optional(),
    first30: z.array(z.unknown()).max(500),
    bucket: z.array(z.unknown()).max(500),
  }),
  manifest: z.object({
    agreed: z.array(z.string().max(200)).max(500),
    custom: z.array(z.unknown()).max(500),
    signedAt: z.string().max(64).optional(),
    mama: z.string().max(2000).optional(),
    partner: z.string().max(2000).optional(),
  }),
  arzt: z.object({
    asked: z.array(z.string().max(200)).max(500),
    custom: z.array(z.unknown()).max(500),
  }),
}

const DEFAULT_ROW = {
  koerper: [] as string[],
  team: {} as Record<string, string>,
  aengste: { fav: [] as string[], read: [] as string[] },
  vorfreude: { first30: [] as unknown[], bucket: [] as unknown[] },
  manifest: { agreed: [] as string[], custom: [] as unknown[] },
  arzt: { asked: [] as string[], custom: [] as unknown[] },
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ island: string }> },
) {
  const { island } = await params
  if (!isIsland(island)) {
    return NextResponse.json({ error: 'Unbekannte Insel' }, { status: 400 })
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

  const wrapper = z.object({ state: islandSchemas[island] })
  const parsed = wrapper.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const active = await getActivePregnancy(supabase, user.id)
  if (!active) {
    return NextResponse.json(
      { error: 'Keine aktive Schwangerschaft — bitte im Profil eine anlegen.' },
      { status: 400 },
    )
  }
  const pregnancyId = active.id

  // Look up existing row scoped to user + active pregnancy.
  const { data: existing, error: lookupError } = await supabase
    .from('kinderwunsch_state')
    .select('id')
    .eq('user_id', user.id)
    .eq('pregnancy_id', pregnancyId)
    .limit(1)
    .single()

  if (lookupError && (lookupError as { code?: string }).code !== 'PGRST116') {
    return apiError(lookupError, `kinderwunsch/${island}/lookup`)
  }

  if (existing) {
    const { error } = await supabase
      .from('kinderwunsch_state')
      .update({ [island]: parsed.data.state })
      .eq('id', (existing as { id: string }).id)
      .eq('user_id', user.id)
    if (error) return apiError(error, `kinderwunsch/${island}/update`)
    return NextResponse.json({ ok: true })
  }

  // No row yet — insert with defaults plus this island's new state.
  const insertRow: Record<string, unknown> = {
    user_id: user.id,
    pregnancy_id: pregnancyId,
    ...DEFAULT_ROW,
    [island]: parsed.data.state,
  }

  const { error } = await supabase.from('kinderwunsch_state').insert(insertRow)
  if (error) return apiError(error, `kinderwunsch/${island}/insert`)
  return NextResponse.json({ ok: true })
}
