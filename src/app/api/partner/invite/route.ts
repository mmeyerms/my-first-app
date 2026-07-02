import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const MAX_PENDING_INVITES = 5

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  // Do NOT invalidate other pending invites — a mother can want multiple open
  // invitations at once (different WhatsApp groups etc.). Only reject when
  // there are too many active invites to prevent spam.
  //
  // Since Migration 024, `used_at` is only set once the invite reached
  // `max_uses` — so "used_at IS NULL AND not expired" still means "still
  // has capacity", i.e. an active invite.
  const { count: pendingCount } = await supabase
    .from('partner_invites')
    .select('id', { count: 'exact', head: true })
    .eq('mother_id', user.id)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())

  if ((pendingCount ?? 0) >= MAX_PENDING_INVITES) {
    return NextResponse.json(
      {
        error: `Du hast bereits ${MAX_PENDING_INVITES} offene Einladungen. Widerrufe eine davon, bevor du eine neue erstellst.`,
      },
      { status: 429 },
    )
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

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
    .select('token, expires_at, max_uses, uses_count')
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

  const inviteRow = invite as
    | { token: string; expires_at: string; max_uses: number; uses_count: number }
    | null

  return NextResponse.json({
    hasPartner: partners.length > 0,
    partners,
    pendingToken: inviteRow?.token ?? null,
    pendingExpiry: inviteRow?.expires_at ?? null,
    // Remaining slots on the currently-active invite. UI shows this so
    // the mother knows how many more people can still redeem the same link.
    pendingUsesRemaining: inviteRow ? Math.max(0, inviteRow.max_uses - inviteRow.uses_count) : null,
    pendingMaxUses: inviteRow?.max_uses ?? null,
  })
}

