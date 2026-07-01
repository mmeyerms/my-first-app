import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  fromPregnancyId: z.string().uuid(),
  toPregnancyId: z.string().uuid(),
  transfer: z.object({
    geburtsplanAnswers: z.boolean().optional(),
    packliste: z.boolean().optional(),
    einkaufsliste: z.boolean().optional(),
    wochenbett: z.boolean().optional(),
    kinderwunschManifest: z.boolean().optional(),
    kinderwunschArzt: z.boolean().optional(),
  }),
})

interface ChecklistState {
  checked?: unknown[]
  custom?: Array<{ id: string; label: string; category?: string }>
  excluded?: string[]
}

/**
 * Copies user-selected data from a previous pregnancy into a new one. Only
 * touches the target pregnancy — the source stays untouched.
 *
 * Rules:
 * - Geburtsplan: full answers deep-copied, target pregnancy becomes new owner.
 * - Checklists (pack/einkauf/wochenbett): custom items + excluded items are
 *   carried over. Checked-state is reset to empty (start fresh).
 * - Kinderwunsch (manifest + arzt): full state copied — reflection state
 *   carries meaning across pregnancies.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  const userId: string = user.id

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 }) }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { fromPregnancyId, toPregnancyId, transfer } = parsed.data

  // Verify both pregnancies belong to caller
  const { data: verify } = await supabase
    .from('pregnancies')
    .select('id')
    .eq('user_id', userId)
    .in('id', [fromPregnancyId, toPregnancyId])
  if (!verify || verify.length !== 2) {
    return NextResponse.json({ error: 'Schwangerschaften nicht gefunden' }, { status: 403 })
  }

  const summary: Record<string, boolean> = {}

  // --- Geburtsplan answers -------------------------------------------------
  if (transfer.geburtsplanAnswers) {
    const { data: sourcePlan } = await supabase
      .from('birth_plans')
      .select('answers')
      .eq('user_id', userId)
      .eq('pregnancy_id', fromPregnancyId)
      .limit(1)
      .single()

    if (sourcePlan?.answers) {
      await supabase.from('birth_plans').upsert(
        {
          user_id: userId,
          pregnancy_id: toPregnancyId,
          answers: sourcePlan.answers,
        },
        { onConflict: 'user_id,pregnancy_id' },
      )
      summary.geburtsplanAnswers = true
    }
  }

  // --- Checklists (pack, einkauf, wochenbett) — carry custom+excluded only -
  async function carryChecklist(kind: 'packliste' | 'einkaufsliste' | 'wochenbett') {
    const { data: source } = await supabase
      .from('checklists')
      .select('state')
      .eq('user_id', userId)
      .eq('pregnancy_id', fromPregnancyId)
      .eq('kind', kind)
      .limit(1)
      .single()
    const state = source?.state as ChecklistState | undefined
    if (!state) return false
    const nextState: ChecklistState = {
      checked: [],
      custom: Array.isArray(state.custom) ? state.custom : [],
      excluded: Array.isArray(state.excluded) ? state.excluded : [],
    }
    if ((nextState.custom?.length ?? 0) === 0 && (nextState.excluded?.length ?? 0) === 0) {
      return false
    }
    await supabase.from('checklists').upsert(
      {
        user_id: userId,
        pregnancy_id: toPregnancyId,
        kind,
        state: nextState as unknown as Record<string, unknown>,
      },
      { onConflict: 'user_id,pregnancy_id,kind' },
    )
    return true
  }

  if (transfer.packliste) summary.packliste = await carryChecklist('packliste')
  if (transfer.einkaufsliste) summary.einkaufsliste = await carryChecklist('einkaufsliste')
  if (transfer.wochenbett) summary.wochenbett = await carryChecklist('wochenbett')

  // --- Kinderwunsch state (manifest + arzt only) --------------------------
  if (transfer.kinderwunschManifest || transfer.kinderwunschArzt) {
    const { data: source } = await supabase
      .from('kinderwunsch_state')
      .select('manifest, arzt')
      .eq('user_id', userId)
      .eq('pregnancy_id', fromPregnancyId)
      .limit(1)
      .single()
    if (source) {
      const payload: Record<string, unknown> = {
        user_id: userId,
        pregnancy_id: toPregnancyId,
      }
      if (transfer.kinderwunschManifest && source.manifest) {
        payload.manifest = source.manifest
        summary.kinderwunschManifest = true
      }
      if (transfer.kinderwunschArzt && source.arzt) {
        payload.arzt = source.arzt
        summary.kinderwunschArzt = true
      }
      if (Object.keys(payload).length > 2) {
        await supabase.from('kinderwunsch_state').upsert(payload, {
          onConflict: 'user_id,pregnancy_id',
        })
      }
    }
  }

  return NextResponse.json({ success: true, summary })
}
