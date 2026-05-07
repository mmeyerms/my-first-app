import type { LocalizedString } from '@/lib/i18n/localized'

export type AntiAngstKarte = {
  id: string
  emoji: string
  fear: LocalizedString
  fact: LocalizedString
}

export const ANTI_ANGST_KARTEN: AntiAngstKarte[] = [
  {
    id: 'aa-1',
    emoji: '⏰',
    fear: {
      de: 'Wir versuchen seit Monaten — was, wenn ich unfruchtbar bin?',
      en: 'We\'ve been trying for months — what if I\'m infertile?',
    },
    fact: {
      de: '80 % der Paare werden innerhalb von 12 Monaten schwanger. Erst nach einem Jahr (bzw. 6 Monaten ab 35) sprechen Ärzte überhaupt von Untersuchungsbedarf. Bis dahin: Geduld ist statistisch normal.',
      en: '80% of couples conceive within 12 months. Doctors don\'t even start considering testing before a full year has passed (or 6 months for women over 35). Until then: patience is statistically normal.',
    },
  },
  {
    id: 'aa-2',
    emoji: '🎂',
    fear: {
      de: 'Ich bin schon 35+ — bin ich zu alt?',
      en: 'I\'m already 35+ — am I too old?',
    },
    fact: {
      de: 'Die meisten Frauen über 35 werden ohne Probleme schwanger. Risiken steigen nur leicht und sind über Vorsorge gut beherrschbar. „Zu alt" gibt es nicht — nur „mit Plan B im Hinterkopf".',
      en: 'Most women over 35 get pregnant without issues. Risks only rise slightly and are easily managed with regular check-ups. There\'s no "too old" — only "having a Plan B in mind."',
    },
  },
  {
    id: 'aa-3',
    emoji: '🛡️',
    fear: {
      de: 'Was, wenn etwas schief geht?',
      en: 'What if something goes wrong?',
    },
    fact: {
      de: '85 % aller Schwangerschaften verlaufen komplikationslos. Frühe Vorsorge senkt das Restrisiko deutlich. Du bist statistisch sehr viel mehr im sicheren Bereich, als die Sorgenzeitschriften suggerieren.',
      en: '85% of all pregnancies are uncomplicated. Early prenatal care reduces the remaining risk significantly. Statistically, you\'re much more in the safe zone than worry-magazines would suggest.',
    },
  },
  {
    id: 'aa-4',
    emoji: '🍷',
    fear: {
      de: 'Ich habe vor dem positiven Test Alkohol getrunken — habe ich dem Baby geschadet?',
      en: 'I drank alcohol before the positive test — did I harm the baby?',
    },
    fact: {
      de: 'Vor der Einnistung gilt das „Alles-oder-Nichts-Prinzip": Entweder es überlebt unbeschadet oder es kommt erst gar nicht zur Schwangerschaft. Einzelne Vorkommnisse vor dem positiven Test sind extrem selten relevant.',
      en: 'Before implantation, the "all-or-nothing" principle applies: either the embryo survives undamaged or no pregnancy develops at all. Isolated incidents before the positive test are very rarely relevant.',
    },
  },
  {
    id: 'aa-5',
    emoji: '🤷',
    fear: {
      de: 'Ich habe das Gefühl, ich bin nicht bereit.',
      en: 'I feel like I\'m not ready.',
    },
    fact: {
      de: 'Niemand fühlt sich zu 100 % bereit. Das ist normal und kein Hinweis auf schlechte Eltern. Bereit-Sein ist ein Prozess, kein Zustand. Auch erfahrene Mütter sagen: „Ich wachse jeden Tag rein."',
      en: 'Nobody feels 100% ready. That\'s normal and not a sign of bad parents. Being ready is a process, not a state. Even experienced moms say: "I grow into it every day."',
    },
  },
  {
    id: 'aa-6',
    emoji: '💔',
    fear: {
      de: 'Was, wenn wir uns als Paar verlieren?',
      en: 'What if we lose each other as a couple?',
    },
    fact: {
      de: 'Studien zeigen: Paare, die VOR der Schwangerschaft offen über Erwartungen reden, haben deutlich stabilere Beziehungen nach der Geburt. Du bist gerade dabei — also schon einen Schritt voraus.',
      en: 'Studies show: couples who talk openly about expectations BEFORE pregnancy have noticeably more stable relationships after birth. You\'re doing it right now — so you\'re already a step ahead.',
    },
  },
  {
    id: 'aa-7',
    emoji: '💼',
    fear: {
      de: 'Was passiert mit meiner Karriere?',
      en: 'What happens to my career?',
    },
    fact: {
      de: 'Karriere und Mutterschaft schließen sich nicht aus. Viele Frauen berichten von erhöhter Effizienz und neuen Prioritäten nach der Elternzeit. Plus: Der Kündigungsschutz in der SS in Deutschland ist einer der stärksten weltweit.',
      en: 'Career and motherhood aren\'t mutually exclusive. Many women report greater efficiency and clearer priorities after parental leave. Plus: pregnancy job protection in Germany (Mutterschutz) is one of the strongest in the world.',
    },
  },
  {
    id: 'aa-8',
    emoji: '🧬',
    fear: {
      de: 'Ich habe eine genetische Vorbelastung in der Familie — wird das Baby gesund?',
      en: 'There\'s a genetic condition in our family — will the baby be healthy?',
    },
    fact: {
      de: 'Die meisten genetischen Vorbelastungen vererben sich nicht zwingend. Eine humangenetische Beratung VOR der SS gibt dir konkrete Risikozahlen — und in über 90 % der Fälle Entwarnung.',
      en: 'Most genetic predispositions are not automatically passed on. A genetic counseling session BEFORE pregnancy gives you concrete risk numbers — and reassurance in over 90% of cases.',
    },
  },
  {
    id: 'aa-9',
    emoji: '😴',
    fear: {
      de: 'Ich werde nie wieder schlafen können.',
      en: 'I\'ll never sleep again.',
    },
    fact: {
      de: 'Die ersten 3 Monate sind hart, ja. Aber: Babys schlafen schon nach wenigen Wochen mehrere Stunden am Stück. Das Klischee der ewig wachen Eltern stimmt nur teilweise — und du wirst überrascht sein, wie viel dein Körper plötzlich aushält.',
      en: 'The first 3 months are hard, yes. But: babies start sleeping several hours in a row after just a few weeks. The cliché of perpetually awake parents is only partly true — and you\'ll be surprised how much your body suddenly handles.',
    },
  },
  {
    id: 'aa-10',
    emoji: '💸',
    fear: {
      de: 'Wir können uns ein Kind nicht leisten.',
      en: 'We can\'t afford a child.',
    },
    fact: {
      de: 'Die Grundausstattung kostet weniger als gedacht (vieles gibt es gebraucht oder geliehen). Plus: Elterngeld + Kindergeld + Steuerersparnis federn 1–2 Jahre stark ab. Niemand wird reich von Kindern — aber alle schaffen es irgendwie.',
      en: 'Basic baby gear costs less than you think (much of it can be bought used or borrowed). Plus: parental allowance, child benefits, and tax breaks soften the first 1–2 years considerably. Nobody gets rich from kids — but somehow everyone manages.',
    },
  },
  {
    id: 'aa-11',
    emoji: '🤰',
    fear: {
      de: 'Was, wenn ich eine Fehlgeburt habe?',
      en: 'What if I have a miscarriage?',
    },
    fact: {
      de: 'Fehlgeburten passieren in 10–20 % der Schwangerschaften — meist sehr früh. Sie sind fast nie selbstverschuldet. Falls es passiert: Es bedeutet nicht, dass es nicht klappen wird. Die meisten Frauen werden danach erfolgreich schwanger.',
      en: 'Miscarriages happen in 10–20% of pregnancies — usually very early. They\'re almost never your fault. If it happens: it doesn\'t mean things won\'t work out. Most women go on to have successful pregnancies afterward.',
    },
  },
  {
    id: 'aa-12',
    emoji: '🏥',
    fear: {
      de: 'Ich habe Angst vor der Geburt selbst.',
      en: 'I\'m afraid of the birth itself.',
    },
    fact: {
      de: 'Geburtsangst ist verbreitet und ernstzunehmen. Ein Geburtsvorbereitungskurs, eine Doula oder Hypnobirthing-Techniken helfen vielen. Plus: Heutige Schmerzmittel (PDA) sind sicher und gut verfügbar — du musst nicht „durchhalten".',
      en: 'Fear of birth is common and worth taking seriously. Birth prep classes, a doula, or hypnobirthing techniques help many. Plus: today\'s pain relief options (epidural) are safe and widely available — you don\'t have to "tough it out."',
    },
  },
]
