import type { Locale } from './i18n/types'
import type { LocalizedString } from './i18n/localized'
import { localized } from './i18n/localized'

export type EinkaufItem = {
  id: string
  label: LocalizedString
  tip?: LocalizedString
}

export type EinkaufKategorie = {
  id: string
  emoji: string
  title: LocalizedString
  prioritaet: 'must' | 'nice' | 'skip'
  items: EinkaufItem[]
}

export const EINKAUF_KATEGORIEN: EinkaufKategorie[] = [
  {
    id: 'schlaf',
    emoji: '😴',
    title: { de: 'Schlafen', en: 'Sleeping' },
    prioritaet: 'must',
    items: [
      {
        id: 'ek-s-1',
        label: { de: 'Babybett oder Reisebett', en: 'Cot or travel cot' },
        tip: {
          de: 'Ab Geburt nötig. Beistellbett sehr praktisch für Nächte',
          en: 'Needed from day one. A bedside crib is very handy at night',
        },
      },
      {
        id: 'ek-s-2',
        label: { de: 'Matratze (passend zum Bett)', en: 'Mattress (matching the cot)' },
      },
      {
        id: 'ek-s-3',
        label: { de: 'Spannbettlaken (2-3x)', en: 'Fitted sheets (2-3x)' },
      },
      {
        id: 'ek-s-4',
        label: { de: 'Schlafsack (passend zur Jahreszeit)', en: 'Sleeping bag (suited to the season)' },
        tip: {
          de: 'Kein loses Bettzeug für Babys unter 1 Jahr!',
          en: 'No loose bedding for babies under 1 year!',
        },
      },
    ],
  },
  {
    id: 'transport',
    emoji: '🚗',
    title: { de: 'Transport', en: 'Transport' },
    prioritaet: 'must',
    items: [
      {
        id: 'ek-t-1',
        label: { de: 'Autositz Gruppe 0+ (bis 13 kg)', en: 'Group 0+ car seat (up to 13 kg)' },
        tip: {
          de: 'Pflicht ab dem ersten Tag! Am besten vor der Geburt montieren lassen',
          en: 'Mandatory from day one! Best installed before the birth',
        },
      },
      {
        id: 'ek-t-2',
        label: { de: 'Kinderwagen oder Buggy', en: 'Pram or stroller' },
        tip: {
          de: 'Oder Babytrage als günstigere Alternative für die ersten Monate',
          en: 'Or a baby carrier as a cheaper alternative for the first months',
        },
      },
      {
        id: 'ek-t-3',
        label: { de: 'Babytrage oder Tragetuch', en: 'Baby carrier or wrap' },
        tip: {
          de: 'Sehr beruhigend für Babys — du hast die Hände frei',
          en: 'Very soothing for babies — and your hands stay free',
        },
      },
      {
        id: 'ek-t-4',
        label: { de: 'Regenschutz für Kinderwagen', en: 'Rain cover for the pram' },
      },
    ],
  },
  {
    id: 'pflege',
    emoji: '🛁',
    title: { de: 'Pflege & Hygiene', en: 'Care & hygiene' },
    prioritaet: 'must',
    items: [
      {
        id: 'ek-p-1',
        label: { de: 'Babybadewanne', en: 'Baby bathtub' },
      },
      {
        id: 'ek-p-2',
        label: { de: 'Windeln Gr. 1 (Neugeborene), großer Vorrat', en: 'Newborn nappies (size 1), big supply' },
      },
      {
        id: 'ek-p-3',
        label: { de: 'Feuchttücher (parfümfrei), 5-10 Packungen', en: 'Wet wipes (fragrance-free), 5-10 packs' },
      },
      {
        id: 'ek-p-4',
        label: { de: 'Wundschutzcreme (Bepanthen o.ä.)', en: 'Nappy cream (Bepanthen or similar)' },
      },
      {
        id: 'ek-p-5',
        label: { de: 'Wickelunterlage + Bezüge', en: 'Changing mat plus covers' },
      },
      {
        id: 'ek-p-6',
        label: { de: 'Babybadethermometer', en: 'Bath thermometer' },
      },
      {
        id: 'ek-p-7',
        label: { de: 'Nagelschere oder Nagelfeile (Baby)', en: 'Baby nail scissors or nail file' },
      },
      {
        id: 'ek-p-8',
        label: { de: 'Nasensauger', en: 'Nasal aspirator' },
      },
    ],
  },
  {
    id: 'stillen',
    emoji: '🤱',
    title: { de: 'Stillen & Ernährung', en: 'Feeding' },
    prioritaet: 'must',
    items: [
      {
        id: 'ek-st-1',
        label: { de: 'Still-BH (2-3x)', en: 'Nursing bras (2-3x)' },
      },
      {
        id: 'ek-st-2',
        label: { de: 'Stilleinlagen', en: 'Breast pads' },
      },
      {
        id: 'ek-st-3',
        label: { de: 'Stillkissen', en: 'Nursing pillow' },
        tip: {
          de: 'Riesenhilfe! Auch als Lagerungskissen für das Baby nutzbar',
          en: 'Huge help! Doubles as a positioning pillow for the baby',
        },
      },
      {
        id: 'ek-st-4',
        label: { de: 'Milchpumpe (manuell oder elektrisch)', en: 'Breast pump (manual or electric)' },
        tip: {
          de: 'Sehr praktisch für unterwegs oder bei Überangebot',
          en: 'Very useful when out and about or for oversupply',
        },
      },
      {
        id: 'ek-st-5',
        label: { de: 'Milchbeutel zum Einfrieren', en: 'Milk storage bags for freezing' },
      },
      {
        id: 'ek-st-6',
        label: {
          de: 'Flaschen + Sauger (auch wenn du stillst)',
          en: 'Bottles and teats (even if you are breastfeeding)',
        },
        tip: {
          de: 'Für Notfälle, Rücklagen oder wenn der Partner übernimmt',
          en: 'For emergencies, expressed milk or when your partner takes over',
        },
      },
    ],
  },
  {
    id: 'kleidung',
    emoji: '👕',
    title: { de: 'Kleidung', en: 'Clothes' },
    prioritaet: 'must',
    items: [
      {
        id: 'ek-k-1',
        label: { de: 'Bodys (5-7x), Gr. 50-56', en: 'Bodysuits (5-7x), size 50-56 / newborn' },
        tip: {
          de: 'Babys wachsen schnell — nicht zu viel kaufen!',
          en: 'Babies grow fast — do not buy too many!',
        },
      },
      {
        id: 'ek-k-2',
        label: { de: 'Strampler / Schlafanzüge (5-7x)', en: 'Onesies / sleepsuits (5-7x)' },
      },
      {
        id: 'ek-k-3',
        label: { de: 'Socken (5-6 Paar)', en: 'Socks (5-6 pairs)' },
      },
      {
        id: 'ek-k-4',
        label: { de: 'Mützchen (2-3x)', en: 'Baby hats (2-3x)' },
      },
      {
        id: 'ek-k-5',
        label: {
          de: 'Jacke / Strickjäckchen (je nach Saison)',
          en: 'Jacket or cardigan (depending on the season)',
        },
      },
    ],
  },
  {
    id: 'praktisch',
    emoji: '⭐',
    title: { de: 'Sehr praktisch', en: 'Very useful' },
    prioritaet: 'nice',
    items: [
      {
        id: 'ek-pr-1',
        label: { de: 'Babyphone', en: 'Baby monitor' },
        tip: {
          de: 'Wenn Schlafzimmer und Kinderzimmer getrennt sind',
          en: 'For when the bedroom and the nursery are separate rooms',
        },
      },
      {
        id: 'ek-pr-2',
        label: { de: 'Weißes Rauschen / Einschlafhilfe', en: 'White noise / sleep aid' },
      },
      {
        id: 'ek-pr-3',
        label: { de: 'Wickelrucksack', en: 'Changing backpack' },
      },
      {
        id: 'ek-pr-4',
        label: {
          de: 'Maxi-Cosi Reisesystem (mit Kinderwagen kompatibel)',
          en: 'Infant car seat travel system (pram-compatible)',
        },
      },
      {
        id: 'ek-pr-5',
        label: { de: 'Babyschaukel oder Wippe', en: 'Baby swing or bouncer' },
      },
      {
        id: 'ek-pr-6',
        label: { de: 'Schnuller (2-3x)', en: 'Pacifiers (2-3x)' },
        tip: {
          de: 'Stillt Saugbedürfnis — nicht alle Babys nehmen einen',
          en: 'Soothes the sucking reflex — not every baby will take one',
        },
      },
    ],
  },
  {
    id: 'ueberschaetzt',
    emoji: '🤷',
    title: { de: 'Oft überschätzt', en: 'Often overrated' },
    prioritaet: 'skip',
    items: [
      {
        id: 'ek-ü-1',
        label: { de: 'Sterilisator', en: 'Bottle sterilizer' },
        tip: {
          de: 'Kochen oder Mikrowellen-Sterilisator reicht völlig aus',
          en: 'Boiling or a microwave sterilizer is more than enough',
        },
      },
      {
        id: 'ek-ü-2',
        label: { de: 'Windeleimer mit Spezialkassette', en: 'Nappy bin with special cartridges' },
        tip: {
          de: 'Normaler Mülleimer mit Deckel tut\'s auch',
          en: 'A normal bin with a lid does the job',
        },
      },
      {
        id: 'ek-ü-3',
        label: { de: 'Wärmestation / Wickelwärmer', en: 'Wipe warmer / changing-table heater' },
      },
      {
        id: 'ek-ü-4',
        label: { de: 'Kinderzimmer-Komplettausstattung', en: 'A full nursery set-up' },
        tip: {
          de: 'Baby schläft die ersten Monate sowieso bei euch im Zimmer',
          en: 'The baby sleeps in your room for the first months anyway',
        },
      },
      {
        id: 'ek-ü-5',
        label: {
          de: 'Viele verschiedene Spielzeuge (Neugeborene)',
          en: 'Lots of different toys (for newborns)',
        },
        tip: {
          de: 'Babys brauchen die ersten Wochen vor allem euch — kein Spielzeug nötig',
          en: 'In the first weeks babies need you above all — no toys needed',
        },
      },
    ],
  },
]

export function getEinkaufKategorieTitle(category: EinkaufKategorie, locale: Locale): string {
  return localized(category.title, locale)
}

export function getEinkaufItemLabel(item: EinkaufItem, locale: Locale): string {
  return localized(item.label, locale)
}

export function getEinkaufItemTip(item: EinkaufItem, locale: Locale): string | undefined {
  return item.tip ? localized(item.tip, locale) : undefined
}
