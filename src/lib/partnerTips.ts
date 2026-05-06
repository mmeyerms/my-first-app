export type PartnerTipType = 'todo' | 'wissen' | 'gespraech'

export interface PartnerTip {
  id: string
  sswFrom: number
  sswTo: number
  type: PartnerTipType
  emoji: string
  text: string
}

export const PARTNER_TIPS: PartnerTip[] = [
  // SSW 1–12
  { id: 'p01a', sswFrom: 1, sswTo: 12, type: 'todo', emoji: '🏠', text: 'Übernimm Haushaltsaufgaben, ohne gefragt zu werden — Kochen, Einkaufen, Aufräumen. Das hilft enorm, wenn sie erschöpft ist.' },
  { id: 'p01b', sswFrom: 1, sswTo: 12, type: 'wissen', emoji: '🧠', text: 'Übelkeit und extreme Müdigkeit im ersten Trimester sind normal. Dein Körper wäre genauso am Ende — ihr Körper baut gerade eine Plazenta auf.' },
  { id: 'p01c', sswFrom: 1, sswTo: 12, type: 'gespraech', emoji: '💬', text: 'Fragt heute gemeinsam: Wem wollen wir es wann sagen? Und wer soll es als Erstes erfahren?' },
  { id: 'p01d', sswFrom: 1, sswTo: 12, type: 'todo', emoji: '📅', text: 'Frag, ob du zum ersten Ultraschalltermin mitkommen kannst — diesen Moment wird sie nie vergessen.' },

  // SSW 13–20
  { id: 'p13a', sswFrom: 13, sswTo: 20, type: 'todo', emoji: '📋', text: 'Lies euch heute gemeinsam durch den Geburtsplan. Es ist nicht zu früh — im Gegenteil.' },
  { id: 'p13b', sswFrom: 13, sswTo: 20, type: 'wissen', emoji: '🦋', text: 'Bald spürt sie die ersten Kindsbewegungen — oft wie ein Flattern. Leg deine Hand auf ihren Bauch wenn sie sagt: "Es bewegt sich!"' },
  { id: 'p13c', sswFrom: 13, sswTo: 20, type: 'gespraech', emoji: '💬', text: 'Sprecht heute über Elternzeit: Wie viel nimmst du dir? Wann? Das früh zu klären nimmt Druck raus.' },
  { id: 'p13d', sswFrom: 13, sswTo: 20, type: 'todo', emoji: '🏥', text: 'Sucht jetzt gemeinsam nach einer Wochenbett-Hebamme. Gute Hebammen sind schnell ausgebucht.' },

  // SSW 21–28
  { id: 'p21a', sswFrom: 21, sswTo: 28, type: 'todo', emoji: '🚗', text: 'Kenne den Weg zum Krankenhaus oder Geburtshaus — inklusive Eingang und Parkmöglichkeiten. Bei Wehen willst du nicht suchen.' },
  { id: 'p21b', sswFrom: 21, sswTo: 28, type: 'wissen', emoji: '👶', text: 'Das Baby kann jetzt Geräusche hören. Sprich oder sing regelmäßig mit dem Bauch — das Baby lernt deine Stimme kennen.' },
  { id: 'p21c', sswFrom: 21, sswTo: 28, type: 'gespraech', emoji: '💬', text: 'Fragt heute: Wer soll wann Bescheid bekommen, wenn die Geburt beginnt? Erstellt eine kurze Liste.' },
  { id: 'p21d', sswFrom: 21, sswTo: 28, type: 'todo', emoji: '💆', text: 'Überrasch sie mit einem Abend ohne Verpflichtungen. Keine Planung, kein Stress — einfach da sein.' },

  // SSW 29–36
  { id: 'p29a', sswFrom: 29, sswTo: 36, type: 'todo', emoji: '🎒', text: 'Pack die Krankentasche gemeinsam. Für dich: Verpflegung, Ladekabel, bequeme Kleidung. Für sie: Frag was sie braucht.' },
  { id: 'p29b', sswFrom: 29, sswTo: 36, type: 'wissen', emoji: '💨', text: 'Lern die Atemtechniken aus dem Geburtsvorbereitungskurs. Als Geburtsbegleiter wirst du sie aktiv anleiten.' },
  { id: 'p29c', sswFrom: 29, sswTo: 36, type: 'gespraech', emoji: '💬', text: 'Besprecht: Wer übernimmt was in den ersten Wochen nach der Geburt? Nachts aufstehen, Besucher koordinieren, Einkaufen?' },
  { id: 'p29d', sswFrom: 29, sswTo: 36, type: 'todo', emoji: '📱', text: 'Speichere die Nummer der Hebamme und des Kreißsaals in dein Handy. Im Ernstfall zählt jede Sekunde.' },

  // SSW 37–42
  { id: 'p37a', sswFrom: 37, sswTo: 42, type: 'todo', emoji: '🔋', text: 'Halte dein Handy immer geladen und sei tagsüber erreichbar. Es kann jederzeit losgehen.' },
  { id: 'p37b', sswFrom: 37, sswTo: 42, type: 'wissen', emoji: '⏱️', text: 'Echte Wehen: regelmäßig, länger, stärker. Vorwehen: unregelmäßig, hören bei Bewegung auf. Im Zweifelsfall: Hebamme anrufen.' },
  { id: 'p37c', sswFrom: 37, sswTo: 42, type: 'gespraech', emoji: '💬', text: 'Sag ihr heute: Was du an ihr bewunderst. Nicht was sie tut — wer sie ist. Jetzt, gerade jetzt, braucht sie das.' },
  { id: 'p37d', sswFrom: 37, sswTo: 42, type: 'todo', emoji: '🧘', text: 'Deine Aufgabe bei der Geburt: Ruhepol sein. Nicht in Panik verfallen. Atme mit ihr. Du bist ihr Anker.' },
]

export const PARTNER_TIP_LABELS: Record<PartnerTipType, string> = {
  todo: 'To-Do heute',
  wissen: 'Wissenssnippet',
  gespraech: 'Gesprächsimpuls',
}

export function getPartnerTipForDay(ssw: number, date: Date = new Date()): PartnerTip {
  const clampedSSW = Math.max(1, Math.min(42, ssw))
  const matching = PARTNER_TIPS.filter((t) => clampedSSW >= t.sswFrom && clampedSSW <= t.sswTo)
  const pool = matching.length > 0 ? matching : PARTNER_TIPS.slice(0, 4)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return pool[dayOfYear % pool.length]
}
