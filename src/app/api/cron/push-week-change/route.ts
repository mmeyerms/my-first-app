import { NextRequest, NextResponse } from 'next/server'
import { sendPushToUser, isPushConfigured } from '@/lib/push/server'
import { getSswInfo } from '@/lib/sswEntwicklung'
import { getMessages } from '@/lib/i18n/messages'
import { mergePreferences, type UserPreferences } from '@/lib/preferences/types'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

/**
 * Daily cron at 08:00 UTC. Finds every active pregnancy where the mother
 * transitioned into a new SSW yesterday->today, then sends a push if the
 * user has opted into weekChange pushes AND an active subscription.
 *
 * "Transitioned yesterday->today" = SSW today != SSW at (now - 24h).
 * Both are integer values derived from due_date.
 *
 * Auth: same pattern as /api/cron/weekly-summary. Vercel Cron header +
 * optional CRON_SECRET Bearer.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  if (!isPushConfigured()) {
    return NextResponse.json({ ok: true, skipped: 'VAPID not configured' })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json({ ok: true, skipped: 'no service role key' })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, serviceKey)

  // Load all active pregnancies with a due date.
  const { data: pregs } = await supabase
    .from('pregnancies')
    .select('user_id, due_date')
    .eq('is_active', true)
    .not('due_date', 'is', null)
    .limit(5000)

  if (!pregs || pregs.length === 0) {
    return NextResponse.json({ ok: true, processed: 0 })
  }

  // Load prefs and locale (locale lives on profiles, not user_preferences).
  const userIds = pregs.map((p) => (p as { user_id: string }).user_id)
  const [{ data: prefRows }, { data: profileRows }] = await Promise.all([
    supabase.from('user_preferences').select('user_id, settings').in('user_id', userIds).limit(5000),
    supabase.from('profiles').select('user_id, locale').in('user_id', userIds).limit(5000),
  ])

  const prefsByUser = new Map<string, UserPreferences>()
  for (const row of prefRows ?? []) {
    const r = row as { user_id: string; settings: Partial<UserPreferences> | null }
    prefsByUser.set(r.user_id, mergePreferences(r.settings))
  }
  const localeByUser = new Map<string, 'de' | 'en'>()
  for (const row of profileRows ?? []) {
    const r = row as { user_id: string; locale?: string | null }
    localeByUser.set(r.user_id, r.locale === 'en' ? 'en' : 'de')
  }

  const todayMs = Date.now()
  const yesterdayMs = todayMs - 24 * 60 * 60 * 1000
  const msPerWeek = 7 * 24 * 60 * 60 * 1000

  function sswFor(dueDateIso: string, atMs: number): number | null {
    const due = new Date(dueDateIso).getTime()
    if (!Number.isFinite(due)) return null
    const weeksUntilDue = (due - atMs) / msPerWeek
    const ssw = Math.round(40 - weeksUntilDue)
    if (ssw < 1) return 1
    if (ssw > 42) return 42
    return ssw
  }

  let sent = 0
  let skipped = 0

  for (const preg of pregs) {
    const p = preg as { user_id: string; due_date: string }
    const sswToday = sswFor(p.due_date, todayMs)
    const sswYesterday = sswFor(p.due_date, yesterdayMs)
    if (sswToday === null || sswYesterday === null) { skipped++; continue }
    if (sswToday === sswYesterday) { skipped++; continue }

    const prefs = prefsByUser.get(p.user_id) ?? mergePreferences(null)
    if (!prefs.notifications.push.weekChange) { skipped++; continue }

    const locale = localeByUser.get(p.user_id) ?? 'de'
    const t = getMessages(locale)
    const push = t.settings.notifications.push
    const sswInfo = getSswInfo(sswToday)
    // Pick the first comparison as the body descriptor. Falls back gracefully.
    const comparison =
      sswInfo?.comparisons[0]?.label[locale] ??
      (locale === 'de' ? 'eine kleine Frucht' : 'a small fruit')

    const result = await sendPushToUser(supabase, p.user_id, {
      title: push.cronWeekChangeTitle.replace('{ssw}', String(sswToday)),
      body: push.cronWeekChangeBody.replace('{comparison}', comparison),
      url: '/woche',
      tag: `week-${sswToday}`,
    })
    sent += result.sent
  }

  return NextResponse.json({ ok: true, processed: pregs.length, sent, skipped })
}
