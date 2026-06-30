import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { HelpSlot } from '@/lib/wochenbett-chef/types'

const claimSchema = z.object({
  slotId: z.string().uuid({ message: 'Ungültige Slot-ID' }),
  helperName: z.string().min(1).max(80),
  helperMessage: z.string().max(500).optional().or(z.literal('')),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  if (!token || typeof token !== 'string' || token.length < 16) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = claimSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()

  // 1) Resolve token → request id
  const { data: req } = await supabase
    .from('help_requests')
    .select('id')
    .eq('share_token', token)
    .limit(1)
    .single()
  if (!req) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const requestId = (req as { id: string }).id

  // 2) Verify the slot belongs to this request AND is still unclaimed
  const { data: slot } = await supabase
    .from('help_slots')
    .select('*')
    .eq('id', parsed.data.slotId)
    .eq('request_id', requestId)
    .limit(1)
    .single()

  if (!slot) return NextResponse.json({ error: 'Slot not found' }, { status: 404 })
  const s = slot as HelpSlot
  if (s.helper_name && s.helper_name.trim() !== '') {
    return NextResponse.json({ error: 'AlreadyClaimed' }, { status: 409 })
  }

  // 3) Claim it. RLS policy public_claims_slot only allows the update if
  //    helper_name is still empty — this prevents races.
  const helperName = parsed.data.helperName.trim()
  const helperMessage = parsed.data.helperMessage?.trim() || null

  const { error } = await supabase
    .from('help_slots')
    .update({
      helper_name: helperName,
      helper_message: helperMessage,
    })
    .eq('id', parsed.data.slotId)
    .eq('request_id', requestId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
