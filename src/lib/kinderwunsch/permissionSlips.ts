import type { LocalizedString } from '@/lib/i18n/localized'

export type PermissionSlip = {
  id: string
  emoji: string
  title: LocalizedString
  body: LocalizedString
}

export const PERMISSION_SLIPS: PermissionSlip[] = [
  {
    id: 'ps-1',
    emoji: '😰',
    title: {
      de: 'Du darfst Angst haben.',
      en: 'You\'re allowed to be afraid.',
    },
    body: {
      de: 'Auch jetzt. Auch morgen. Auch im positiven Test. Angst und Vorfreude sind keine Gegensätze — sie können nebeneinander wohnen.',
      en: 'Now. Tomorrow. Even on the day of the positive test. Fear and joyful anticipation aren\'t opposites — they can live side by side.',
    },
  },
  {
    id: 'ps-2',
    emoji: '🤔',
    title: {
      de: 'Du darfst es noch nicht sicher wollen.',
      en: 'You\'re allowed not to be sure yet.',
    },
    body: {
      de: 'Niemand fühlt sich zu 100% bereit. Die ehrlichsten Mütter sagen: „Ich war nie ganz sicher — und wurde trotzdem die Mama, die ich heute bin."',
      en: 'Nobody feels 100% ready. The most honest mothers say: "I was never quite sure — and I still became the mom I am today."',
    },
  },
  {
    id: 'ps-3',
    emoji: '😢',
    title: {
      de: 'Du darfst weinen, wenn der Test negativ ist.',
      en: 'You\'re allowed to cry when the test is negative.',
    },
    body: {
      de: 'Jeder negative Test ist ein kleiner Abschied von einer Hoffnung. Das darf weh tun. Auch wenn du weißt, dass es noch klappen wird.',
      en: 'Every negative test is a small goodbye to a hope. It\'s allowed to hurt — even when you know it will work out eventually.',
    },
  },
  {
    id: 'ps-4',
    emoji: '⏳',
    title: {
      de: 'Du darfst dir Zeit nehmen.',
      en: 'You\'re allowed to take your time.',
    },
    body: {
      de: 'Es ist kein Wettrennen. Andere Paare haben länger gebraucht, ohne dass etwas „falsch" war. Druck ist der größte Feind der Fruchtbarkeit.',
      en: 'It\'s not a race. Other couples have taken longer without anything being "wrong." Pressure is fertility\'s biggest enemy.',
    },
  },
  {
    id: 'ps-5',
    emoji: '🤐',
    title: {
      de: 'Du darfst es niemandem erzählen.',
      en: 'You\'re allowed to tell no one.',
    },
    body: {
      de: 'Oder es nur einer Person sagen. Du musst niemandem Update geben. Das hier gehört euch.',
      en: 'Or to share it with just one person. You don\'t owe anyone an update. This belongs to the two of you.',
    },
  },
  {
    id: 'ps-6',
    emoji: '🌧️',
    title: {
      de: 'Du darfst eine schlechte Schwangere sein.',
      en: 'You\'re allowed to be a "bad" pregnant person.',
    },
    body: {
      de: 'Müde, gereizt, ungeduldig, manchmal undankbar. Schwangerschaft ist nicht durchgehend Glühen. Das macht dich nicht zu einer schlechten Mama.',
      en: 'Tired, irritated, impatient, sometimes ungrateful. Pregnancy isn\'t a constant glow. That doesn\'t make you a bad mom.',
    },
  },
  {
    id: 'ps-7',
    emoji: '🌊',
    title: {
      de: 'Du darfst Angst vor der Geburt haben.',
      en: 'You\'re allowed to be afraid of birth.',
    },
    body: {
      de: 'Die Geburt ist ein extremes körperliches Erlebnis. Dass du Respekt davor hast, ist klug — nicht schwach.',
      en: 'Birth is an extreme physical experience. Respecting that is wise — not weak.',
    },
  },
  {
    id: 'ps-8',
    emoji: '💛',
    title: {
      de: 'Du darfst nicht sofort Mama-Gefühle haben.',
      en: 'You\'re allowed not to feel mom-feelings right away.',
    },
    body: {
      de: 'Manche Mütter verlieben sich erst Wochen nach der Geburt. Bonding ist ein Prozess, kein Knall. Das macht euch beide nicht weniger wert.',
      en: 'Some mothers fall in love weeks after birth. Bonding is a process, not a fireworks moment. That doesn\'t make either of you less.',
    },
  },
  {
    id: 'ps-9',
    emoji: '🚫',
    title: {
      de: 'Du darfst nein sagen — auch zu lieben Menschen.',
      en: 'You\'re allowed to say no — even to people you love.',
    },
    body: {
      de: 'Schwiegermutter, beste Freundin, Kollegin. Wenn ihr Rat oder Besuch dich gerade überfordert: Nein ist ein vollständiger Satz.',
      en: 'Mother-in-law, best friend, colleague. When their advice or visit overwhelms you: "no" is a complete sentence.',
    },
  },
  {
    id: 'ps-10',
    emoji: '🔁',
    title: {
      de: 'Du darfst es noch verschieben.',
      en: 'You\'re allowed to put it off a little longer.',
    },
    body: {
      de: 'Wenn das Bauchgefühl sagt „Noch nicht jetzt" — hör drauf. Ein bewusst gewählter Zeitpunkt ist mehr wert als ein erzwungener.',
      en: 'If your gut says "not yet" — listen to it. A consciously chosen moment is worth more than a forced one.',
    },
  },
  {
    id: 'ps-11',
    emoji: '😶‍🌫️',
    title: {
      de: 'Du darfst zweifeln.',
      en: 'You\'re allowed to have doubts.',
    },
    body: {
      de: 'An deiner Bereitschaft. An eurer Beziehung. An dem ganzen Vorhaben. Zweifel sind keine Anklage — sie sind ein Hinweis, in dich hineinzuhören.',
      en: 'About your readiness. About your relationship. About the whole plan. Doubts aren\'t an accusation — they\'re an invitation to listen inward.',
    },
  },
  {
    id: 'ps-12',
    emoji: '🌸',
    title: {
      de: 'Du darfst euch beide priorisieren.',
      en: 'You\'re allowed to prioritize the two of you.',
    },
    body: {
      de: 'Bevor das Baby kommt, dürft ihr noch einmal euch sein. Reisen, schlafen, faulenzen, lieben — ohne schlechtes Gewissen.',
      en: 'Before the baby comes, you\'re allowed to be just the two of you again. Travel, sleep, laze around, love — guilt-free.',
    },
  },
]
