export type TeamFrage = {
  id: string
  emoji: string
  question: string
  hint?: string
}

export const TEAM_FRAGEN: TeamFrage[] = [
  {
    id: 'tf-1',
    emoji: '🌳',
    question: 'Welche Kindheitsmomente von uns wollen wir unbedingt weitergeben?',
    hint: 'Was war so schön, dass dein Kind es auch erleben sollte? Sonntagsfrühstück mit Oma? Lange Wanderungen? Vorlesen vorm Schlafen?',
  },
  {
    id: 'tf-2',
    emoji: '🪞',
    question: 'Was hat uns als Kind geprägt — und was wollen wir bewusst anders machen?',
    hint: 'Manche Sätze unserer Eltern wollen wir niemals selbst sagen. Welche sind das? Hier ist Raum, ehrlich zu sein.',
  },
  {
    id: 'tf-3',
    emoji: '⚖️',
    question: 'Wer von uns wird eher der "strenge", wer der "spielerische" Elternteil?',
    hint: 'Niemand muss eine bestimmte Rolle übernehmen — aber es hilft, wenn wir wissen, in welche Richtung wir natürlich tendieren.',
  },
  {
    id: 'tf-4',
    emoji: '🛡️',
    question: 'Was ist uns wichtiger: Sicherheit oder Freiheit?',
    hint: 'Beide sind wichtig — aber im Ernstfall: Wo zieht ihr die Grenze? Klettern lassen oder lieber festhalten?',
  },
  {
    id: 'tf-5',
    emoji: '💬',
    question: 'Wie gehen wir damit um, wenn wir uns über Erziehung uneinig sind?',
    hint: 'Vor dem Kind aussprechen? Hinter den Kulissen? Nie vor dem Kind streiten? Was fühlt sich für euch richtig an?',
  },
  {
    id: 'tf-6',
    emoji: '📱',
    question: 'Wie viel Bildschirmzeit ist für uns ok — und ab welchem Alter?',
    hint: 'Diese Frage spaltet Familien. Sprecht jetzt drüber — bevor das Tablet zur Notlösung wird.',
  },
  {
    id: 'tf-7',
    emoji: '💞',
    question: 'Was tun wir, wenn das Baby uns als Paar fordert?',
    hint: 'Klare Regel? Date Night? Paar-Therapie ohne Zögern? Was wäre euer Notfallplan, wenn ihr euch verliert?',
  },
  {
    id: 'tf-8',
    emoji: '🔄',
    question: 'Wer übernimmt im ersten Jahr die Hauptverantwortung wofür?',
    hint: 'Nachts, Termine, Einkauf, mentale Last — wer macht was? Sprecht es konkret durch, nicht als Floskel.',
  },
  {
    id: 'tf-9',
    emoji: '💎',
    question: 'Welche Werte sind uns nicht verhandelbar?',
    hint: 'Ehrlichkeit? Mitgefühl? Bildung? Naturverbundenheit? Was ist eure absolute Basis?',
  },
  {
    id: 'tf-10',
    emoji: '🛟',
    question: 'Was tun wir, wenn Großeltern oder Freunde uns ungebeten beraten?',
    hint: 'Höflich nicken und ignorieren? Klar Grenze setzen? Wer von euch übernimmt die "Türsteher"-Rolle?',
  },
]
