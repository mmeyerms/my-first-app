/**
 * Curated content for the 10 Partner-Features (PROJ-12 Konzept 2.0).
 *
 * All content is TypeScript instead of DB rows so it can be edited/reviewed
 * via git without a Supabase round-trip. Length caps enforced by real-world
 * partner attention span (5-8 min/day, mobile pockets of time).
 *
 * Roles: 'papa' | 'oma' | 'opa' | 'bestie' | 'andere' | 'mama'
 * (mama = second mother; treated like papa for content targeting.)
 */

export type PartnerRoleKey = 'papa' | 'mama' | 'oma' | 'opa' | 'bestie' | 'andere'

/* ============================================================
 * FEATURE 01 — Wochen-Impulse (persönlicher SSW-basierter Nudge)
 * ============================================================
 * Ein 90-Sekunden-Impuls pro Rolle × SSW-Fenster. Nicht komplett
 * ausgeschöpft — 40 werden mit der Zeit zusammengetragen. Fallback
 * auf Trimester-Impuls wenn keiner für exakte SSW da ist.
 */

export interface WeeklyImpulse {
  ssw: number
  roles: PartnerRoleKey[]
  headline: string
  body: string
  cta?: string
}

export const WEEKLY_IMPULSES: WeeklyImpulse[] = [
  // First trimester (4-12)
  { ssw: 6, roles: ['papa', 'mama'],
    headline: 'Sie ist gerade viel müder als sie zeigt.',
    body: 'Die Hormone in den ersten Wochen kosten Energie. Übernimm heute etwas ohne zu fragen: Einkauf, Wäsche, Abendessen. Sie merkt es, auch wenn sie nichts sagt.' },
  { ssw: 8, roles: ['papa', 'mama'],
    headline: 'Übelkeit ist heute wahrscheinlich präsent.',
    body: 'Wenn sie morgens im Bad ist: kein Frühstücksgespräch. Ingwertee vorbereiten und leise Zwieback hinstellen. Reden geht später.' },
  { ssw: 10, roles: ['oma', 'opa'],
    headline: 'Sie schafft es diese Wochen kaum jemandem zu erzählen.',
    body: 'Ihr Bauch zeigt noch nichts, aber ihr Körper arbeitet für zwei. Ein spontaner Anruf ohne dass sie etwas zurückgeben muss: „Ich denk an dich."' },
  { ssw: 11, roles: ['bestie'],
    headline: 'Sie hat Angst und redet nicht drüber.',
    body: 'Erstes Trimester ist statistisch das riskanteste. Schick ihr heute etwas nicht Baby-bezogenes: Meme, gemeinsame Erinnerung, dummes Video. Halte eure Freundschaft normal.' },

  // Second trimester (13-27)
  { ssw: 15, roles: ['papa', 'mama'],
    headline: 'Der Bauch fängt an sichtbar zu werden.',
    body: 'Frag heute: „Wie fühlst du dich in deinem Körper gerade?" Nicht kommentieren, nicht witzig sein. Zuhören.' },
  { ssw: 18, roles: ['papa', 'mama'],
    headline: 'Diese Woche merkt sie erste Bewegungen.',
    body: 'Für dich sind es noch keine Tritte zum Fühlen — das kommt ab Woche 22-24. Aber sie fühlt sie jetzt. Frag heute Abend: „Wie fühlst du das gerade?" Ohne zu erklären, ohne Google.' },
  { ssw: 20, roles: ['bestie'],
    headline: 'Halbzeit.',
    body: '20 Wochen geschafft, 20 vor euch. Das ist der Moment für einen kleinen Anruf. „Wir sind bei der Hälfte. Ich hab dich lieb." Kein Ratschlag, kein Ratgeber. Einfach da sein.' },
  { ssw: 20, roles: ['oma', 'opa'],
    headline: 'Halbzeit — sie plant jetzt vorwärts.',
    body: 'Ab jetzt fangen konkrete Vorbereitungen an: Kinderzimmer, Kliniktasche, Namen. Frag was sie sich wünschen. Deine Meinung ist willkommen. Deine Entscheidung nicht.' },
  { ssw: 24, roles: ['papa', 'mama'],
    headline: 'Sie fühlt sich jetzt vielleicht das erste Mal richtig schwanger.',
    body: 'Das zweite Trimester ist oft „das gute". Nutze es. Verabrede euch für einen Kinoabend oder ein Wochenende weg — das letzte lange Wochenende zu zweit für eine Weile.' },
  { ssw: 26, roles: ['papa', 'mama'],
    headline: 'Zeit für den Geburtsvorbereitungs-Kurs.',
    body: 'Melde euch beide an — Kliniken bevorzugen Partner-Kurse. Reservieren jetzt bevor Kurse voll sind. Dein Beitrag: Termin buchen ohne dass sie es tun muss.' },

  // Third trimester (28-36)
  { ssw: 28, roles: ['papa', 'mama'],
    headline: 'Ab jetzt zählt jede Woche doppelt.',
    body: 'Elternzeit-Antrag muss vor 7 Wochen vor Beginn beim Arbeitgeber sein. Wenn du im April Elternzeit willst und dein Baby ist Anfang Juni fällig: heute anfangen. Wir haben einen Wizard dafür.',
    cta: 'Elternzeit-Wizard' },
  { ssw: 30, roles: ['oma', 'opa'],
    headline: 'Es wird eng.',
    body: 'Sie ist am Ende des zweiten Trimesters müde. Der Bauch macht Alltag schwer. Ein Vorschlag: heute mal einfach Wäsche abholen. Nicht fragen ob sie es braucht. Einfach machen. Das ist die Art Hilfe, die niemand ablehnt.' },
  { ssw: 32, roles: ['bestie'],
    headline: 'Sie wird zunehmend introvertiert.',
    body: 'Ab jetzt sind gemeinsame Abende seltener. Reserviere dir einen konkreten Nachmittag mit ihr — Frühstück oder Spaziergang. Bevor der Alltag mit Baby losgeht.' },
  { ssw: 34, roles: ['papa', 'mama'],
    headline: 'Klinik-Route bei Nacht abfahren.',
    body: 'Wenn es losgeht, willst du nicht Google Maps checken. Fahr die Route zur Klinik einmal um 3 Uhr morgens ab, ohne Verkehr. Wo parken? Wo ist der Kreissaal-Eingang?' },

  // Zielgerade (37-40+)
  { ssw: 37, roles: ['papa', 'mama'],
    headline: 'Kliniktasche ist gepackt?',
    body: 'Wenn nein: heute. Sie hat vermutlich zu viel drin. Prüfe: eigene Tasche für dich (Wechselklamotten, Ladegerät, Snacks, Handtuch für Kreissaal-Dusche).' },
  { ssw: 38, roles: ['oma', 'opa'],
    headline: 'Sag ihr klar was du kannst.',
    body: '„Ich kann in den ersten zwei Wochen jeden zweiten Tag da sein — sag mir wann du mich willst." Konkret ist Gold. Vage ist Belastung.' },
  { ssw: 39, roles: ['papa', 'mama'],
    headline: 'Wehen erkennen: es dauert.',
    body: 'Übungswehen (Braxton-Hicks) sind normal und heute wahrscheinlich häufiger. Echte Wehen: regelmäßig, werden stärker, kommen in kürzeren Abständen. Regel: 5-1-1. Alle 5 Min, 1 Min lang, seit 1 Std.' },
  { ssw: 40, roles: ['papa', 'mama', 'oma', 'opa', 'bestie'],
    headline: 'Die ET ist ein Schätzwert.',
    body: 'Nur 5% aller Babys werden am ET geboren. Halbwertszeit für Geburt liegt bei SSW 40+3. Nicht drängeln, nicht ständig fragen. Sie zählt selbst.' },
]

