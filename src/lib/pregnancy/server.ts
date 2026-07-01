import type { SupabaseClient } from '@supabase/supabase-js'

export type PregnancyStatus = 'planning' | 'pregnant' | 'born' | 'sternenkind'
export type BabyGender = 'female' | 'male' | 'diverse' | 'surprise' | 'unknown'

export interface Pregnancy {
  id: string
  user_id: string
  status: PregnancyStatus
  is_active: boolean
  baby_name: string | null
  baby_names: string[] | null
  is_multiple: boolean
  baby_gender: BabyGender | null
  positive_test_date: string | null
  due_date: string | null
  birth_date: string | null
  ended_date: string | null
  memorial_note: string | null
  created_at: string
  updated_at: string
}

/**
 * Returns the active pregnancy for the given user, or null if none exists.
 * Uses maybeSingle-like behaviour (single() returns 406 when 0 rows in PostgREST,
 * which we surface as null via the error code check).
 */
export async function getActivePregnancy(
  supabase: SupabaseClient,
  userId: string,
): Promise<Pregnancy | null> {
  const { data } = await supabase
    .from('pregnancies')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .limit(1)
    .single()
  return (data as Pregnancy | null) ?? null
}

/**
 * Returns ALL pregnancies for the given user, newest first.
 */
export async function getAllPregnancies(
  supabase: SupabaseClient,
  userId: string,
): Promise<Pregnancy[]> {
  const { data } = await supabase
    .from('pregnancies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)
  return (data ?? []) as Pregnancy[]
}
