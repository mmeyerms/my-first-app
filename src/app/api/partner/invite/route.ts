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

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  await supabase.from('partner_links').update({ active: false }).eq('mother_id', user.id)
  await supabase
    .from('partner_invites')
    .update({ used_at: new Date().toISOString() })
    .eq('mother_id', user.id)
    .is('used_at', null)

  return NextResponse.json({ success: true })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: link } = await supabase
    .from('partner_links')
    .select('partner_user_id, active')
    .eq('mother_id', user.id)
    .eq('active', true)
    .single()

  const { data: invite } = await supabase
    .from('partner_invites')
    .select('token, expires_at')
    .eq('mother_id', user.id)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({
    hasPartner: !!link,
    pendingToken: invite?.token ?? null,
    pendingExpiry: invite?.expires_at ?? null,
  })
}

const acceptSchema = z.object({ token: z.string().uuid() })

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const result = acceptSchema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: 'Token fehlt' }, { status: 400 })

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
  const { error } = await supabase.from('partner_links').upsert({
    mother_id: invite.mother_id,
    partner_user_id: user.id,
    active: true,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
