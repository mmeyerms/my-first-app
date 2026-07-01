import type { Locale } from './i18n/types'
import type { LocalizedString } from './i18n/localized'
import { localized } from './i18n/localized'

export type QuestionType = 'single' | 'multi' | 'text'

/**
 * Preset key used for tone-adjusted suggestions.
 * Mirrors CLINIC_PRESETS in einstellungen/sections/GeburtsplanSection.tsx
 * plus the generic fallback for null presets.
 */
export type ClinicPresetKey = 'klinik' | 'hausgeburt' | 'geburtshaus' | 'ambulant' | 'generic'

export interface Question {
  id: string
  stage: 1 | 2 | 3
  label: LocalizedString
  type: QuestionType
  options?: LocalizedString[]
  optional?: boolean
  hint?: LocalizedString
  /**
   * Short, tappable answer suggestions shown below open text inputs
   * (type 'text', or the __custom__ input in 'single'/'multi').
   * Tapping inserts the text into the field.
   * `suggestions` is the generic list; `presetSuggestions` overrides it
   * per clinic preset when the user has selected one.
   */
  suggestions?: LocalizedString[]
  presetSuggestions?: Partial<Record<ClinicPresetKey, LocalizedString[]>>
}

export const QUESTIONS: Question[] = [
  // Stufe 1 — Kern (immer sichtbar)
  {
    id: 'location',
    stage: 1,
    label: {
      de: 'Wo möchtest du gebären?',
      en: 'Where do you want to give birth?',
    },
    type: 'single',
    options: [
      { de: 'Krankenhaus', en: 'Hospital' },
      { de: 'Geburtshaus', en: 'Birth centre' },
      { de: 'Hausgeburt', en: 'Home birth' },
      { de: 'Noch nicht entschieden', en: 'Not decided yet' },
    ],
    hint: {
      de: 'Krankenhaus, Geburtshaus oder zuhause — das ist eine der ersten großen Entscheidungen, und viele Frauen spüren dabei Druck von außen. Dabei gibt es keine richtige Antwort — nur deine. Ein Krankenhaus gibt Sicherheit durch volle medizinische Infrastruktur. Ein Geburtshaus ist persönlicher, aber du wirst bei Komplikationen verlegt. Zuhause gebären gibt maximale Kontrolle über dein Umfeld — braucht aber eine sehr erfahrene Hebamme. Wichtigste Frage: Wo kannst du dich fallen lassen?',
      en: 'Hospital, birth centre or at home — this is one of the first big decisions, and many women feel pressure from the outside. But there is no right answer, only yours. A hospital offers safety through full medical infrastructure. A birth centre is more personal, but you will be transferred if complications arise. A home birth gives you maximum control over your environment — but needs a very experienced midwife. The most important question: where can you let go?',
    },
  },
  {
    id: 'companions',
    stage: 1,
    label: {
      de: 'Wer soll bei der Geburt dabei sein?',
      en: 'Who should be with you during the birth?',
    },
    type: 'multi',
    options: [
      { de: 'Partner/in', en: 'Partner' },
      { de: 'Doula', en: 'Doula' },
      { de: 'Freundin / Vertraute Person', en: 'A friend or trusted person' },
      { de: 'Nur das medizinische Team', en: 'Only the medical team' },
    ],
    hint: {
      de: 'Wer bei der Geburt dabei ist, beeinflusst wie du dich fühlen wirst. Nicht jeder, der dabei sein will, ist gut für dich in diesem Moment. Dein Partner? Wunderbar — aber sprecht vorher offen darüber, was er leisten kann und was nicht. Manche Frauen holen sich zusätzlich eine Doula — jemand mit Erfahrung, die genau weiß wie man unterstützt ohne zu stören. Du darfst auch allein sein, wenn das richtig für dich ist.',
      en: 'Who is in the room shapes how you will feel. Not everyone who wants to be there is good for you in that moment. Your partner? Wonderful — but talk openly beforehand about what they can and cannot offer. Some women add a doula, someone experienced who knows how to support without intruding. You are also allowed to be alone, if that is right for you.',
    },
    suggestions: [
      { de: 'Meine Mutter', en: 'My mother' },
      { de: 'Meine Schwester', en: 'My sister' },
      { de: 'Beste Freundin', en: 'Best friend' },
      { de: 'Geburtsfotograf:in', en: 'Birth photographer' },
    ],
  },
  {
    id: 'pain_management',
    stage: 1,
    label: {
      de: 'Wie möchtest du mit Schmerzen umgehen?',
      en: 'How do you want to handle pain?',
    },
    type: 'multi',
    options: [
      { de: 'PDA (Periduralanästhesie)', en: 'Epidural' },
      { de: 'Wasser (Badewanne / Dusche)', en: 'Water (bath or shower)' },
      { de: 'TENS-Gerät', en: 'TENS machine' },
      { de: 'Hypnobirthing', en: 'Hypnobirthing' },
      { de: 'Lachgas', en: 'Nitrous oxide (gas and air)' },
      { de: 'Offen – je nach Situation', en: 'Open — depending on the situation' },
      { de: 'Keine Schmerzmittel', en: 'No pain medication' },
    ],
    hint: {
      de: 'Über kein Thema gibt es mehr Meinungsdruck als dieses. "Natürliche Geburt" klingt nach Stärke — aber Stärke ist es, zu wissen was dir hilft, nicht was andere von dir erwarten. Die PDA ist sicher, bewährt und ermöglicht es vielen Frauen, die Geburt erst wirklich zu erleben. Gleichzeitig berichten Frauen ohne Schmerzmittel von einem tiefen Gefühl von Kraft. Es gibt keine Medaille für Schmerzen. Schreib auf was du dir wünschst — und sei gleichzeitig offen, im Moment umzudenken. Geburten halten sich selten an Pläne.',
      en: 'No topic carries more opinionated pressure than this one. "Natural birth" sounds like strength — but real strength is knowing what helps you, not what others expect of you. Epidurals are safe, well-tested and let many women truly experience their birth. At the same time, women who go without medication report a deep sense of power. There is no medal for pain. Write down what you wish for — and stay open to changing your mind in the moment. Births rarely stick to plans.',
    },
    suggestions: [
      { de: 'Akupunktur', en: 'Acupuncture' },
      { de: 'Homöopathie', en: 'Homoeopathy' },
      { de: 'Massage durch Partner:in', en: 'Massage from my partner' },
      { de: 'Atemtechniken', en: 'Breathing techniques' },
    ],
    presetSuggestions: {
      hausgeburt: [
        { de: 'Atemtechniken', en: 'Breathing techniques' },
        { de: 'Aromatherapie', en: 'Aromatherapy' },
        { de: 'Homöopathie', en: 'Homoeopathy' },
        { de: 'Massage durch Partner:in', en: 'Massage from my partner' },
      ],
      geburtshaus: [
        { de: 'Akupunktur', en: 'Acupuncture' },
        { de: 'Atemtechniken', en: 'Breathing techniques' },
        { de: 'Wasser & Wärme', en: 'Water and warmth' },
        { de: 'Rebozo', en: 'Rebozo' },
      ],
      klinik: [
        { de: 'PDA-Option offenhalten', en: 'Keep the epidural option open' },
        { de: 'Lachgas ausprobieren', en: 'Try nitrous oxide first' },
        { de: 'Akupunktur wenn verfügbar', en: 'Acupuncture if available' },
        { de: 'Wärmflasche / Kirschkernkissen', en: 'Hot water bottle / cherry-stone pillow' },
      ],
    },
  },
  {
    id: 'wishes',
    stage: 1,
    label: {
      de: 'Was ist dir bei der Geburt am wichtigsten?',
      en: 'What matters most to you during birth?',
    },
    type: 'text',
    optional: true,
    hint: {
      de: 'Hier ist dein freier Raum — für alles, was sich nicht in eine Checkbox pressen lässt. Vielleicht: "Ich möchte, dass jemand mit mir redet bevor etwas passiert." Oder: "Keine lauten Geräusche." Oder: "Meine Playlist soll laufen." Schreibe auf was dich gerade beschäftigt — auch wenn es klein klingt. Das Geburts-Team kann nur auf dich eingehen, wenn es weiß was dir wichtig ist.',
      en: 'This is your free space — for everything that does not fit a checkbox. Maybe: "I want someone to tell me before anything happens." Or: "No loud noises." Or: "I want my playlist on." Write down whatever is on your mind, even if it sounds small. The birth team can only respond to you if they know what matters to you.',
    },
    suggestions: [
      { de: 'Sagt mir vorher, was ihr tut', en: 'Tell me what you are about to do' },
      { de: 'Ich möchte mich sicher fühlen', en: 'I want to feel safe' },
      { de: 'Ruhige Atmosphäre', en: 'A calm atmosphere' },
      { de: 'Zeit für mein Baby direkt danach', en: 'Time with my baby right after' },
      { de: 'Selbstbestimmt entscheiden', en: 'Make my own decisions' },
    ],
    presetSuggestions: {
      klinik: [
        { de: 'Sagt mir vorher, was ihr tut', en: 'Tell me what you are about to do' },
        { de: 'Keine Studierenden im Raum', en: 'No medical students in the room' },
        { de: 'Wenige Personalwechsel', en: 'As few staff changes as possible' },
        { de: 'Gedimmtes Licht wenn möglich', en: 'Dim the lights if possible' },
        { de: 'Baby direkt zu mir', en: 'Baby directly on me' },
      ],
      hausgeburt: [
        { de: 'Ruhige, vertraute Atmosphäre', en: 'A calm, familiar atmosphere' },
        { de: 'Meine Playlist läuft', en: 'My playlist stays on' },
        { de: 'Nur meine Hebamme und Partner:in', en: 'Only my midwife and partner' },
        { de: 'Kerzenlicht im Raum', en: 'Candlelight in the room' },
        { de: 'Baby im eigenen Tempo begrüßen', en: 'Greet the baby at our own pace' },
      ],
      geburtshaus: [
        { de: 'Ruhige, intime Atmosphäre', en: 'A calm, intimate atmosphere' },
        { de: 'Bewegungsfreiheit', en: 'Freedom to move' },
        { de: 'Wassergeburt wenn möglich', en: 'Water birth if possible' },
        { de: 'Baby direkt zu mir', en: 'Baby directly on me' },
        { de: 'Verzögertes Abnabeln', en: 'Delayed cord clamping' },
      ],
      ambulant: [
        { de: 'Baldige Entlassung', en: 'Early discharge' },
        { de: 'Nur nötigste Untersuchungen', en: 'Only essential examinations' },
        { de: 'Ruhe direkt nach der Geburt', en: 'Rest right after the birth' },
        { de: 'Wenige Personalwechsel', en: 'As few staff changes as possible' },
      ],
    },
  },
  {
    id: 'no_gos',
    stage: 1,
    label: {
      de: 'Was möchtest du auf keinen Fall?',
      en: 'What do you absolutely not want?',
    },
    type: 'text',
    optional: true,
    hint: {
      de: 'Das ist eine der kraftvollsten Fragen im Geburtsplan — sie gibt dir eine Stimme für Momente, in denen du vielleicht keine Kraft mehr hast zu sprechen. Manche Frauen schreiben: "Kein Dammschnitt ohne Rücksprache." Andere: "Keine Studenten im Raum." Oder: "Sagt mir nicht ich soll leise sein." Was auch immer dein No-Go ist — es ist gültig. Dein Körper, dein Raum, deine Regeln.',
      en: 'This is one of the most powerful questions in the birth plan — it gives you a voice for the moments when you may have no strength left to speak. Some women write: "No episiotomy without checking with me first." Others: "No medical students in the room." Or: "Do not tell me to be quiet." Whatever your no-go is, it is valid. Your body, your space, your rules.',
    },
    suggestions: [
      { de: 'Kein Dammschnitt ohne Rücksprache', en: 'No episiotomy without checking with me' },
      { de: 'Keine Studierenden im Raum', en: 'No medical students in the room' },
      { de: 'Sagt mir nicht, ich soll leise sein', en: 'Do not tell me to be quiet' },
      { de: 'Kein Zug am Baby', en: 'No pulling on the baby' },
      { de: 'Kein Cristeller-Handgriff', en: 'No fundal pressure (Kristeller)' },
    ],
    presetSuggestions: {
      klinik: [
        { de: 'Kein Dammschnitt ohne Rücksprache', en: 'No episiotomy without checking with me' },
        { de: 'Keine Studierenden im Raum', en: 'No medical students in the room' },
        { de: 'Kein Cristeller-Handgriff', en: 'No fundal pressure (Kristeller)' },
        { de: 'Kein unnötiges CTG-Dauerband', en: 'No unnecessary continuous CTG monitoring' },
        { de: 'Keine ungefragte Untersuchung', en: 'No examination without asking first' },
      ],
      hausgeburt: [
        { de: 'Keine Hektik', en: 'No rushing' },
        { de: 'Keine unnötigen Untersuchungen', en: 'No unnecessary examinations' },
        { de: 'Nicht mir sagen, ich soll leise sein', en: 'Do not tell me to be quiet' },
        { de: 'Kein Zug am Baby', en: 'No pulling on the baby' },
      ],
      geburtshaus: [
        { de: 'Kein Dammschnitt ohne Rücksprache', en: 'No episiotomy without checking with me' },
        { de: 'Keine unnötige Verlegung', en: 'No unnecessary transfer' },
        { de: 'Nicht mir sagen, ich soll leise sein', en: 'Do not tell me to be quiet' },
        { de: 'Kein Cristeller-Handgriff', en: 'No fundal pressure (Kristeller)' },
      ],
    },
  },

  // Stufe 2 — Vertiefung (ab SSW 20)
  {
    id: 'mobility',
    stage: 2,
    label: {
      de: 'Bewegungsfreiheit während der Geburt?',
      en: 'Freedom to move during birth?',
    },
    type: 'single',
    options: [
      { de: 'Sehr wichtig – ich möchte mich frei bewegen', en: 'Very important — I want to move freely' },
      { de: 'Wichtig, aber flexibel', en: 'Important, but flexible' },
      { de: 'Nicht besonders wichtig', en: 'Not particularly important' },
    ],
    hint: {
      de: 'Viele Frauen wissen nicht: Du musst nicht auf dem Rücken liegen. Das ist eine Krankenhausroutine, keine medizinische Notwendigkeit. Bewegung kann Schmerzen lindern und die Geburt verkürzen. Laufen, Hocken, auf einem Ball sitzen, im Wasser stehen — dein Körper findet oft instinktiv die richtige Position. Frag deine Hebamme was möglich ist und schreib es hier fest.',
      en: 'Many women do not know: you do not have to lie on your back. That is a hospital routine, not a medical necessity. Movement can ease pain and shorten labour. Walking, squatting, sitting on a ball, standing in the water — your body often finds the right position by instinct. Ask your midwife what is possible and write it down here.',
    },
  },
  {
    id: 'episiotomy',
    stage: 2,
    label: {
      de: 'Dammschnitt – deine Wünsche?',
      en: 'Episiotomy — your wishes?',
    },
    type: 'single',
    options: [
      { de: 'Nur im absoluten Notfall', en: 'Only in an absolute emergency' },
      { de: 'Bitte möglichst vermeiden', en: 'Please avoid if possible' },
      { de: 'Ich vertraue dem medizinischen Team', en: 'I trust the medical team to decide' },
      { de: 'Noch nicht entschieden', en: 'Not decided yet' },
    ],
    hint: {
      de: 'Der Dammschnitt berührt Fragen von Körper, Kontrolle und Vertrauen. Er ist manchmal nötig — aber nicht immer. Studien zeigen: Ein natürlicher Riss heilt oft besser als ein Schnitt. Warme Kompressen, bestimmte Positionen und eine geduldige Hebamme können das Risiko senken. Du hast das Recht, dieses Thema im Voraus anzusprechen. Dein Wunsch, informiert zu entscheiden, ist berechtigt.',
      en: 'An episiotomy touches on questions of body, control and trust. It is sometimes necessary — but not always. Studies show natural tears often heal better than a cut. Warm compresses, certain positions and a patient midwife can lower the risk. You have the right to bring this up in advance. Your wish to make an informed decision is legitimate.',
    },
  },
  {
    id: 'bonding',
    stage: 2,
    label: {
      de: 'Bonding direkt nach der Geburt?',
      en: 'Bonding right after birth?',
    },
    type: 'multi',
    options: [
      { de: 'Sofortkontakt (Haut-zu-Haut)', en: 'Immediate skin-to-skin contact' },
      { de: 'Verzögertes Abnabeln', en: 'Delayed cord clamping' },
      { de: 'Partner/in schneidet die Nabelschnur', en: 'Partner cuts the cord' },
      { de: 'Wie das Team empfiehlt', en: 'As the team recommends' },
    ],
    hint: {
      de: 'Die ersten Minuten nach der Geburt können unvergesslich sein. Haut-zu-Haut-Kontakt senkt Stresshormone bei dir und deinem Baby, unterstützt das Stillen und gibt euch Zeit euch zu "erkennen". Aber: Wenn es aus medizinischen Gründen nicht sofort klappt — eure Bindung entsteht trotzdem. Bonding passiert nicht nur in den ersten Minuten. Es passiert jede Nacht, jeden Tag, über Monate.',
      en: 'The first minutes after birth can be unforgettable. Skin-to-skin contact lowers stress hormones in both you and your baby, supports breastfeeding and gives you time to recognise each other. But: if for medical reasons it does not happen straight away, your bond still forms. Bonding does not only happen in those first minutes. It happens every night, every day, over months.',
    },
    suggestions: [
      { de: 'Erstes Stillen begleiten', en: 'Support the first breastfeed' },
      { de: 'Baby erst nach 1h abwiegen', en: 'Weigh the baby only after the first hour' },
      { de: 'Partner:in trägt Baby im Haut-Kontakt', en: 'Partner does skin-to-skin too' },
      { de: 'Ungestörte erste Stunde', en: 'Undisturbed first hour' },
    ],
  },
  {
    id: 'breastfeeding',
    stage: 2,
    label: {
      de: 'Stillwunsch?',
      en: 'Do you want to breastfeed?',
    },
    type: 'single',
    options: [
      { de: 'Ja, ich möchte stillen', en: 'Yes, I want to breastfeed' },
      { de: 'Ja, mit Unterstützung durch Hebamme', en: 'Yes, with support from a midwife' },
      { de: 'Nein – Flasche geplant', en: 'No — planning to bottle-feed' },
      { de: 'Noch nicht entschieden', en: 'Not decided yet' },
    ],
    hint: {
      de: 'Stillen ist eines der emotionalsten Themen der frühen Mutterschaft. Der Druck zu stillen ist real — und gleichzeitig schaffen es viele Frauen aus hundert verschiedenen Gründen nicht. Beides ist verständlich. Stillen hat klare Vorteile — aber ein glückliches Baby mit der Flasche ist besser als eine erschöpfte Mutter voller Schuldgefühle. Wenn du stillen möchtest: Hol dir Unterstützung (Hebamme, Stillberaterin) — und lass dir erlaubt sein, den Plan zu ändern.',
      en: 'Breastfeeding is one of the most emotional topics of early motherhood. The pressure to breastfeed is real — and at the same time, many women cannot, for a hundred different reasons. Both are understandable. Breastfeeding has clear benefits — but a happy bottle-fed baby is better than an exhausted mother drowning in guilt. If you want to breastfeed, get support (midwife, lactation consultant) — and allow yourself to change the plan.',
    },
  },
  {
    id: 'photography',
    stage: 2,
    label: {
      de: 'Fotos und Videos – was darf wann?',
      en: 'Photos and videos — what is allowed and when?',
    },
    type: 'multi',
    options: [
      { de: 'Während der Geburt erlaubt', en: 'Allowed during the birth' },
      { de: 'Nur beim Moment der Geburt', en: 'Only at the moment of birth' },
      { de: 'Partner/in darf filmen', en: 'Partner is allowed to film' },
      { de: 'Erst nach der Geburt', en: 'Only after the birth' },
      { de: 'Keine Fotos während der Geburt', en: 'No photos during the birth' },
    ],
    hint: {
      de: 'Wer fotografiert wann was — das ist eine unterschätzte Frage. Viele Paare sind hinterher froh um Fotos aus dem Kreißsaal. Andere möchten keine Kamera in der Nähe. Denke vorher nach: Wer ist der "offizielle Fotograf"? Sollen Geburtsmomente festgehalten werden? Und: Wer darf die Bilder sehen, wer nicht? Dein Partner sollte das vorher klar wissen, damit er/sie nicht in einem wichtigen Moment zögert.',
      en: 'Who photographs what and when is an underrated question. Many couples are later grateful for photos from the delivery room. Others do not want a camera anywhere near. Think it through: who is the "official photographer"? Should the moments of birth be captured? And: who is allowed to see the pictures afterwards, who is not? Your partner should know this clearly in advance, so they do not hesitate in a key moment.',
    },
    suggestions: [
      { de: 'Nur Detailaufnahmen (Hände, Füße)', en: 'Only detail shots (hands, feet)' },
      { de: 'Keine Gesichter der Mama', en: 'No photos of mum\'s face' },
      { de: 'Nur für uns, nichts öffentlich', en: 'For us only, nothing public' },
      { de: 'Fotograf:in nur draußen warten', en: 'Photographer waits outside the room' },
    ],
  },
  {
    id: 'atmosphere',
    stage: 2,
    label: {
      de: 'Wünsche zur Atmosphäre (Musik, Licht, Duft)?',
      en: 'Wishes for atmosphere (music, lighting, scent)?',
    },
    type: 'text',
    optional: true,
    hint: {
      de: 'Das klingt nach Luxus, macht aber einen echten Unterschied. Dein Nervensystem reagiert auf Umgebungsreize — gedämpftes Licht signalisiert Sicherheit, vertraute Musik kann den Kreißsaal zu "deinem" Raum machen. Viele Frauen bringen eine eigene Playlist, ein Kissen von zuhause oder einen Duft mit. Kreißsäle erlauben das oft — frag nach. Manchmal sind es die kleinen Dinge, die uns erden.',
      en: 'This sounds like a luxury, but it makes a real difference. Your nervous system reacts to its surroundings — dim lighting signals safety, familiar music can make the delivery room "yours". Many women bring their own playlist, a pillow from home or a scent. Hospitals often allow this — ask. Sometimes it is the small things that ground us.',
    },
    suggestions: [
      { de: 'Meine eigene Playlist', en: 'My own playlist' },
      { de: 'Gedimmtes Licht', en: 'Dim lighting' },
      { de: 'Lavendel-Aromaöl', en: 'Lavender aroma oil' },
      { de: 'Eigenes Kissen von zuhause', en: 'My own pillow from home' },
      { de: 'Ruhe, wenige Stimmen', en: 'Quiet, few voices' },
    ],
    presetSuggestions: {
      klinik: [
        { de: 'Meine eigene Playlist', en: 'My own playlist' },
        { de: 'Gedimmtes Licht wenn möglich', en: 'Dim lighting if possible' },
        { de: 'Bluetooth-Box mitbringen', en: 'Bring my own Bluetooth speaker' },
        { de: 'Türen geschlossen halten', en: 'Keep the doors closed' },
      ],
      hausgeburt: [
        { de: 'Kerzenlicht', en: 'Candlelight' },
        { de: 'Vertraute Musik', en: 'Familiar music' },
        { de: 'Aromatherapie (Lavendel)', en: 'Aromatherapy (lavender)' },
        { de: 'Warmes Bad vorbereitet', en: 'Warm bath prepared' },
      ],
      geburtshaus: [
        { de: 'Gedimmtes, warmes Licht', en: 'Dim, warm lighting' },
        { de: 'Wasserbecken bereit', en: 'Birth pool ready' },
        { de: 'Meine Playlist', en: 'My own playlist' },
        { de: 'Lavendel oder Rose als Duft', en: 'Lavender or rose scent' },
      ],
    },
  },
  {
    id: 'complications',
    stage: 2,
    label: {
      de: 'Bei Komplikationen (z.B. Kaiserschnitt): Was gilt?',
      en: 'In case of complications (e.g. caesarean): what counts?',
    },
    type: 'text',
    optional: true,
    hint: {
      de: 'Dieser Abschnitt ist schwer zu schreiben — weil niemand gern daran denkt, dass die Geburt nicht wie geplant läuft. Und doch: Frauen, die sich vorher damit beschäftigt haben, sind hinterher oft dankbar. Ein ungeplanter Kaiserschnitt ist kein Versagen — er rettet manchmal Leben. Was wünschst du dir in diesem Fall? Partner soll dabei sein? Baby direkt danach auf deine Brust? Schreibe es auf — für den Fall der Fälle.',
      en: 'This section is hard to write — because nobody likes to think about birth not going to plan. And yet: women who have thought it through in advance are often grateful afterwards. An unplanned caesarean is not failure — sometimes it saves lives. What do you wish for in that case? Partner present? Baby placed on your chest right after? Write it down — just in case.',
    },
    suggestions: [
      { de: 'Partner:in bleibt bei mir', en: 'Partner stays with me' },
      { de: 'Baby direkt auf meine Brust', en: 'Baby placed on my chest right away' },
      { de: 'Sagt mir vorher jeden Schritt', en: 'Tell me each step beforehand' },
      { de: 'Sichtschutz herunterlassen wenn ich möchte', en: 'Lower the curtain if I want to see' },
      { de: 'Kein Trennungsmoment mit Baby', en: 'Do not separate me from my baby' },
    ],
    presetSuggestions: {
      klinik: [
        { de: 'Partner:in im OP dabei', en: 'Partner in the operating room' },
        { de: 'Sanfter Kaiserschnitt wenn möglich', en: 'Gentle caesarean if possible' },
        { de: 'Baby direkt auf meine Brust', en: 'Baby placed on my chest right away' },
        { de: 'Sagt mir vorher jeden Schritt', en: 'Tell me each step beforehand' },
        { de: 'Verzögertes Abnabeln wenn möglich', en: 'Delayed cord clamping if possible' },
      ],
      hausgeburt: [
        { de: 'Bei Verlegung: Partner:in kommt mit', en: 'On transfer: partner comes with me' },
        { de: 'Hebamme begleitet in Klinik', en: 'Midwife accompanies me to the hospital' },
        { de: 'Ruhige Kommunikation, kein Alarmismus', en: 'Calm communication, no alarmism' },
        { de: 'Baby immer bei mir', en: 'Baby stays with me' },
      ],
      geburtshaus: [
        { de: 'Bei Verlegung: Partner:in und Hebamme mit', en: 'On transfer: partner and midwife with me' },
        { de: 'Ruhige, klare Kommunikation', en: 'Calm, clear communication' },
        { de: 'Baby direkt auf meine Brust', en: 'Baby placed on my chest right away' },
        { de: 'Sagt mir vorher jeden Schritt', en: 'Tell me each step beforehand' },
      ],
    },
  },

  // Stufe 3 — Wochenbett (ab SSW 32)
  {
    id: 'room',
    stage: 3,
    label: {
      de: 'Zimmer-Präferenz im Wochenbett?',
      en: 'Room preference for postpartum stay?',
    },
    type: 'single',
    options: [
      { de: 'Einzel-Zimmer (wenn möglich)', en: 'Private room (if possible)' },
      { de: 'Mehrbett-Zimmer ist ok', en: 'Shared room is fine' },
      { de: 'Egal', en: 'No preference' },
    ],
    hint: {
      de: 'Das Einzelzimmer klingt erstmal teuer und unnötig — bis das Baby um 3 Uhr schreit und du froh bist, vier andere Frauen nicht zu wecken. Oder umgekehrt: Im Mehrbettzimmer sind andere Mütter da, und das kann unglaublich stärkend sein. Informiere dich was deine Klinik anbietet und was es kostet. Wenn du körperlich erschöpft bist und Ruhe brauchst — das Einzelzimmer ist kein Luxus, es ist Selbstfürsorge.',
      en: 'A private room sounds expensive and unnecessary — until the baby cries at 3 am and you are glad you are not waking four other women. Or the opposite: in a shared room there are other mothers there, and that can be incredibly strengthening. Find out what your hospital offers and what it costs. If you are physically exhausted and need rest, a private room is not a luxury, it is self-care.',
    },
  },
  {
    id: 'visitors',
    stage: 3,
    label: {
      de: 'Besuche – wer darf wann kommen?',
      en: 'Visitors — who can come when?',
    },
    type: 'text',
    optional: true,
    hint: {
      de: 'Das Wochenbett ist eine der verletzlichsten Phasen deines Lebens — und gleichzeitig wollen alle kommen und gratulieren. Dein Recht: Nein zu sagen. Nur 20 Minuten. Erst nach der zweiten Woche. Besprich das vorher mit deinem Partner: Er/sie kann der "Türsteher" sein. "Sie schläft gerade — wir melden uns." Deine Familie und Freunde meinen es gut. Aber du brauchst Erholung, keine Koordination.',
      en: 'The early postpartum period is one of the most vulnerable phases of your life — and at the same time, everyone wants to come and congratulate you. Your right: to say no. Only 20 minutes. Not until the second week. Talk it through with your partner beforehand: they can be the "bouncer". "She is asleep — we will be in touch." Your family and friends mean well. But you need rest, not a social calendar.',
    },
  },
  {
    id: 'baby_sleep',
    stage: 3,
    label: {
      de: 'Baby-Schlafplatz?',
      en: 'Where will the baby sleep?',
    },
    type: 'single',
    options: [
      { de: 'Rooming-in (Baby immer bei mir)', en: 'Rooming-in (baby always with me)' },
      { de: 'Säuglingszimmer nachts', en: 'Nursery at night' },
      { de: 'Flexibel', en: 'Flexible' },
    ],
    hint: {
      de: 'Rooming-in (Baby die ganze Nacht bei dir) ist medizinisch empfohlen — es unterstützt Stillen und Bindung. Gleichzeitig sind die ersten Nächte intensiv. Viele Kliniken haben ein Säuglingszimmer, in das du dein Baby für einige Stunden geben kannst damit du schläfst. Das ist keine Schwäche — das ist Vernunft. Ein paar Stunden Schlaf machen aus einer überforderten Mutter wieder eine, die present sein kann.',
      en: 'Rooming-in (baby with you all night) is medically recommended — it supports breastfeeding and bonding. At the same time the first nights are intense. Many hospitals have a nursery where you can hand the baby over for a few hours so you can sleep. That is not weakness, that is wisdom. A few hours of sleep can turn an overwhelmed mother back into one who can be present.',
    },
  },
  {
    id: 'discharge',
    stage: 3,
    label: {
      de: 'Entlassung aus dem Krankenhaus?',
      en: 'When do you want to be discharged?',
    },
    type: 'single',
    options: [
      { de: 'So früh wie möglich', en: 'As early as possible' },
      { de: 'Lieber ein paar Tage länger bleiben', en: 'I prefer to stay a few extra days' },
      { de: 'Wie empfohlen', en: 'As recommended' },
    ],
    hint: {
      de: 'Früh nach Hause: eigenes Bett, eigene Küche, eigene Privatsphäre. Aber auch weniger professionelle Unterstützung. Länger bleiben: Schwestern und Hebammen sind da wenn du nachts Fragen hast. Hör auf deinen Körper — nicht auf den Druck der Krankenkasse oder die Ungeduld deiner Familie. Du weißt am besten wann du bereit bist.',
      en: 'Going home early: your own bed, your own kitchen, your own privacy. But also less professional support. Staying longer: nurses and midwives are there if you have questions in the night. Listen to your body — not to insurance pressure or your family\'s impatience. You know best when you are ready.',
    },
  },
  {
    id: 'midwife',
    stage: 3,
    label: {
      de: 'Wochenbett-Hebamme organisiert?',
      en: 'Postpartum midwife organised?',
    },
    type: 'single',
    options: [
      { de: 'Ja, bereits organisiert ✓', en: 'Yes, already arranged ✓' },
      { de: 'Noch nicht – brauche Unterstützung', en: 'Not yet — I need help with this' },
      { de: 'Nicht nötig', en: 'Not needed' },
    ],
    hint: {
      de: 'Eine Wochenbett-Hebamme ist kein Nice-to-have — sie ist eine der wichtigsten Ressourcen der ersten Wochen nach der Geburt. Sie kommt zu dir nach Hause, prüft die Wundheilung, hilft beim Stillen und — das vergessen viele — sie ist oft die erste, die merkt wenn es dir nicht gut geht. Gute Hebammen sind oft 6+ Monate im Voraus ausgebucht. Falls du noch keine hast: Heute anfangen. Frag deine Gynäkologin oder Freundinnen.',
      en: 'A postpartum midwife is not a nice-to-have — she is one of the most important resources of the first weeks after birth. She comes to your home, checks healing, helps with breastfeeding and — many people forget this — is often the first to notice if you are not well. Good midwives are often booked out 6+ months in advance. If you do not have one yet: start today. Ask your gynaecologist or friends with kids.',
    },
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

export function getQuestionLabel(question: Question, locale: Locale): string {
  return localized(question.label, locale)
}

export function getQuestionHint(question: Question, locale: Locale): string | undefined {
  return question.hint ? localized(question.hint, locale) : undefined
}

export function getQuestionOptions(question: Question, locale: Locale): string[] {
  return (question.options ?? []).map((option) => localized(option, locale))
}

/**
 * Resolve the suggestion list for a question given the user's clinic preset.
 * If a preset is set and the question has a matching override list, use that.
 * Otherwise fall back to the generic `suggestions` list.
 * Returns an empty array when nothing applies (safe to call on any question).
 */
export function getQuestionSuggestions(
  question: Question,
  clinicPreset: string | null | undefined,
): LocalizedString[] {
  const key: ClinicPresetKey | null =
    clinicPreset === 'klinik' ||
    clinicPreset === 'hausgeburt' ||
    clinicPreset === 'geburtshaus' ||
    clinicPreset === 'ambulant'
      ? clinicPreset
      : null
  if (key && question.presetSuggestions?.[key]?.length) {
    return question.presetSuggestions[key] ?? []
  }
  return question.suggestions ?? []
}
