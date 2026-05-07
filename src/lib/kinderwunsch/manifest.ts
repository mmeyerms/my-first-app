import type { LocalizedString } from '@/lib/i18n/localized'

export type ManifestStatement = {
  id: string
  text: LocalizedString
}

export const MANIFEST_VORSCHLAEGE: ManifestStatement[] = [
  {
    id: 'm-1',
    text: {
      de: 'Wir sprechen miteinander, nicht über das Baby.',
      en: 'We talk with each other, not just about the baby.',
    },
  },
  {
    id: 'm-2',
    text: {
      de: 'Wir akzeptieren, dass wir nicht jeden Tag glücklich sind.',
      en: 'We accept that we won\'t be happy every single day.',
    },
  },
  {
    id: 'm-3',
    text: {
      de: 'Wir holen uns Hilfe, bevor wir am Ende sind.',
      en: 'We ask for help before we reach the breaking point.',
    },
  },
  {
    id: 'm-4',
    text: {
      de: 'Wir achten unsere Beziehung als Paar — auch wenn wir Eltern werden.',
      en: 'We honor our relationship as a couple — even as we become parents.',
    },
  },
  {
    id: 'm-5',
    text: {
      de: 'Wir vertrauen unserem Bauchgefühl, nicht jedem Ratschlag.',
      en: 'We trust our gut, not every piece of advice.',
    },
  },
  {
    id: 'm-6',
    text: {
      de: 'Wir teilen die mentale Last — nicht nur die sichtbaren Aufgaben.',
      en: 'We share the mental load — not just the visible tasks.',
    },
  },
  {
    id: 'm-7',
    text: {
      de: 'Wir streiten fair und nie vor dem Kind, wenn wir es vermeiden können.',
      en: 'We fight fair and never in front of our child if we can help it.',
    },
  },
  {
    id: 'm-8',
    text: {
      de: 'Wir sehen Eltern-Sein als Lernreise — Fehler sind erlaubt.',
      en: 'We see parenting as a learning journey — mistakes are allowed.',
    },
  },
  {
    id: 'm-9',
    text: {
      de: 'Wir behalten unsere Hobbys und Freundschaften.',
      en: 'We keep our hobbies and friendships.',
    },
  },
  {
    id: 'm-10',
    text: {
      de: 'Wir feiern auch die kleinen Momente.',
      en: 'We celebrate the small moments too.',
    },
  },
]
