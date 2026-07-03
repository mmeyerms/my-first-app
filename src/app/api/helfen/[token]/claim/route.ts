import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sendPushToUser, isPushConfigured } from '@/lib/push/server'
import { mergePreferences, type UserPreferences } from '@/lib/preferences/types'
import { getMessages } from '@/lib/i18n/messages'
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
  // Rate-Limit: 5 Claim-Versuche pro Minute pro IP.
  // Öffentliche Route (keine Auth) → IP als Key.
  const ip = getClientIp(request)
  const rate = rateLimit(`helfen-claim:${ip}`, { window: 60_000, max: 5 })
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: 'Zu viele Anfragen — bitte kurz warten.',
        retryAfter: rate.retryAfter,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfter ?? 60) },
      },
    )
  }

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

  // 1) Resolve token → request id + owner user_id (owner = the mother who
  //    needs to be notified when someone claims a slot).
  const { data: req } = await supabase
    .from('help_requests')
    .select('id, user_id')
    .eq('share_token', token)
    .limit(1)
    .single()
  if (!req) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const requestRow = req as { id: string; user_id: string }
  const requestId = requestRow.id

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

  // Notify the mother (owner) — non-blocking, best-effort. We swallow any
  // push error so a broken push endpoint never breaks the claim itself.
  // Requires the service-role client to bypass RLS on push_subscriptions
  // and user_preferences (helper is anonymous, no auth.uid()).
  try {
    if (isPushConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient: createSbClient } = await import('@supabase/supabase-js')
      const admin = createSbClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      )
      // Check owner's push opt-in for help-slot-claim events.
      const { data: prefRow } = await admin
        .from('user_preferences')
        .select('settings')
        .eq('user_id', requestRow.user_id)
        .limit(1)
        .maybeSingle()
      const prefs: UserPreferences = mergePreferences(
        (prefRow as { settings: Partial<UserPreferences> | null } | null)?.settings ?? null,
      )
      if (prefs.notifications.push.helpSlotClaimed) {
        // Locale for the push copy — read profile.locale.
        const { data: profileRow } = await admin
          .from('profiles')
          .select('locale')
          .eq('user_id', requestRow.user_id)
          .limit(1)
          .maybeSingle()
        const locale =
          (profileRow as { locale?: string | null } | null)?.locale === 'en' ? 'en' : 'de'
        const t = getMessages(locale)
        const push = t.settings.notifications.push
        await sendPushToUser(admin, requestRow.user_id, {
          title: push.cronHelpClaimTitle.replace('{name}', helperName),
          body: push.cronHelpClaimBody
            .replace('{name}', helperName)
            .replace('{slot}', s.description?.slice(0, 40) || t.helfen.categoryShort[s.category] || 'Slot'),
          url: '/wochenbett-chef',
          tag: `slot-${s.id}`,
        })
      }
    }
  } catch (pushErr) {
    console.warn('[helfen-claim] push failed (non-fatal):', pushErr)
  }

  return NextResponse.json({ ok: true })
}