/* ============================================================
 * FEATURE 02 — Fragen-Bibliothek (FAQ mit Peer-Antworten)
 * ============================================================
 */

export interface PartnerQuestion {
  id: string
  roles: PartnerRoleKey[]
  question: string
  peerAnswers: Array<{ from: string; text: string }>
  context?: string
}

export const PARTNER_QUESTIONS: PartnerQuestion[] = [
  // Papa
  { id: 'kreissaal-outfit', roles: ['papa', 'mama'],
    question: 'Was ziehe ich im Kreissaal an?',
    context: 'Praktisch, angenehm, keine Fotos-Zwang-Klamotten.',
    peerAnswers: [
      { from: 'Jonas, 34', text: 'Kurze Hose und T-Shirt. Es wird warm. Kein Schmuck, keine Uhr. Und Wechselklamotten für zwei Nächte im Auto.' },
      { from: 'Marc, 29', text: 'Bequeme Schuhe. Man steht viel.' },
      { from: 'Timo, 38', text: 'Was du gerne trägst wenn Fotos gemacht werden. Es gibt Fotos.' },
    ] },
  { id: 'bindung-vater', roles: ['papa'],
    question: 'Ich fühle noch nichts — ist das normal?',
    context: 'Vater-Bindung entwickelt sich meist später als bei Müttern. Kein Grund zur Sorge.',
    peerAnswers: [
      { from: 'Anonym, 32', text: 'Ich fühlte 4 Monate lang nichts. Dann hat er mir mit 3 Wochen zum ersten Mal die Finger gedrückt. Der Damm brach.' },
      { from: 'Robin, 40', text: 'Bei uns kam es beim ersten Ultraschall. Dann verschwand es. Dann kam es zurück beim Namen aussuchen. Bindung ist keine Line, sondern eine Welle.' },
    ] },
  { id: 'sex-schwanger', roles: ['papa', 'mama'],
    question: 'Darf ich Sex vorschlagen?',
    context: 'Ja, medizinisch bis zum Ende möglich (Ausnahmen: bestimmte Risikoschwangerschaften). Aber Kommunikation.',
    peerAnswers: [
      { from: 'Anonym, 36', text: 'Wir haben aufgehört zu fragen und angefangen zu reden. „Wie fühlst du dich heute?" statt „Hättest du Lust?" hat alles geändert.' },
      { from: 'David, 30', text: 'Sie hatte zwei Monate keine Lust. Dann wieder. Dann wieder nicht. Nimm nichts persönlich.' },
    ] },
  { id: 'weinen-nichts-getan', roles: ['papa', 'mama'],
    question: 'Sie weint und ich habe nichts getan — was mache ich?',
    context: 'Hormonelle Schwankungen sind neu und ungeübt. Nicht das Weinen erklären.',
    peerAnswers: [
      { from: 'Jan, 35', text: 'Ich habe gelernt: Nicht fragen „Was ist los?". Sondern: „Willst du reden oder soll ich einfach da sein?" Meistens war letzteres richtig.' },
      { from: 'Anonym, 28', text: 'Wasser holen. Kein Wort. Dann sitzen bleiben. Klingt banal, hat immer funktioniert.' },
    ] },
  { id: 'elternzeit-arbeitgeber', roles: ['papa', 'mama'],
    question: 'Wie melde ich Elternzeit an ohne mich unbeliebt zu machen?',
    context: 'Elternzeit ist gesetzlich verankert — dein Anspruch, keine Bitte. Frist: 7 Wochen vorher schriftlich.',
    peerAnswers: [
      { from: 'Anonym, 31', text: 'Ich habe es 3 Monate vorher mit meinem Chef besprochen — nicht als Frage, sondern als Info. Dann formell 7 Wochen vorher. Alle waren froh dass sie planen konnten.' },
      { from: 'Steffen, 39', text: 'Erste Reaktion war zunächst gemischt. Zwei Wochen später Danke-E-Mail vom Chef weil ich rechtzeitig transparent war.' },
    ] },
  { id: 'wochenbett-partner-support', roles: ['papa', 'mama'],
    question: 'Wie unterstütze ich sie im Wochenbett ohne dass wir uns streiten?',
    context: 'Klare Aufgabenteilung schriftlich vor dem ET vereinbaren.',
    peerAnswers: [
      { from: 'Anonym, 33', text: 'Wir haben in Woche 36 eine Excel gemacht. Nachtdienste, Kochen, Familien-Kommunikation. Klingt uncool. Hat uns gerettet.' },
      { from: 'Anonym, 27', text: 'Die erste Woche keine Besucher außer Oma. Nichts erklären, nicht rechtfertigen. Kein „Sorry wir sind noch zu erschöpft".' },
    ] },

  // Oma/Opa
  { id: 'sids-beikost-heute', roles: ['oma', 'opa'],
    question: 'Was hat sich seit 30 Jahren geändert bei SIDS und Beikost?',
    context: 'Empfehlungen wurden mehrfach überarbeitet. Kein Vorwurf — nur Info.',
    peerAnswers: [
      { from: 'Renate, 62', text: 'Bei uns lag das Kind in Bauchlage. Heute geht das gar nicht mehr. Ich habe zugehört und nichts kommentiert. Es hilft.' },
      { from: 'Klaus, 58', text: 'Wir hatten schon mit 4 Monaten Karottenbrei. Heute: 6 Monate abwarten. Meine Tochter hat es mir erklärt, ich habe es akzeptiert.' },
    ] },
  { id: 'wochenbett-besuchen', roles: ['oma', 'opa'],
    question: 'Wann und wie oft darf ich im Wochenbett besuchen?',
    context: 'Signal-Ampel in der App abwarten. Grün = ja. Gelb = kurz anrufen. Rot = warten.',
    peerAnswers: [
      { from: 'Christa, 65', text: 'Ich habe die ersten 3 Tage gar nicht besucht. Meine Tochter hat sich später bedankt. Manchmal ist da-nicht-sein die beste Hilfe.' },
      { from: 'Hans, 60', text: 'Erste Regel: nichts mitbringen was noch mehr Aufwand macht. Blumen brauchen Vase. Kuchen braucht Teller. Ein warmes Essen im Alu-Behälter braucht nichts.' },
    ] },
  { id: 'helfen-ohne-bevormundung', roles: ['oma', 'opa'],
    question: 'Wie helfe ich ohne zu bevormunden?',
    peerAnswers: [
      { from: 'Angelika, 59', text: 'Zwei Regeln: keine ungefragten Ratschläge. Und wenn ich einen gebe: „Bei uns damals — aber jede Zeit ist anders." Klein, aber wirkt.' },
      { from: 'Peter, 63', text: 'Ich frage jetzt: „Willst du meine Meinung dazu hören oder soll ich nur zuhören?" Ist eine der besten Fragen, die ich gelernt habe.' },
    ] },
  { id: 'stolz-ohne-vergleich', roles: ['oma', 'opa'],
    question: 'Wie zeige ich Stolz ohne zu vergleichen?',
    peerAnswers: [
      { from: 'Ulrike, 61', text: 'Ich sage nicht mehr „Bei uns war das damals so". Ich sage: „Das machst du gerade wunderbar." Punkt. Kein Nebensatz.' },
    ] },
  { id: 'fern-helfen', roles: ['oma', 'opa'],
    question: 'Wie kann ich helfen wenn ich weit weg wohne?',
    context: 'Fernhilfe braucht Konkretheit. Vage Angebote helfen nicht.',
    peerAnswers: [
      { from: 'Anonym, 66', text: 'Ich habe für 4 Wochen jeden Dienstag ein warmes Essen bei einem Lieferservice gebucht. Sie musste nur die Tür öffnen. Das war meine beste Idee.' },
      { from: 'Anonym, 67', text: 'Video-Anrufe zu festen Zeiten (Dienstag 19 Uhr, Sonntag 11 Uhr). Nicht spontan reinplatzen. Verlässlichkeit ist Ruhe für sie.' },
    ] },

  // Bestie
  { id: 'geschenk-was-wirklich', roles: ['bestie'],
    question: 'Was schenke ich zur Geburt was wirklich hilft — nicht noch ein Body?',
    peerAnswers: [
      { from: 'Anonym, 34', text: 'Reinigungsdienst-Gutschein für 3 Termine in den ersten 8 Wochen. Bestes Geschenk das ich je gemacht habe.' },
      { from: 'Anonym, 31', text: 'Zwei Kochbücher mit Ein-Topf-Rezepten + ein Set gefrorene Fertigmahlzeiten aus meinem eigenen Freezer. Sie hat geweint.' },
    ] },
  { id: 'ppd-was-sag-ich', roles: ['bestie'],
    question: 'Was sage ich wenn sie mir 3 Monate nach der Geburt sagt, sie hat Depressionen?',
    context: 'Wichtig: Zuhören ohne zu bagatellisieren. Anlaufstellen kennen (siehe PPD-Modul).',
    peerAnswers: [
      { from: 'Anonym, 32', text: '„Das nimmt mich mit was du erzählst. Ich bin froh dass du mich gefragt hast. Willst du dass wir zusammen die Hebammen-Hotline anrufen?" Ich habe das genau so gesagt. Sie hat sich getraut.' },
    ] },
  { id: 'verbindung-halten', roles: ['bestie'],
    question: 'Wie bleibe ich Teil ihres Lebens ohne dass es nur um das Baby geht?',
    peerAnswers: [
      { from: 'Anonym, 33', text: 'Wir haben eine Regel: Beim ersten Kaffee reden wir 20 Min NICHT über das Baby. Sondern über sie. Ihre Woche, ihre Gedanken. Sie hat gesagt das ist ihr wichtigster Termin geworden.' },
    ] },
  { id: 'traurig-veraendert', roles: ['bestie'],
    question: 'Ist es OK dass ich innerlich traurig bin dass sich alles verändert?',
    context: 'Ja. Trauer um die alte Beziehung ist normal. Sprich sie an — nicht mit ihr, aber mit dir.',
    peerAnswers: [
      { from: 'Anonym, 29', text: 'Ich habe es einer anderen Freundin erzählt. Nicht ihr. Das war klug. Und ich war weniger sauer wenn sie mal wieder eine Nacht mit Baby verpasst hat.' },
    ] },
]

