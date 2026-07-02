import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/profile/export — GDPR Art. 20 (Right to Data Portability)
 *
 * Returns a single JSON download containing every row the caller owns
 * across every user-scoped table. Server-side auth is required; RLS on
 * each table also restricts the result to the caller's own rows as a
 * second line of defence.
 *
 * Shape:
 *   {
 *     generated_at: ISO-8601 string,
 *     user_id: uuid,
 *     data: { profile, pregnancies, birth_plans, diary_entries, termine,
 *             checklists, kinderwunsch_state, user_preferences,
 *             termin_categories, partner_todos, partner_links }
 *   }
 *
 * Response headers set `Content-Disposition: attachment` so a browser
 * `fetch → blob → <a download>` chain saves the file directly.
 */
export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const uid = user.id

  // Fetch everything in parallel — each table is independently RLS-scoped.
  const [
    profileRes,
    pregnanciesRes,
    birthPlansRes,
    diaryRes,
    termineRes,
    checklistsRes,
    kwRes,
    prefsRes,
    catsRes,
    todosRes,
    linksRes,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', uid).limit(1),
    supabase.from('pregnancies').select('*').eq('user_id', uid).limit(100),
    supabase.from('birth_plans').select('*').eq('user_id', uid).limit(100),
    supabase.from('diary_entries').select('*').eq('user_id', uid).limit(5000),
    supabase.from('termine').select('*').eq('user_id', uid).limit(5000),
    supabase.from('checklists').select('*').eq('user_id', uid).limit(1000),
    supabase.from('kinderwunsch_state').select('*').eq('user_id', uid).limit(100),
    supabase.from('user_preferences').select('*').eq('user_id', uid).limit(1),
    supabase.from('termin_categories').select('*').eq('user_id', uid).limit(100),
    supabase.from('partner_todos').select('*').eq('user_id', uid).limit(1000),
    supabase.from('partner_links').select('*').eq('mother_id', uid).limit(100),
  ])

  const payload = {
    generated_at: new Date().toISOString(),
    user_id: uid,
    data: {
      profile: profileRes.data?.[0] ?? null,
      pregnancies: pregnanciesRes.data ?? [],
      birth_plans: birthPlansRes.data ?? [],
      diary_entries: diaryRes.data ?? [],
      termine: termineRes.data ?? [],
      checklists: checklistsRes.data ?? [],
      kinderwunsch_state: kwRes.data ?? [],
      user_preferences: prefsRes.data ?? [],
      termin_categories: catsRes.data ?? [],
      partner_todos: todosRes.data ?? [],
      partner_links: linksRes.data ?? [],
    },
  }

  const isoDate = new Date().toISOString().slice(0, 10)
  const filename = `mamamap-export-${isoDate}.json`

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="${filename}"`,
      'cache-control': 'no-store',
    },
  })
}
