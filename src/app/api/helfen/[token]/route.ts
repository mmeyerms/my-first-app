import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  HelpRequest,
  HelpRequestWithSlots,
  HelpSlot,
} from '@/lib/wochenbett-chef/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  if (!token || typeof token !== 'string' || token.length < 16) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  const supabase = await createClient()

  // Public read — RLS allows SELECT on help_requests for everyone.
  const { data: req, error: reqErr } = await supabase
    .from('help_requests')
    .select('*')
    .eq('share_token', token)
    .limit(1)
    .single()

  if (reqErr || !req) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const r = req as HelpRequest

  const { data: slots, error: slotsErr } = await supabase
    .from('help_slots')
    .select('*')
    .eq('request_id', r.id)
    .order('created_at', { ascending: true })
    .limit(200)

  if (slotsErr) {
    return NextResponse.json({ error: slotsErr.message }, { status: 500 })
  }

  // Don't leak user_id externally
  const safe: Omit<HelpRequestWithSlots, 'user_id'> = {
    id: r.id,
    pregnancy_id: r.pregnancy_id,
    share_token: r.share_token,
    title: r.title,
    intro: r.intro,
    created_at: r.created_at,
    updated_at: r.updated_at,
    slots: (slots ?? []) as HelpSlot[],
  }

  return NextResponse.json(safe)
}