/* ============================================================
 * FEATURE 03 — Elternzeit-Assistent (Papa)
 * ============================================================
 * State liegt in DB (parental_leave_progress). Diese Datei
 * enthaelt die Guides und Anschreiben-Templates.
 */

export interface ElternzeitStep {
  id: string
  title: string
  detail: string
  deadline?: string
  optional?: boolean
}

export const ELTERNZEIT_STEPS: ElternzeitStep[] = [
  { id: 'planung',
    title: 'Zeitrahmen bestimmen',
    detail: 'Elternzeit maximal 3 Jahre pro Kind, bis zum 8. Geburtstag verteilbar. Fuer Vaeter ueblich: 2 Monate (Elterngeld-Bonus) in den ersten Wochen nach Geburt. Alternativ ausdehnen auf 3-4 Monate.',
    deadline: '~SSW 28' },
  { id: 'chef-gespraech',
    title: 'Chef informell informieren',
    detail: 'Nicht bindend, aber gute Praxis. So kann dein Team planen. Format: kurzes Meeting oder Ende eines 1:1s. Sag was du planst, nicht dass du fragst um Erlaubnis.',
    deadline: '~SSW 30-32',
    optional: true },
  { id: 'antrag',
    title: 'Formalen Antrag schriftlich einreichen',
    detail: 'Muss 7 Wochen vor Beginn beim Arbeitgeber sein. Per E-Mail plus Post (Einschreiben) empfohlen. Template unten.',
    deadline: 'spaetestens 7 Wochen vor Beginn' },
  { id: 'elterngeld',
    title: 'Elterngeld beantragen',
    detail: 'Nach Geburt, sobald Geburtsurkunde da ist. In Berlin: online. Andere Bundeslaender: Papier-Antrag. Website deiner Elterngeld-Stelle in Google-Suche „Elterngeld [Bundesland] Antrag".',
    deadline: 'binnen 3 Monate nach Geburt' },
  { id: 'krankenversicherung',
    title: 'Krankenversicherung / Familienversicherung pruefen',
    detail: 'Wenn du gesetzlich versichert bist: pauschal versichert waehrend Elternzeit. Wenn privat: pruefen ob Beitragsermaessigung moeglich.',
    optional: true },
]

