export type TipCategory = 'praktisch' | 'mindset' | 'partnerschaft' | 'reflexion'

export interface Tip {
  id: string
  sswFrom: number
  sswTo: number
  category: TipCategory
  emoji: string
  text: string
}

export const TIPS: Tip[] = [
  // SSW 1–4 — Die ersten Wochen
  { id: 't01a', sswFrom: 1, sswTo: 4, category: 'mindset', emoji: '✨', text: 'Du trägst ein neues Leben in dir. Das ist ein Wunder — auch wenn es sich noch nicht so anfühlt. Gib dir Zeit anzukommen.' },
  { id: 't01b', sswFrom: 1, sswTo: 4, category: 'praktisch', emoji: '💊', text: 'Folsäure ist jetzt besonders wichtig. Falls du noch keine nimmst — sprich heute noch mit deiner Ärztin oder deinem Arzt.' },
  { id: 't01c', sswFrom: 1, sswTo: 4, category: 'reflexion', emoji: '🌱', text: 'Wie fühlst du dich heute? Glücklich, ängstlich, überwältigt? Alle Gefühle sind erlaubt. Du musst dich nicht entscheiden.' },
  { id: 't01d', sswFrom: 1, sswTo: 4, category: 'partnerschaft', emoji: '💑', text: 'Wenn du es noch niemandem erzählt hast — das ist völlig in Ordnung. Das Geheimnis gehört euch.' },

  // SSW 5–8 — Übelkeit & erste Anzeichen
  { id: 't05a', sswFrom: 5, sswTo: 8, category: 'praktisch', emoji: '🍋', text: 'Übelkeit? Kleine, häufige Mahlzeiten helfen oft mehr als große Portionen. Ingwertee, Salzcracker oder Zitronenduft können Linderung bringen.' },
  { id: 't05b', sswFrom: 5, sswTo: 8, category: 'mindset', emoji: '🌸', text: 'Übelkeit bedeutet: dein Körper arbeitet hart für das Baby. Du bist nicht schwach — du bist stark.' },
  { id: 't05c', sswFrom: 5, sswTo: 8, category: 'reflexion', emoji: '📓', text: 'Manche Frauen beginnen jetzt ein Schwangerschaftstagebuch. Kein Druck — aber vielleicht magst du heute einen ersten Satz schreiben?' },
  { id: 't05d', sswFrom: 5, sswTo: 8, category: 'partnerschaft', emoji: '💑', text: 'Dein Partner weiß vielleicht nicht, wie er helfen soll. Sei konkret: "Ich brauche heute Abend Ruhe" oder "Kannst du kochen?"' },

  // SSW 9–12 — Erstes Trimester Endspurt
  { id: 't09a', sswFrom: 9, sswTo: 12, category: 'praktisch', emoji: '🏥', text: 'Der erste große Ultraschall steht bald an. Schreib deine Fragen für die Ärztin schon jetzt auf — damit du im Moment nichts vergisst.' },
  { id: 't09b', sswFrom: 9, sswTo: 12, category: 'mindset', emoji: '🌙', text: 'Erschöpfung im ersten Trimester ist real und normal. Dein Körper baut gerade eine Plazenta auf. Ruh dich aus, wann immer du kannst.' },
  { id: 't09c', sswFrom: 9, sswTo: 12, category: 'reflexion', emoji: '💭', text: 'Wann möchtest du es wem sagen? Überleg heute, wer die erste Person sein soll, die es erfährt — außer euch beiden.' },
  { id: 't09d', sswFrom: 9, sswTo: 12, category: 'partnerschaft', emoji: '💑', text: 'Bald könnt ihr das erste Mal gemeinsam das Herzchen schlagen hören. Ein Moment, den ihr nicht vergessen werdet.' },

  // SSW 13–16 — Zweites Trimester beginnt
  { id: 't13a', sswFrom: 13, sswTo: 16, category: 'mindset', emoji: '🌈', text: 'Willkommen im zweiten Trimester! Viele Frauen beschreiben es als die schönste Phase. Die Übelkeit lässt nach — die Vorfreude wächst.' },
  { id: 't13b', sswFrom: 13, sswTo: 16, category: 'praktisch', emoji: '📋', text: 'Jetzt ist ein guter Zeitpunkt, sich um einen Platz in einem Geburtsvorbereitungskurs zu kümmern. Die beliebtesten sind schnell ausgebucht.' },
  { id: 't13c', sswFrom: 13, sswTo: 16, category: 'reflexion', emoji: '🌿', text: 'Was ist dein größter Wunsch für die Geburt? Noch kein Plan nötig — aber fang an, dir Gedanken zu machen.' },
  { id: 't13d', sswFrom: 13, sswTo: 16, category: 'partnerschaft', emoji: '💑', text: 'Teile deinem Partner heute eine Seite aus unserem Geburtsplan-Wizard. Gemeinsam darüber nachdenken schafft Nähe.' },

  // SSW 17–20 — Baby bewegt sich
  { id: 't17a', sswFrom: 17, sswTo: 20, category: 'mindset', emoji: '🦋', text: 'Bald wirst du die ersten Kindsbewegungen spüren — oft wie ein Kribbeln oder Flattern. Sei geduldig, sie kommen.' },
  { id: 't17b', sswFrom: 17, sswTo: 20, category: 'praktisch', emoji: '👩‍⚕️', text: 'Ab SSW 20 empfiehlt es sich, eine Hebamme für die Nachsorge zu suchen. Gute Hebammen sind schnell vergeben — früh anfragen lohnt sich.' },
  { id: 't17c', sswFrom: 17, sswTo: 20, category: 'reflexion', emoji: '💭', text: 'Wie stellst du dir den ersten Tag mit dem Baby vor? Kein richtiges oder falsches Bild — lass deiner Fantasie freien Lauf.' },
  { id: 't17d', sswFrom: 17, sswTo: 20, category: 'partnerschaft', emoji: '💑', text: 'Wenn du die ersten Bewegungen spürst, leg die Hand deines Partners auf deinen Bauch. Diesen Moment werdet ihr beide nie vergessen.' },

  // SSW 21–24 — Mitte der Schwangerschaft
  { id: 't21a', sswFrom: 21, sswTo: 24, category: 'mindset', emoji: '🌺', text: 'Dein Bauch wächst sichtbar. Manche lieben das — andere brauchen etwas Zeit. Beides ist vollkommen normal.' },
  { id: 't21b', sswFrom: 21, sswTo: 24, category: 'praktisch', emoji: '💧', text: 'Genug trinken ist jetzt besonders wichtig. 2–3 Liter Wasser täglich helfen gegen Schwellungen, Müdigkeit und Kreislaufprobleme.' },
  { id: 't21c', sswFrom: 21, sswTo: 24, category: 'reflexion', emoji: '🌸', text: 'Was macht dich heute stolz auf dich und deinen Körper? Schreib es auf oder sag es laut — du verdienst dieses Lob.' },
  { id: 't21d', sswFrom: 21, sswTo: 24, category: 'partnerschaft', emoji: '💑', text: 'Plant heute einen gemeinsamen Abend ohne Handy. Reden, träumen, Namen überlegen — einfach zu zweit sein.' },

  // SSW 25–28 — Drittes Trimester naht
  { id: 't25a', sswFrom: 25, sswTo: 28, category: 'praktisch', emoji: '🎒', text: 'Denk schon mal an die Krankentasche. Du musst sie noch nicht packen — aber eine Liste zu erstellen nimmt später Stress.' },
  { id: 't25b', sswFrom: 25, sswTo: 28, category: 'mindset', emoji: '💪', text: 'Du trägst nicht nur ein Kind — du wächst selbst. Dein Mut, deine Stärke, deine Liebe werden größer als du dachtest.' },
  { id: 't25c', sswFrom: 25, sswTo: 28, category: 'reflexion', emoji: '🌙', text: 'Schläfst du schlecht? Das ist normal. Versuch es mit einem Schwangerschaftskissen und einer Tasse Kamillee vor dem Schlafen.' },
  { id: 't25d', sswFrom: 25, sswTo: 28, category: 'partnerschaft', emoji: '💑', text: 'Sprecht heute über eure Erwartungen ans Wochenbett. Wer kommt wann zu Besuch? Wer übernimmt welche Aufgaben? Früh reden spart Stress.' },

  // SSW 29–32 — Drittes Trimester
  { id: 't29a', sswFrom: 29, sswTo: 32, category: 'praktisch', emoji: '🏥', text: 'Jetzt wäre ein guter Zeitpunkt, das Krankenhaus oder Geburtshaus deiner Wahl zu besichtigen. Viele bieten Führungen an.' },
  { id: 't29b', sswFrom: 29, sswTo: 32, category: 'mindset', emoji: '🌸', text: 'Ängste vor der Geburt sind menschlich. Sie bedeuten, dass du dir etwas wünschst — eine schöne Geburt, ein gesundes Baby, Kontrolle. Das ist verständlich.' },
  { id: 't29c', sswFrom: 29, sswTo: 32, category: 'reflexion', emoji: '💭', text: 'Was sind deine drei wichtigsten Wünsche für die Geburt? Schreib sie in den Geburtsplan-Wizard — heute ist ein guter Tag dafür.' },
  { id: 't29d', sswFrom: 29, sswTo: 32, category: 'partnerschaft', emoji: '💑', text: 'Besprecht heute den Weg ins Krankenhaus. Wo liegt der Eingang? Wo kann man parken? Was tun um 3 Uhr nachts? Üben reduziert Stress.' },

  // SSW 33–36 — Nesting & Vorbereitung
  { id: 't33a', sswFrom: 33, sswTo: 36, category: 'praktisch', emoji: '🎒', text: 'Pack jetzt die Krankentasche. Für dich: Wäsche, Kosmetik, Snacks. Fürs Baby: Strampler, Mützchen, erste Windeln. Für den Partner: Verpflegung, Ladekabel.' },
  { id: 't33b', sswFrom: 33, sswTo: 36, category: 'mindset', emoji: '🏠', text: 'Der Nesting-Instinkt ist real: Das Bedürfnis, alles vorzubereiten und aufzuräumen, ist biologisch. Hör auf deinen Körper — aber überanstrenge dich nicht.' },
  { id: 't33c', sswFrom: 33, sswTo: 36, category: 'reflexion', emoji: '🌺', text: 'Wer soll als Erstes informiert werden, wenn die Wehen beginnen? Leg heute eine kurze Anrufliste an — das macht es leichter.' },
  { id: 't33d', sswFrom: 33, sswTo: 36, category: 'partnerschaft', emoji: '💑', text: 'Plant einen "letzten Abend zu zweit" — ein schönes Essen, ein Film, einfach füreinander da sein. Bald seid ihr zu dritt.' },

  // SSW 37–39 — Endspurt
  { id: 't37a', sswFrom: 37, sswTo: 39, category: 'mindset', emoji: '✨', text: 'Dein Baby ist jetzt "offiziell reif". Es könnte jederzeit kommen — oder noch ein paar Wochen warten. Üb dich in Geduld und Vertrauen.' },
  { id: 't37b', sswFrom: 37, sswTo: 39, category: 'praktisch', emoji: '📱', text: 'Speicher die Nummer deiner Hebamme, des Kreißsaals und deines Partners an einem leicht zugänglichen Ort. Im Moment der Wehen suchst du nicht gern.' },
  { id: 't37c', sswFrom: 37, sswTo: 39, category: 'reflexion', emoji: '💭', text: 'Was willst du dem Baby als erstes sagen? Manche Mütter üben es — andere lassen es einfach kommen. Was fühlt sich für dich richtig an?' },
  { id: 't37d', sswFrom: 37, sswTo: 39, category: 'partnerschaft', emoji: '💑', text: 'Euer Leben verändert sich bald für immer — zum Wunderschönen. Schreibt euch heute je einen Brief, den ihr nach der Geburt lest.' },

  // SSW 40–42 — Übertragung / Warten
  { id: 't40a', sswFrom: 40, sswTo: 42, category: 'mindset', emoji: '🌙', text: 'Warten ist schwer. Dein Körper und dein Baby wissen, wann die Zeit gekommen ist. Du kannst vertrauen — auch wenn es sich nicht so anfühlt.' },
  { id: 't40b', sswFrom: 40, sswTo: 42, category: 'praktisch', emoji: '🚶‍♀️', text: 'Spaziergänge, Himbeerblättertee, Akupunktur — vieles wird empfohlen. Was sich für dich richtig anfühlt, ist das Richtige. Kein Druck.' },
  { id: 't40c', sswFrom: 40, sswTo: 42, category: 'reflexion', emoji: '🌸', text: 'Du hast diese Reise gemeistert. Jede Übelkeit, jede schlaflose Nacht, jede Sorge — du hast sie getragen. Das ist außergewöhnlich.' },
  { id: 't40d', sswFrom: 40, sswTo: 42, category: 'partnerschaft', emoji: '💑', text: 'Nutzt die letzten gemeinsamen Stunden: schlafen, essen, reden, kuscheln. Die Zeit zu zweit ist kostbar — und eine neue beginnt bald.' },
]

export function getTipForDay(ssw: number, date: Date = new Date()): Tip {
  const clampedSSW = Math.max(1, Math.min(42, ssw))
  const matching = TIPS.filter((t) => clampedSSW >= t.sswFrom && clampedSSW <= t.sswTo)
  const pool = matching.length > 0 ? matching : TIPS.filter((t) => t.sswFrom <= 4)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return pool[dayOfYear % pool.length]
}

export const CATEGORY_LABELS: Record<TipCategory, string> = {
  praktisch: 'Praktischer Tipp',
  mindset: 'Mindset-Impuls',
  partnerschaft: 'Für euch beide',
  reflexion: 'Gedankenanstoß',
}
