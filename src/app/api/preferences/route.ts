import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_PREFERENCES, mergePreferences, type UserPreferences } from '@/lib/preferences/types'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data } = await supabase
    .from('user_preferences')
    .select('settings')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!data?.settings) return NextResponse.json(DEFAULT_PREFERENCES)
  return NextResponse.json(mergePreferences(data.settings as Partial<UserPreferences>))
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Erwarte Objekt' }, { status: 400 })
  }

  // Merge into current settings so partial PATCH-like PUTs work
  const { data: current } = await supabase
    .from('user_preferences')
    .select('settings')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  const merged = mergePreferences({
    ...(current?.settings ?? {}),
    ...(body as Partial<UserPreferences>),
  } as Partial<UserPreferences>)

  const { error } = await supabase
    .from('user_preferences')
    .upsert(
      { user_id: user.id, settings: merged as unknown as Record<string, unknown> },
      { onConflict: 'user_id' },
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(merged)
}