export const ELTERNZEIT_LETTER_TEMPLATE = `Sehr geehrte:r [Vorgesetzte:r-Name],

hiermit beantrage ich gemäß § 15 Abs. 7 Bundeselterngeld- und Elternzeitgesetz (BEEG) Elternzeit für unser Kind, das voraussichtlich am [Geburtstermin] geboren wird.

Ich möchte Elternzeit im Zeitraum vom [Startdatum] bis zum [Enddatum] in Anspruch nehmen. In dieser Zeit werde ich [Anzahl] Wochen/Monate zu Hause sein.

Für Rückfragen zur Übergabe stehe ich Ihnen gerne zur Verfügung. Ich werde in den kommenden Wochen einen Übergabeplan erstellen und mit Ihnen abstimmen.

Mit freundlichen Grüßen
[Dein Name]

Datum: [Datum des Anschreibens]`

/* ============================================================
 * FEATURE 04 — Vater-zu-Vater Peer-Texte
 * ============================================================
 */

export interface PapaPeerText {
  id: string
  title: string
  body: string
  from: string
}

export const PAPA_PEER_TEXTS: PapaPeerText[] = [
  { id: 'erste-nacht',
    from: 'Jonas, 34, erstes Kind vor 2 Jahren',
    title: 'Die erste Nacht',
    body: 'Ich hab die erste Nacht geheult. Am dritten Tag ging es besser. Nach zwei Wochen hab ich mich gefragt wie ich je ohne dieses kleine Wesen gelebt habe. Zwischen diesen drei Momenten liegt was — aber es kommt.' },
  { id: 'stille',
    from: 'David, 38, drittes Kind',
    title: 'Manchmal ist Stille die Antwort',
    body: 'Sie hatte den ganzen Tag geweint. Ich wusste nicht was tun. Also hab ich einfach das Baby gehalten, wortlos, in der Küche gestanden. Sie kam nach 20 Min und sagte „Danke". Ich hatte nichts gesagt. Das war die Antwort.' },
  { id: 'nicht-bereit',
    from: 'Anonym, 29',
    title: 'Ich war nicht bereit',
    body: 'Ich hatte Panik in der 30. SSW. Ich dachte ich würde ein schlechter Vater. Meine Frau hat gesagt „Niemand ist bereit. Die anderen tun nur so." Sie hatte recht. Man lernt es. Nicht in einer Nacht, aber in Wochen.' },
  { id: 'kreissaal-nicht-loesen',
    from: 'Timo, 31',
    title: 'Im Kreissaal nicht alles lösen wollen',
    body: 'Ich wollte die Schmerzen wegdrücken, Ratschläge geben, machen. Die Hebamme hat mich zur Seite genommen: „Sei einfach da. Halt ihre Hand. Sprich leise. Alles andere machen wir." Das war das Wertvollste was mir jemand gesagt hat.' },
]

