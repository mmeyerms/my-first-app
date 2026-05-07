import type { LocalizedString } from '@/lib/i18n/localized'

export type TeamFrage = {
  id: string
  emoji: string
  question: LocalizedString
  hint?: LocalizedString
}

export const TEAM_FRAGEN: TeamFrage[] = [
  {
    id: 'tf-1',
    emoji: '🌳',
    question: {
      de: 'Welche Kindheitsmomente von uns wollen wir unbedingt weitergeben?',
      en: 'Which moments from our own childhoods do we absolutely want to pass on?',
    },
    hint: {
      de: 'Was war so schön, dass dein Kind es auch erleben sollte? Sonntagsfrühstück mit Oma? Lange Wanderungen? Vorlesen vorm Schlafen?',
      en: 'What was so good that your child should get to experience it too? Sunday breakfast with grandma? Long hikes? Bedtime stories?',
    },
  },
  {
    id: 'tf-2',
    emoji: '🪞',
    question: {
      de: 'Was hat uns als Kind geprägt — und was wollen wir bewusst anders machen?',
      en: 'What shaped us as kids — and what do we consciously want to do differently?',
    },
    hint: {
      de: 'Manche Sätze unserer Eltern wollen wir niemals selbst sagen. Welche sind das? Hier ist Raum, ehrlich zu sein.',
      en: 'There are sentences from our parents we swore we\'d never say ourselves. Which ones? This is the space to be honest.',
    },
  },
  {
    id: 'tf-3',
    emoji: '⚖️',
    question: {
      de: 'Wer von uns wird eher der "strenge", wer der "spielerische" Elternteil?',
      en: 'Who of us will be the more "strict" parent, who the more "playful" one?',
    },
    hint: {
      de: 'Niemand muss eine bestimmte Rolle übernehmen — aber es hilft, wenn wir wissen, in welche Richtung wir natürlich tendieren.',
      en: 'Nobody has to play a fixed role — but it helps to know which way we naturally lean.',
    },
  },
  {
    id: 'tf-4',
    emoji: '🛡️',
    question: {
      de: 'Was ist uns wichtiger: Sicherheit oder Freiheit?',
      en: 'What matters more to us: safety or freedom?',
    },
    hint: {
      de: 'Beide sind wichtig — aber im Ernstfall: Wo zieht ihr die Grenze? Klettern lassen oder lieber festhalten?',
      en: 'Both matter — but when push comes to shove: where do you draw the line? Let them climb, or hold them back?',
    },
  },
  {
    id: 'tf-5',
    emoji: '💬',
    question: {
      de: 'Wie gehen wir damit um, wenn wir uns über Erziehung uneinig sind?',
      en: 'How do we handle it when we disagree about parenting?',
    },
    hint: {
      de: 'Vor dem Kind aussprechen? Hinter den Kulissen? Nie vor dem Kind streiten? Was fühlt sich für euch richtig an?',
      en: 'Talk it out in front of the child? Behind the scenes? Never argue in front of them? What feels right for you?',
    },
  },
  {
    id: 'tf-6',
    emoji: '📱',
    question: {
      de: 'Wie viel Bildschirmzeit ist für uns ok — und ab welchem Alter?',
      en: 'How much screen time is okay for us — and from what age?',
    },
    hint: {
      de: 'Diese Frage spaltet Familien. Sprecht jetzt drüber — bevor das Tablet zur Notlösung wird.',
      en: 'This question divides families. Talk about it now — before the tablet becomes the emergency solution.',
    },
  },
  {
    id: 'tf-7',
    emoji: '💞',
    question: {
      de: 'Was tun wir, wenn das Baby uns als Paar fordert?',
      en: 'What do we do when the baby pushes us to our limit as a couple?',
    },
    hint: {
      de: 'Klare Regel? Date Night? Paar-Therapie ohne Zögern? Was wäre euer Notfallplan, wenn ihr euch verliert?',
      en: 'A clear rule? Date night? Couples therapy without hesitation? What\'s your emergency plan if you start losing each other?',
    },
  },
  {
    id: 'tf-8',
    emoji: '🔄',
    question: {
      de: 'Wer übernimmt im ersten Jahr die Hauptverantwortung wofür?',
      en: 'Who takes the lead on what during the first year?',
    },
    hint: {
      de: 'Nachts, Termine, Einkauf, mentale Last — wer macht was? Sprecht es konkret durch, nicht als Floskel.',
      en: 'Nights, appointments, groceries, mental load — who does what? Talk it through concretely, not as a vague promise.',
    },
  },
  {
    id: 'tf-9',
    emoji: '💎',
    question: {
      de: 'Welche Werte sind uns nicht verhandelbar?',
      en: 'Which values are non-negotiable for us?',
    },
    hint: {
      de: 'Ehrlichkeit? Mitgefühl? Bildung? Naturverbundenheit? Was ist eure absolute Basis?',
      en: 'Honesty? Compassion? Education? Connection to nature? What\'s your absolute foundation?',
    },
  },
  {
    id: 'tf-10',
    emoji: '🛟',
    question: {
      de: 'Was tun wir, wenn Großeltern oder Freunde uns ungebeten beraten?',
      en: 'What do we do when grandparents or friends give us unsolicited advice?',
    },
    hint: {
      de: 'Höflich nicken und ignorieren? Klar Grenze setzen? Wer von euch übernimmt die "Türsteher"-Rolle?',
      en: 'Smile and ignore politely? Set clear boundaries? Which of you plays "bouncer"?',
    },
  },
]
