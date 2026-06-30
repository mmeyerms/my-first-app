import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import type {
  HelpRequest,
  HelpRequestWithSlots,
  HelpSlot,
} from '@/lib/wochenbett-chef/types'

const postSchema = z.object({
  title: z.string().min(1).max(200).optional().or(z.literal('')),
  intro: z.string().max(2000).optional().or(z.literal('')),
})

function randomToken(len = 32): string {
  // URL-safe base62-ish: 32 hex chars are plenty unguessable.
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = ''
  for (let i = 0; i < len; i++) {
    out += chars[bytes[i] % chars.length]
  }
  return out
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: requests, error: reqErr } = await supabase
    .from('help_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (reqErr) return NextResponse.json({ error: reqErr.message }, { status: 500 })

  const reqList = (requests ?? []) as HelpRequest[]
  if (reqList.length === 0) return NextResponse.json([])

  const ids = reqList.map((r) => r.id)

  // Bulk-fetch slots for all requests in one query (no N+1)
  const { data: slotsData, error: slotsErr } = await supabase
    .from('help_slots')
    .select('*')
    .in('request_id', ids)
    .order('created_at', { ascending: true })
    .limit(500)

  if (slotsErr) return NextResponse.json({ error: slotsErr.message }, { status: 500 })

  const slotsByReq = new Map<string, HelpSlot[]>()
  for (const s of (slotsData ?? []) as HelpSlot[]) {
    const arr = slotsByReq.get(s.request_id) ?? []
    arr.push(s)
    slotsByReq.set(s.request_id, arr)
  }

  const out: HelpRequestWithSlots[] = reqList.map((r) => ({
    ...r,
    slots: slotsByReq.get(r.id) ?? [],
  }))

  return NextResponse.json(out)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown = {}
  try {
    body = await request.json()
  } catch {
    // empty body is fine — create with defaults
  }

  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const active = await getActivePregnancy(supabase, user.id)
  const title = parsed.data.title?.trim() || null
  const intro = parsed.data.intro?.trim() || null

  // Generate token & retry on extremely unlikely collision (1 in 62^32)
  let attempt = 0
  let inserted: HelpRequest | null = null
  let lastErr: { message?: string } | null = null
  while (attempt < 3 && !inserted) {
    const share_token = randomToken(32)
    const { data, error } = await supabase
      .from('help_requests')
      .insert({
        user_id: user.id,
        pregnancy_id: active?.id ?? null,
        share_token,
        title,
        intro,
      })
      .select()
      .single()
    if (!error && data) {
      inserted = data as HelpRequest
      break
    }
    lastErr = error
    attempt++
  }

  if (!inserted) {
    return NextResponse.json(
      { error: lastErr?.message ?? 'Konnte Hilfe-Liste nicht anlegen' },
      { status: 500 },
    )
  }

  const withSlots: HelpRequestWithSlots = { ...inserted, slots: [] }
  return NextResponse.json(withSlots, { status: 201 })
}
