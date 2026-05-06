export type EinkaufItem = {
  id: string
  label: string
  tip?: string
}

export type EinkaufKategorie = {
  id: string
  emoji: string
  title: string
  prioritaet: 'must' | 'nice' | 'skip'
  items: EinkaufItem[]
}

export const EINKAUF_KATEGORIEN: EinkaufKategorie[] = [
  {
    id: 'schlaf',
    emoji: '😴',
    title: 'Schlafen',
    prioritaet: 'must',
    items: [
      { id: 'ek-s-1', label: 'Babybett oder Reisebett', tip: 'Ab Geburt nötig. Beistellbett sehr praktisch für Nächte' },
      { id: 'ek-s-2', label: 'Matratze (passend zum Bett)' },
      { id: 'ek-s-3', label: 'Spannbettlaken (2-3x)' },
      { id: 'ek-s-4', label: 'Schlafsack (passend zur Jahreszeit)', tip: 'Kein loses Bettzeug für Babys unter 1 Jahr!' },
    ],
  },
  {
    id: 'transport',
    emoji: '🚗',
    title: 'Transport',
    prioritaet: 'must',
    items: [
      { id: 'ek-t-1', label: 'Autositz Gruppe 0+ (bis 13 kg)', tip: 'Pflicht ab dem ersten Tag! Am besten vor der Geburt montieren lassen' },
      { id: 'ek-t-2', label: 'Kinderwagen oder Buggy', tip: 'Oder Babytrage als günstigere Alternative für die ersten Monate' },
      { id: 'ek-t-3', label: 'Babytrage oder Tragetuch', tip: 'Sehr beruhigend für Babys — du hast die Hände frei' },
      { id: 'ek-t-4', label: 'Regenschutz für Kinderwagen' },
    ],
  },
  {
    id: 'pflege',
    emoji: '🛁',
    title: 'Pflege & Hygiene',
    prioritaet: 'must',
    items: [
      { id: 'ek-p-1', label: 'Babybadewanne' },
      { id: 'ek-p-2', label: 'Windeln Gr. 1 (Neugeborene), großer Vorrat' },
      { id: 'ek-p-3', label: 'Feuchttücher (parfümfrei), 5-10 Packungen' },
      { id: 'ek-p-4', label: 'Wundschutzcreme (Bepanthen o.ä.)' },
      { id: 'ek-p-5', label: 'Wickelunterlage + Bezüge' },
      { id: 'ek-p-6', label: 'Babybadethermometer' },
      { id: 'ek-p-7', label: 'Nagelschere oder Nagelfeile (Baby)' },
      { id: 'ek-p-8', label: 'Nasensauger' },
    ],
  },
  {
    id: 'stillen',
    emoji: '🤱',
    title: 'Stillen & Ernährung',
    prioritaet: 'must',
    items: [
      { id: 'ek-st-1', label: 'Still-BH (2-3x)' },
      { id: 'ek-st-2', label: 'Stilleinlagen' },
      { id: 'ek-st-3', label: 'Stillkissen', tip: 'Riesenhilfe! Auch als Lagerungskissen für das Baby nutzbar' },
      { id: 'ek-st-4', label: 'Milchpumpe (manuell oder elektrisch)', tip: 'Sehr praktisch für unterwegs oder bei Überangebot' },
      { id: 'ek-st-5', label: 'Milchbeutel zum Einfrieren' },
      { id: 'ek-st-6', label: 'Flaschen + Sauger (auch wenn du stillst)', tip: 'Für Notfälle, Rücklagen oder wenn der Partner übernimmt' },
    ],
  },
  {
    id: 'kleidung',
    emoji: '👕',
    title: 'Kleidung',
    prioritaet: 'must',
    items: [
      { id: 'ek-k-1', label: 'Bodys (5-7x), Gr. 50-56', tip: 'Babys wachsen schnell — nicht zu viel kaufen!' },
      { id: 'ek-k-2', label: 'Strampler / Schlafanzüge (5-7x)' },
      { id: 'ek-k-3', label: 'Socken (5-6 Paar)' },
      { id: 'ek-k-4', label: 'Mützchen (2-3x)' },
      { id: 'ek-k-5', label: 'Jacke / Strickjäckchen (je nach Saison)' },
    ],
  },
  {
    id: 'praktisch',
    emoji: '⭐',
    title: 'Sehr praktisch',
    prioritaet: 'nice',
    items: [
      { id: 'ek-pr-1', label: 'Babyphone', tip: 'Wenn Schlafzimmer und Kinderzimmer getrennt sind' },
      { id: 'ek-pr-2', label: 'Weißes Rauschen / Einschlafhilfe' },
      { id: 'ek-pr-3', label: 'Wickelrucksack' },
      { id: 'ek-pr-4', label: 'Maxi-Cosi Reisesystem (mit Kinderwagen kompatibel)' },
      { id: 'ek-pr-5', label: 'Babyschaukel oder Wippe' },
      { id: 'ek-pr-6', label: 'Schnuller (2-3x)', tip: 'Stillt Saugbedürfnis — nicht alle Babys nehmen einen' },
    ],
  },
  {
    id: 'ueberschaetzt',
    emoji: '🤷',
    title: 'Oft überschätzt',
    prioritaet: 'skip',
    items: [
      { id: 'ek-ü-1', label: 'Sterilisator', tip: 'Kochen oder Mikrowellen-Sterilisator reicht völlig aus' },
      { id: 'ek-ü-2', label: 'Windeleimer mit Spezialkassette', tip: 'Normaler Mülleimer mit Deckel tut\'s auch' },
      { id: 'ek-ü-3', label: 'Wärmestation / Wickelwärmer' },
      { id: 'ek-ü-4', label: 'Kinderzimmer-Komplettausstattung', tip: 'Baby schläft die ersten Monate sowieso bei euch im Zimmer' },
      { id: 'ek-ü-5', label: 'Viele verschiedene Spielzeuge (Neugeborene)', tip: 'Babys brauchen die ersten Wochen vor allem euch — kein Spielzeug nötig' },
    ],
  },
]
