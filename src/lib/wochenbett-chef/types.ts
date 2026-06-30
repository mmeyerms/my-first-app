export type HelpCategory =
  | 'kochen'
  | 'einkaufen'
  | 'reden'
  | 'waesche'
  | 'kinderbetreuung'
  | 'andere'

export const HELP_CATEGORIES: readonly HelpCategory[] = [
  'kochen',
  'einkaufen',
  'reden',
  'waesche',
  'kinderbetreuung',
  'andere',
] as const

export interface HelpRequest {
  id: string
  user_id: string
  pregnancy_id: string | null
  share_token: string
  title: string | null
  intro: string | null
  created_at: string
  updated_at: string
}

export interface HelpSlot {
  id: string
  request_id: string
  category: HelpCategory
  description: string | null
  date: string | null
  time: string | null
  helper_name: string | null
  helper_message: string | null
  created_at: string
  updated_at: string
}

export interface HelpRequestWithSlots extends HelpRequest {
  slots: HelpSlot[]
}
