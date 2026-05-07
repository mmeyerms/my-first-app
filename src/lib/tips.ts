import type { Locale } from './i18n/types'
import type { LocalizedString } from './i18n/localized'
import { localized } from './i18n/localized'

export type TipCategory = 'praktisch' | 'mindset' | 'partnerschaft' | 'reflexion'

export interface Tip {
  id: string
  sswFrom: number
  sswTo: number
  category: TipCategory
  emoji: string
  text: LocalizedString
  detail?: LocalizedString
}

export const TIPS: Tip[] = [
  // SSW 1–4 — Die ersten Wochen
  {
    id: 't01a',
    sswFrom: 1,
    sswTo: 4,
    category: 'mindset',
    emoji: '✨',
    text: {
      de: 'Du trägst ein neues Leben in dir. Das ist ein Wunder — auch wenn es sich noch nicht so anfühlt. Gib dir Zeit anzukommen.',
      en: 'You are carrying a new life inside you. That is a miracle — even if it does not yet feel like one. Give yourself time to arrive.',
    },
    detail: {
      de: 'Die ersten Wochen fühlen sich oft surreal an. Vielleicht zweifelst du am Test, vielleicht spürst du nichts, vielleicht ist alles auf einmal zu viel. Das ist normal. Niemand wird über Nacht zur Mutter — du wächst Tag für Tag in diese Rolle hinein. Lass dir die Zeit, die du brauchst, ohne dich für deine Gefühle zu rechtfertigen.',
      en: 'The first weeks often feel surreal. Maybe you doubt the test, maybe you feel nothing, maybe everything is too much at once. That is normal. Nobody becomes a mother overnight — you grow into the role day by day. Take the time you need, without justifying your feelings to anyone.',
    },
  },
  {
    id: 't01b',
    sswFrom: 1,
    sswTo: 4,
    category: 'praktisch',
    emoji: '💊',
    text: {
      de: 'Folsäure ist jetzt besonders wichtig. Falls du noch keine nimmst — sprich heute noch mit deiner Ärztin oder deinem Arzt.',
      en: 'Folic acid is especially important now. If you are not taking any yet, talk to your doctor today.',
    },
    detail: {
      de: '400 Mikrogramm Folsäure pro Tag senken nachweislich das Risiko für Neuralrohrdefekte beim Baby. Idealerweise nimmt man sie schon vor der Schwangerschaft — aber jetzt ist immer noch früh genug. Apotheken haben sie ohne Rezept. Achte zusätzlich auf Jod und ggf. Eisen — dein Arzt kann das beim ersten Termin checken.',
      en: '400 micrograms of folic acid a day are proven to lower the risk of neural tube defects. Ideally you start before pregnancy — but now is still early enough. You can buy it over the counter at any pharmacy. Also keep an eye on iodine and possibly iron — your doctor can check both at your first appointment.',
    },
  },
  {
    id: 't01c',
    sswFrom: 1,
    sswTo: 4,
    category: 'reflexion',
    emoji: '🌱',
    text: {
      de: 'Wie fühlst du dich heute? Glücklich, ängstlich, überwältigt? Alle Gefühle sind erlaubt. Du musst dich nicht entscheiden.',
      en: 'How do you feel today? Happy, anxious, overwhelmed? All feelings are allowed. You do not have to choose just one.',
    },
    detail: {
      de: 'Viele Frauen erwarten von sich pures Glück — und sind dann erschrocken über Angst, Zweifel oder Wehmut über das alte Leben. Diese Ambivalenz ist nicht das Gegenteil von Liebe. Sie ist Teil davon. Du darfst dich auf dein Baby freuen UND um deine Freiheit trauern. Beides hat Platz.',
      en: 'Many women expect themselves to feel nothing but joy — and are shocked by fear, doubt or grief for their old life. This ambivalence is not the opposite of love. It is part of it. You are allowed to look forward to your baby AND mourn the freedom you are losing. Both can be true.',
    },
  },
  {
    id: 't01d',
    sswFrom: 1,
    sswTo: 4,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Wenn du es noch niemandem erzählt hast — das ist völlig in Ordnung. Das Geheimnis gehört euch.',
      en: 'If you have not told anyone yet — that is completely fine. The secret belongs to the two of you.',
    },
    detail: {
      de: 'Diese ersten Wochen sind ein eigener kleiner Raum, in dem nur ihr beide Bescheid wisst. Nutzt das. Macht einen besonderen Spaziergang, einen ruhigen Abend, ein gemeinsames Foto, das ihr später eurem Kind zeigen könnt. Das Außen kommt schnell genug — diese Stille zu zweit kommt nicht zurück.',
      en: 'These first weeks are a small private space that only the two of you share. Use it. Take a special walk, have a quiet evening, take a photo together that you can show your child one day. The outside world comes soon enough — this quiet time as a couple does not come back.',
    },
  },
  {
    id: 't01e',
    sswFrom: 1,
    sswTo: 4,
    category: 'mindset',
    emoji: '🌊',
    text: {
      de: 'Du musst nicht jeden Tag funktionieren. Manche Tage sind nur zum Überleben da.',
      en: 'You do not have to function every day. Some days are just for getting through.',
    },
    detail: {
      de: 'Wenn du im ersten Trimester um 19 Uhr ins Bett gehst, ist das keine Niederlage — das ist Hochleistungssport. Dein Körper baut gerade eine Plazenta und versorgt ein wachsendes Baby mit allem was es braucht. Das kostet ungefähr so viel Energie wie ein leichter Marathonlauf — täglich. Sei großzügig mit dir.',
      en: 'If you go to bed at 7 pm in the first trimester, that is not defeat — that is endurance sport. Your body is building a placenta and supplying a growing baby with everything it needs. That takes about as much energy as a light marathon — every day. Be generous with yourself.',
    },
  },

  // SSW 5–8 — Übelkeit & erste Anzeichen
  {
    id: 't05a',
    sswFrom: 5,
    sswTo: 8,
    category: 'praktisch',
    emoji: '🍋',
    text: {
      de: 'Übelkeit? Kleine, häufige Mahlzeiten helfen oft mehr als große Portionen. Ingwertee, Salzcracker oder Zitronenduft können Linderung bringen.',
      en: 'Nausea? Small frequent meals often help more than large portions. Ginger tea, salty crackers or the scent of lemon can bring relief.',
    },
    detail: {
      de: 'Ein Keks neben dem Bett — gegessen noch bevor du aufstehst — kann den Morgen komplett verändern. Salzige Cracker, trockenes Brot, eine Scheibe Toast. Der Geruch von Kaffee, Zwiebeln oder bestimmten Parfums kann Übelkeit auslösen — das ist normal und kein Zeichen von Schwäche. Wenn die Übelkeit so stark ist dass du nichts behalten kannst: bitte deinen Arzt — es gibt sichere Mittel.',
      en: 'A cracker on your nightstand — eaten before you even get up — can change your whole morning. Salty crackers, dry bread, a slice of toast. The smell of coffee, onions or certain perfumes can trigger nausea — that is normal, not a sign of weakness. If the nausea is so severe you cannot keep anything down, please ask your doctor — there are safe medications.',
    },
  },
  {
    id: 't05b',
    sswFrom: 5,
    sswTo: 8,
    category: 'mindset',
    emoji: '🌸',
    text: {
      de: 'Übelkeit bedeutet: dein Körper arbeitet hart für das Baby. Du bist nicht schwach — du bist stark.',
      en: 'Nausea means your body is working hard for the baby. You are not weak — you are strong.',
    },
    detail: {
      de: 'Wissenschaftler sagen: Übelkeit ist oft ein Zeichen einer gesunden, hormonell aktiven Schwangerschaft. Es ist kein Trostpflaster — es ist ein Hinweis darauf, dass dein Körper genau das tut, was er soll. An schlechten Tagen darfst du das vergessen. Lieg auf der Couch, weine wenn du musst, und denk dran: das geht meist nach Woche 12 deutlich besser.',
      en: 'Researchers say nausea is often a sign of a healthy, hormonally active pregnancy. This is not a consolation prize — it is evidence your body is doing exactly what it should. On bad days you are allowed to forget all that. Lie on the couch, cry if you need to, and remember: it usually gets much better after week 12.',
    },
  },
  {
    id: 't05c',
    sswFrom: 5,
    sswTo: 8,
    category: 'reflexion',
    emoji: '📓',
    text: {
      de: 'Manche Frauen beginnen jetzt ein Schwangerschaftstagebuch. Kein Druck — aber vielleicht magst du heute einen ersten Satz schreiben?',
      en: 'Some women start a pregnancy journal around now. No pressure — but maybe you feel like writing a first sentence today?',
    },
    detail: {
      de: 'Nicht für Instagram. Nicht für dein Kind. Für dich, in zehn Jahren. Was fühlst du heute? Was macht dir Angst? Was freut dich am meisten? Schwangerschaften sind intensiv und vergehen schnell — die kleinen Gedanken verblassen als erstes. Ein Notizbuch, eine App, eine Sprachnotiz — alles zählt.',
      en: 'Not for Instagram. Not for your child. For you, ten years from now. What do you feel today? What scares you? What makes you happiest? Pregnancies are intense and pass quickly — the small thoughts are the first to fade. A notebook, an app, a voice memo — anything counts.',
    },
  },
  {
    id: 't05d',
    sswFrom: 5,
    sswTo: 8,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Dein Partner weiß vielleicht nicht, wie er helfen soll. Sei konkret: "Ich brauche heute Abend Ruhe" oder "Kannst du kochen?"',
      en: 'Your partner may not know how to help. Be specific: "I need a quiet evening" or "Can you cook tonight?"',
    },
    detail: {
      de: 'Partner sind keine Gedankenleser — und gerade Männer fühlen sich oft hilflos, weil sie nichts "Sichtbares" tun können. Konkrete Bitten sind ein Geschenk. "Bring mir bitte einen Tee", "Übernimm heute den Einkauf", "Halt mich einfach mal." Je klarer du sagst was du brauchst, desto entspannter werdet ihr beide.',
      en: 'Partners are not mind readers — and men in particular often feel helpless because there is nothing visible they can do. Concrete requests are a gift. "Please bring me a cup of tea." "Do the grocery shopping today." "Just hold me." The clearer you are about what you need, the more relaxed both of you will be.',
    },
  },
  {
    id: 't05e',
    sswFrom: 5,
    sswTo: 8,
    category: 'praktisch',
    emoji: '☕',
    text: {
      de: 'Kaffee runterfahren — aber sanft. Bis 200 mg pro Tag (eine kleine Tasse) gilt als unbedenklich.',
      en: 'Cut back on coffee — but gently. Up to 200 mg per day (one small cup) is considered safe.',
    },
    detail: {
      de: 'Du musst nicht von heute auf morgen alles streichen. Ein abrupter Entzug bringt Kopfschmerzen, schlechte Laune und mehr Stress als gut tut. Misch deinen Kaffee mit halb entkoffeiniertem, wechsle auf grünen Tee, oder probier mal einen Lupinen-Cappuccino. Dein Geschmack verändert sich in der Schwangerschaft sowieso — vielleicht magst du Kaffee bald gar nicht mehr.',
      en: 'You do not have to quit overnight. Sudden withdrawal brings headaches, bad mood and more stress than it is worth. Mix your coffee half decaf, switch to green tea, or try a lupin cappuccino. Your taste will change during pregnancy anyway — you may not even like coffee in a few weeks.',
    },
  },

  // SSW 9–12 — Erstes Trimester Endspurt
  {
    id: 't09a',
    sswFrom: 9,
    sswTo: 12,
    category: 'praktisch',
    emoji: '🏥',
    text: {
      de: 'Der erste große Ultraschall steht bald an. Schreib deine Fragen für die Ärztin schon jetzt auf — damit du im Moment nichts vergisst.',
      en: 'The first big ultrasound is coming up. Write your questions down now — so you do not forget anything in the moment.',
    },
    detail: {
      de: 'Im Behandlungszimmer ist man oft aufgeregt und vergisst die Hälfte. Mach dir vorher Notizen auf dem Handy: Wie ist der Mutterpass zu lesen? Wann darf ich reisen? Welche Sportarten sind ok? Was ist mit Sex? Welche Symptome sollten sofort gemeldet werden? Niemand findet diese Fragen dumm — und du bekommst die Antworten nur wenn du fragst.',
      en: 'In the exam room you are usually nervous and forget half of what you wanted to ask. Make notes on your phone in advance: How do I read my pregnancy record book? When can I travel? Which sports are okay? What about sex? Which symptoms should I report immediately? Nobody thinks these questions are silly — and you only get answers if you ask.',
    },
  },
  {
    id: 't09b',
    sswFrom: 9,
    sswTo: 12,
    category: 'mindset',
    emoji: '🌙',
    text: {
      de: 'Erschöpfung im ersten Trimester ist real und normal. Dein Körper baut gerade eine Plazenta auf. Ruh dich aus, wann immer du kannst.',
      en: 'First trimester exhaustion is real and normal. Your body is building a placenta. Rest whenever you can.',
    },
    detail: {
      de: 'Die Plazenta ist ein komplettes neues Organ, das dein Körper aus dem Nichts wachsen lässt — ein Wunder der Biologie. Sobald sie fertig ist (meist um Woche 12-14), übernimmt sie viel Arbeit, und du fühlst dich oft schlagartig besser. Bis dahin: 10-Minuten-Powernaps am Mittag, früher ins Bett, weniger Verabredungen. Niemand wird das später hinterfragen.',
      en: 'The placenta is a brand new organ your body grows from nothing — a biological miracle. Once it is finished (usually around week 12 to 14) it takes over a lot of work and you often feel suddenly better. Until then: 10-minute power naps at midday, earlier bedtime, fewer plans. Nobody will hold it against you later.',
    },
  },
  {
    id: 't09c',
    sswFrom: 9,
    sswTo: 12,
    category: 'reflexion',
    emoji: '💭',
    text: {
      de: 'Wann möchtest du es wem sagen? Überleg heute, wer die erste Person sein soll, die es erfährt — außer euch beiden.',
      en: 'When do you want to tell whom? Think today about who should be the first person to know — apart from the two of you.',
    },
    detail: {
      de: 'Manche warten bis nach dem 12-Wochen-Ultraschall, andere brauchen sofort eine Vertraute. Beides ist richtig. Denk dran: Wer es weiß, weiß es auch im Falle einer Fehlgeburt. Wähle Menschen, die dich tragen würden — nicht nur die, die sich freuen würden. Das ist ein Unterschied.',
      en: 'Some women wait until after the 12-week scan, others need a confidante right away. Both are valid. Remember: whoever knows now would also know if you had a miscarriage. Choose people who would carry you through it — not just those who would celebrate. There is a difference.',
    },
  },
  {
    id: 't09d',
    sswFrom: 9,
    sswTo: 12,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Bald könnt ihr das erste Mal gemeinsam das Herzchen schlagen hören. Ein Moment, den ihr nicht vergessen werdet.',
      en: 'Soon the two of you will hear the heartbeat together for the first time. A moment you will never forget.',
    },
    detail: {
      de: 'Plant den Termin so, dass dein Partner mitkommen kann — auch wenn es Urlaub kostet oder eine Schicht getauscht werden muss. Dieser kleine, schnelle Ton aus dem Ultraschall macht etwas mit Vätern: Vorher abstrakt, danach plötzlich real. Es ist oft DER Moment, in dem aus "Schwangerschaft" "unser Baby" wird.',
      en: 'Plan the appointment so your partner can come — even if it costs a day off or a swapped shift. That small, fast sound from the ultrasound does something to fathers: abstract before, suddenly real after. It is often THE moment when "pregnancy" becomes "our baby".',
    },
  },
  {
    id: 't09e',
    sswFrom: 9,
    sswTo: 12,
    category: 'praktisch',
    emoji: '🩺',
    text: {
      de: 'Mutterpass immer dabei haben — er ist deine medizinische Visitenkarte für jede Notfallsituation.',
      en: 'Always carry your Mutterpass (pregnancy record book) — it is your medical ID in any emergency.',
    },
    detail: {
      de: 'Pack ihn in deine Handtasche, nicht in den Schrank. Im Zweifelsfall (Blutungen, Unfall, Reise) brauchst du ihn sofort. Auf Reisen idealerweise zusätzlich ein Foto der wichtigsten Seiten auf dem Handy — falls die Tasche mal verloren geht. Klingt übertrieben, ist aber gold wert wenn der Fall eintritt.',
      en: 'Keep it in your handbag, not in a drawer. If something happens (bleeding, accident, while travelling) you need it immediately. When travelling, also keep a photo of the key pages on your phone — in case the bag gets lost. Sounds excessive, but it is priceless when you actually need it.',
    },
  },

  // SSW 13–16 — Zweites Trimester beginnt
  {
    id: 't13a',
    sswFrom: 13,
    sswTo: 16,
    category: 'mindset',
    emoji: '🌈',
    text: {
      de: 'Willkommen im zweiten Trimester! Viele Frauen beschreiben es als die schönste Phase. Die Übelkeit lässt nach — die Vorfreude wächst.',
      en: 'Welcome to the second trimester! Many women describe it as the loveliest phase. The nausea fades — the anticipation grows.',
    },
    detail: {
      de: 'Das zweite Trimester wird oft "Honeymoon-Phase" genannt — und das ist kein Zufall. Hormone stabilisieren sich, der Bauch ist sichtbar aber nicht störend, du hast wieder Energie. Nutze diese Wochen für alles, was später schwerer wird: Reisen, Restaurantbesuche, lange Spaziergänge, gemeinsame Zeit. Das dritte Trimester kommt schneller als du denkst.',
      en: 'The second trimester is often called the "honeymoon phase" — and that is no coincidence. Hormones stabilise, your bump is visible but not yet in the way, your energy returns. Use these weeks for everything that gets harder later: travel, restaurants, long walks, time together. The third trimester arrives faster than you think.',
    },
  },
  {
    id: 't13b',
    sswFrom: 13,
    sswTo: 16,
    category: 'praktisch',
    emoji: '📋',
    text: {
      de: 'Jetzt ist ein guter Zeitpunkt, sich um einen Platz in einem Geburtsvorbereitungskurs zu kümmern. Die beliebtesten sind schnell ausgebucht.',
      en: 'Now is a good time to book a spot in a childbirth preparation class. The popular ones fill up fast.',
    },
    detail: {
      de: 'Hebammen-Kurse, Hypnobirthing, Wassergymnastik — die Auswahl ist groß. Frag in der Hebammenpraxis, in deiner Klinik oder bei Freundinnen mit Kindern. Die Kosten übernimmt meist die Krankenkasse für dich (Partner manchmal nicht). Wichtig: Kurse für werdende Eltern starten oft in SSW 28 — aber Anmeldung ist jetzt.',
      en: 'Midwife-led classes, hypnobirthing, water exercise — the choice is wide. Ask at your midwife practice, your hospital or friends with children. In Germany the cost is usually covered by health insurance for you (sometimes not for partners) — check what your local system covers. Most courses start around week 28, but you need to sign up now.',
    },
  },
  {
    id: 't13c',
    sswFrom: 13,
    sswTo: 16,
    category: 'reflexion',
    emoji: '🌿',
    text: {
      de: 'Was ist dein größter Wunsch für die Geburt? Noch kein Plan nötig — aber fang an, dir Gedanken zu machen.',
      en: 'What is your biggest wish for the birth? No plan needed yet — but start thinking about it.',
    },
    detail: {
      de: 'Vielleicht: "Ich möchte mich sicher fühlen." "Ich möchte aktiv sein dürfen." "Ich möchte, dass mein Partner an meiner Seite ist." Wünsche sind keine Pläne — sie sind dein innerer Kompass. Aus dem ersten Wunsch ergeben sich später automatisch die richtigen Fragen für den Geburtsplan-Wizard.',
      en: 'Maybe: "I want to feel safe." "I want to be allowed to move freely." "I want my partner by my side." Wishes are not plans — they are your inner compass. Once you have your first wish, the right questions for the birth plan wizard will follow naturally.',
    },
  },
  {
    id: 't13d',
    sswFrom: 13,
    sswTo: 16,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Teile deinem Partner heute eine Seite aus unserem Geburtsplan-Wizard. Gemeinsam darüber nachdenken schafft Nähe.',
      en: 'Share a page from our birth plan wizard with your partner today. Thinking it through together creates closeness.',
    },
    detail: {
      de: 'Geburtsplan ist nicht nur deine Aufgabe. Wenn dein Partner sich früh mit den Fragen beschäftigt, ist er/sie im entscheidenden Moment vorbereitet — und kann für dich sprechen, wenn du nicht kannst. Macht einen "Geburtsplan-Abend" daraus: ein Glas (alkoholfreier) Sekt, Snacks, und gemeinsam durch den Wizard scrollen.',
      en: 'The birth plan is not yours alone. If your partner engages with the questions early, they will be prepared in the decisive moment — and can speak for you when you cannot. Turn it into a "birth plan evening": a glass of alcohol-free sparkling wine, snacks, and scroll through the wizard together.',
    },
  },
  {
    id: 't13e',
    sswFrom: 13,
    sswTo: 20,
    category: 'reflexion',
    emoji: '📝',
    text: {
      de: 'Fang heute ein Schwangerschaftstagebuch an — auch wenn es nur 3 Sätze sind.',
      en: 'Start a pregnancy journal today — even if it is just three sentences.',
    },
    detail: {
      de: 'Nicht für Instagram. Nicht für dein Kind. Für dich, in zehn Jahren. Was fühlst du heute? Was macht dir Angst? Was freut dich am meisten? Schwangerschaften sind intensiv und vergehen schnell — die kleinen Gedanken verblassen als erstes. Ein Notizbuch, eine App, ein Sprachnotiz — alles zählt.',
      en: 'Not for Instagram. Not for your child. For you, ten years from now. What do you feel today? What scares you? What makes you happiest? Pregnancies are intense and pass quickly — the small thoughts are the first to fade. A notebook, an app, a voice memo — anything counts.',
    },
  },

  // SSW 17–20 — Baby bewegt sich
  {
    id: 't17a',
    sswFrom: 17,
    sswTo: 20,
    category: 'mindset',
    emoji: '🦋',
    text: {
      de: 'Bald wirst du die ersten Kindsbewegungen spüren — oft wie ein Kribbeln oder Flattern. Sei geduldig, sie kommen.',
      en: 'Soon you will feel the first movements — often like a tingle or a flutter. Be patient, they will come.',
    },
    detail: {
      de: 'Erstgebärende spüren sie meist zwischen SSW 18 und 22 — manche früher, manche später. Es fühlt sich nicht wie ein Tritt an, sondern wie kleine Bläschen oder ein Fisch im Bauch. Wenn du gestresst bist, im Stehen oder beim Sport: oft spürt man nichts. Leg dich ruhig hin, lege die Hände auf den Bauch, atme. Dann kommen sie.',
      en: 'First-time mums usually feel them between weeks 18 and 22 — some earlier, some later. It does not feel like a kick, more like little bubbles or a fish swimming inside. When you are stressed, standing or exercising you often feel nothing. Lie down quietly, put your hands on your belly, breathe. Then they come.',
    },
  },
  {
    id: 't17b',
    sswFrom: 17,
    sswTo: 20,
    category: 'praktisch',
    emoji: '👩‍⚕️',
    text: {
      de: 'Ab SSW 20 empfiehlt es sich, eine Hebamme für die Nachsorge zu suchen. Gute Hebammen sind schnell vergeben — früh anfragen lohnt sich.',
      en: 'From week 20 onwards it is wise to look for a midwife for postpartum care. Good midwives are booked quickly — start asking early.',
    },
    detail: {
      de: 'Schreib mehrere Hebammen gleichzeitig an — die meisten haben volle Auftragsbücher und antworten nicht immer. In ländlichen Regionen kann es knapp werden, in Großstädten manchmal monatelange Wartelisten. Plattformen wie hebammensuche.de, ammely oder lokale Hebammenverbände helfen. Frag auch in deiner Frauenarztpraxis nach Empfehlungen.',
      en: 'Contact several midwives at once — most have full books and do not always reply. In rural areas it can be tight; in big cities there are sometimes waiting lists of months. In Germany, platforms like hebammensuche.de or ammely help — wherever you are, your local midwife association or your OB-GYN can recommend someone.',
    },
  },
  {
    id: 't17c',
    sswFrom: 17,
    sswTo: 20,
    category: 'reflexion',
    emoji: '💭',
    text: {
      de: 'Wie stellst du dir den ersten Tag mit dem Baby vor? Kein richtiges oder falsches Bild — lass deiner Fantasie freien Lauf.',
      en: 'How do you imagine the first day with your baby? No right or wrong picture — let your imagination run free.',
    },
    detail: {
      de: 'Manche sehen sich auf dem Sofa kuscheln, andere im Park, andere total überfordert mit nassem Haar und Müsli im Gesicht. Alle Bilder sind gültig — und keines wird genau so eintreten. Aber das innere Bild zu haben hilft, eigene Erwartungen zu erkennen. Schreib es auf — und schau in einem Jahr darauf zurück.',
      en: 'Some picture cuddling on the couch, others a walk in the park, others total chaos with wet hair and cereal on their face. Every picture is valid — and none will come true exactly as you imagine. But having an inner picture helps you notice your own expectations. Write it down — and look back at it in a year.',
    },
  },
  {
    id: 't17d',
    sswFrom: 17,
    sswTo: 20,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Wenn du die ersten Bewegungen spürst, leg die Hand deines Partners auf deinen Bauch. Diesen Moment werdet ihr beide nie vergessen.',
      en: 'When you feel the first movements, place your partner\'s hand on your belly. Neither of you will ever forget that moment.',
    },
    detail: {
      de: 'Anfangs sind die Bewegungen für andere noch nicht spürbar — auch nicht für den Partner. Das ändert sich meist um SSW 22-24. Bis dahin: erzähl ihm/ihr trotzdem davon. "Gerade hat es sich gemeldet." Das macht das Baby auch für den Partner real, lange bevor er/sie etwas spürt.',
      en: 'At first the movements are not yet noticeable from the outside — not even for your partner. That usually changes around weeks 22 to 24. Until then: tell them anyway. "It just kicked again." That makes the baby real for your partner long before they can feel anything.',
    },
  },
  {
    id: 't17e',
    sswFrom: 17,
    sswTo: 20,
    category: 'praktisch',
    emoji: '🛏️',
    text: {
      de: 'Schlaf jetzt am besten auf der linken Seite — das verbessert die Durchblutung der Plazenta.',
      en: 'Sleep on your left side now if you can — it improves blood flow to the placenta.',
    },
    detail: {
      de: 'Auf dem Rücken kann ab dem zweiten Trimester die untere Hohlvene zusammengedrückt werden — das wird unangenehm. Die linke Seitenlage gilt als optimal. Ein Schwangerschaftskissen (zwischen den Knien, unter dem Bauch) macht einen Riesenunterschied. Es muss kein 100-Euro-Modell sein — auch ein langes normales Kissen tut es.',
      en: 'From the second trimester onwards, lying on your back can compress the inferior vena cava — uncomfortable for you. Lying on the left side is considered optimal. A pregnancy pillow (between your knees, under your bump) makes a huge difference. It does not have to be an expensive model — a long regular pillow does the job.',
    },
  },

  // SSW 21–24 — Mitte der Schwangerschaft
  {
    id: 't21a',
    sswFrom: 21,
    sswTo: 24,
    category: 'mindset',
    emoji: '🌺',
    text: {
      de: 'Dein Bauch wächst sichtbar. Manche lieben das — andere brauchen etwas Zeit. Beides ist vollkommen normal.',
      en: 'Your bump is visibly growing. Some women love it — others need a bit of time. Both are completely normal.',
    },
    detail: {
      de: 'Wenn du dich in deinem Körper fremd fühlst, bist du nicht allein. Dehnungsstreifen, Wassereinlagerungen, eine breitere Nase, dunklere Brustwarzen — vieles ändert sich. Manche dieser Änderungen bleiben, viele gehen wieder. Aber dein Körper macht gerade etwas Außergewöhnliches. Versuch ihm zu danken, auch wenn du ihn nicht jeden Tag liebst.',
      en: 'If you feel like a stranger in your own body, you are not alone. Stretch marks, water retention, a wider nose, darker nipples — a lot is changing. Some of these changes stay, many fade again. But your body is doing something extraordinary right now. Try to thank it, even on the days you do not love it.',
    },
  },
  {
    id: 't21b',
    sswFrom: 21,
    sswTo: 24,
    category: 'praktisch',
    emoji: '💧',
    text: {
      de: 'Genug trinken ist jetzt besonders wichtig. 2–3 Liter Wasser täglich helfen gegen Schwellungen, Müdigkeit und Kreislaufprobleme.',
      en: 'Drinking enough is especially important now. Two to three litres of water a day help with swelling, fatigue and circulation issues.',
    },
    detail: {
      de: 'Wenn du oft Kopfschmerzen oder Krämpfe in den Waden hast — meist ist es zu wenig getrunken. Hilfreicher Trick: stell dir morgens 2 Liter-Flaschen hin und trink sie über den Tag leer. So musst du nicht zählen. Tee, Saftschorle und wasserreiche Lebensmittel (Gurke, Melone) zählen mit.',
      en: 'If you often get headaches or calf cramps, it is usually not drinking enough. Helpful trick: in the morning, set out two one-litre bottles and empty them across the day. No counting needed. Tea, fruit spritzers and water-rich foods (cucumber, melon) count too.',
    },
  },
  {
    id: 't21c',
    sswFrom: 21,
    sswTo: 24,
    category: 'reflexion',
    emoji: '🌸',
    text: {
      de: 'Was macht dich heute stolz auf dich und deinen Körper? Schreib es auf oder sag es laut — du verdienst dieses Lob.',
      en: 'What makes you proud of yourself and your body today? Write it down or say it out loud — you deserve the praise.',
    },
    detail: {
      de: 'Wir sind gewohnt, unseren Körper zu kritisieren. Schwangerschaft ist eine seltene Chance, ihn zu bewundern. Was kann er gerade? Wachsen lassen, nähren, schützen. Sag dir: "Danke, dass du das machst." Klingt komisch, wirkt aber. Selbstmitgefühl ist eine Fähigkeit — und Schwangerschaft ist ein guter Trainingsplatz.',
      en: 'We are used to criticising our bodies. Pregnancy is a rare chance to admire one. What is your body doing right now? Growing, nourishing, protecting. Say to it: "Thank you for doing this." Sounds odd, but it works. Self-compassion is a skill — and pregnancy is a great place to practise.',
    },
  },
  {
    id: 't21d',
    sswFrom: 21,
    sswTo: 24,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Plant heute einen gemeinsamen Abend ohne Handy. Reden, träumen, Namen überlegen — einfach zu zweit sein.',
      en: 'Plan a phone-free evening together today. Talk, dream, think of names — just be a couple.',
    },
    detail: {
      de: 'Nehmt einen Stift und schreibt jeder eure 5 Lieblingsnamen auf — ohne vorher abzusprechen. Manche Paare entdecken so einen, der bei beiden auf der Liste steht. Außerdem: redet über kleine Erinnerungen aus eurer eigenen Kindheit. Was war wichtig? Was wollt ihr weitergeben? Was nicht? Solche Gespräche kosten nichts und schaffen tiefe Nähe.',
      en: 'Take a pen and write down your five favourite names each — without comparing first. Some couples discover a name that is on both lists. Also: share little memories from your own childhoods. What was important? What do you want to pass on? What not? These conversations cost nothing and create deep intimacy.',
    },
  },
  {
    id: 't21e',
    sswFrom: 21,
    sswTo: 24,
    category: 'praktisch',
    emoji: '👶',
    text: {
      de: 'Mutterschutzantrag und Elterngeld früh vorbereiten — die Bürokratie braucht Zeit.',
      en: 'Prepare maternity leave and parental allowance paperwork early — bureaucracy takes time.',
    },
    detail: {
      de: 'Mutterschutz beginnt 6 Wochen vor dem ETT. Elterngeld kann erst nach der Geburt beantragt werden, aber alle Unterlagen kannst du jetzt schon zusammenstellen: Lohnabrechnungen der letzten 12 Monate, Geburtsurkunde des Babys (kommt später), Steuerbescheid, Bankverbindung. Manche Bundesländer haben Online-Tools, die das stark vereinfachen.',
      en: 'In Germany, maternity leave (Mutterschutz) starts six weeks before the due date. Parental allowance (Elterngeld) can only be applied for after the birth, but you can prepare all documents now: payslips for the past 12 months, the baby\'s birth certificate (later), tax assessment, bank details. Some federal states have online tools that simplify the process. Check the rules wherever you live.',
    },
  },

  // SSW 25–28 — Drittes Trimester naht
  {
    id: 't25a',
    sswFrom: 25,
    sswTo: 28,
    category: 'praktisch',
    emoji: '🎒',
    text: {
      de: 'Denk schon mal an die Krankentasche. Du musst sie noch nicht packen — aber eine Liste zu erstellen nimmt später Stress.',
      en: 'Start thinking about the hospital bag. You do not have to pack it yet — but writing the list now reduces stress later.',
    },
    detail: {
      de: 'Drei Bereiche: für dich (bequeme Kleidung, Stilleinlagen, Hausschuhe, Pflege ohne Duft, Snacks), fürs Baby (zwei Strampler, Mützchen, eine Decke, Erstausstattung-Body), für den Partner (Snacks, Powerbank, Wechselshirt). Vergiss Mutterpass, Personalausweis und Versichertenkarte nicht — sie kommen am besten ganz nach oben.',
      en: 'Three sections: for you (comfortable clothes, breast pads, slippers, fragrance-free toiletries, snacks); for the baby (two onesies, a hat, a blanket, a newborn bodysuit); for your partner (snacks, power bank, change of shirt). Do not forget your pregnancy record, ID and insurance card — keep them right on top.',
    },
  },
  {
    id: 't25b',
    sswFrom: 25,
    sswTo: 28,
    category: 'mindset',
    emoji: '💪',
    text: {
      de: 'Du trägst nicht nur ein Kind — du wächst selbst. Dein Mut, deine Stärke, deine Liebe werden größer als du dachtest.',
      en: 'You are not just carrying a child — you are growing yourself. Your courage, your strength, your love are becoming bigger than you knew.',
    },
    detail: {
      de: 'Du wirst Dinge schaffen, die du dir heute nicht zutraust. Drei Stunden Schlaf am Stück und trotzdem ein lachendes Baby trösten. Wundverbände wechseln, ohne dabei selbst umzukippen. Eine Geburt durchstehen — wie auch immer sie kommt. Mutterschaft offenbart eine Kraft in dir, die du noch nicht kanntest. Vertrau darauf.',
      en: 'You will do things you do not trust yourself with today. Three hours of broken sleep and still soothing a smiling baby. Changing dressings without fainting. Getting through a birth — whatever shape it takes. Motherhood reveals a strength in you that you did not know was there. Trust it.',
    },
  },
  {
    id: 't25c',
    sswFrom: 25,
    sswTo: 28,
    category: 'reflexion',
    emoji: '🌙',
    text: {
      de: 'Schläfst du schlecht? Das ist normal. Versuch es mit einem Schwangerschaftskissen und einer Tasse Kamillentee vor dem Schlafen.',
      en: 'Sleeping badly? That is normal. Try a pregnancy pillow and a cup of chamomile tea before bed.',
    },
    detail: {
      de: 'Ab dem dritten Trimester ist Schlaf eine echte Herausforderung. Der Bauch drückt, der Rücken zieht, das Baby tritt nachts. Routinen helfen: gleiche Schlafenszeit, Handy aus dem Schlafzimmer, kühles Zimmer (18°C ideal). Wenn du nachts wach liegst — kein Drama. Aufstehen, Tee trinken, ein paar Seiten lesen, dann zurück. Erzwungener Schlaf wird nicht besser.',
      en: 'In the third trimester, sleep becomes a real challenge. Your belly presses, your back aches, the baby kicks at night. Routines help: same bedtime, phone out of the bedroom, cool room (18°C / 64°F is ideal). If you lie awake — no drama. Get up, drink tea, read a few pages, go back. Forced sleep does not get better.',
    },
  },
  {
    id: 't25d',
    sswFrom: 25,
    sswTo: 28,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Sprecht heute über eure Erwartungen ans Wochenbett. Wer kommt wann zu Besuch? Wer übernimmt welche Aufgaben? Früh reden spart Stress.',
      en: 'Talk today about your expectations for the postpartum period. Who visits when? Who takes on which tasks? Talking early saves stress later.',
    },
    detail: {
      de: 'Konkrete Themen: Wer geht einkaufen in den ersten zwei Wochen? Wer kocht? Wann kommt welche Familie zu Besuch — und wie lange? Wer redet mit den Schwiegereltern, wenn deren Erwartungen nicht passen? Klare Absprachen vor der Geburt verhindern Streit nach der Geburt — wenn ihr beide ohnehin müde und gereizt seid.',
      en: 'Concrete topics: Who does the grocery shopping in the first two weeks? Who cooks? When does which side of the family visit — and for how long? Who talks to the in-laws if their expectations do not fit? Clear agreements before birth prevent fights after — when you are both tired and irritable anyway.',
    },
  },
  {
    id: 't25e',
    sswFrom: 25,
    sswTo: 28,
    category: 'praktisch',
    emoji: '🪑',
    text: {
      de: 'Beckenbodenübungen jetzt täglich — das macht später einen Riesenunterschied.',
      en: 'Daily pelvic floor exercises now — they make a huge difference later.',
    },
    detail: {
      de: 'Der Beckenboden trägt jetzt mehrere Kilo zusätzlich. Schon 5 Minuten täglich (anspannen, halten, lösen) wirken Wunder — gegen Inkontinenz nach der Geburt, für eine schnellere Rückbildung, für ein besseres Körpergefühl. Apps wie "Bauchgefühl" oder "Keep Calm Mama" haben gute Anleitungen. Beckenbodenkurse zahlt die Krankenkasse oft auch postnatal.',
      en: 'Your pelvic floor is carrying several extra kilos right now. Just 5 minutes a day (squeeze, hold, release) does wonders — against postpartum incontinence, for faster recovery, for a better connection to your body. Apps like "Bauchgefühl" or "Keep Calm Mama" have good guided routines. Many health insurers also cover postnatal pelvic floor classes.',
    },
  },

  // SSW 29–32 — Drittes Trimester
  {
    id: 't29a',
    sswFrom: 29,
    sswTo: 32,
    category: 'praktisch',
    emoji: '🏥',
    text: {
      de: 'Jetzt wäre ein guter Zeitpunkt, das Krankenhaus oder Geburtshaus deiner Wahl zu besichtigen. Viele bieten Führungen an.',
      en: 'Now is a good time to tour the hospital or birth centre of your choice. Many offer guided visits.',
    },
    detail: {
      de: 'Eine Kreißsaal-Führung nimmt eine Menge Angst. Du siehst die Räume, lernst typische Abläufe kennen und kannst Fragen stellen, die online nicht beantwortet werden: Darf ich essen? Wie viel Bewegung ist möglich? Was passiert wenn der Partner nicht rechtzeitig kommt? Die meisten Kliniken bieten Termine ab SSW 30 an — anrufen reicht.',
      en: 'A delivery room tour takes away a lot of fear. You see the rooms, get a feel for typical procedures and can ask questions you will not find online: Can I eat? How much movement is allowed? What happens if my partner does not arrive in time? Most hospitals offer tours from week 30 — a phone call is usually enough.',
    },
  },
  {
    id: 't29b',
    sswFrom: 29,
    sswTo: 32,
    category: 'mindset',
    emoji: '🌸',
    text: {
      de: 'Ängste vor der Geburt sind menschlich. Sie bedeuten, dass du dir etwas wünschst — eine schöne Geburt, ein gesundes Baby, Kontrolle. Das ist verständlich.',
      en: 'Fears about birth are human. They mean you wish for something — a beautiful birth, a healthy baby, some control. That is understandable.',
    },
    detail: {
      de: 'Angst ist keine Schwäche, sondern Information: Sie zeigt, was dir wichtig ist. Sprich mit deiner Hebamme darüber — sie kennt diese Sorgen, du musst sie nicht schön reden. Bei starken Ängsten gibt es spezialisierte Therapeuten (Geburtstrauma-Therapie, Hypnobirthing). Gut vorbereitet sein heißt nicht: keine Angst haben. Es heißt: trotz Angst handlungsfähig bleiben.',
      en: 'Fear is not weakness — it is information. It shows what matters to you. Talk to your midwife about it — she knows these worries, you do not have to dress them up. For strong anxiety there are specialised therapists (birth trauma therapy, hypnobirthing). Being well prepared does not mean having no fear. It means staying capable of acting despite the fear.',
    },
  },
  {
    id: 't29c',
    sswFrom: 29,
    sswTo: 32,
    category: 'reflexion',
    emoji: '💭',
    text: {
      de: 'Was sind deine drei wichtigsten Wünsche für die Geburt? Schreib sie in den Geburtsplan-Wizard — heute ist ein guter Tag dafür.',
      en: 'What are your three most important wishes for the birth? Write them into the birth plan wizard — today is a good day for it.',
    },
    detail: {
      de: 'Drei Punkte sind realistisch — bei 20 Wünschen wird es im Stress vergessen. Sortiere nach: was ist mir absolut heilig, was wäre schön, was ist mir relativ egal. Die wichtigsten 3 lernt dein Partner auswendig. So kann er/sie für dich sprechen, falls du in den Wehen nicht mehr willst oder kannst.',
      en: 'Three points are realistic — twenty get forgotten in the moment. Sort them: what is absolutely sacred to me, what would be nice, what do I not really mind. Your partner memorises the top 3. That way they can speak for you if you cannot or do not want to during labour.',
    },
  },
  {
    id: 't29d',
    sswFrom: 29,
    sswTo: 32,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Besprecht heute den Weg ins Krankenhaus. Wo liegt der Eingang? Wo kann man parken? Was tun um 3 Uhr nachts? Üben reduziert Stress.',
      en: 'Plan the route to the hospital today. Where is the entrance? Where can you park? What do you do at 3 am? Rehearsing lowers stress.',
    },
    detail: {
      de: 'Fahrt einmal "trocken" hin — ohne Wehen. Wo ist die Notaufnahme? Wo der Kreißsaal-Eingang nachts? Gibt es einen Geburtsklingel? Speichert die Nummer ein. Macht ein Foto vom Eingang. Plant Plan B falls das Auto nicht startet (Taxi-Nummer, Nachbarin). Diese Vorbereitung dauert 30 Minuten und nimmt im Ernstfall enorm Druck raus.',
      en: 'Do a dry run — without labour. Where is the emergency entrance? Where is the night entrance to the labour ward? Is there a delivery buzzer? Save the number. Take a photo of the entrance. Plan a backup if the car does not start (taxi number, neighbour). 30 minutes of preparation takes enormous pressure off the real moment.',
    },
  },
  {
    id: 't29e',
    sswFrom: 29,
    sswTo: 32,
    category: 'mindset',
    emoji: '🕯️',
    text: {
      de: 'Du brauchst keine "perfekte Geburt". Du brauchst nur eine, durch die du gut hindurch kommst.',
      en: 'You do not need a "perfect birth". You only need one you come through well.',
    },
    detail: {
      de: 'Geburten sind unberechenbar. Manchmal läuft alles wie auf Wolken, manchmal wird aus dem Wassergeburtsplan ein Notkaiserschnitt. Beide Geburten sind gültig. Beide bringen ein Baby auf die Welt. Beide machen dich zur Mutter. Lass los, was du nicht kontrollieren kannst — und halt fest, was du kannst (Vorbereitung, Atmung, Vertrauen ins Team).',
      en: 'Births are unpredictable. Sometimes everything flows; sometimes a planned water birth becomes an emergency caesarean. Both births are valid. Both bring a baby into the world. Both make you a mother. Let go of what you cannot control — and hold on to what you can (preparation, breathing, trust in the team).',
    },
  },

  // SSW 33–36 — Nesting & Vorbereitung
  {
    id: 't33a',
    sswFrom: 33,
    sswTo: 36,
    category: 'praktisch',
    emoji: '🎒',
    text: {
      de: 'Pack jetzt die Krankentasche. Für dich: Wäsche, Kosmetik, Snacks. Fürs Baby: Strampler, Mützchen, erste Windeln. Für den Partner: Verpflegung, Ladekabel.',
      en: 'Pack the hospital bag now. For you: underwear, toiletries, snacks. For the baby: onesies, hats, first nappies. For your partner: food, charging cable.',
    },
    detail: {
      de: 'Stell die Tasche an die Wohnungstür oder ins Auto. Wichtig: Vergiss nicht ein bequemes Outfit für die Heimfahrt — Jeans passen nicht. Lippenpflege gegen ausgetrocknete Lippen während der Wehen, ein Lieblingstee, ein Foto, das dich ruhig macht. Eine Liste was zuletzt rein muss (Handy, Ladekabel, Mutterpass) klebt am besten an der Tasche.',
      en: 'Put the bag by the front door or in the car. Important: do not forget a comfortable outfit for the drive home — jeans will not fit. Lip balm for dry lips during labour, a favourite tea, a photo that calms you. Stick a list of last-minute items (phone, charger, pregnancy record) onto the bag.',
    },
  },
  {
    id: 't33b',
    sswFrom: 33,
    sswTo: 36,
    category: 'mindset',
    emoji: '🏠',
    text: {
      de: 'Der Nesting-Instinkt ist real: Das Bedürfnis, alles vorzubereiten und aufzuräumen, ist biologisch. Hör auf deinen Körper — aber überanstrenge dich nicht.',
      en: 'The nesting instinct is real: the urge to prepare and tidy everything is biological. Listen to your body — but do not overdo it.',
    },
    detail: {
      de: 'Plötzlich willst du den Backofen putzen, das Babybett 5x umstellen, Schubladen ausmisten? Das ist millionenalter Instinkt — nicht Verrücktheit. Aber: keine Leiter, keine schweren Möbel, keine Chemikalien. Delegiere die anstrengenden Sachen an den Partner und konzentrier dich auf das, was sich ruhig anfühlt — sortieren, falten, ordnen.',
      en: 'Suddenly you want to scrub the oven, move the cot five times, declutter every drawer? That is an instinct millions of years old — not madness. But: no ladders, no heavy furniture, no harsh chemicals. Delegate the strenuous tasks to your partner and focus on what feels calm — sorting, folding, ordering.',
    },
  },
  {
    id: 't33c',
    sswFrom: 33,
    sswTo: 36,
    category: 'reflexion',
    emoji: '🌺',
    text: {
      de: 'Wer soll als Erstes informiert werden, wenn die Wehen beginnen? Leg heute eine kurze Anrufliste an — das macht es leichter.',
      en: 'Who should be informed first when labour begins? Put together a short call list today — it makes things easier.',
    },
    detail: {
      de: 'Drei Listen: 1) Wer wird sofort angerufen (Partner, Hebamme, Klinik). 2) Wer kommt in den ersten Stunden (Eltern, beste Freundin). 3) Wer wird nach der Geburt informiert (alle anderen). Schreib sie auf einen Zettel am Kühlschrank. Im Wehensturm denkt niemand klar — eine Liste rettet euch beide.',
      en: 'Three lists: 1) Who gets called immediately (partner, midwife, hospital). 2) Who comes in the first hours (parents, best friend). 3) Who hears the news after the birth (everyone else). Stick them on the fridge. In the storm of labour nobody thinks clearly — a list saves you both.',
    },
  },
  {
    id: 't33d',
    sswFrom: 33,
    sswTo: 36,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Plant einen "letzten Abend zu zweit" — ein schönes Essen, ein Film, einfach füreinander da sein. Bald seid ihr zu dritt.',
      en: 'Plan a "last evening as two" — a nice dinner, a film, just being there for each other. Soon there will be three of you.',
    },
    detail: {
      de: 'Es ist nicht der "letzte" Abend — aber so wie es jetzt ist, wird es nie wieder sein. Spontane Restaurantbesuche, lange ausschlafen, ungestörte Gespräche — das wird seltener. Markiert diesen Moment bewusst. Schreibt euch je einen Brief, oder bewahrt einen kleinen Gegenstand auf — etwas, das ihr eurem Kind mal zeigen könnt.',
      en: 'It is not really the "last" evening — but the way things are now will never come back. Spontaneous restaurant visits, long lie-ins, undisturbed conversations all become rarer. Mark this moment intentionally. Write each other a letter, or keep a small object — something you can show your child one day.',
    },
  },
  {
    id: 't33e',
    sswFrom: 33,
    sswTo: 36,
    category: 'praktisch',
    emoji: '🍲',
    text: {
      de: 'Fang jetzt an, fürs Wochenbett vorzukochen — gefrorene Mahlzeiten sind Gold wert.',
      en: 'Start cooking ahead for the postpartum period now — frozen meals are worth their weight in gold.',
    },
    detail: {
      de: 'In den ersten Wochen mit Baby kommst du nicht zum Kochen. Bereite jetzt 5-10 Portionen vor: Suppen, Currys, Eintöpfe, Lasagne — alles was sich gut einfrieren lässt. Stillende brauchen mehr Energie und besonders Eisen — Linsen, Hafer, dunkles Gemüse. Eine gut gefüllte Gefriertruhe ist eines der schönsten Geschenke an dein zukünftiges Ich.',
      en: 'In the first weeks with a baby you will not have time to cook. Prepare 5 to 10 portions now: soups, curries, stews, lasagne — anything that freezes well. Breastfeeding mothers need extra energy and especially iron — lentils, oats, dark leafy greens. A well-stocked freezer is one of the kindest gifts you can give your future self.',
    },
  },

  // SSW 37–39 — Endspurt
  {
    id: 't37a',
    sswFrom: 37,
    sswTo: 39,
    category: 'mindset',
    emoji: '✨',
    text: {
      de: 'Dein Baby ist jetzt "offiziell reif". Es könnte jederzeit kommen — oder noch ein paar Wochen warten. Üb dich in Geduld und Vertrauen.',
      en: 'Your baby is now "officially full term". It could come any moment — or wait a few more weeks. Practise patience and trust.',
    },
    detail: {
      de: 'Nur etwa 5% aller Babys kommen am errechneten Termin. Manche kommen 3 Wochen früher, manche 2 Wochen später — beides ist normal. Versuch loszulassen vom "Wann kommt es endlich?". Stattdessen: was kannst du heute Schönes tun? Cafe, Massage, Spaziergang. Diese ruhigen letzten Tage darfst du genießen, statt stündlich auf den Bauch zu schauen.',
      en: 'Only around 5% of babies arrive on the due date. Some come three weeks early, some two weeks late — both are normal. Try to let go of the "when will it finally come?" question. Instead: what nice thing can you do today? A café, a massage, a walk. These quiet last days are for enjoying, not for staring at your belly every hour.',
    },
  },
  {
    id: 't37b',
    sswFrom: 37,
    sswTo: 39,
    category: 'praktisch',
    emoji: '📱',
    text: {
      de: 'Speicher die Nummer deiner Hebamme, des Kreißsaals und deines Partners an einem leicht zugänglichen Ort. Im Moment der Wehen suchst du nicht gern.',
      en: 'Save the numbers of your midwife, labour ward and partner somewhere easy to find. You will not want to be searching during contractions.',
    },
    detail: {
      de: 'Lege eine Favoriten-Gruppe in deinen Kontakten an: "Geburt". Hebamme, Klinik, Partner, beste Freundin, Eltern. Notiere zusätzlich auf einem Zettel am Kühlschrank — falls das Handy mal leer ist oder verloren geht. Wenn du den Wegweiser jetzt vorbereitest, brauchst du im Ernstfall nicht mehr nachzudenken.',
      en: 'Create a favourites group in your contacts called "Birth": midwife, hospital, partner, best friend, parents. Also write them on a note on the fridge — in case your phone runs out or gets lost. Setting up these signposts now means you do not have to think when it counts.',
    },
  },
  {
    id: 't37c',
    sswFrom: 37,
    sswTo: 39,
    category: 'reflexion',
    emoji: '💭',
    text: {
      de: 'Was willst du dem Baby als erstes sagen? Manche Mütter üben es — andere lassen es einfach kommen. Was fühlt sich für dich richtig an?',
      en: 'What do you want to say to your baby first? Some mothers practise it — others let it come on its own. What feels right to you?',
    },
    detail: {
      de: 'Manche flüstern den Namen, andere sagen "Hallo du", andere weinen einfach. Es gibt keine richtigen Worte — aber einen ersten Atemzug zusammen. Diese Sekunde wird dich für immer prägen. Wenn du dir vorher etwas zurechtlegen willst, mach das. Wenn du dich überraschen lassen willst, auch gut. Hauptsache: sei da.',
      en: 'Some whisper the name, others say "Hello, you", others just cry. There are no right words — but there is a first breath together. That second will stay with you forever. If you want to rehearse something, do it. If you want to be surprised, also good. The main thing: be there.',
    },
  },
  {
    id: 't37d',
    sswFrom: 37,
    sswTo: 39,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Euer Leben verändert sich bald für immer — zum Wunderschönen. Schreibt euch heute je einen Brief, den ihr nach der Geburt lest.',
      en: 'Your life is about to change forever — into something wonderful. Write each other a letter today, to be read after the birth.',
    },
    detail: {
      de: 'Was wünscht du dir für euch als Eltern? Was schätzt du an deinem Partner besonders? Welche Versprechen wollt ihr euch geben? Diese Briefe sind kein Test, kein Versprechen, kein Vertrag — nur ein Schnappschuss eures Wir genau jetzt. In drei Jahren, mitten in einer Streitphase, werden sie unbezahlbar sein.',
      en: 'What do you wish for the two of you as parents? What do you appreciate most about your partner? What promises do you want to make? These letters are not a test, not a promise, not a contract — just a snapshot of your "us" right now. In three years, in the middle of a hard patch, they will be priceless.',
    },
  },
  {
    id: 't37e',
    sswFrom: 37,
    sswTo: 39,
    category: 'praktisch',
    emoji: '🚗',
    text: {
      de: 'Babyschale jetzt einbauen lassen — du fährst damit nach Hause.',
      en: 'Get the infant car seat installed now — you will drive home in it.',
    },
    detail: {
      de: 'Du darfst das Krankenhaus nicht ohne Babyschale verlassen. Lass den Einbau von einem Profi prüfen — ADAC, Babyfachmarkt oder zertifizierter Händler. Falsch eingebaute Babyschalen sind eine der häufigsten Sicherheitsmängel. Übe einmal: wie schnall ich ein Baby richtig an? (Gurt zwischen den Beinen, Riemen auf Schulterhöhe, kein dicker Anorak.)',
      en: 'You are not allowed to leave the hospital without a car seat. Have the installation checked by a professional — a baby specialist shop, motoring club or certified retailer. Wrongly installed car seats are one of the most common safety issues. Practise once: how do I strap a baby in correctly? (Buckle between the legs, straps at shoulder height, no thick coat under the harness.)',
    },
  },

  // SSW 40–42 — Übertragung / Warten
  {
    id: 't40a',
    sswFrom: 40,
    sswTo: 42,
    category: 'mindset',
    emoji: '🌙',
    text: {
      de: 'Warten ist schwer. Dein Körper und dein Baby wissen, wann die Zeit gekommen ist. Du kannst vertrauen — auch wenn es sich nicht so anfühlt.',
      en: 'Waiting is hard. Your body and your baby know when the time has come. You can trust them — even when it does not feel that way.',
    },
    detail: {
      de: 'Jeder Tag fühlt sich an wie eine Woche. Die Frage "und, schon was?" wird unerträglich. Tipp: Stell den Status auf "Wir melden uns wenn es soweit ist" und blocke die Frage damit ab. Verbring die Wartezeit mit Dingen, die dich runterfahren — Filme, Bücher, lange Bäder, Eis. Das Baby kommt sicher. Der ETT ist ein Schätzwert, kein Lieferdatum.',
      en: 'Every day feels like a week. The question "any news yet?" becomes unbearable. Tip: set your status to "We will be in touch when it happens" and let that block the question. Spend the wait on things that wind you down — films, books, long baths, ice cream. The baby will come. The due date is an estimate, not a delivery date.',
    },
  },
  {
    id: 't40b',
    sswFrom: 40,
    sswTo: 42,
    category: 'praktisch',
    emoji: '🚶‍♀️',
    text: {
      de: 'Spaziergänge, Himbeerblättertee, Akupunktur — vieles wird empfohlen. Was sich für dich richtig anfühlt, ist das Richtige. Kein Druck.',
      en: 'Walks, raspberry leaf tea, acupuncture — many things are recommended. Whatever feels right to you is right. No pressure.',
    },
    detail: {
      de: 'Bewährte Wehen-anregende Methoden: lange Spaziergänge (besonders Treppen rauf), warme Bäder, scharfes Essen, Sex (Prostaglandine im Sperma!), Akupunktur bei der Hebamme. Was nicht hilft: Stress, Frust, ständig auf den Bauch starren. Wenn die Geburt nicht beginnen will, hat das oft einen Grund — dein Körper, dein Baby brauchen noch Zeit.',
      en: 'Tried-and-tested ways to encourage labour: long walks (especially up stairs), warm baths, spicy food, sex (semen contains prostaglandins!), acupuncture with your midwife. What does not help: stress, frustration, staring at your belly. If labour does not want to start, there is usually a reason — your body and baby still need a little more time.',
    },
  },
  {
    id: 't40c',
    sswFrom: 40,
    sswTo: 42,
    category: 'reflexion',
    emoji: '🌸',
    text: {
      de: 'Du hast diese Reise gemeistert. Jede Übelkeit, jede schlaflose Nacht, jede Sorge — du hast sie getragen. Das ist außergewöhnlich.',
      en: 'You have made it through this journey. Every wave of nausea, every sleepless night, every worry — you carried them. That is extraordinary.',
    },
    detail: {
      de: '40 Wochen lang hast du einen Menschen wachsen lassen. Du hast Müdigkeit ausgehalten, Sodbrennen, Rückenschmerzen, Sorgen, Vorfreude. Du bist eine andere geworden, ohne es zu merken. Egal wie deine Geburt verläuft — diese 9 Monate haben dich vorbereitet. Du bist bereit. Auch wenn dein Kopf gerade etwas anderes sagt.',
      en: 'For 40 weeks you have grown a human being. You have endured fatigue, heartburn, back pain, worries, anticipation. You have become someone different without noticing. Whatever shape your birth takes — these 9 months have prepared you. You are ready. Even if your head says otherwise right now.',
    },
  },
  {
    id: 't40d',
    sswFrom: 40,
    sswTo: 42,
    category: 'partnerschaft',
    emoji: '💑',
    text: {
      de: 'Nutzt die letzten gemeinsamen Stunden: schlafen, essen, reden, kuscheln. Die Zeit zu zweit ist kostbar — und eine neue beginnt bald.',
      en: 'Make the most of these last hours together: sleep, eat, talk, cuddle. Time as two is precious — and a new chapter starts soon.',
    },
    detail: {
      de: 'Schaut euch alte Fotos an — von eurer ersten Wohnung, eurer Hochzeit, eurer ersten Reise. Erinnert euch, wer ihr wart, bevor ihr Eltern wurdet. Dieses Paar bleibt — auch wenn es bald in einer neuen Konstellation lebt. Eine starke Beziehung ist das größte Geschenk, das ihr eurem Kind machen könnt. Heute ist ein guter Tag, das zu spüren.',
      en: 'Look at old photos — from your first flat, your wedding, your first trip. Remember who you were before you became parents. That couple stays — even as it starts living in a new constellation. A strong relationship is the greatest gift you can give your child. Today is a good day to feel that.',
    },
  },
  {
    id: 't40e',
    sswFrom: 40,
    sswTo: 42,
    category: 'mindset',
    emoji: '⏳',
    text: {
      de: 'Die letzten Tage sind oft die längsten. Sei sanft mit dir.',
      en: 'The last days are often the longest. Be gentle with yourself.',
    },
    detail: {
      de: 'Nichts in deinem ganzen Leben hat dich darauf vorbereitet, so lange auf etwas Unkontrollierbares zu warten. Du wirst ungeduldig, frustriert, vielleicht weinerlich — alles legitim. Halte dir vor Augen: in einer Woche, in zwei Wochen ist es vorbei. Dann hältst du dein Baby im Arm. Bis dahin: ein Tag nach dem anderen.',
      en: 'Nothing in your whole life has prepared you to wait this long for something you cannot control. You will be impatient, frustrated, maybe tearful — all legitimate. Hold on to this: in a week, in two weeks, it will be over. Then you will hold your baby in your arms. Until then: one day at a time.',
    },
  },
]

export function getTipForDay(ssw: number, date: Date = new Date()): Tip {
  const clampedSSW = Math.max(1, Math.min(42, ssw))
  const matching = TIPS.filter((t) => clampedSSW >= t.sswFrom && clampedSSW <= t.sswTo)
  const pool = matching.length > 0 ? matching : TIPS.filter((t) => t.sswFrom <= 4)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return pool[dayOfYear % pool.length]
}

export const CATEGORY_LABELS: Record<TipCategory, LocalizedString> = {
  praktisch: { de: 'Praktischer Tipp', en: 'Practical tip' },
  mindset: { de: 'Mindset-Impuls', en: 'Mindset prompt' },
  partnerschaft: { de: 'Für euch beide', en: 'For the two of you' },
  reflexion: { de: 'Gedankenanstoß', en: 'Reflection' },
}

export function getCategoryLabel(category: TipCategory, locale: Locale): string {
  return localized(CATEGORY_LABELS[category], locale)
}

export function getTipText(tip: Tip, locale: Locale): string {
  return localized(tip.text, locale)
}

export function getTipDetail(tip: Tip, locale: Locale): string | undefined {
  return tip.detail ? localized(tip.detail, locale) : undefined
}
