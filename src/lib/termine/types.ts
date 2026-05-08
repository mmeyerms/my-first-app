import type { LocalizedString } from '@/lib/i18n/localized'

export type TerminTypeId =
  | 'erstgespraech'
  | 'erste_vorsorge'
  | 'nackenfaltenmessung'
  | 'triple_test'
  | 'feindiagnostik'
  | 'zuckertest'
  | 'dritter_ultraschall'
  | 'ctg'
  | 'hebammengespraech'
  | 'geburtsplangespraech'
  | 'klinikbesichtigung'
  | 'wochenbett_hebamme'
  | 'geburtsvorbereitung'
  | 'stillberatung'
  | 'zahnarzt'
  | 'custom'

export type TerminCategory = 'untersuchung' | 'beratung' | 'vorbereitung' | 'sonstiges'

export type TerminTypeDef = {
  id: TerminTypeId
  category: TerminCategory
  emoji: string
  title: LocalizedString
  description: LocalizedString
  sswFrom: number
  sswTo: number
  oneOff: boolean
  recommended: boolean
}

export type Termin = {
  id: string
  type: TerminTypeId
  title: string
  date: string
  time?: string
  location?: string
  doctor?: string
  notes?: string
  done?: boolean
  createdAt: string
  /** Links recurring siblings together. Same value across a series. */
  groupId?: string
}

export type RecurrenceRhythm = 'weekly' | 'biweekly' | 'monthly'
