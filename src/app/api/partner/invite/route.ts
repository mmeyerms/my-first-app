import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  // Invalidate existing pending invites for this mother
  await supabase
    .from('partner_invites')
    .update({ used_at: new Date().toISOString() })
    .eq('mother_id', user.id)
    .is('used_at', null)

  const { error } = await supabase.from('partner_invites').insert({
    mother_id: user.id,
    token,
    expires_at: expiresAt,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ token, expiresAt })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  // Optional query param ?partnerId=... to deactivate a specific link.
  // Without it, deactivate ALL of the mother's links (legacy behaviour).
  const url = new URL(request.url)
  const partnerId = url.searchParams.get('partnerId')

  let q = supabase.from('partner_links').update({ active: false }).eq('mother_id', user.id)
  if (partnerId) q = q.eq('partner_user_id', partnerId)
  await q

  if (!partnerId) {
    await supabase
      .from('partner_invites')
      .update({ used_at: new Date().toISOString() })
      .eq('mother_id', user.id)
      .is('used_at', null)
  }

  return NextResponse.json({ success: true })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  // ALL active links + all pending invites
  const { data: links } = await supabase
    .from('partner_links')
    .select('partner_user_id, role, display_name, active, created_at')
    .eq('mother_id', user.id)
    .eq('active', true)
    .order('created_at', { ascending: false })

  const { data: invite } = await supabase
    .from('partner_invites')
    .select('token, expires_at')
    .eq('mother_id', user.id)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const partners = (links ?? []).map((l) => ({
    partnerUserId: (l as { partner_user_id: string }).partner_user_id,
    role: (l as { role: string | null }).role,
    displayName: (l as { display_name: string | null }).display_name,
    createdAt: (l as { created_at: string }).created_at,
  }))

  return NextResponse.json({
    hasPartner: partners.length > 0,
    partners,
    pendingToken: invite?.token ?? null,
    pendingExpiry: invite?.expires_at ?? null,
  })
}

const acceptSchema = z.object({
  token: z.string().uuid(),
  role: z.enum(['papa', 'mama', 'oma', 'opa', 'bestie', 'andere']),
  displayName: z.string().min(1).max(50),
})

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const result = acceptSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const { data: invite } = await supabase
    .from('partner_invites')
    .select('id, mother_id, expires_at, used_at')
    .eq('token', result.data.token)
    .single()

  if (!invite || invite.used_at || new Date(invite.expires_at as string) < new Date()) {
    return NextResponse.json({ error: 'Ungültiger oder abgelaufener Einladungslink' }, { status: 400 })
  }
  // Allow self-linking only in mock/dev mode (no Supabase configured)
  const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!isMock && invite.mother_id === user.id) {
    return NextResponse.json({ error: 'Du kannst nicht dein eigener Partner sein' }, { status: 400 })
  }

  await supabase.from('partner_invites').update({ used_at: new Date().toISOString() }).eq('id', invite.id)
  const { error } = await supabase.from('partner_links').upsert(
    {
      mother_id: invite.mother_id,
      partner_user_id: user.id,
      active: true,
      role: result.data.role,
      display_name: result.data.displayName.trim(),
    },
    { onConflict: 'mother_id,partner_user_id' },
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, motherId: invite.mother_id })
}
