import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'

const DEFAULTS = {
  koerper: [] as string[],
  team: {} as Record<string, string>,
  aengste: { fav: [] as string[], read: [] as string[] },
  vorfreude: {
    first30: [] as unknown[],
    bucket: [] as unknown[],
  },
  manifest: {
    agreed: [] as string[],
    custom: [] as unknown[],
  },
  arzt: {
    asked: [] as string[],
    custom: [] as unknown[],
  },
}

type StateRow = {
  koerper: unknown
  team: unknown
  aengste: unknown
  vorfreude: unknown
  manifest: unknown
  arzt: unknown
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const active = await getActivePregnancy(supabase, user.id)
  if (!active) return NextResponse.json(DEFAULTS)

  const { data, error } = await supabase
    .from('kinderwunsch_state')
    .select('koerper, team, aengste, vorfreude, manifest, arzt')
    .eq('user_id', user.id)
    .eq('pregnancy_id', active.id)
    .limit(1)
    .single()

  if (error && (error as { code?: string }).code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) return NextResponse.json(DEFAULTS)

  const row = data as StateRow
  return NextResponse.json({
    koerper: row.koerper ?? DEFAULTS.koerper,
    team: row.team ?? DEFAULTS.team,
    aengste: row.aengste ?? DEFAULTS.aengste,
    vorfreude: row.vorfreude ?? DEFAULTS.vorfreude,
    manifest: row.manifest ?? DEFAULTS.manifest,
    arzt: row.arzt ?? DEFAULTS.arzt,
  })
}
