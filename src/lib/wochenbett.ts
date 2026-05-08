import type { Locale } from './i18n/types'
import type { LocalizedString } from './i18n/localized'
import { localized } from './i18n/localized'

export type WochenbettItem = {
  id: string
  label: LocalizedString
  tip?: LocalizedString
}

export type WochenbettKategorie = {
  id: string
  emoji: string
  title: LocalizedString
  items: WochenbettItem[]
}

export const WOCHENBETT_KATEGORIEN: WochenbettKategorie[] = [
  {
    id: 'mama_pflege',
    emoji: '💆',
    title: { de: 'Mama-Pflege & Heilung', en: 'Mom care & healing' },
    items: [
      {
        id: 'wb-mp-1',
        label: { de: 'Große Wochenbetteinlagen (für 4-6 Wochen)', en: 'Large postpartum pads (for 4-6 weeks)' },
        tip: {
          de: 'Du wirst mehr brauchen als du denkst. Der Wochenfluss dauert 4-6 Wochen.',
          en: "You'll need more than you think. Lochia flow lasts 4-6 weeks.",
        },
      },
      {
        id: 'wb-mp-2',
        label: { de: 'Einweg-Unterhosen oder alte Unterwäsche', en: 'Disposable underwear or old underwear' },
      },
      {
        id: 'wb-mp-3',
        label: { de: 'Heilsalbe für Dammnaht/Kaiserschnitt-Narbe', en: 'Healing ointment for perineal stitches / C-section scar' },
        tip: {
          de: 'Bei Kaiserschnitt: Bepanthen oder spezielle Narbenpflege. Bei Dammriss: was die Hebamme empfiehlt.',
          en: 'For C-section: Bepanthen or scar-care cream. For tears: what the midwife recommends.',
        },
      },
      {
        id: 'wb-mp-4',
        label: { de: 'Kühlpads (im Tiefkühler bereit)', en: 'Cooling pads (ready in freezer)' },
        tip: {
          de: 'Hilft enorm bei Schwellungen und Schmerzen.',
          en: 'Hugely helpful for swelling and pain.',
        },
      },
      {
        id: 'wb-mp-5',
        label: { de: 'Sitzkissen / Hämorrhoidenring', en: 'Donut cushion / hemorrhoid ring' },
        tip: {
          de: 'Sitzen ist die ersten Tage oft unangenehm.',
          en: 'Sitting is often uncomfortable in the first days.',
        },
      },
      {
        id: 'wb-mp-6',
        label: { de: 'Po-Dusche oder Bidet-Aufsatz', en: 'Peri-bottle or bidet attachment' },
        tip: {
          de: 'Sanftere Reinigung als Toilettenpapier — ein Gamechanger.',
          en: 'Gentler than toilet paper — a real game-changer.',
        },
      },
      {
        id: 'wb-mp-7',
        label: { de: 'Bequeme Schlafanzüge mit Knöpfen vorne', en: 'Comfy pajamas with front buttons' },
        tip: {
          de: 'Wichtig fürs Stillen ohne Verrenkungen.',
          en: 'Important for breastfeeding without contorting.',
        },
      },
      {
        id: 'wb-mp-8',
        label: { de: 'Bauchgurt / Recovery-Bauchband (optional)', en: 'Belly band / recovery wrap (optional)' },
      },
    ],
  },
  {
    id: 'stillen',
    emoji: '🤱',
    title: { de: 'Stillen & Brustpflege', en: 'Breastfeeding & breast care' },
    items: [
      {
        id: 'wb-st-1',
        label: { de: 'Stillkissen', en: 'Nursing pillow' },
        tip: {
          de: 'Großer Helfer: schützt Rücken und unterstützt das Baby.',
          en: 'Big helper: saves your back, supports baby.',
        },
      },
      {
        id: 'wb-st-2',
        label: { de: 'Stilleinlagen (waschbare oder Einweg)', en: 'Breast pads (washable or disposable)' },
      },
      {
        id: 'wb-st-3',
        label: { de: 'Brustwarzensalbe (Lanolin)', en: 'Nipple cream (lanolin)' },
        tip: {
          de: "Multimam, Lansinoh oder gleichwertig. Auch für Babys Mund unbedenklich.",
          en: "Multimam, Lansinoh or equivalent. Safe for baby's mouth too.",
        },
      },
      {
        id: 'wb-st-4',
        label: { de: 'Stillhütchen (im Notfall)', en: 'Nipple shields (just in case)' },
      },
      {
        id: 'wb-st-5',
        label: { de: 'Stilltee (z.B. mit Bockshornklee)', en: 'Nursing tea (e.g. fenugreek)' },
      },
      {
        id: 'wb-st-6',
        label: { de: 'Quark-Wickel oder kühlende Brustkompressen', en: 'Quark compresses or cooling breast pads' },
        tip: {
          de: 'Hilft bei Milcheinschuss und Schwellungen.',
          en: 'Helps with engorgement and swelling.',
        },
      },
      {
        id: 'wb-st-7',
        label: { de: 'Milchpumpe (manuell oder elektrisch)', en: 'Breast pump (manual or electric)' },
      },
      {
        id: 'wb-st-8',
        label: { de: 'Aufbewahrungsbeutel für Muttermilch', en: 'Breast milk storage bags' },
      },
      {
        id: 'wb-st-9',
        label: { de: 'Still-BHs (mind. 3x)', en: 'Nursing bras (at least 3)' },
      },
    ],
  },
  {
    id: 'mama_alltag',
    emoji: '🧘',
    title: { de: 'Mama-Alltag', en: 'Daily life for mom' },
    items: [
      {
        id: 'wb-ma-1',
        label: { de: 'Trinkflasche fürs Bett', en: 'Water bottle for bedside' },
        tip: {
          de: 'Stillen macht riesigen Durst — immer in Reichweite halten.',
          en: "Breastfeeding makes you so thirsty — keep one within reach.",
        },
      },
      {
        id: 'wb-ma-2',
        label: { de: 'Snacks für nachts', en: 'Snacks for night feedings' },
        tip: {
          de: 'Nüsse, Müsliriegel, Bananen — wenn du um 3 Uhr stillst.',
          en: "Nuts, granola bars, bananas — for when you're feeding at 3 AM.",
        },
      },
      {
        id: 'wb-ma-3',
        label: { de: 'Aufgeladenes Handy + Ladekabel am Bett', en: 'Charged phone + cable at bedside' },
      },
      {
        id: 'wb-ma-4',
        label: { de: 'Buch / Hörbuch / Podcast-Liste', en: 'Book / audiobook / podcast list' },
      },
      {
        id: 'wb-ma-5',
        label: { de: 'Tagebuch oder Notiz-App', en: 'Journal or notes app' },
        tip: {
          de: 'Erinnere dich später an die kleinen Momente.',
          en: "You'll want to remember the small moments later.",
        },
      },
      {
        id: 'wb-ma-6',
        label: { de: 'Dunkler Vorhang fürs Schlafzimmer', en: 'Blackout curtain for bedroom' },
        tip: {
          de: 'Tagsüber schlafen wird wichtig.',
          en: 'Daytime napping becomes important.',
        },
      },
    ],
  },
  {
    id: 'ernaehrung',
    emoji: '🍲',
    title: { de: 'Ernährung & Vorratshaltung', en: 'Nutrition & meal prep' },
    items: [
      {
        id: 'wb-er-1',
        label: { de: 'Vorgekochte Mahlzeiten im Tiefkühler', en: 'Pre-cooked meals in freezer' },
        tip: {
          de: 'Mind. 1-2 Wochen vorbereiten — du hast keine Zeit zu kochen.',
          en: 'Prep at least 1-2 weeks worth — no time to cook.',
        },
      },
      {
        id: 'wb-er-2',
        label: { de: 'Lieferdienst-Apps eingerichtet', en: 'Delivery apps set up' },
      },
      {
        id: 'wb-er-3',
        label: { de: 'Vitamine (Folsäure, Eisen, Vitamin D)', en: 'Vitamins (folate, iron, vitamin D)' },
        tip: {
          de: 'Fortsetzung nach der Geburt, besonders beim Stillen.',
          en: 'Continue after birth, especially while breastfeeding.',
        },
      },
      {
        id: 'wb-er-4',
        label: { de: 'Stilltee, Beruhigungstee', en: 'Nursing tea, calming tea' },
      },
      {
        id: 'wb-er-5',
        label: { de: 'Hilfe für Einkäufe organisieren', en: 'Arrange grocery help' },
        tip: {
          de: 'Familie, Freunde, Liefergutscheine — sag nicht "alles gut", wenn es nicht so ist.',
          en: "Family, friends, grocery delivery — don't pretend you're fine when you're not.",
        },
      },
    ],
  },
  {
    id: 'kontakte',
    emoji: '📞',
    title: { de: 'Wichtige Kontakte', en: 'Key contacts' },
    items: [
      {
        id: 'wb-ko-1',
        label: { de: 'Wochenbett-Hebamme: Nummer + Termine', en: 'Postpartum midwife: number + visits' },
        tip: {
          de: 'Sie kommt zu dir nach Hause — die wichtigste Person der ersten Wochen.',
          en: 'She comes to your home — the most important person of the early weeks.',
        },
      },
      {
        id: 'wb-ko-2',
        label: { de: 'Kinderarzt + U2/U3-Termine geplant', en: 'Pediatrician + first checkups scheduled' },
      },
      {
        id: 'wb-ko-3',
        label: { de: 'Frauenarzt: Kontroll-Termin nach 6 Wochen', en: 'Gynecologist: 6-week postpartum check' },
      },
      {
        id: 'wb-ko-4',
        label: { de: 'Stillberaterin / IBCLC bei Problemen', en: 'Lactation consultant / IBCLC for issues' },
      },
      {
        id: 'wb-ko-5',
        label: { de: 'Krankenkasse / Beihilfe / Standesamt', en: 'Health insurance / registry office' },
        tip: {
          de: 'Geburtsurkunde, Krankenversicherung fürs Baby, Elterngeld-Antrag.',
          en: 'Birth certificate, baby insurance, parental allowance.',
        },
      },
      {
        id: 'wb-ko-6',
        label: { de: 'Notfall-Nummer der Klinik', en: 'Emergency number of the clinic' },
      },
    ],
  },
  {
    id: 'beziehung',
    emoji: '💞',
    title: { de: 'Beziehung & Mental Health', en: 'Relationship & mental health' },
    items: [
      {
        id: 'wb-be-1',
        label: { de: 'Nachts abwechseln klar geregelt', en: 'Clear night-shift rotation agreed' },
      },
      {
        id: 'wb-be-2',
        label: { de: 'Besuche vorab regeln (Wer? Wann? Wie lange?)', en: 'Visits planned (who, when, how long)' },
        tip: {
          de: 'Du darfst auch nein sagen. Die ersten 2 Wochen gehören euch dreien.',
          en: "You're allowed to say no. The first 2 weeks belong to the three of you.",
        },
      },
      {
        id: 'wb-be-3',
        label: { de: 'Wochenbett-Depression: Anzeichen kennen', en: 'Know the signs of postpartum depression' },
        tip: {
          de: 'Anhaltende Traurigkeit > 2 Wochen, Antriebslosigkeit, Schuldgefühle: bitte zur Hebamme oder zum Arzt.',
          en: 'Persistent sadness > 2 weeks, low energy, guilt: please reach out to midwife or doctor.',
        },
      },
      {
        id: 'wb-be-4',
        label: { de: 'Telefonnummer für Krise / Hilfetelefon', en: 'Crisis hotline number on hand' },
        tip: {
          de: 'In Deutschland: 0800-1110111 (kostenlos, 24/7).',
          en: 'In Germany: 0800-1110111 (free, 24/7).',
        },
      },
    ],
  },
]

export function getWochenbettKategorieTitle(category: WochenbettKategorie, locale: Locale): string {
  return localized(category.title, locale)
}

export function getWochenbettItemLabel(item: WochenbettItem, locale: Locale): string {
  return localized(item.label, locale)
}

export function getWochenbettItemTip(item: WochenbettItem, locale: Locale): string | undefined {
  return item.tip ? localized(item.tip, locale) : undefined
}