/* ============================================================
 * FEATURE 05 — „Damals — Heute" (Oma/Opa)
 * ============================================================
 * Fokus auf die Themen wo sich Empfehlungen konkret geändert haben.
 */

export interface DamalsHeuteItem {
  topic: string
  damals: string
  heute: string
  quelle?: string
}

export const DAMALS_HEUTE: DamalsHeuteItem[] = [
  { topic: 'Schlafposition',
    damals: 'Bauchlage — „schläft ruhiger, spuckt weniger".',
    heute: 'Ausschließlich Rückenlage. Zusammenhang zu SIDS ist eindeutig belegt.',
    quelle: 'Bundeszentrale für gesundheitliche Aufklärung (BZgA)' },
  { topic: 'Beikost-Start',
    damals: 'Ab 4 Monate — Karottenbrei oder Grießbrei.',
    heute: 'Frühestens 4 Monate, spätestens 6 Monate. Muttermilch oder Anfangsnahrung als Hauptquelle bis Ende 1. Lebensjahr.',
    quelle: 'DGKJ Ernährungskommission' },
  { topic: 'Honig unter 1 Jahr',
    damals: 'Ein Löffelchen im Tee gegen Husten war üblich.',
    heute: 'Nein. Kann Botulismus auslösen. Erst nach 12 Monaten.',
    quelle: 'Robert Koch-Institut' },
  { topic: 'Kopfform-Kissen (Positioner)',
    damals: 'Wurden häufig empfohlen.',
    heute: 'Nein. Ersticktungsrisiko. Baby liegt auf festem, flachem Untergrund, ohne Kissen oder Nestchen im Bett.',
    quelle: 'AAP · American Academy of Pediatrics' },
  { topic: 'Impfen',
    damals: '6-fach-Impfung, teils optional, teils diskutiert.',
    heute: 'STIKO-Empfehlung: 6-fach-Impfung + Rotaviren + Pneumokokken im ersten Halbjahr. Standard, kaum noch diskutiert im medizinischen Umfeld.',
    quelle: 'Ständige Impfkommission (STIKO)' },
  { topic: 'Stillen — wie lange',
    damals: 'Meist 3-6 Monate.',
    heute: 'WHO empfiehlt 6 Monate ausschließlich, dann parallel zu Beikost mind. bis 12 Monate — solange Mutter und Kind wollen. Kein Zwang, aber verändert die Erwartung.',
    quelle: 'WHO Guidelines' },
  { topic: 'Frühzeitige Kinderbetreuung',
    damals: 'Krippe war Ausnahme, oft mit Zweifel begleitet.',
    heute: 'Wissenschaftlicher Konsens: ab 12 Monaten hochwertige Krippe hat positive Effekte auf soziale Entwicklung. Kein „Schaden" für Bindung wenn Qualität stimmt.',
    quelle: 'NUBBEK-Studie 2013' },
]

