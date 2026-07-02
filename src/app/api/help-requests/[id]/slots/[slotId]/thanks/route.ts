import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * POST /api/help-requests/[id]/slots/[slotId]/thanks
 *
 * Records that the mother has sent a thank-you message for this claimed
 * slot. Idempotent: if thanks_sent_at is already set we return ok anyway.
 * The actual message delivery happens client-side via Web Share API — this
 * endpoint only stamps the timestamp so the coordinator dashboard can hide
 * the "Danke sagen" button.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; slotId: string }> },
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: requestId, slotId } = await params

  // Verify ownership via help_requests join. RLS on help_slots gates this
  // through the parent request's user_id.
  const { data: parent } = await supabase
    .from('help_requests')
    .select('id')
    .eq('id', requestId)
    .eq('user_id', user.id)
    .limit(1)
    .single()
  if (!parent) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await supabase
    .from('help_slots')
    .update({ thanks_sent_at: new Date().toISOString() })
    .eq('id', slotId)
    .eq('request_id', requestId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
