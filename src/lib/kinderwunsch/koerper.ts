export type KoerperItem = {
  id: string
  label: string
  tip?: string
}

export type KoerperKategorie = {
  id: string
  emoji: string
  title: string
  items: KoerperItem[]
}

export const KOERPER_KATEGORIEN: KoerperKategorie[] = [
  {
    id: 'allgemein',
    emoji: '🌿',
    title: 'Lifestyle vorbereiten',
    items: [
      { id: 'kw-k-1', label: 'Folsäure einnehmen (400–800 µg täglich)', tip: 'Mindestens 4 Wochen vor der geplanten Konzeption starten — Folsäure schützt das Neuralrohr des Babys schon in den ersten Wochen.' },
      { id: 'kw-k-2', label: 'Alkohol weglassen oder deutlich reduzieren', tip: 'Es gibt keine "sichere" Menge in der Schwangerschaft — also ist die Umstellung jetzt schon sinnvoll.' },
      { id: 'kw-k-3', label: 'Rauchen aufhören (auch der Partner)', tip: 'Passivrauchen senkt die Fruchtbarkeit nachweislich. Auch der Partner profitiert von einem Stopp — Spermienqualität verbessert sich nach 3 Monaten deutlich.' },
      { id: 'kw-k-4', label: 'Koffein im Blick haben (max. 200 mg/Tag)', tip: 'Das sind ca. 2 Tassen Kaffee. In der frühen Schwangerschaft hilft es, schon jetzt umzusteigen.' },
      { id: 'kw-k-5', label: 'Gesundes Gewicht anstreben (BMI 19–25)', tip: 'Sowohl Untergewicht als auch starkes Übergewicht können den Zyklus stören. Kein Diät-Druck — nur ein freundlicher Check.' },
      { id: 'kw-k-6', label: 'Regelmäßige, moderate Bewegung', tip: 'Yoga, Schwimmen, Spaziergänge — alles was Stress senkt und den Kreislauf in Schwung bringt.' },
      { id: 'kw-k-7', label: 'Stress reduzieren (Meditation, Schlaf)', tip: 'Hoher Cortisolspiegel kann den Zyklus beeinflussen. 10 Minuten Meditation am Tag machen einen Unterschied.' },
    ],
  },
  {
    id: 'termine',
    emoji: '📅',
    title: 'Wichtige Arzttermine',
    items: [
      { id: 'kw-t-1', label: 'Zahnarzt-Check + professionelle Reinigung', tip: 'In der Schwangerschaft sind viele Zahnbehandlungen riskanter. Erledige Bohren und Reinigungen JETZT.' },
      { id: 'kw-t-2', label: 'Frauenarzt: Kinderwunschsprechstunde', tip: 'Auch ohne aktuelle Beschwerden — ein Beratungsgespräch räumt Fragen vorab aus dem Weg.' },
      { id: 'kw-t-3', label: 'Hausarzt: Allgemeiner Check + Impfstatus', tip: 'Lass auch Schilddrüse, Eisen und Vitamin D prüfen. Mängel lassen sich vor SS leichter ausgleichen.' },
      { id: 'kw-t-4', label: 'Augenarzt (bei Bedarf)', tip: 'Sehkraft kann sich in der Schwangerschaft verändern. Falls eine Korrektur nötig ist, lieber jetzt machen.' },
    ],
  },
  {
    id: 'impfungen',
    emoji: '💉',
    title: 'Impfungen prüfen',
    items: [
      { id: 'kw-i-1', label: 'Röteln-Schutz (mind. 4 Wochen vor SS)', tip: 'Röteln in der frühen SS können dem Baby schwer schaden. Falls keine 2 Impfungen dokumentiert sind: nachholen.' },
      { id: 'kw-i-2', label: 'Windpocken-Immunität', tip: 'Wenn du nie Windpocken hattest und nicht geimpft bist: Auffrischung jetzt, vor der Schwangerschaft.' },
      { id: 'kw-i-3', label: 'Masern-Mumps-Röteln (MMR)', tip: 'Eine MMR-Auffrischung ist häufig sinnvoll — frag deinen Hausarzt.' },
      { id: 'kw-i-4', label: 'Keuchhusten (Pertussis)', tip: 'Wird auch in der SS empfohlen, aber eine Auffrischung vorher schadet nicht.' },
      { id: 'kw-i-5', label: 'Grippe-Impfung (saisonal)', tip: 'In der Schwangerschaft empfohlen — falls Saison ist, kannst du sie vorab bekommen.' },
    ],
  },
  {
    id: 'vorerkrankungen',
    emoji: '🩺',
    title: 'Vorerkrankungen abklären',
    items: [
      { id: 'kw-v-1', label: 'Schilddrüsenwerte prüfen (TSH)', tip: 'Eine unentdeckte Schilddrüsenstörung kann Fruchtbarkeit und Schwangerschaft beeinflussen.' },
      { id: 'kw-v-2', label: 'Diabetes-Risiko abklären', tip: 'Bei familiärer Vorbelastung oder PCOS ein Blutzucker-Check vor der Schwangerschaft.' },
      { id: 'kw-v-3', label: 'Bei familiärer genetischer Vorbelastung: Beratung', tip: 'Genetische Beratung ist nicht nur für seltene Krankheiten — sie kann auch Sorgen ausräumen.' },
      { id: 'kw-v-4', label: 'Medikamente überprüfen lassen', tip: 'Manche Medikamente sind in der SS nicht erlaubt. Frag VORHER, ob deine umgestellt werden müssen.' },
      { id: 'kw-v-5', label: 'Chronische Erkrankungen einstellen', tip: 'Asthma, Bluthochdruck, Migräne — vor der SS optimal eingestellt zu sein erspart Stress.' },
    ],
  },
  {
    id: 'organisatorisch',
    emoji: '📋',
    title: 'Organisatorisches',
    items: [
      { id: 'kw-o-1', label: 'Krankenkassen-Tarif prüfen (Privat/GKV)', tip: 'Je nach Tarif unterscheiden sich Leistungen wie Hebammen-Suche, Hausgeburt, Vorsorge.' },
      { id: 'kw-o-2', label: 'Arbeitsplatz-Risiken klären', tip: 'Schichtarbeit, Chemikalien, schweres Heben? Sprich mit deinem Arzt über die Auswirkungen.' },
      { id: 'kw-o-3', label: 'Versicherungsschutz prüfen', tip: 'Berufsunfähigkeit, Risikolebensversicherung — vor SS abschließen ist günstiger und einfacher.' },
      { id: 'kw-o-4', label: 'Finanziellen Notgroschen aufbauen', tip: 'Elternzeit + Kinderkosten verändern das Budget. Ein Polster für 6 Monate gibt Ruhe.' },
    ],
  },
]