/* ============================================================
 * FEATURE 06 — Fernhilfe (Oma/Opa)
 * ============================================================
 */

export interface FernhilfeIdee {
  id: string
  title: string
  detail: string
  aufwand: 'niedrig' | 'mittel' | 'hoch'
}

export const FERNHILFE_IDEEN: FernhilfeIdee[] = [
  { id: 'essen-abo',
    title: 'Essen-Lieferung als Abo',
    detail: 'Einmal pro Woche eine warme Mahlzeit über HelloFresh, Marley Spoon oder lokal beim Lieferservice. Für 8 Wochen buchen. Sie muss nur Tür öffnen.',
    aufwand: 'niedrig' },
  { id: 'reinigung',
    title: 'Reinigungsdienst 3× im Wochenbett',
    detail: 'Book Airtasker, Helpling oder lokal. Ein Termin in Woche 1, dann Woche 4, Woche 8. Bezahlung übers Portal, kein Bargeld.',
    aufwand: 'niedrig' },
  { id: 'video-ritual',
    title: 'Verlässlicher Video-Termin',
    detail: 'Feste Zeit einmal pro Woche (z.B. Sonntag 11 Uhr). Nicht spontan reinplatzen. Verlässlichkeit ist Ruhe. Über FaceTime, WhatsApp oder wo sie sich wohl fühlt.',
    aufwand: 'niedrig' },
  { id: 'brief',
    title: 'Handschriftlicher Brief einmal pro Monat',
    detail: 'Alt aber Wirkung. Kein digitaler Kanal. Kurze Zeilen, keine Ratschläge, nur Verbindung.',
    aufwand: 'niedrig' },
  { id: 'aupair',
    title: 'Aupair oder Nanny mitfinanzieren',
    detail: 'Für Familien mit älterem Geschwisterkind hilft eine bezahlte Betreuung enorm. Angebot: „Ich zahle 3 Nachmittage pro Woche für 4 Wochen." Sie sagt ja oder nein.',
    aufwand: 'hoch' },
  { id: 'stipend',
    title: 'Cash für unerwartete Kosten',
    detail: 'Regelmäßiger kleiner Zuschuss auf ihr Konto (z.B. 200€/Monat für 6 Monate). Ungebunden, keine Rechenschaft. Sie hat eine Reserve.',
    aufwand: 'hoch' },
]

/* ============================================================
 * FEATURE 07 — Besuchs-Etikette (Oma/Opa + Bestie)
 * ============================================================
 * Signal wird in DB gespeichert (partner_visit_signals).
 * Hier: Erklaerungen zu den drei Ampel-Zustaenden.
 */

export interface BesuchSignalMeta {
  key: 'green' | 'yellow' | 'red'
  label: string
  motherPrompt: string
  partnerPrompt: string
  emoji: string
}

