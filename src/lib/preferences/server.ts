import type { SupabaseClient } from '@supabase/supabase-js'
import { DEFAULT_PREFERENCES, mergePreferences, type UserPreferences } from './types'

export async function getPreferences(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPreferences> {
  const { data } = await supabase
    .from('user_preferences')
    .select('settings')
    .eq('user_id', userId)
    .limit(1)
    .single()

  if (!data?.settings) return { ...DEFAULT_PREFERENCES }
  return mergePreferences(data.settings as Partial<UserPreferences>)
}
