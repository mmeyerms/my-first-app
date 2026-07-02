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

export type HelpSlotType = 'task' | 'gift' | 'money'

export const HELP_SLOT_TYPES: readonly HelpSlotType[] = ['task', 'gift', 'money'] as const

export interface HelpSlot {
  id: string
  request_id: string
  category: HelpCategory
  description: string | null
  date: string | null
  time: string | null
  helper_name: string | null
  helper_message: string | null
  slot_type: HelpSlotType
  target_url: string | null
  suggested_amount: number | null
  thanks_sent_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface HelpRequestWithSlots extends HelpRequest {
  slots: HelpSlot[]
}