// displayName: Buchstaben, Ziffern, Leerzeichen, Bindestrich, Punkt, Apostroph.
// Unicode-Letters (inkl. Umlaute), aber KEINE Zero-Width, keine Emoji.
// Blockt Homograph-Attacken (Cyrillic look-alikes) und Whitespace-only Namen.
const displayNameSchema = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, 'Name darf nicht leer sein')
      .max(50)
      .regex(/^[\p{L}\p{N} .\-'’]+$/u, 'Nur Buchstaben, Ziffern, Leerzeichen, „.", „-" und „’" erlaubt'),
  )

// Two accept schemas: the modern client passes the token in the body (so it
// never appears in the URL path, which would leak via Referer to any embedded
// third-party resource before we can scrub the location bar). We ALSO accept
// requests without a body-token for backwards compat with any old-style
// clients that still POST to the [token] URL — for them the caller can pass
// the token as a `?token=...` search param.
const acceptSchema = z.object({
  token: z.string().uuid(),
  role: z.enum(['papa', 'mama', 'oma', 'opa', 'bestie', 'andere']),
  displayName: displayNameSchema,
})

const acceptBodyWithoutTokenSchema = z.object({
  role: z.enum(['papa', 'mama', 'oma', 'opa', 'bestie', 'andere']),
  displayName: displayNameSchema,
})

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  // Preferred: token in body. Fallback: token in URL search param (legacy).
  // We deliberately do NOT accept it via URL path anymore — the referrer
  // leak is exactly what we are hardening against.
  const bodyIsObject = body !== null && typeof body === 'object'
  const bodyRecord = bodyIsObject ? (body as Record<string, unknown>) : {}
  const bodyHasToken = typeof bodyRecord.token === 'string'

  let parsed: { token: string; role: 'papa' | 'mama' | 'oma' | 'opa' | 'bestie' | 'andere'; displayName: string }

  if (bodyHasToken) {
    const result = acceptSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    parsed = result.data
  } else {
    const url = new URL(request.url)
    const tokenParam = url.searchParams.get('token')
    if (!tokenParam) {
      return NextResponse.json(
        { error: 'Token fehlt (weder im Body noch als Query-Parameter)' },
        { status: 400 },
      )
    }
    const bodyResult = acceptBodyWithoutTokenSchema.safeParse(body)
    if (!bodyResult.success) {
      return NextResponse.json({ error: bodyResult.error.flatten() }, { status: 400 })
    }
    const tokenResult = z.string().uuid().safeParse(tokenParam)
    if (!tokenResult.success) {
      return NextResponse.json({ error: 'Ungültiger Token' }, { status: 400 })
    }
    parsed = { token: tokenResult.data, ...bodyResult.data }
  }

  const result = { data: parsed }

  // Look up invite for basic checks (expiry, self-link, capacity used up).
  // Differentiate messages so users understand WHY it failed.
  //
  // Multi-use tokens (Migration 024): the same invite link can be used by
  // up to `max_uses` different people (Papa, Oma, Opa, Bestie, ...). The
  // UNIQUE (mother_id, partner_user_id) constraint on partner_links stops
  // the SAME auth user from redeeming twice.
  const { data: invite } = await supabase
    .from('partner_invites')
    .select('id, mother_id, expires_at, used_at, max_uses, uses_count')
    .eq('token', result.data.token)
    .single()

  if (!invite) {
    return NextResponse.json(
      { error: 'Der Einladungslink existiert nicht. Bitte lass dir einen neuen zusenden.' },
      { status: 400 },
    )
  }
  if (new Date(invite.expires_at as string) < new Date()) {
    return NextResponse.json(
      { error: 'Der Einladungslink ist abgelaufen (7 Tage). Bitte lass dir einen neuen zusenden.' },
      { status: 400 },
    )
  }
  const inviteRow = invite as { id: string; mother_id: string; expires_at: string; used_at: string | null; max_uses: number; uses_count: number }
  if (inviteRow.uses_count >= inviteRow.max_uses) {
    return NextResponse.json(
      {
        error:
          'Dieser Einladungslink hat sein Limit erreicht (5 Personen können teilnehmen). Die Mama kann in ihren Einstellungen einen neuen Link erstellen.',
      },
      { status: 400 },
    )
  }
  const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!isMock && inviteRow.mother_id === user.id) {
    return NextResponse.json(
      {
        error:
          'Du kannst nicht dein eigener Partner sein. Melde dich in einem privaten Tab mit einer anderen E-Mail-Adresse an, um den Link als Partner zu öffnen.',
      },
      { status: 400 },
    )
  }

  // Idempotency: if this exact user already redeemed, skip the counter bump
  // and just re-upsert the partner_link with the new role/name. This handles
  // "user hits Accept twice quickly" without wasting a slot.
  const { data: existingLink } = await supabase
    .from('partner_links')
    .select('mother_id')
    .eq('mother_id', inviteRow.mother_id)
    .eq('partner_user_id', user.id)
    .limit(1)
    .maybeSingle()

  // ATOMIC consume: increment uses_count only if it's still below max_uses.
  // If two concurrent PUTs race, only enough of them succeed to reach the
  // cap. Set used_at when we reach max_uses so the historic UI ("used")
  // still lights up when the link is fully consumed.
  //
  // Skip the counter bump if this user has already redeemed (idempotency).
  const newCount = inviteRow.uses_count + 1
  const shouldClaimSlot = !existingLink
  if (shouldClaimSlot) {
    const { data: claimed } = await supabase
      .from('partner_invites')
      .update({
        uses_count: newCount,
        used_at: newCount >= inviteRow.max_uses ? new Date().toISOString() : inviteRow.used_at,
      })
      .eq('id', inviteRow.id)
      .lt('uses_count', inviteRow.max_uses)
      .eq('uses_count', inviteRow.uses_count) // CAS: only proceed if nobody else bumped
      .select('id')
      .maybeSingle()

    if (!claimed) {
      // A concurrent PUT ate this slot. Ask user to retry — the invite
      // may still have room after their retry (race resolves naturally).
      return NextResponse.json(
        { error: 'Einladung wurde gerade schon eingelöst — bitte einen Moment warten und erneut versuchen.' },
        { status: 409 },
      )
    }
  }

  const { error } = await supabase.from('partner_links').upsert(
    {
      mother_id: invite.mother_id,
      partner_user_id: user.id,
      active: true,
      role: result.data.role,
      display_name: result.data.displayName,
    },
    { onConflict: 'mother_id,partner_user_id' },
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Copy the mother's design preferences (accentColor + fontSize) into the
  // partner's user_preferences row — only if the partner doesn't have one yet.
  // The partner can still change these later. Rationale: continuity of visual
  // identity between Mama's and Partner's app instance.
  try {
    const { data: motherPrefs } = await supabase
      .from('user_preferences')
      .select('settings')
      .eq('user_id', invite.mother_id)
      .limit(1)
      .single()

    const { data: partnerPrefs } = await supabase
      .from('user_preferences')
      .select('settings')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (!partnerPrefs) {
      // Partner has no prefs row yet — seed with mother's visual defaults.
      const source = (motherPrefs?.settings ?? {}) as Record<string, unknown>
      const seedSettings: Record<string, unknown> = {}
      if (typeof source.accentColor === 'string') seedSettings.accentColor = source.accentColor
      if (typeof source.fontSize === 'string') seedSettings.fontSize = source.fontSize
      if (Object.keys(seedSettings).length > 0) {
        await supabase
          .from('user_preferences')
          .upsert(
            { user_id: user.id, settings: seedSettings },
            { onConflict: 'user_id' },
          )
      }
    }
  } catch {
    // Non-fatal — partner just falls back to defaults on missing prefs row.
  }

  return NextResponse.json({ success: true, motherId: invite.mother_id })
}