export const BESUCH_SIGNAL_META: BesuchSignalMeta[] = [
  { key: 'green',
    emoji: '🟢',
    label: 'Bitte kommt',
    motherPrompt: 'Ich freue mich über Besuch. Vorher kurz anrufen ist trotzdem nett.',
    partnerPrompt: 'Sie freut sich. Bring etwas Warmes zum Essen mit — kein Gastgeschenk das Aufwand macht.' },
  { key: 'yellow',
    emoji: '🟡',
    label: 'Erst kurz absprechen',
    motherPrompt: 'Ich brauche gerade etwas Ruhe. Ruf mich vorher an, dann finden wir einen guten Moment.',
    partnerPrompt: 'Ruf sie vorher an. Kein WhatsApp — Anruf. Wenn du keine Antwort bekommst: verschiebe.' },
  { key: 'red',
    emoji: '🔴',
    label: 'Bitte noch nicht',
    motherPrompt: 'Ich brauche gerade Zeit für mich. Ich melde mich sobald ich bereit bin. Danke fürs Warten.',
    partnerPrompt: 'Sie hat gerade keinen Raum für Besuch. Schick eine liebe Nachricht ohne zu fragen wann. Sie meldet sich.' },
]

/* ============================================================
 * FEATURE 08 — Bestie-Rituale
 * ============================================================
 */

export interface BestieRitual {
  id: string
  moment: string
  suggestion: string
  ssw?: number
}

export const BESTIE_RITUALE: BestieRitual[] = [
  { id: 'halbzeit', ssw: 20, moment: 'Halbzeit-SSW 20',
    suggestion: 'Kleiner Anruf oder Sprachnachricht: „Halbzeit. Ich denk an dich. Kein Ratgeber, nur ich."' },
  { id: 'baby-shower', ssw: 32, moment: 'Baby-Shower-Idee',
    suggestion: 'Statt Party mit Fremden: intimes Frühstück zu dritt/viert. Sie muss nichts organisieren.' },
  { id: 'letzter-nachmittag', ssw: 36, moment: 'Letzter „Nur wir"-Nachmittag',
    suggestion: 'Reserviere einen konkreten Nachmittag in ihrer Nähe. Café, Spaziergang, Nagelstudio — egal. Nur nicht Baby-Themen.' },
  { id: 'sos-woche-1', moment: 'SOS-Angebot in Woche 1',
    suggestion: 'Sag ihr klar: „Ich hab am Mittwoch 4 Std frei. Ich komm zu dir. Wäsche, Einkauf, was du willst — oder nur da sein." Konkret.' },
  { id: 'girls-only-3-monate', moment: '3 Monate nach Geburt',
    suggestion: 'Ein Abend ohne Baby, ohne Partner — nur ihr zwei. Sie hat mit Baby dann meist gerade genug Rhythmus für ein Ausrutschen. Bring das Angebot proaktiv.' },
]

/* ============================================================
 * FEATURE 09 — Geschenke-Kurator
 * ============================================================
 * Affiliate-fähig — später mit tatsächlichen Amazon-ASINs
 * gefüllt. Erste 12 Produkte, sortiert nach Wirkung.
 */

export interface Geschenk {
  id: string
  category: 'service' | 'praktisch' | 'wohlfuehl' | 'buch'
  title: string
  why: string
  priceRange: string
  affiliate?: { asin?: string; url?: string }
}

export const GESCHENKE: Geschenk[] = [
  { id: 'reinigungsdienst', category: 'service', priceRange: '€60-90',
    title: 'Reinigungsdienst-Gutschein (3× 2h)',
    why: 'Eines der wirksamsten Geschenke. Sie muss nichts tun, Wohnung ist sauber. Buchbar über Helpling, Book-a-tiger.' },
  { id: 'kochabo', category: 'service', priceRange: '€120-180',
    title: 'HelloFresh Familien-Abo für 4 Wochen',
    why: 'Nächste 4 Wochen keine Einkaufsplanung, kein Rezept-Google. Wichtig: Familien-Portion wählen, mit Papa und älteren Geschwistern.' },
  { id: 'massage', category: 'wohlfuehl', priceRange: '€60-100',
    title: 'Massage-Gutschein für Woche 12 nach Geburt',
    why: 'Nicht direkt nach der Geburt (unrealistisch). Für Woche 12 mit Datum vermerken. Sie freut sich.' },
  { id: 'stilleinlagen', category: 'praktisch', priceRange: '€25',
    title: 'Bambus-Stilleinlagen Mehrweg-Set',
    why: 'Alle Erstlings-Mütter unterschätzen wie viel gebraucht wird. Nachhaltig statt Einweg.',
    affiliate: { asin: 'B08XYZ' /* placeholder */ } },
  { id: 'wickelunterlage', category: 'praktisch', priceRange: '€35',
    title: 'Waschbare Wickelunterlage 3er-Set',
    why: 'Fürs Sofa, fürs Bett, fürs Wickeln unterwegs. Waschmaschinenfest, öko-tex zertifiziert.' },
  { id: 'nestchen', category: 'praktisch', priceRange: '€45-60',
    title: 'Doomoo Buddy Nestchen',
    why: 'Stützt Bauch/Rücken beim Stillen, waschbar bis 60°. Nicht fürs Baby-Bett (SIDS), sondern für sie zum Stillen.' },
  { id: 'buch-stillen', category: 'buch', priceRange: '€22',
    title: 'Buch „Intuitives Stillen" von Regine Gresens',
    why: 'Nicht dogmatisch, sondern beobachtend. Hilft mehr als jeder Hebammen-Ratgeber-Klassiker.' },
  { id: 'buch-wochenbett', category: 'buch', priceRange: '€18',
    title: 'Buch „Die 40 Tage" — Wochenbett-Klassiker',
    why: 'Weniger Erziehungsbuch, mehr Perspektiv-Rahmen. Wenn sie eher literarisch als Ratgeber-orientiert ist: dieses.' },
  { id: 'gerobe', category: 'wohlfuehl', priceRange: '€55-80',
    title: 'Kuschel-Robe / Bademantel für Wochenbett',
    why: 'Sie wird 6 Wochen im Bademantel leben. Ein guter, wärmender Bademantel — Frottier oder Waffelpiquée.' },
  { id: 'thermos', category: 'praktisch', priceRange: '€25-35',
    title: 'Große Thermoskanne mit Tragriemen',
    why: 'Beim Stillen braucht sie Wasser oder Tee, nachts. Kanne die 12h warm hält, groß genug für die Nacht.' },
  { id: 'brief-zeit', category: 'wohlfuehl', priceRange: 'kostenlos',
    title: 'Brief mit „Ich hab Zeit für dich"-Coupons',
    why: 'Schreib 10 Coupons in einen Umschlag: „Ein Abend bei mir mit Wein" · „Ein Nachmittag zusammen ohne Baby" · „Ein Anruf um 3 Uhr morgens". Sie kann sie einlösen wenn sie mag.' },
  { id: 'foto-abzug', category: 'wohlfuehl', priceRange: '€30-50',
    title: 'Foto-Abzug der Freundschaft, gerahmt',
    why: 'Kein Baby-Foto. Ein Foto von euch zwei — gerahmt. Symbol: „Wir bleiben." Steht neben ihrem Bett.' },
]

