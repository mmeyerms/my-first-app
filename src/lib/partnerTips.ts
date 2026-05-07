import type { Locale } from './i18n/types'
import type { LocalizedString } from './i18n/localized'
import { localized } from './i18n/localized'

export type PartnerTipType = 'todo' | 'wissen' | 'gespraech' | 'witzig' | 'positiv'

export interface PartnerTip {
  id: string
  sswFrom: number
  sswTo: number
  type: PartnerTipType
  emoji: string
  text: LocalizedString
}

export const PARTNER_TIPS: PartnerTip[] = [
  // SSW 1–12
  {
    id: 'p01a',
    sswFrom: 1,
    sswTo: 12,
    type: 'todo',
    emoji: '🏠',
    text: {
      de: 'Übernimm Haushaltsaufgaben, ohne gefragt zu werden — Kochen, Einkaufen, Aufräumen. Das hilft enorm, wenn sie erschöpft ist.',
      en: 'Take on household tasks without being asked — cooking, shopping, tidying up. It helps enormously when she is exhausted.',
    },
  },
  {
    id: 'p01b',
    sswFrom: 1,
    sswTo: 12,
    type: 'wissen',
    emoji: '🧠',
    text: {
      de: 'Übelkeit und extreme Müdigkeit im ersten Trimester sind normal. Dein Körper wäre genauso am Ende — ihr Körper baut gerade eine Plazenta auf.',
      en: 'Nausea and extreme tiredness in the first trimester are normal. Your body would be just as wrecked — hers is building a placenta from scratch.',
    },
  },
  {
    id: 'p01c',
    sswFrom: 1,
    sswTo: 12,
    type: 'gespraech',
    emoji: '💬',
    text: {
      de: 'Fragt heute gemeinsam: Wem wollen wir es wann sagen? Und wer soll es als Erstes erfahren?',
      en: 'Ask each other today: who do we want to tell, and when? And who should be the first to know?',
    },
  },
  {
    id: 'p01d',
    sswFrom: 1,
    sswTo: 12,
    type: 'todo',
    emoji: '📅',
    text: {
      de: 'Frag, ob du zum ersten Ultraschalltermin mitkommen kannst — diesen Moment wird sie nie vergessen.',
      en: 'Ask if you can come to the first ultrasound appointment — she will never forget that moment.',
    },
  },
  {
    id: 'p01e',
    sswFrom: 1,
    sswTo: 12,
    type: 'witzig',
    emoji: '😅',
    text: {
      de: 'Sie sagt: "Ich bin so müde." Du denkst: "Ich auch." Du sagst: Nichts. Du lernst schnell.',
      en: 'She says: "I am so tired." You think: "Me too." You say: nothing. You learn fast.',
    },
  },
  {
    id: 'p01f',
    sswFrom: 1,
    sswTo: 12,
    type: 'positiv',
    emoji: '💛',
    text: {
      de: 'Du bist nicht nur der Partner — du bist der erste Mensch, der dieses Baby außerhalb ihres Körpers kennenlernen wird. Kein Druck. Okay, etwas Druck. Aber du schaffst das.',
      en: 'You are not just the partner — you are the first person who will meet this baby outside her body. No pressure. Okay, a little pressure. But you have got this.',
    },
  },

  // SSW 13–20
  {
    id: 'p13a',
    sswFrom: 13,
    sswTo: 20,
    type: 'todo',
    emoji: '📋',
    text: {
      de: 'Lies euch heute gemeinsam durch den Geburtsplan. Es ist nicht zu früh — im Gegenteil.',
      en: 'Read through the birth plan together today. It is not too early — quite the opposite.',
    },
  },
  {
    id: 'p13b',
    sswFrom: 13,
    sswTo: 20,
    type: 'wissen',
    emoji: '🦋',
    text: {
      de: 'Bald spürt sie die ersten Kindsbewegungen — oft wie ein Flattern. Leg deine Hand auf ihren Bauch wenn sie sagt: "Es bewegt sich!"',
      en: 'Soon she will feel the first movements — often like a flutter. Put your hand on her belly when she says: "It is moving!"',
    },
  },
  {
    id: 'p13c',
    sswFrom: 13,
    sswTo: 20,
    type: 'gespraech',
    emoji: '💬',
    text: {
      de: 'Sprecht heute über Elternzeit: Wie viel nimmst du dir? Wann? Das früh zu klären nimmt Druck raus.',
      en: 'Talk about parental leave today: how much will you take? When? Settling this early takes pressure off.',
    },
  },
  {
    id: 'p13d',
    sswFrom: 13,
    sswTo: 20,
    type: 'todo',
    emoji: '🏥',
    text: {
      de: 'Sucht jetzt gemeinsam nach einer Wochenbett-Hebamme. Gute Hebammen sind schnell ausgebucht.',
      en: 'Start looking for a postpartum midwife together now. The good ones are booked up fast.',
    },
  },
  {
    id: 'p13e',
    sswFrom: 13,
    sswTo: 20,
    type: 'witzig',
    emoji: '🤣',
    text: {
      de: 'Offizieller Hinweis: "Wie groß ist das Baby jetzt?" ist eine vollkommen legitime Konversation. Diese Woche: eine Avocado. Nächste Woche: eine Mango. Du bist jetzt ein Obstexperte.',
      en: 'Official notice: "How big is the baby now?" is a perfectly legitimate conversation. This week: an avocado. Next week: a mango. You are a fruit expert now.',
    },
  },
  {
    id: 'p13f',
    sswFrom: 13,
    sswTo: 20,
    type: 'positiv',
    emoji: '🌟',
    text: {
      de: 'Ihr zweites Trimester beginnt. Sie fühlt sich wahrscheinlich zum ersten Mal seit Wochen wieder wie sie selbst. Feiere das. Mach etwas Schönes — einfach so, kein Anlass nötig.',
      en: 'Her second trimester is starting. She probably feels like herself again for the first time in weeks. Celebrate it. Do something nice — no reason needed.',
    },
  },

  // SSW 21–28
  {
    id: 'p21a',
    sswFrom: 21,
    sswTo: 28,
    type: 'todo',
    emoji: '🚗',
    text: {
      de: 'Kenne den Weg zum Krankenhaus oder Geburtshaus — inklusive Eingang und Parkmöglichkeiten. Bei Wehen willst du nicht suchen.',
      en: 'Know the route to the hospital or birth centre — including entrance and parking. When labour starts you do not want to be searching.',
    },
  },
  {
    id: 'p21b',
    sswFrom: 21,
    sswTo: 28,
    type: 'wissen',
    emoji: '👶',
    text: {
      de: 'Das Baby kann jetzt Geräusche hören. Sprich oder sing regelmäßig mit dem Bauch — das Baby lernt deine Stimme kennen.',
      en: 'The baby can hear sounds now. Talk or sing to the bump regularly — the baby is getting to know your voice.',
    },
  },
  {
    id: 'p21c',
    sswFrom: 21,
    sswTo: 28,
    type: 'gespraech',
    emoji: '💬',
    text: {
      de: 'Fragt heute: Wer soll wann Bescheid bekommen, wenn die Geburt beginnt? Erstellt eine kurze Liste.',
      en: 'Ask today: who should be told when, once labour begins? Put together a short list.',
    },
  },
  {
    id: 'p21d',
    sswFrom: 21,
    sswTo: 28,
    type: 'todo',
    emoji: '💆',
    text: {
      de: 'Überrasch sie mit einem Abend ohne Verpflichtungen. Keine Planung, kein Stress — einfach da sein.',
      en: 'Surprise her with an evening without obligations. No plans, no stress — just be there.',
    },
  },
  {
    id: 'p21e',
    sswFrom: 21,
    sswTo: 28,
    type: 'witzig',
    emoji: '🎵',
    text: {
      de: 'Das Baby hört jetzt deine Stimme. Vorsicht: Es speichert alles. Überleg dir gut, welche Lieder du singst — du wirst sie noch jahrelang singen müssen.',
      en: 'The baby can hear your voice now. Careful: it remembers everything. Choose your songs wisely — you will be singing them for years.',
    },
  },
  {
    id: 'p21f',
    sswFrom: 21,
    sswTo: 28,
    type: 'positiv',
    emoji: '🤝',
    text: {
      de: 'Wusstest du? Paare, die die Schwangerschaft bewusst gemeinsam erleben, berichten von tieferer Bindung — nicht nur zum Kind, sondern auch zueinander. Du machst das richtig.',
      en: 'Did you know? Couples who experience pregnancy consciously together report a deeper bond — not just to the child, but to each other. You are doing it right.',
    },
  },

  // SSW 29–36
  {
    id: 'p29a',
    sswFrom: 29,
    sswTo: 36,
    type: 'todo',
    emoji: '🎒',
    text: {
      de: 'Pack die Krankentasche gemeinsam. Für dich: Verpflegung, Ladekabel, bequeme Kleidung. Für sie: Frag was sie braucht.',
      en: 'Pack the hospital bag together. For you: snacks, charging cable, comfortable clothes. For her: ask what she needs.',
    },
  },
  {
    id: 'p29b',
    sswFrom: 29,
    sswTo: 36,
    type: 'wissen',
    emoji: '💨',
    text: {
      de: 'Lern die Atemtechniken aus dem Geburtsvorbereitungskurs. Als Geburtsbegleiter wirst du sie aktiv anleiten.',
      en: 'Learn the breathing techniques from the childbirth class. As her birth partner you will be actively guiding her.',
    },
  },
  {
    id: 'p29c',
    sswFrom: 29,
    sswTo: 36,
    type: 'gespraech',
    emoji: '💬',
    text: {
      de: 'Besprecht: Wer übernimmt was in den ersten Wochen nach der Geburt? Nachts aufstehen, Besucher koordinieren, Einkaufen?',
      en: 'Talk it through: who does what in the first weeks after the birth? Night feeds, coordinating visitors, grocery runs?',
    },
  },
  {
    id: 'p29d',
    sswFrom: 29,
    sswTo: 36,
    type: 'todo',
    emoji: '📱',
    text: {
      de: 'Speichere die Nummer der Hebamme und des Kreißsaals in dein Handy. Im Ernstfall zählt jede Sekunde.',
      en: 'Save the midwife\'s and the labour ward\'s number in your phone. In an emergency every second counts.',
    },
  },
  {
    id: 'p29e',
    sswFrom: 29,
    sswTo: 36,
    type: 'witzig',
    emoji: '🛒',
    text: {
      de: 'Du wirst jetzt Sachen kaufen, von denen du nie dachtest, dass du sie kaufst. "Stilleinlagen" zum Beispiel. Willkommen in deiner neuen Realität.',
      en: 'You are about to buy things you never thought you would. "Breast pads", for instance. Welcome to your new reality.',
    },
  },
  {
    id: 'p29f',
    sswFrom: 29,
    sswTo: 36,
    type: 'positiv',
    emoji: '💪',
    text: {
      de: 'Sie trägt gerade etwas Unvorstellbares — physisch und emotional. Du musst nicht alles verstehen. Du musst nur da sein. Und das tust du.',
      en: 'She is carrying something unimaginable right now — physically and emotionally. You do not have to understand it all. You just have to be there. And you are.',
    },
  },

  // SSW 37–42
  {
    id: 'p37a',
    sswFrom: 37,
    sswTo: 42,
    type: 'todo',
    emoji: '🔋',
    text: {
      de: 'Halte dein Handy immer geladen und sei tagsüber erreichbar. Es kann jederzeit losgehen.',
      en: 'Keep your phone charged at all times and stay reachable during the day. It could start any moment.',
    },
  },
  {
    id: 'p37b',
    sswFrom: 37,
    sswTo: 42,
    type: 'wissen',
    emoji: '⏱️',
    text: {
      de: 'Echte Wehen: regelmäßig, länger, stärker. Vorwehen: unregelmäßig, hören bei Bewegung auf. Im Zweifelsfall: Hebamme anrufen.',
      en: 'Real contractions: regular, longer, stronger. Practice contractions: irregular, ease off with movement. If in doubt: call the midwife.',
    },
  },
  {
    id: 'p37c',
    sswFrom: 37,
    sswTo: 42,
    type: 'gespraech',
    emoji: '💬',
    text: {
      de: 'Sag ihr heute: Was du an ihr bewunderst. Nicht was sie tut — wer sie ist. Jetzt, gerade jetzt, braucht sie das.',
      en: 'Tell her today what you admire about her. Not what she does — who she is. Right now, more than ever, she needs to hear it.',
    },
  },
  {
    id: 'p37d',
    sswFrom: 37,
    sswTo: 42,
    type: 'todo',
    emoji: '🧘',
    text: {
      de: 'Deine Aufgabe bei der Geburt: Ruhepol sein. Nicht in Panik verfallen. Atme mit ihr. Du bist ihr Anker.',
      en: 'Your job at the birth: be the calm one. Do not panic. Breathe with her. You are her anchor.',
    },
  },
  {
    id: 'p37e',
    sswFrom: 37,
    sswTo: 42,
    type: 'witzig',
    emoji: '📱',
    text: {
      de: 'Ab sofort gilt: Handy immer bei 100% laden. Immer. Das ist jetzt dein einziger Job. Nein, Quatsch. Aber echt: Handy laden.',
      en: 'New rule: keep your phone at 100%. Always. That is now your only job. Okay, not your only job. But seriously: charge the phone.',
    },
  },
  {
    id: 'p37f',
    sswFrom: 37,
    sswTo: 42,
    type: 'positiv',
    emoji: '🌸',
    text: {
      de: 'Gleich werdet ihr zu dritt sein. Dieses Kapitel — nur ihr zwei — endet bald. Und das nächste ist das schönste. Aber halte diesen Moment kurz fest. Du wirst ihn nie vergessen.',
      en: 'Soon there will be three of you. This chapter — just the two of you — is almost over. And the next one is the most beautiful. But hold on to this moment for a second. You will never forget it.',
    },
  },
]

export const PARTNER_TIP_LABELS: Record<PartnerTipType, LocalizedString> = {
  todo: { de: 'To-Do heute', en: 'Today\'s to-do' },
  wissen: { de: 'Wissenssnippet', en: 'Knowledge snippet' },
  gespraech: { de: 'Gesprächsimpuls', en: 'Conversation prompt' },
  witzig: { de: '😄 Schmunzelmoment', en: '😄 Smile of the day' },
  positiv: { de: '💛 Herzenssache', en: '💛 Matter of the heart' },
}

export function getPartnerTipForDay(ssw: number, date: Date = new Date()): PartnerTip {
  const clampedSSW = Math.max(1, Math.min(42, ssw))
  const matching = PARTNER_TIPS.filter((t) => clampedSSW >= t.sswFrom && clampedSSW <= t.sswTo)
  const pool = matching.length > 0 ? matching : PARTNER_TIPS.slice(0, 4)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return pool[dayOfYear % pool.length]
}

export function getPartnerTipText(tip: PartnerTip, locale: Locale): string {
  return localized(tip.text, locale)
}

export function getPartnerTipLabel(type: PartnerTipType, locale: Locale): string {
  return localized(PARTNER_TIP_LABELS[type], locale)
}
