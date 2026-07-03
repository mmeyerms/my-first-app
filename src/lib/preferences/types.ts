export type GreetingTone = 'warm' | 'sachlich' | 'locker' | 'liebevoll'
export type AccentColor = 'burgundy' | 'rose' | 'sage' | 'blue'
export type FontSize = 'sm' | 'md' | 'lg'
export type SnapshotCardKey =
  | 'nextTermin'
  | 'ssw'
  | 'tipp'
  | 'tagebuch'
  | 'countdown'
  | 'wochenbettChef'
  | 'sternzeichen'
export type SnapshotDensity = 'compact' | 'expanded'
export type WocheProgressStyle = 'bar' | 'percent' | 'weeksLeft' | 'none'
export type PartnerRole = 'partner' | 'grandparent' | 'friend' | 'other'
export type QuestionSetMode = 'short' | 'full'
export type WocheBlockKey =
  | 'development'
  | 'comparisons'
  | 'momBody'
  | 'funFact'
  | 'partnerTip'
  | 'nextWeek'
export type WocheComparisonCategory =
  | 'frucht'
  | 'suessigkeit'
  | 'spielzeug'
  | 'tier'
  | 'alltag'
  | 'sport'
  | 'beauty'

export interface PartnerVisibility {
  termine: boolean
  tagebuch: boolean
  geburtsplan: boolean
  woche: boolean
  wochenbett: boolean
  partnerTodos: boolean
}

export interface KinderwunschTracking {
  temperature: boolean
  lh: boolean
  symptothermal: boolean
  gv: boolean
  mens: boolean
}

export interface KinderwunschReminders {
  vitaminsTime: string | null
  ovuTestActive: boolean
  wunschEt: string | null
}

export type ChecklistLocation = 'klinik' | 'hausgeburt' | 'geburtshaus'
export type ChecklistSeason = 'sommer' | 'winter'
export type ChecklistSetup = 'solo' | 'duo'

export interface ChecklistPresets {
  location: ChecklistLocation | null
  season: ChecklistSeason | null
  setup: ChecklistSetup | null
}

export interface PushNotificationsPreferences {
  /** Push at the transition into a new SSW. Dispatched by /api/cron/push-week-change (daily 08:00 UTC). */
  weekChange: boolean
  /** Push reminder before an appointment, honoring per-termin reminder_hours. Dispatched by /api/cron/push-termin-reminder (hourly). */
  terminReminder: boolean
  /** Push when a Wochenbett-Chef help slot is claimed by a helper. Sent inline from /api/helfen/[token]/claim. */
  helpSlotClaimed: boolean
}

export interface NotificationsPreferences {
  /** When true, this user receives the weekly Sunday summary email dispatched by /api/cron/weekly-summary. */
  weeklyEmail: boolean
  /** Per-type push flags. Only respected when the user also has an active push_subscriptions row. */
  push: PushNotificationsPreferences
}

export interface SecurityPreferences {
  /** Auto-logout on idle. null = never (default). */
  autoLogoutMinutes: number | null
}

/**
 * Notfall-Karte (PROJ-13): medical emergency data the mother fills in once.
 * Rendered as lock-screen image + wallet PDF. All fields optional — the
 * card renders only what's present.
 */
/**
 * Lebensumstaende (PROJ-Sonderfaelle): 8 Flags die Ansprache und Inhalte
 * app-weit anpassen. Bewusst in den Preferences (nicht auf pregnancies):
 * privat, ohne Partner-RLS-Exposition, sofort ohne Migration nutzbar.
 */
export interface LifeCircumstances {
  /** Regenbogen-Schwangerschaft — schwanger nach Verlust. Sanftere Fruehphasen-Ansprache. */
  afterLoss: boolean
  /** Baby frueh geboren / NICU — Wochenbett-Inhalte angepasst, Fruehchen-Anlaufstellen. */
  premature: boolean
  /** Risikoschwangerschaft — keine pauschalen Bewegungs-Tipps, engmaschige Betreuung. */
  riskPregnancy: boolean
  /** Verordnete Bettruhe — Hilfe-Organisation schon vor der Geburt prominent. */
  bedRest: boolean
  /** Solo-Mama — Formulierungen ohne Paar-Annahme, Support-Netz im Fokus. */
  soloMama: boolean
  /** Geplanter Kaiserschnitt — Sectio-Infos, laengere Wochenbett-Erholung. */
  plannedSectio: boolean
  /** Kinderwunschbehandlung / IVF — Behandlungs-Phasen-Begleitung. */
  ivf: boolean
  /** Auffaelliger Praenataldiagnostik-Befund — wuerdevolle Verweise statt Auto-Tipps. */
  prenatalFinding: boolean
}

export interface NotfallKarte {
  bloodType: string
  allergies: string
  medications: string
  conditions: string
  clinicName: string
  clinicAddress: string
  clinicPhone: string
  emergencyContactName: string
  emergencyContactPhone: string
}

export interface UserPreferences {
  // Design
  accentColor: AccentColor
  fontSize: FontSize

