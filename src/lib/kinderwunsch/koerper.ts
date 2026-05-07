import type { LocalizedString } from '@/lib/i18n/localized'

export type KoerperItem = {
  id: string
  label: LocalizedString
  tip?: LocalizedString
}

export type KoerperKategorie = {
  id: string
  emoji: string
  title: LocalizedString
  items: KoerperItem[]
}

export const KOERPER_KATEGORIEN: KoerperKategorie[] = [
  {
    id: 'allgemein',
    emoji: '🌿',
    title: { de: 'Lifestyle vorbereiten', en: 'Prepare your lifestyle' },
    items: [
      {
        id: 'kw-k-1',
        label: { de: 'Folsäure einnehmen (400–800 µg täglich)', en: 'Take folic acid (400–800 µg daily)' },
        tip: {
          de: 'Mindestens 4 Wochen vor der geplanten Konzeption starten — Folsäure schützt das Neuralrohr des Babys schon in den ersten Wochen.',
          en: 'Start at least 4 weeks before you plan to conceive — folic acid protects the baby\'s neural tube in those very first weeks.',
        },
      },
      {
        id: 'kw-k-2',
        label: { de: 'Alkohol weglassen oder deutlich reduzieren', en: 'Cut out alcohol or reduce it significantly' },
        tip: {
          de: 'Es gibt keine "sichere" Menge in der Schwangerschaft — also ist die Umstellung jetzt schon sinnvoll.',
          en: 'There is no "safe" amount during pregnancy — so it makes sense to start adjusting now.',
        },
      },
      {
        id: 'kw-k-3',
        label: { de: 'Rauchen aufhören (auch der Partner)', en: 'Quit smoking (your partner too)' },
        tip: {
          de: 'Passivrauchen senkt die Fruchtbarkeit nachweislich. Auch der Partner profitiert von einem Stopp — Spermienqualität verbessert sich nach 3 Monaten deutlich.',
          en: 'Secondhand smoke is proven to lower fertility. Your partner benefits too — sperm quality improves noticeably after 3 months smoke-free.',
        },
      },
      {
        id: 'kw-k-4',
        label: { de: 'Koffein im Blick haben (max. 200 mg/Tag)', en: 'Watch your caffeine intake (max. 200 mg/day)' },
        tip: {
          de: 'Das sind ca. 2 Tassen Kaffee. In der frühen Schwangerschaft hilft es, schon jetzt umzusteigen.',
          en: 'That\'s about 2 cups of coffee. It helps to make the switch now, before early pregnancy.',
        },
      },
      {
        id: 'kw-k-5',
        label: { de: 'Gesundes Gewicht anstreben (BMI 19–25)', en: 'Aim for a healthy weight (BMI 19–25)' },
        tip: {
          de: 'Sowohl Untergewicht als auch starkes Übergewicht können den Zyklus stören. Kein Diät-Druck — nur ein freundlicher Check.',
          en: 'Both underweight and significant overweight can disrupt your cycle. No diet pressure — just a gentle check-in.',
        },
      },
      {
        id: 'kw-k-6',
        label: { de: 'Regelmäßige, moderate Bewegung', en: 'Regular, moderate movement' },
        tip: {
          de: 'Yoga, Schwimmen, Spaziergänge — alles was Stress senkt und den Kreislauf in Schwung bringt.',
          en: 'Yoga, swimming, long walks — anything that lowers stress and gets your circulation going.',
        },
      },
      {
        id: 'kw-k-7',
        label: { de: 'Stress reduzieren (Meditation, Schlaf)', en: 'Reduce stress (meditation, sleep)' },
        tip: {
          de: 'Hoher Cortisolspiegel kann den Zyklus beeinflussen. 10 Minuten Meditation am Tag machen einen Unterschied.',
          en: 'High cortisol levels can affect your cycle. Even 10 minutes of meditation a day makes a difference.',
        },
      },
    ],
  },
  {
    id: 'termine',
    emoji: '📅',
    title: { de: 'Wichtige Arzttermine', en: 'Important medical appointments' },
    items: [
      {
        id: 'kw-t-1',
        label: { de: 'Zahnarzt-Check + professionelle Reinigung', en: 'Dental check-up + professional cleaning' },
        tip: {
          de: 'In der Schwangerschaft sind viele Zahnbehandlungen riskanter. Erledige Bohren und Reinigungen JETZT.',
          en: 'Many dental treatments carry more risk during pregnancy. Get fillings and cleanings done NOW.',
        },
      },
      {
        id: 'kw-t-2',
        label: { de: 'Frauenarzt: Kinderwunschsprechstunde', en: 'Gynecologist: pre-conception consultation' },
        tip: {
          de: 'Auch ohne aktuelle Beschwerden — ein Beratungsgespräch räumt Fragen vorab aus dem Weg.',
          en: 'Even without any current concerns — a consultation clears up questions before they become worries.',
        },
      },
      {
        id: 'kw-t-3',
        label: { de: 'Hausarzt: Allgemeiner Check + Impfstatus', en: 'GP: general check-up + vaccination status' },
        tip: {
          de: 'Lass auch Schilddrüse, Eisen und Vitamin D prüfen. Mängel lassen sich vor SS leichter ausgleichen.',
          en: 'Get your thyroid, iron, and vitamin D checked too. Deficiencies are much easier to fix before pregnancy.',
        },
      },
      {
        id: 'kw-t-4',
        label: { de: 'Augenarzt (bei Bedarf)', en: 'Eye doctor (if needed)' },
        tip: {
          de: 'Sehkraft kann sich in der Schwangerschaft verändern. Falls eine Korrektur nötig ist, lieber jetzt machen.',
          en: 'Your vision can change during pregnancy. If you need a new prescription, it\'s better to sort it now.',
        },
      },
    ],
  },
  {
    id: 'impfungen',
    emoji: '💉',
    title: { de: 'Impfungen prüfen', en: 'Check your vaccinations' },
    items: [
      {
        id: 'kw-i-1',
        label: { de: 'Röteln-Schutz (mind. 4 Wochen vor SS)', en: 'Rubella immunity (at least 4 weeks before pregnancy)' },
        tip: {
          de: 'Röteln in der frühen SS können dem Baby schwer schaden. Falls keine 2 Impfungen dokumentiert sind: nachholen.',
          en: 'Rubella in early pregnancy can seriously harm the baby. If you don\'t have 2 documented vaccinations: get them updated.',
        },
      },
      {
        id: 'kw-i-2',
        label: { de: 'Windpocken-Immunität', en: 'Chickenpox (varicella) immunity' },
        tip: {
          de: 'Wenn du nie Windpocken hattest und nicht geimpft bist: Auffrischung jetzt, vor der Schwangerschaft.',
          en: 'If you never had chickenpox and aren\'t vaccinated: get the shot now, before pregnancy.',
        },
      },
      {
        id: 'kw-i-3',
        label: { de: 'Masern-Mumps-Röteln (MMR)', en: 'Measles-Mumps-Rubella (MMR)' },
        tip: {
          de: 'Eine MMR-Auffrischung ist häufig sinnvoll — frag deinen Hausarzt.',
          en: 'An MMR booster is often a good idea — ask your GP.',
        },
      },
      {
        id: 'kw-i-4',
        label: { de: 'Keuchhusten (Pertussis)', en: 'Whooping cough (pertussis)' },
        tip: {
          de: 'Wird auch in der SS empfohlen, aber eine Auffrischung vorher schadet nicht.',
          en: 'It\'s also recommended during pregnancy, but a booster beforehand can\'t hurt.',
        },
      },
      {
        id: 'kw-i-5',
        label: { de: 'Grippe-Impfung (saisonal)', en: 'Flu shot (seasonal)' },
        tip: {
          de: 'In der Schwangerschaft empfohlen — falls Saison ist, kannst du sie vorab bekommen.',
          en: 'Recommended during pregnancy — if it\'s flu season, you can get it ahead of time.',
        },
      },
    ],
  },
  {
    id: 'vorerkrankungen',
    emoji: '🩺',
    title: { de: 'Vorerkrankungen abklären', en: 'Address pre-existing conditions' },
    items: [
      {
        id: 'kw-v-1',
        label: { de: 'Schilddrüsenwerte prüfen (TSH)', en: 'Check thyroid levels (TSH)' },
        tip: {
          de: 'Eine unentdeckte Schilddrüsenstörung kann Fruchtbarkeit und Schwangerschaft beeinflussen.',
          en: 'An undetected thyroid disorder can affect both fertility and pregnancy.',
        },
      },
      {
        id: 'kw-v-2',
        label: { de: 'Diabetes-Risiko abklären', en: 'Check your diabetes risk' },
        tip: {
          de: 'Bei familiärer Vorbelastung oder PCOS ein Blutzucker-Check vor der Schwangerschaft.',
          en: 'If diabetes runs in the family or you have PCOS, get a blood sugar check before pregnancy.',
        },
      },
      {
        id: 'kw-v-3',
        label: { de: 'Bei familiärer genetischer Vorbelastung: Beratung', en: 'Genetic counseling if there\'s a family history' },
        tip: {
          de: 'Genetische Beratung ist nicht nur für seltene Krankheiten — sie kann auch Sorgen ausräumen.',
          en: 'Genetic counseling isn\'t just for rare diseases — it can also put your worries to rest.',
        },
      },
      {
        id: 'kw-v-4',
        label: { de: 'Medikamente überprüfen lassen', en: 'Have your medications reviewed' },
        tip: {
          de: 'Manche Medikamente sind in der SS nicht erlaubt. Frag VORHER, ob deine umgestellt werden müssen.',
          en: 'Some medications aren\'t safe during pregnancy. Ask BEFORE you conceive whether yours need to change.',
        },
      },
      {
        id: 'kw-v-5',
        label: { de: 'Chronische Erkrankungen einstellen', en: 'Stabilize chronic conditions' },
        tip: {
          de: 'Asthma, Bluthochdruck, Migräne — vor der SS optimal eingestellt zu sein erspart Stress.',
          en: 'Asthma, high blood pressure, migraines — being well-managed before pregnancy saves a lot of stress.',
        },
      },
    ],
  },
  {
    id: 'organisatorisch',
    emoji: '📋',
    title: { de: 'Organisatorisches', en: 'Practical matters' },
    items: [
      {
        id: 'kw-o-1',
        label: { de: 'Krankenkassen-Tarif prüfen (Privat/GKV)', en: 'Review your health insurance plan (private/statutory)' },
        tip: {
          de: 'Je nach Tarif unterscheiden sich Leistungen wie Hebammen-Suche, Hausgeburt, Vorsorge.',
          en: 'Coverage varies — midwife access, home births, and prenatal care can differ depending on your plan.',
        },
      },
      {
        id: 'kw-o-2',
        label: { de: 'Arbeitsplatz-Risiken klären', en: 'Clarify workplace risks' },
        tip: {
          de: 'Schichtarbeit, Chemikalien, schweres Heben? Sprich mit deinem Arzt über die Auswirkungen.',
          en: 'Shift work, chemicals, heavy lifting? Talk to your doctor about how it might affect you.',
        },
      },
      {
        id: 'kw-o-3',
        label: { de: 'Versicherungsschutz prüfen', en: 'Check your insurance coverage' },
        tip: {
          de: 'Berufsunfähigkeit, Risikolebensversicherung — vor SS abschließen ist günstiger und einfacher.',
          en: 'Disability and life insurance — getting them before pregnancy is cheaper and easier.',
        },
      },
      {
        id: 'kw-o-4',
        label: { de: 'Finanziellen Notgroschen aufbauen', en: 'Build a financial safety net' },
        tip: {
          de: 'Elternzeit + Kinderkosten verändern das Budget. Ein Polster für 6 Monate gibt Ruhe.',
          en: 'Parental leave plus baby expenses will change your budget. A 6-month cushion brings peace of mind.',
        },
      },
    ],
  },
]