/* ============================================================
 * FEATURE 10 — PPD-Awareness (alle Rollen)
 * ============================================================
 * Postpartum-Depression: Signale, was tun, Anlaufstellen.
 * Diese Sektion braucht Disclaimer + Notfall-Hotline.
 */

export interface PPDSignal {
  id: string
  label: string
  detail: string
  severity: 'watch' | 'concern' | 'urgent'
}

export const PPD_SIGNALE: PPDSignal[] = [
  { id: 'traurigkeit-2-wochen', severity: 'concern',
    label: 'Anhaltende Traurigkeit über 2 Wochen',
    detail: 'Baby-Blues ist normal in den ersten Tagen. Wenn Traurigkeit nach 2 Wochen anhält oder schlimmer wird: Signal.' },
  { id: 'keine-freude', severity: 'concern',
    label: 'Keine Freude am Baby',
    detail: 'Wenn sie sagt „ich fühle nichts" oder „ich hätte es nicht tun sollen" — nicht bagatellisieren.' },
  { id: 'schuld-schaden', severity: 'urgent',
    label: 'Gedanken sich oder dem Baby zu schaden',
    detail: 'Sofortiger Handlungsbedarf. Direkt Klinik/Notaufnahme aufsuchen oder 112. Nicht warten bis morgen.' },
  { id: 'panikattacken', severity: 'concern',
    label: 'Panikattacken oder starke Ängste',
    detail: 'Herzrasen, Beklemmung, Panik vor „was schiefgehen kann" — häufig bei postpartaler Angststörung.' },
  { id: 'isolation', severity: 'watch',
    label: 'Zieht sich immer weiter zurück',
    detail: 'Alle Anrufe ignoriert, Fenster zu, keine Antworten mehr auf WhatsApp — Warnzeichen wenn länger als 1 Woche.' },
  { id: 'schlaf-nie', severity: 'watch',
    label: 'Kann nicht schlafen obwohl Baby schläft',
    detail: 'Übernächtig sein ist normal. Nicht schlafen können wenn Möglichkeit besteht ist ein anderes Signal.' },
]

export const PPD_HOTLINES = [
  { name: 'Schatten &amp; Licht — Krise nach der Geburt', phone: '0800 3776 0000',
    hours: 'Mo-Fr 8-18 Uhr', kostenlos: true,
    url: 'https://www.schatten-und-licht.de' },
  { name: 'Hilfetelefon Schwangere in Not', phone: '0800 40 40 020',
    hours: 'Rund um die Uhr, mehrsprachig', kostenlos: true },
  { name: 'Telefonseelsorge', phone: '0800 111 0 111',
    hours: 'Rund um die Uhr, anonym', kostenlos: true },
  { name: 'Ärztlicher Bereitschaftsdienst', phone: '116 117',
    hours: 'Rund um die Uhr', kostenlos: true },
  { name: 'Rettungsdienst', phone: '112',
    hours: 'Notfall — sofort', kostenlos: true },
]
