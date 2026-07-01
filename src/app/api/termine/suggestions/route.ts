import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Returns distinct locations + doctors from the user's termine (across ALL
 * pregnancies) — used for autosuggest when adding a new appointment. Values
 * are trimmed, de-duped case-sensitively, capped at 30 per field.
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data } = await supabase
    .from('termine')
    .select('location, doctor')
    .eq('user_id', user.id)
    .limit(500)

  const locationSet = new Set<string>()
  const doctorSet = new Set<string>()
  for (const row of data ?? []) {
    const loc = (row as { location?: string | null }).location?.trim()
    if (loc) locationSet.add(loc)
    const doc = (row as { doctor?: string | null }).doctor?.trim()
    if (doc) doctorSet.add(doc)
  }

  return NextResponse.json({
    locations: Array.from(locationSet).sort().slice(0, 30),
    doctors: Array.from(doctorSet).sort().slice(0, 30),
  })
}