  // Snapshot / Dashboard
  greetingTone: GreetingTone
  snapshotCards: SnapshotCardKey[]
  snapshotDensity: SnapshotDensity
  showCountdownWidget: boolean

  // Woche
  wocheProgressStyle: WocheProgressStyle
  wocheBlocks: WocheBlockKey[]
  wocheComparisonCategories: WocheComparisonCategory[]

  // Tagebuch
  tagebuchCustomPrompts: string[]
  tagebuchPromptRotation: boolean
  tagebuchShowRueckblick: boolean

  // Geburtsplan
  geburtsplanQuestionSet: QuestionSetMode
  geburtsplanClinicPreset: string | null

  // Partner
  partnerRole: PartnerRole
  partnerLabel: string
  partnerVisibility: PartnerVisibility

  // Kinderwunsch
  kinderwunschCycleLength: number
  kinderwunschTracking: KinderwunschTracking
  kinderwunschReminders: KinderwunschReminders

  // Checklist presets (Packliste, Einkaufsliste, Wochenbett)
  listPresets: ChecklistPresets

  // Notifications (Wochen-Mail etc.)
  notifications: NotificationsPreferences

  // Security (auto-logout etc.)
  security: SecurityPreferences

  // Notfall-Karte (PROJ-13)
  notfallKarte: NotfallKarte

  // Lebensumstaende (Sonderfaelle)
  lifeCircumstances: LifeCircumstances
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  accentColor: 'burgundy',
  fontSize: 'md',

  greetingTone: 'warm',
  snapshotCards: ['nextTermin', 'ssw', 'tipp', 'tagebuch'],
  snapshotDensity: 'expanded',
  showCountdownWidget: true,

  wocheProgressStyle: 'bar',
  wocheBlocks: ['development', 'comparisons', 'momBody', 'funFact', 'partnerTip', 'nextWeek'],
  wocheComparisonCategories: ['frucht', 'suessigkeit', 'spielzeug', 'tier', 'alltag', 'sport', 'beauty'],

  tagebuchCustomPrompts: [],
  tagebuchPromptRotation: true,
  tagebuchShowRueckblick: true,

  geburtsplanQuestionSet: 'full',
  geburtsplanClinicPreset: null,

  partnerRole: 'partner',
  partnerLabel: 'Partner:in',
  partnerVisibility: {
    partnerTodos: true,
    termine: true,
    tagebuch: false,
    geburtsplan: true,
    woche: true,
    wochenbett: true,
  },

  kinderwunschCycleLength: 28,
  kinderwunschTracking: {
    temperature: true,
    lh: true,
    symptothermal: false,
    gv: true,
    mens: true,
  },
  kinderwunschReminders: {
    vitaminsTime: null,
    ovuTestActive: false,
    wunschEt: null,
  },

  listPresets: {
    location: null,
    season: null,
    setup: null,
  },

  notifications: {
    weeklyEmail: false,
    push: {
      weekChange: true,
      terminReminder: true,
      helpSlotClaimed: true,
    },
  },

  security: {
    autoLogoutMinutes: null,
  },

  notfallKarte: {
    bloodType: '',
    allergies: '',
    medications: '',
    conditions: '',
    clinicName: '',
    clinicAddress: '',
    clinicPhone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  },

  lifeCircumstances: {
    afterLoss: false,
    premature: false,
    riskPregnancy: false,
    bedRest: false,
    soloMama: false,
    plannedSectio: false,
    ivf: false,
    prenatalFinding: false,
  },
}

/**
 * Merge partial prefs from DB with defaults so new fields do not crash old data.
 */
export function mergePreferences(
  partial: Partial<UserPreferences> | null | undefined,
): UserPreferences {
  if (!partial) return { ...DEFAULT_PREFERENCES }
  return {
    ...DEFAULT_PREFERENCES,
    ...partial,
    partnerVisibility: {
      ...DEFAULT_PREFERENCES.partnerVisibility,
      ...(partial.partnerVisibility ?? {}),
    },
    kinderwunschTracking: {
      ...DEFAULT_PREFERENCES.kinderwunschTracking,
      ...(partial.kinderwunschTracking ?? {}),
    },
    kinderwunschReminders: {
      ...DEFAULT_PREFERENCES.kinderwunschReminders,
      ...(partial.kinderwunschReminders ?? {}),
    },
    listPresets: {
      ...DEFAULT_PREFERENCES.listPresets,
      ...(partial.listPresets ?? {}),
    },
    notifications: {
      ...DEFAULT_PREFERENCES.notifications,
      ...(partial.notifications ?? {}),
      push: {
        ...DEFAULT_PREFERENCES.notifications.push,
        ...(partial.notifications?.push ?? {}),
      },
    },
    security: {
      ...DEFAULT_PREFERENCES.security,
      ...(partial.security ?? {}),
    },
    notfallKarte: {
      ...DEFAULT_PREFERENCES.notfallKarte,
      ...(partial.notfallKarte ?? {}),
    },
    lifeCircumstances: {
      ...DEFAULT_PREFERENCES.lifeCircumstances,
      ...(partial.lifeCircumstances ?? {}),
    },
  }
}
