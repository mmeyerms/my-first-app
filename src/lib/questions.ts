export type QuestionType = 'single' | 'multi' | 'text'

export interface Question {
  id: string
  stage: 1 | 2 | 3
  label: string
  type: QuestionType
  options?: string[]
  optional?: boolean
  hint?: string
}

export const QUESTIONS: Question[] = [
  // Stufe 1 — Kern (immer sichtbar)
  {
    id: 'location',
    stage: 1,
    label: 'Wo möchtest du gebären?',
    type: 'single',
    options: ['Krankenhaus', 'Geburtshaus', 'Hausgeburt', 'Noch nicht entschieden'],
    hint: 'Krankenhaus, Geburtshaus oder zuhause — das ist eine der ersten großen Entscheidungen, und viele Frauen spüren dabei Druck von außen. Dabei gibt es keine richtige Antwort — nur deine. Ein Krankenhaus gibt Sicherheit durch volle medizinische Infrastruktur. Ein Geburtshaus ist persönlicher, aber du wirst bei Komplikationen verlegt. Zuhause gebären gibt maximale Kontrolle über dein Umfeld — braucht aber eine sehr erfahrene Hebamme. Wichtigste Frage: Wo kannst du dich fallen lassen?',
  },
  {
    id: 'companions',
    stage: 1,
    label: 'Wer soll bei der Geburt dabei sein?',
    type: 'multi',
    options: ['Partner/in', 'Doula', 'Freundin / Vertraute Person', 'Nur das medizinische Team'],
    hint: 'Wer bei der Geburt dabei ist, beeinflusst wie du dich fühlen wirst. Nicht jeder, der dabei sein will, ist gut für dich in diesem Moment. Dein Partner? Wunderbar — aber sprecht vorher offen darüber, was er leisten kann und was nicht. Manche Frauen holen sich zusätzlich eine Doula — jemand mit Erfahrung, die genau weiß wie man unterstützt ohne zu stören. Du darfst auch allein sein, wenn das richtig für dich ist.',
  },
  {
    id: 'pain_management',
    stage: 1,
    label: 'Wie möchtest du mit Schmerzen umgehen?',
    type: 'multi',
    options: ['PDA (Periduralanästhesie)', 'Wasser (Badewanne / Dusche)', 'TENS-Gerät', 'Hypnobirthing', 'Lachgas', 'Offen – je nach Situation', 'Keine Schmerzmittel'],
    hint: 'Über kein Thema gibt es mehr Meinungsdruck als dieses. "Natürliche Geburt" klingt nach Stärke — aber Stärke ist es, zu wissen was dir hilft, nicht was andere von dir erwarten. Die PDA ist sicher, bewährt und ermöglicht es vielen Frauen, die Geburt erst wirklich zu erleben. Gleichzeitig berichten Frauen ohne Schmerzmittel von einem tiefen Gefühl von Kraft. Es gibt keine Medaille für Schmerzen. Schreib auf was du dir wünschst — und sei gleichzeitig offen, im Moment umzudenken. Geburten halten sich selten an Pläne.',
  },
  {
    id: 'wishes',
    stage: 1,
    label: 'Was ist dir bei der Geburt am wichtigsten?',
    type: 'text',
    optional: true,
    hint: 'Hier ist dein freier Raum — für alles, was sich nicht in eine Checkbox pressen lässt. Vielleicht: "Ich möchte, dass jemand mit mir redet bevor etwas passiert." Oder: "Keine lauten Geräusche." Oder: "Meine Playlist soll laufen." Schreibe auf was dich gerade beschäftigt — auch wenn es klein klingt. Das Geburts-Team kann nur auf dich eingehen, wenn es weiß was dir wichtig ist.',
  },
  {
    id: 'no_gos',
    stage: 1,
    label: 'Was möchtest du auf keinen Fall?',
    type: 'text',
    optional: true,
    hint: 'Das ist eine der kraftvollsten Fragen im Geburtsplan — sie gibt dir eine Stimme für Momente, in denen du vielleicht keine Kraft mehr hast zu sprechen. Manche Frauen schreiben: "Kein Dammschnitt ohne Rücksprache." Andere: "Keine Studenten im Raum." Oder: "Sagt mir nicht ich soll leise sein." Was auch immer dein No-Go ist — es ist gültig. Dein Körper, dein Raum, deine Regeln.',
  },

  // Stufe 2 — Vertiefung (ab SSW 20)
  {
    id: 'mobility',
    stage: 2,
    label: 'Bewegungsfreiheit während der Geburt?',
    type: 'single',
    options: ['Sehr wichtig – ich möchte mich frei bewegen', 'Wichtig, aber flexibel', 'Nicht besonders wichtig'],
    hint: 'Viele Frauen wissen nicht: Du musst nicht auf dem Rücken liegen. Das ist eine Krankenhausroutine, keine medizinische Notwendigkeit. Bewegung kann Schmerzen lindern und die Geburt verkürzen. Laufen, Hocken, auf einem Ball sitzen, im Wasser stehen — dein Körper findet oft instinktiv die richtige Position. Frag deine Hebamme was möglich ist und schreib es hier fest.',
  },
  {
    id: 'episiotomy',
    stage: 2,
    label: 'Dammschnitt – deine Wünsche?',
    type: 'single',
    options: ['Nur im absoluten Notfall', 'Bitte möglichst vermeiden', 'Ich vertraue dem medizinischen Team', 'Noch nicht entschieden'],
    hint: 'Der Dammschnitt berührt Fragen von Körper, Kontrolle und Vertrauen. Er ist manchmal nötig — aber nicht immer. Studien zeigen: Ein natürlicher Riss heilt oft besser als ein Schnitt. Warme Kompressen, bestimmte Positionen und eine geduldige Hebamme können das Risiko senken. Du hast das Recht, dieses Thema im Voraus anzusprechen. Dein Wunsch, informiert zu entscheiden, ist berechtigt.',
  },
  {
    id: 'bonding',
    stage: 2,
    label: 'Bonding direkt nach der Geburt?',
    type: 'multi',
    options: ['Sofortkontakt (Haut-zu-Haut)', 'Verzögertes Abnabeln', 'Partner/in schneidet die Nabelschnur', 'Wie das Team empfiehlt'],
    hint: 'Die ersten Minuten nach der Geburt können unvergesslich sein. Haut-zu-Haut-Kontakt senkt Stresshormone bei dir und deinem Baby, unterstützt das Stillen und gibt euch Zeit euch zu "erkennen". Aber: Wenn es aus medizinischen Gründen nicht sofort klappt — eure Bindung entsteht trotzdem. Bonding passiert nicht nur in den ersten Minuten. Es passiert jede Nacht, jeden Tag, über Monate.',
  },
  {
    id: 'breastfeeding',
    stage: 2,
    label: 'Stillwunsch?',
    type: 'single',
    options: ['Ja, ich möchte stillen', 'Ja, mit Unterstützung durch Hebamme', 'Nein – Flasche geplant', 'Noch nicht entschieden'],
    hint: 'Stillen ist eines der emotionalsten Themen der frühen Mutterschaft. Der Druck zu stillen ist real — und gleichzeitig schaffen es viele Frauen aus hundert verschiedenen Gründen nicht. Beides ist verständlich. Stillen hat klare Vorteile — aber ein glückliches Baby mit der Flasche ist besser als eine erschöpfte Mutter voller Schuldgefühle. Wenn du stillen möchtest: Hol dir Unterstützung (Hebamme, Stillberaterin) — und lass dir erlaubt sein, den Plan zu ändern.',
  },
  {
    id: 'photography',
    stage: 2,
    label: 'Fotos und Videos – was darf wann?',
    type: 'multi',
    options: ['Während der Geburt erlaubt', 'Nur beim Moment der Geburt', 'Partner/in darf filmen', 'Erst nach der Geburt', 'Keine Fotos während der Geburt'],
    hint: 'Wer fotografiert wann was — das ist eine unterschätzte Frage. Viele Paare sind hinterher froh um Fotos aus dem Kreißsaal. Andere möchten keine Kamera in der Nähe. Denke vorher nach: Wer ist der "offizielle Fotograf"? Sollen Geburtsmomente festgehalten werden? Und: Wer darf die Bilder sehen, wer nicht? Dein Partner sollte das vorher klar wissen, damit er/sie nicht in einem wichtigen Moment zögert.',
  },
  {
    id: 'atmosphere',
    stage: 2,
    label: 'Wünsche zur Atmosphäre (Musik, Licht, Duft)?',
    type: 'text',
    optional: true,
    hint: 'Das klingt nach Luxus, macht aber einen echten Unterschied. Dein Nervensystem reagiert auf Umgebungsreize — gedämpftes Licht signalisiert Sicherheit, vertraute Musik kann den Kreißsaal zu "deinem" Raum machen. Viele Frauen bringen eine eigene Playlist, ein Kissen von zuhause oder einen Duft mit. Kreißsäle erlauben das oft — frag nach. Manchmal sind es die kleinen Dinge, die uns erden.',
  },
  {
    id: 'complications',
    stage: 2,
    label: 'Bei Komplikationen (z.B. Kaiserschnitt): Was gilt?',
    type: 'text',
    optional: true,
    hint: 'Dieser Abschnitt ist schwer zu schreiben — weil niemand gern daran denkt, dass die Geburt nicht wie geplant läuft. Und doch: Frauen, die sich vorher damit beschäftigt haben, sind hinterher oft dankbar. Ein ungeplanter Kaiserschnitt ist kein Versagen — er rettet manchmal Leben. Was wünschst du dir in diesem Fall? Partner soll dabei sein? Baby direkt danach auf deine Brust? Schreibe es auf — für den Fall der Fälle.',
  },

  // Stufe 3 — Wochenbett (ab SSW 32)
  {
    id: 'room',
    stage: 3,
    label: 'Zimmer-Präferenz im Wochenbett?',
    type: 'single',
    options: ['Einzel-Zimmer (wenn möglich)', 'Mehrbett-Zimmer ist ok', 'Egal'],
    hint: 'Das Einzelzimmer klingt erstmal teuer und unnötig — bis das Baby um 3 Uhr schreit und du froh bist, vier andere Frauen nicht zu wecken. Oder umgekehrt: Im Mehrbettzimmer sind andere Mütter da, und das kann unglaublich stärkend sein. Informiere dich was deine Klinik anbietet und was es kostet. Wenn du körperlich erschöpft bist und Ruhe brauchst — das Einzelzimmer ist kein Luxus, es ist Selbstfürsorge.',
  },
  {
    id: 'visitors',
    stage: 3,
    label: 'Besuche – wer darf wann kommen?',
    type: 'text',
    optional: true,
    hint: 'Das Wochenbett ist eine der verletzlichsten Phasen deines Lebens — und gleichzeitig wollen alle kommen und gratulieren. Dein Recht: Nein zu sagen. Nur 20 Minuten. Erst nach der zweiten Woche. Besprich das vorher mit deinem Partner: Er/sie kann der "Türsteher" sein. "Sie schläft gerade — wir melden uns." Deine Familie und Freunde meinen es gut. Aber du brauchst Erholung, keine Koordination.',
  },
  {
    id: 'baby_sleep',
    stage: 3,
    label: 'Baby-Schlafplatz?',
    type: 'single',
    options: ['Rooming-in (Baby immer bei mir)', 'Säuglingszimmer nachts', 'Flexibel'],
    hint: 'Rooming-in (Baby die ganze Nacht bei dir) ist medizinisch empfohlen — es unterstützt Stillen und Bindung. Gleichzeitig sind die ersten Nächte intensiv. Viele Kliniken haben ein Säuglingszimmer, in das du dein Baby für einige Stunden geben kannst damit du schläfst. Das ist keine Schwäche — das ist Vernunft. Ein paar Stunden Schlaf machen aus einer überforderten Mutter wieder eine, die present sein kann.',
  },
  {
    id: 'discharge',
    stage: 3,
    label: 'Entlassung aus dem Krankenhaus?',
    type: 'single',
    options: ['So früh wie möglich', 'Lieber ein paar Tage länger bleiben', 'Wie empfohlen'],
    hint: 'Früh nach Hause: eigenes Bett, eigene Küche, eigene Privatsphäre. Aber auch weniger professionelle Unterstützung. Länger bleiben: Schwestern und Hebammen sind da wenn du nachts Fragen hast. Hör auf deinen Körper — nicht auf den Druck der Krankenkasse oder die Ungeduld deiner Familie. Du weißt am besten wann du bereit bist.',
  },
  {
    id: 'midwife',
    stage: 3,
    label: 'Wochenbett-Hebamme organisiert?',
    type: 'single',
    options: ['Ja, bereits organisiert ✓', 'Noch nicht – brauche Unterstützung', 'Nicht nötig'],
    hint: 'Eine Wochenbett-Hebamme ist kein Nice-to-have — sie ist eine der wichtigsten Ressourcen der ersten Wochen nach der Geburt. Sie kommt zu dir nach Hause, prüft die Wundheilung, hilft beim Stillen und — das vergessen viele — sie ist oft die erste, die merkt wenn es dir nicht gut geht. Gute Hebammen sind oft 6+ Monate im Voraus ausgebucht. Falls du noch keine hast: Heute anfangen. Frag deine Gynäkologin oder Freundinnen.',
  },
]

export const STAGE_UNLOCK: Record<1 | 2 | 3, number> = { 1: 0, 2: 20, 3: 32 }

export function getStageQuestions(stage: 1 | 2 | 3): Question[] {
  return QUESTIONS.filter((q) => q.stage === stage)
}

export function countAnswered(answers: Record<string, unknown>, stage: 1 | 2 | 3): number {
  return getStageQuestions(stage).filter((q) => {
    const a = answers[q.id]
    return Array.isArray(a) ? a.length > 0 : typeof a === 'string' && a.trim().length > 0
  }).length
}
