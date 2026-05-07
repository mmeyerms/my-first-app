import type { Locale } from './i18n/types'
import type { LocalizedString } from './i18n/localized'
import { localized } from './i18n/localized'

export type PackItem = {
  id: string
  label: LocalizedString
  tip?: LocalizedString
}

export type PackCategory = {
  id: string
  emoji: string
  title: LocalizedString
  items: PackItem[]
}

export const PACK_CATEGORIES: PackCategory[] = [
  {
    id: 'mutter',
    emoji: '👩',
    title: { de: 'Für die Mama', en: 'For mum' },
    items: [
      {
        id: 'pk-m-1',
        label: { de: 'Mutterpass', en: 'Pregnancy record book (Mutterpass)' },
        tip: {
          de: 'Das wichtigste Dokument — nie vergessen!',
          en: 'The single most important document — never forget it!',
        },
      },
      {
        id: 'pk-m-2',
        label: { de: 'Krankenversicherungskarte', en: 'Health insurance card' },
      },
      {
        id: 'pk-m-3',
        label: { de: 'Personalausweis / Reisepass', en: 'ID card or passport' },
      },
      {
        id: 'pk-m-4',
        label: { de: 'Geburtsplan (ausgedruckt)', en: 'Birth plan (printed)' },
        tip: {
          de: 'Drucke 2-3 Kopien für Hebamme, Ärztin und dich',
          en: 'Print 2-3 copies — for the midwife, the doctor and yourself',
        },
      },
      {
        id: 'pk-m-5',
        label: { de: 'Bequeme Kleidung für die Geburt', en: 'Comfortable clothes for the birth' },
      },
      {
        id: 'pk-m-6',
        label: { de: 'Warme Socken', en: 'Warm socks' },
        tip: {
          de: 'Kalte Füße unter der Geburt ist sehr verbreitet',
          en: 'Cold feet during labour are very common',
        },
      },
      {
        id: 'pk-m-7',
        label: { de: 'Stillbustier / Still-BH (2x)', en: 'Nursing bra or top (2x)' },
      },
      {
        id: 'pk-m-8',
        label: { de: 'Bequeme Nachthemden (2-3x)', en: 'Comfortable nightgowns (2-3x)' },
      },
      {
        id: 'pk-m-9',
        label: { de: 'Einweg-Unterwäsche oder alte Unterwäsche', en: 'Disposable or old underwear' },
      },
      {
        id: 'pk-m-10',
        label: { de: 'Bademantel und Hausschuhe', en: 'Dressing gown and slippers' },
      },
      {
        id: 'pk-m-11',
        label: { de: 'Wochenbetteinlagen / starke Binden', en: 'Postpartum pads / heavy-flow pads' },
      },
      {
        id: 'pk-m-12',
        label: { de: 'Brustpads / Stilleinlagen', en: 'Breast pads' },
      },
      {
        id: 'pk-m-13',
        label: {
          de: 'Toilettenartikel (Shampoo, Duschgel, Zahnbürste)',
          en: 'Toiletries (shampoo, shower gel, toothbrush)',
        },
      },
      {
        id: 'pk-m-14',
        label: { de: 'Lippenpflege', en: 'Lip balm' },
        tip: {
          de: 'Unter der Geburt atmet man viel durch den Mund — Lippen werden schnell trocken',
          en: 'During labour you breathe a lot through your mouth — lips dry out quickly',
        },
      },
      {
        id: 'pk-m-15',
        label: { de: 'Haargummi / Haarband', en: 'Hair tie or headband' },
      },
      {
        id: 'pk-m-16',
        label: { de: 'Handy-Ladekabel', en: 'Phone charger' },
      },
      {
        id: 'pk-m-17',
        label: { de: 'Snacks für nach der Geburt', en: 'Snacks for after the birth' },
        tip: {
          de: 'Du wirst riesenhungrig sein! Nüsse, Kekse, Riegel',
          en: 'You will be ravenous! Nuts, biscuits, bars',
        },
      },
      {
        id: 'pk-m-18',
        label: { de: 'Wasserflaschen', en: 'Water bottles' },
      },
      {
        id: 'pk-m-19',
        label: { de: 'Kopfhörer und Entspannungsmusik', en: 'Headphones and calming music' },
      },
      {
        id: 'pk-m-20',
        label: { de: 'Kamera oder geladenes Handy für Fotos', en: 'Camera or charged phone for photos' },
      },
    ],
  },
  {
    id: 'baby',
    emoji: '👶',
    title: { de: 'Für das Baby', en: 'For the baby' },
    items: [
      {
        id: 'pk-b-1',
        label: { de: 'Body (3-5x), Größe 50-56', en: 'Bodysuits (3-5x), size 50-56 / newborn' },
      },
      {
        id: 'pk-b-2',
        label: { de: 'Strampler / Schlafanzüge (3-5x)', en: 'Onesies / sleepsuits (3-5x)' },
      },
      {
        id: 'pk-b-3',
        label: { de: 'Mützchen für den Kopf', en: 'Baby hat' },
      },
      {
        id: 'pk-b-4',
        label: { de: 'Socken (3-4 Paar)', en: 'Socks (3-4 pairs)' },
      },
      {
        id: 'pk-b-5',
        label: { de: 'Decke / Pucktuch', en: 'Blanket / swaddle' },
      },
      {
        id: 'pk-b-6',
        label: { de: 'Autositz (muss vorher montiert sein!)', en: 'Car seat (must be installed in advance!)' },
        tip: {
          de: 'Ohne gültigen Autositz darfst du mit dem Baby nicht nach Hause',
          en: 'You cannot drive home with the baby without a proper car seat',
        },
      },
      {
        id: 'pk-b-7',
        label: { de: 'Windeln Gr. 1 (Neugeborene), ca. 10 Stück', en: 'Newborn nappies (size 1), about 10' },
      },
      {
        id: 'pk-b-8',
        label: { de: 'Feuchttücher (parfümfrei)', en: 'Wet wipes (fragrance-free)' },
      },
      {
        id: 'pk-b-9',
        label: { de: 'Wundschutzcreme (z.B. Bepanthen)', en: 'Nappy cream (e.g. Bepanthen)' },
      },
      {
        id: 'pk-b-10',
        label: { de: 'Schnuller (falls gewünscht)', en: 'Pacifier (if you want one)' },
      },
    ],
  },
  {
    id: 'partner',
    emoji: '🧑',
    title: { de: 'Für den Partner', en: 'For the partner' },
    items: [
      {
        id: 'pk-p-1',
        label: { de: 'Kleidung für 1-2 Nächte', en: 'Clothes for 1-2 nights' },
      },
      {
        id: 'pk-p-2',
        label: { de: 'Zahnbürste & Hygieneartikel', en: 'Toothbrush and toiletries' },
      },
      {
        id: 'pk-p-3',
        label: { de: 'Snacks und Getränke', en: 'Snacks and drinks' },
      },
      {
        id: 'pk-p-4',
        label: {
          de: 'Kissen (Krankenhäuser haben oft harte Liegen)',
          en: 'Pillow (hospital beds are often hard)',
        },
      },
      {
        id: 'pk-p-5',
        label: { de: 'Buch oder Beschäftigung für Wartezeiten', en: 'A book or something to do while waiting' },
      },
      {
        id: 'pk-p-6',
        label: { de: 'Ladekabel', en: 'Charging cable' },
      },
      {
        id: 'pk-p-7',
        label: { de: 'Kamera', en: 'Camera' },
      },
    ],
  },
  {
    id: 'dokumente',
    emoji: '📄',
    title: { de: 'Dokumente', en: 'Documents' },
    items: [
      {
        id: 'pk-d-1',
        label: { de: 'Mutterpass', en: 'Pregnancy record book (Mutterpass)' },
      },
      {
        id: 'pk-d-2',
        label: { de: 'Krankenversicherungskarte', en: 'Health insurance card' },
      },
      {
        id: 'pk-d-3',
        label: { de: 'Personalausweis', en: 'ID card' },
      },
      {
        id: 'pk-d-4',
        label: { de: 'Geburtsplan', en: 'Birth plan' },
      },
      {
        id: 'pk-d-5',
        label: {
          de: 'Einweisung vom Arzt / Hebamme (falls vorhanden)',
          en: 'Referral from doctor or midwife (if you have one)',
        },
      },
      {
        id: 'pk-d-6',
        label: {
          de: 'Krankenhausanmeldung (falls bereits vorab)',
          en: 'Hospital pre-registration (if completed in advance)',
        },
        tip: {
          de: 'Viele Krankenhäuser bieten Voranmeldung ab SSW 30 an',
          en: 'Many hospitals offer pre-registration from week 30 onwards',
        },
      },
      {
        id: 'pk-d-7',
        label: { de: 'Notfallkontakte aufgeschrieben', en: 'Emergency contacts written down' },
      },
    ],
  },
]

export function getPackCategoryTitle(category: PackCategory, locale: Locale): string {
  return localized(category.title, locale)
}

export function getPackItemLabel(item: PackItem, locale: Locale): string {
  return localized(item.label, locale)
}

export function getPackItemTip(item: PackItem, locale: Locale): string | undefined {
  return item.tip ? localized(item.tip, locale) : undefined
}
