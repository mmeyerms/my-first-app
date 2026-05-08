import type { LocalizedString } from '@/lib/i18n/localized'

export type SswComparisonCategory =
  | 'frucht'
  | 'suessigkeit'
  | 'spielzeug'
  | 'tier'
  | 'alltag'
  | 'sport'
  | 'beauty'

export type SswComparison = {
  category: SswComparisonCategory
  emoji: string
  label: LocalizedString
}

export type SswInfo = {
  ssw: number
  /** Length in millimeters (crown-rump until ~SSW 20, then crown-heel) */
  sizeMm: number
  /** Weight in grams. Undefined for very early weeks where weight isn't meaningful. */
  weightG?: number
  development: LocalizedString
  comparisons: SswComparison[]
  /** What the mom is feeling/experiencing this week (1-2 sentences). */
  momBody?: LocalizedString
  /** A delightful, surprising fact about this week. */
  funFact?: LocalizedString
  /** Concrete, actionable tip for the partner this week. */
  partnerTip?: LocalizedString
}

export const SSW_DATA: SswInfo[] = [
  {
    ssw: 4,
    sizeMm: 0.4,
    development: {
      de: 'Dein Baby ist gerade ein winziger Zellhaufen, der sich in deine Gebärmutterschleimhaut einnistet. Erste Strukturen für Herz und Nervensystem werden angelegt. Du spürst noch nichts, aber im Inneren passiert ein kleines Wunder.',
      en: 'Your baby is a tiny cluster of cells implanting into the lining of your uterus. The first structures for the heart and nervous system are forming. You can\'t feel anything yet — but inside, a quiet miracle is unfolding.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🌱', label: { de: 'so klein wie ein Mohnkorn', en: 'as tiny as a poppy seed' } },
      { category: 'alltag', emoji: '🔬', label: { de: 'gerade unter dem Mikroskop sichtbar', en: 'barely visible under a microscope' } },
      { category: 'alltag', emoji: '✨', label: { de: 'kleiner als ein Glitzerstaub-Korn', en: 'smaller than a speck of glitter' } },
      { category: 'beauty', emoji: '💄', label: { de: 'kleiner als ein Hauch Lipgloss', en: 'smaller than a dab of lip gloss' } },
    ],
    momBody: {
      de: 'Vielleicht ein leichtes Ziehen, ein bisschen Müdigkeit — oft fühlt sich SSW 4 an wie kurz vor der Periode. Ein Schwangerschaftstest könnte gerade jetzt zum ersten Mal positiv anzeigen.',
      en: 'Maybe a slight pull, a bit of tiredness — week 4 often feels like the days before your period. A pregnancy test could show its first positive line right now.',
    },
    funFact: {
      de: 'Im Moment der Einnistung schüttet dein Körper hCG aus — das Hormon, das den Schwangerschaftstest erst möglich macht.',
      en: 'At the moment of implantation, your body starts releasing hCG — the very hormone that makes a pregnancy test possible.',
    },
    partnerTip: {
      de: 'Frag offen, wie sie sich fühlt — körperlich UND emotional. Die Wochen zwischen positivem Test und erstem Ultraschall sind oft die einsamsten der ganzen Schwangerschaft.',
      en: 'Ask openly how she feels — physically AND emotionally. The weeks between the first positive test and the first ultrasound are often the loneliest of the whole pregnancy.',
    },
  },
  {
    ssw: 5,
    sizeMm: 1,
    development: {
      de: 'Das Herz beginnt erste Zuckungen — noch nicht hörbar, aber da. Der Embryo bildet drei Keimblätter, aus denen alles Spätere wird: Haut, Knochen, Organe. Du bist offiziell schwanger.',
      en: 'The heart starts its very first flickers — not audible yet, but already there. The embryo forms three layers that will become skin, bones, and organs. You are officially pregnant.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🌾', label: { de: 'so klein wie ein Sesamkorn', en: 'as tiny as a sesame seed' } },
      { category: 'alltag', emoji: '🪡', label: { de: 'kleiner als eine Stecknadelspitze', en: 'smaller than a pinhead' } },
      { category: 'suessigkeit', emoji: '🍬', label: { de: 'wie ein Streuselchen auf einem Cupcake', en: 'like a sprinkle on a cupcake' } },
      { category: 'beauty', emoji: '💄', label: { de: 'klein wie ein Lippenstift-Tupfer', en: 'small as a single lipstick dab' } },
    ],
  },
  {
    ssw: 6,
    sizeMm: 4,
    development: {
      de: 'Das winzige Herz schlägt jetzt regelmäßig — etwa 110 Mal pro Minute. Erste Anlagen für Augen, Ohren und Gliedmaßen werden sichtbar. Übelkeit kann sich melden, ist aber ein gutes Zeichen.',
      en: 'The tiny heart now beats steadily — about 110 times per minute. The first buds for eyes, ears, and limbs are appearing. Morning sickness may show up, but it\'s usually a good sign.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🫘', label: { de: 'so groß wie eine Linse', en: 'as big as a lentil' } },
      { category: 'suessigkeit', emoji: '🍬', label: { de: 'wie ein Mini-Gummibärchen', en: 'like a mini gummy bear' } },
      { category: 'alltag', emoji: '✏️', label: { de: 'wie die Spitze eines Bleistifts', en: 'like the tip of a pencil' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein Tropfen Mascara', en: 'like a drop of mascara' } },
    ],
    momBody: {
      de: 'Übelkeit kann jetzt einsetzen — oft schon morgens beim Zähneputzen. Der Geruchssinn wird hyperempfindlich; selbst dein Lieblingsparfüm kann plötzlich unerträglich riechen.',
      en: 'Nausea may start now — often the moment you brush your teeth in the morning. Your sense of smell goes into overdrive; even your favorite perfume can suddenly be unbearable.',
    },
    funFact: {
      de: 'Das Herz deines Babys schlägt jetzt schneller als deins — rund 110 Schläge pro Minute, doppelt so schnell wie ein erwachsener Herzschlag.',
      en: 'Your baby\'s heart now beats faster than yours — around 110 beats per minute, almost twice as fast as an adult\'s.',
    },
    partnerTip: {
      de: 'Halte einen Vorrat an Salzgebäck, Ingwertee und kalten Getränken bereit. Übelkeit kommt unangekündigt — wenn sie zugreifen kann ohne aufzustehen, ist viel gewonnen.',
      en: 'Keep crackers, ginger tea, and cold drinks within reach. Nausea hits without warning — being able to grab something without getting up is a huge win.',
    },
  },
  {
    ssw: 7,
    sizeMm: 8,
    development: {
      de: 'Der Embryo verdoppelt seine Größe in dieser Woche! Arm- und Beinknospen formen sich, und das Gehirn entwickelt sich rasant. Du fühlst dich vielleicht erschöpft — dein Körper leistet gerade Schwerstarbeit.',
      en: 'The embryo doubles in size this week! Arm and leg buds are forming, and the brain is growing rapidly. You may feel exhausted — your body is doing serious heavy lifting right now.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🫐', label: { de: 'so groß wie eine Heidelbeere', en: 'as big as a blueberry' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'wie ein Schokolinsen-Stück', en: 'like a single chocolate chip' } },
      { category: 'spielzeug', emoji: '🧱', label: { de: 'kleiner als ein Lego-Noppen', en: 'smaller than a Lego stud' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie eine Perle Lipgloss', en: 'like a single lip-gloss bead' } },
    ],
  },
  {
    ssw: 8,
    sizeMm: 16,
    development: {
      de: 'Finger und Zehen sind angelegt, noch wie kleine Schwimmhäute. Der Schwanzansatz verschwindet, das Baby sieht jetzt richtig nach Mensch aus. Erste winzige Bewegungen finden statt — du spürst sie nur noch nicht.',
      en: 'Fingers and toes are forming, still slightly webbed. The little tail bud disappears — your baby now looks distinctly human. The first tiny movements happen, but you can\'t feel them yet.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍇', label: { de: 'so groß wie eine Himbeere', en: 'as big as a raspberry' } },
      { category: 'tier', emoji: '🐛', label: { de: 'so lang wie eine kleine Raupe', en: 'as long as a small caterpillar' } },
      { category: 'alltag', emoji: '🪙', label: { de: 'so breit wie eine 1-Cent-Münze', en: 'as wide as a 1-cent coin' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein kleiner Make-up-Schwamm', en: 'like a small makeup sponge tip' } },
    ],
    momBody: {
      de: 'Übelkeit, Müdigkeit, geschwollene Brüste — dein Körper arbeitet auf Hochtouren am Aufbau der Plazenta. Du brauchst mehr Schlaf als je zuvor, und das ist absolut normal.',
      en: 'Nausea, fatigue, swollen breasts — your body is working overtime to build the placenta. You need more sleep than ever, and that\'s completely normal.',
    },
    funFact: {
      de: 'Dein Baby hat in dieser Woche noch einen winzigen Schwanz — der bildet sich bis zur 12. Woche von selbst zurück.',
      en: 'Your baby still has a tiny tail this week — it disappears all on its own by week 12.',
    },
    partnerTip: {
      de: 'Übernimm Hausarbeit, ohne dass sie fragen muss. Erste-Trimester-Müdigkeit ist real und verschwindet nicht durch Willenskraft. Wäsche, Spülen, Einkauf — einfach machen.',
      en: 'Take over household tasks without being asked. First-trimester fatigue is real and doesn\'t respond to willpower. Laundry, dishes, groceries — just do them.',
    },
  },
  {
    ssw: 9,
    sizeMm: 22,
    development: {
      de: 'Aus dem Embryo wird offiziell ein Fötus. Alle wichtigen Organe sind angelegt und entwickeln sich weiter. Erste Reflexe entstehen — das Baby kann sich strecken und biegen.',
      en: 'The embryo is officially a fetus now. All major organs have formed and continue to develop. The first reflexes appear — your baby can stretch and curl.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🫒', label: { de: 'so groß wie eine Olive', en: 'as big as an olive' } },
      { category: 'suessigkeit', emoji: '🍓', label: { de: 'wie ein einzelnes Erdbeerbonbon', en: 'like a single strawberry candy' } },
      { category: 'spielzeug', emoji: '🎲', label: { de: 'kleiner als ein Würfel', en: 'smaller than a die' } },
      { category: 'beauty', emoji: '💄', label: { de: 'so lang wie eine Mascara-Bürste (kurz)', en: 'as long as a mascara brush (short)' } },
    ],
  },
  {
    ssw: 10,
    sizeMm: 31,
    development: {
      de: 'Die kritische Phase der Organbildung ist fast vorbei. Mini-Nägel beginnen zu wachsen, Zähnchen werden im Kiefer angelegt. Das Baby öffnet und schließt seine winzigen Fäuste.',
      en: 'The critical phase of organ formation is almost behind you. Tiny nails start to grow, and tooth buds form in the jaw. Your baby opens and closes its little fists.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍓', label: { de: 'so groß wie eine Erdbeere', en: 'as big as a strawberry' } },
      { category: 'tier', emoji: '🐝', label: { de: 'so groß wie eine Hummel', en: 'about the size of a bumblebee' } },
      { category: 'spielzeug', emoji: '🪀', label: { de: 'wie eine kleine Murmel', en: 'like a small marble' } },
      { category: 'beauty', emoji: '💅', label: { de: 'wie ein Nagellack-Fläschchen-Verschluss', en: 'like a nail polish bottle cap' } },
    ],
    momBody: {
      de: 'Stimmungsschwankungen können dich überraschen — von Tränen über Trost-TV bis zu plötzlicher Euphorie. Hormone fahren Achterbahn, und das ist nicht „übertrieben", sondern Biochemie.',
      en: 'Mood swings can ambush you — from tears over comfort TV to sudden euphoria. Hormones are on a rollercoaster, and it\'s not "dramatic", it\'s biochemistry.',
    },
    funFact: {
      de: 'Dein Baby kann jetzt schon schlucken — und produziert seinen ersten Urin direkt ins Fruchtwasser, das es kurz darauf wieder trinkt.',
      en: 'Your baby can already swallow — and produces its first urine straight into the amniotic fluid, which it then drinks again.',
    },
    partnerTip: {
      de: 'Sei der ruhige Pol bei Stimmungsschwankungen. Nicht erklären, nicht reparieren — einfach da sein, eine Decke holen, einen Tee machen, sagen „Ich bin hier."',
      en: 'Be the calm anchor through mood swings. Don\'t explain, don\'t fix — just be there, fetch a blanket, make tea, say "I\'m right here."',
    },
  },
  {
    ssw: 11,
    sizeMm: 41,
    development: {
      de: 'Das Baby kann jetzt kräftig strampeln, schlucken und sogar Schluckauf bekommen. Die Genitalien beginnen sich zu differenzieren. Dein Bauch zeigt vielleicht noch nichts — aber du bist hochaktive Werkstatt für ein Wunder.',
      en: 'Your baby can now kick energetically, swallow, and even get the hiccups. The genitals start to differentiate. Your belly may still be flat — but inside you\'re a busy workshop building a miracle.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍋', label: { de: 'so groß wie eine Limette', en: 'as big as a lime' } },
      { category: 'spielzeug', emoji: '🚗', label: { de: 'wie ein Hot-Wheels-Auto', en: 'like a Hot Wheels car' } },
      { category: 'alltag', emoji: '🥄', label: { de: 'so lang wie ein Teelöffel', en: 'as long as a teaspoon' } },
      { category: 'beauty', emoji: '💄', label: { de: 'so lang wie ein Mini-Lippenstift', en: 'as long as a mini lipstick' } },
    ],
  },
  {
    ssw: 12,
    sizeMm: 54,
    weightG: 14,
    development: {
      de: 'Ende des ersten Trimesters! Das Risiko einer Fehlgeburt sinkt deutlich. Das Baby hat alle Organe angelegt — jetzt geht es vor allem ums Wachsen. Die Übelkeit lässt bei vielen langsam nach.',
      en: 'End of the first trimester! Miscarriage risk drops noticeably. All organs are in place — now it\'s mostly about growing. For many, morning sickness starts to ease.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍑', label: { de: 'so groß wie eine Pflaume', en: 'as big as a plum' } },
      { category: 'suessigkeit', emoji: '🍬', label: { de: 'leicht wie ein paar Gummibärchen', en: 'as light as a few gummy bears' } },
      { category: 'tier', emoji: '🐭', label: { de: 'so groß wie eine kleine Maus', en: 'about the size of a small mouse' } },
      { category: 'spielzeug', emoji: '🧸', label: { de: 'wie ein winziger Spielzeug-Hase', en: 'like a tiny toy bunny' } },
      { category: 'sport', emoji: '🎾', label: { de: 'so groß wie ein Tischtennisball', en: 'about the size of a table tennis ball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'etwa wie eine Mascara-Bürste', en: 'about like a mascara brush' } },
    ],
    momBody: {
      de: 'Die Übelkeit lässt bei vielen nach — Energie kehrt zurück. Der Bauch kann erstmals leicht spannen, ohne dass schon eine Wölbung sichtbar ist. Atme durch: das erste Trimester ist geschafft.',
      en: 'Nausea often starts to ease — energy returns. Your belly may feel slightly tight without any visible bump yet. Breathe out: the first trimester is behind you.',
    },
    funFact: {
      de: 'Dein Baby hat jetzt schon einzigartige Fingerabdrücke — die werden sich sein Leben lang nicht mehr verändern.',
      en: 'Your baby already has unique fingerprints — they will never change for the rest of its life.',
    },
    partnerTip: {
      de: 'Plant gemeinsam, wem ihr es jetzt erzählen wollt — und wem nicht. Schreibt eine kurze Liste. Es ist ihre Geschichte, aber zwei Menschen sollten wissen, wer Bescheid weiß.',
      en: 'Plan together who you want to tell now — and who not. Write a short list. It\'s her story, but two people should know who is in the loop.',
    },
  },
  {
    ssw: 13,
    sizeMm: 74,
    weightG: 23,
    development: {
      de: 'Die Stimmbänder werden ausgebildet — fürs Schreien später. Das Baby trinkt schon Fruchtwasser und uriniert es wieder aus. Sein Kopf macht etwa die Hälfte der Körpergröße aus.',
      en: 'The vocal cords are forming — ready for crying later. Your baby is already drinking amniotic fluid and peeing it back out. The head is still about half of the body length.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍑', label: { de: 'so groß wie ein Pfirsich', en: 'as big as a peach' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'leicht wie ein Schoko-Riegel', en: 'as light as a chocolate bar' } },
      { category: 'spielzeug', emoji: '🦆', label: { de: 'wie eine kleine Quietsche-Ente', en: 'like a small rubber duck' } },
      { category: 'alltag', emoji: '🥄', label: { de: 'so lang wie ein Esslöffel', en: 'as long as a tablespoon' } },
      { category: 'beauty', emoji: '💄', label: { de: 'so lang wie ein normaler Lippenstift', en: 'as long as a regular lipstick' } },
    ],
  },
  {
    ssw: 14,
    sizeMm: 87,
    weightG: 43,
    development: {
      de: 'Das Baby kann jetzt Grimassen schneiden, blinzeln und am Daumen lutschen. Lanugo-Haare bedecken den Körper als feiner Flaum. Vielleicht spürst du jetzt mehr Energie — willkommen im zweiten Trimester.',
      en: 'Your baby can now make faces, blink, and suck its thumb. A fine layer of lanugo hair covers the body. You may feel a fresh wave of energy — welcome to the second trimester.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍋', label: { de: 'so groß wie eine Zitrone', en: 'as big as a lemon' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie ein halber Schokoriegel', en: 'as heavy as half a chocolate bar' } },
      { category: 'spielzeug', emoji: '🪀', label: { de: 'wie ein kleines Jojo', en: 'like a small yo-yo' } },
      { category: 'tier', emoji: '🐹', label: { de: 'so groß wie ein Hamster', en: 'about the size of a hamster' } },
      { category: 'sport', emoji: '🎾', label: { de: 'wie ein kleiner Squash-Ball', en: 'like a small squash ball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein Mascara-Tube mit Bürste', en: 'like a mascara tube with brush' } },
    ],
    momBody: {
      de: 'Energie kehrt zurück, der Appetit auch. Die Brust kann weiter spannen. Manche bemerken jetzt das „Pregnancy-Glow" — durch die bessere Durchblutung wirkt die Haut frischer.',
      en: 'Energy returns, appetite too. Your breasts may keep feeling tender. Some notice the famous "pregnancy glow" — better circulation makes skin look fresher.',
    },
    funFact: {
      de: 'Dein Baby kann jetzt schon Grimassen schneiden — Stirn runzeln, schmollen, lächeln. Es übt unbewusst die Mimik, die es später braucht.',
      en: 'Your baby can already pull faces — frown, pout, smile. It\'s unconsciously rehearsing the expressions it will use later.',
    },
    partnerTip: {
      de: 'Plant einen ruhigen Abend zu zweit — vor dem Bauch wachsen, vor Sorgen, vor allem. Ein Babymoon-Light, mitten im Alltag. Macht Fotos voneinander.',
      en: 'Plan a calm evening just the two of you — before the belly grows, before the worries, before everything. A "babymoon-lite" in the middle of life. Take photos of each other.',
    },
  },
  {
    ssw: 15,
    sizeMm: 100,
    weightG: 70,
    development: {
      de: 'Die Knochen härten aus, Beine wachsen länger als Arme. Das Baby hört jetzt deine Stimme und deinen Herzschlag. Manche Mütter spüren in dieser Woche zum ersten Mal ein zartes Flattern.',
      en: 'Bones are hardening, and the legs grow longer than the arms. Your baby can now hear your voice and heartbeat. Some moms feel the very first delicate flutters this week.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍎', label: { de: 'so groß wie ein Apfel', en: 'as big as an apple' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie eine kleine Tafel Schokolade', en: 'as heavy as a small chocolate bar' } },
      { category: 'spielzeug', emoji: '🎾', label: { de: 'so groß wie ein Tennisball', en: 'about the size of a tennis ball' } },
      { category: 'alltag', emoji: '📱', label: { de: 'so lang wie ein iPhone', en: 'as long as an iPhone' } },
      { category: 'sport', emoji: '🎾', label: { de: 'genau wie ein Tennisball', en: 'just like a tennis ball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein Parfüm-Sample-Fläschchen', en: 'like a perfume sample bottle' } },
    ],
  },
  {
    ssw: 16,
    sizeMm: 116,
    weightG: 100,
    development: {
      de: 'Das Baby übt das Atmen — es zieht Fruchtwasser ein und aus. Der Herzschlag ist beim Doppler-Ultraschall deutlich zu hören. Die Augen können sich jetzt langsam bewegen, auch wenn sie noch geschlossen sind.',
      en: 'Your baby is practicing breathing — pulling amniotic fluid in and out. The heartbeat is now clearly audible on a doppler. The eyes can move slowly, even while still closed.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥑', label: { de: 'so groß wie eine Avocado', en: 'as big as an avocado' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie eine Tafel Schokolade', en: 'as heavy as a bar of chocolate' } },
      { category: 'spielzeug', emoji: '🧸', label: { de: 'so lang wie ein kleiner Teddybär', en: 'as long as a small teddy bear' } },
      { category: 'alltag', emoji: '📱', label: { de: 'ungefähr wie ein großes Smartphone', en: 'about the size of a large smartphone' } },
      { category: 'tier', emoji: '🐭', label: { de: 'leicht wie eine kleine Maus', en: 'as light as a small mouse' } },
      { category: 'sport', emoji: '🥎', label: { de: 'wie ein kleiner Softball', en: 'like a small softball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie eine kleine Parfümflakon-Probe', en: 'like a small perfume bottle sample' } },
    ],
    momBody: {
      de: 'Der Bauch wird langsam sichtbar — manche zeigen schon eine kleine Wölbung, andere noch nicht. Beides ist normal. Brust spannt weniger, Energie ist gut.',
      en: 'Your belly is slowly showing — some have a little bump already, others not yet. Both are normal. Breast tenderness eases, energy feels good.',
    },
    funFact: {
      de: 'Dein Baby kann jetzt deine Stimme hören und reagiert auf Musik. Sein Innenohr ist fertig entwickelt — es lauscht dir zu.',
      en: 'Your baby can now hear your voice and reacts to music. Its inner ear is fully formed — it\'s listening to you.',
    },
    partnerTip: {
      de: 'Sprich mit dem Bauch. Ja, es fühlt sich anfangs komisch an. Aber dein Baby lernt deine Stimme jetzt schon kennen — der Effekt nach der Geburt ist riesig.',
      en: 'Talk to the belly. Yes, it feels weird at first. But your baby is learning your voice now — the effect after birth is enormous.',
    },
  },
  {
    ssw: 17,
    sizeMm: 130,
    weightG: 140,
    development: {
      de: 'Eine Schicht Fettgewebe bildet sich unter der Haut, die noch durchscheinend ist. Das Skelett verwandelt sich von Knorpel zu festem Knochen. Das Baby hat jetzt einen ausgeprägten Gleichgewichtssinn.',
      en: 'A layer of fat begins to form under the skin, which is still translucent. The skeleton turns from cartilage into bone. Your baby is developing a real sense of balance.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍐', label: { de: 'so groß wie eine Birne', en: 'as big as a pear' } },
      { category: 'suessigkeit', emoji: '🍪', label: { de: 'schwer wie ein Schokokuss-Pack', en: 'as heavy as a pack of marshmallow treats' } },
      { category: 'tier', emoji: '🐹', label: { de: 'so schwer wie zwei Hamster', en: 'about the weight of two hamsters' } },
      { category: 'alltag', emoji: '🥕', label: { de: 'so lang wie eine kleine Karotte', en: 'as long as a small carrot' } },
      { category: 'sport', emoji: '🏐', label: { de: 'so groß wie ein Wasserball-Anhänger', en: 'about the size of a small water-polo trinket' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein Mini-Parfüm-Roll-on', en: 'like a mini perfume roll-on' } },
    ],
  },
  {
    ssw: 18,
    sizeMm: 140,
    weightG: 190,
    development: {
      de: 'Die Ohren stehen jetzt seitlich vom Kopf ab, das Baby reagiert auf laute Geräusche. Die Geschlechtsorgane sind beim Ultraschall meist erkennbar. Du spürst vielleicht erste deutliche Tritte!',
      en: 'The ears are now in their proper position and your baby reacts to loud sounds. The genitals are usually visible on ultrasound. You may feel the first real kicks!',
    },
    comparisons: [
      { category: 'frucht', emoji: '🫑', label: { de: 'so groß wie eine Paprika', en: 'as big as a bell pepper' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie zwei Tafeln Schokolade', en: 'as heavy as two chocolate bars' } },
      { category: 'spielzeug', emoji: '🪆', label: { de: 'wie eine mittlere Matrjoschka', en: 'like a medium matryoshka doll' } },
      { category: 'alltag', emoji: '📚', label: { de: 'so lang wie ein Taschenbuch', en: 'as long as a paperback book' } },
      { category: 'tier', emoji: '🐭', label: { de: 'so schwer wie eine Ratte', en: 'as heavy as a small rat' } },
      { category: 'sport', emoji: '🧘', label: { de: 'fast wie ein halber Yoga-Block', en: 'almost like half a yoga block' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein Make-up-Pinsel-Set (klein)', en: 'like a small makeup-brush set' } },
    ],
    momBody: {
      de: 'Erste deutliche Tritte können kommen — bei manchen wie Schmetterlinge, bei anderen wie kleine Stupser. Rückenschmerzen können beginnen, weil der Schwerpunkt sich verschiebt.',
      en: 'First clear kicks can arrive — for some like butterflies, for others like little nudges. Back pain may start as your center of gravity shifts.',
    },
    funFact: {
      de: 'Dein Baby gähnt jetzt schon im Bauch — komplett mit ausgestrecktem Mund und manchmal einem kleinen Hicks danach.',
      en: 'Your baby is yawning in the womb already — full open mouth and sometimes a little hiccup afterwards.',
    },
    partnerTip: {
      de: 'Wenn sie dir den Bauch hinhält, leg die Hand sanft auf — auch wenn du noch nichts spürst. Das geteilte Warten ist ein eigener Liebesakt.',
      en: 'When she offers you her belly, place your hand gently — even if you don\'t feel anything yet. The shared waiting is its own act of love.',
    },
  },
  {
    ssw: 19,
    sizeMm: 150,
    weightG: 240,
    development: {
      de: 'Eine schützende, käseartige Schicht (Vernix Caseosa) überzieht die Haut. Das Baby entwickelt einen klaren Schlaf-Wach-Rhythmus. Sinnesregionen im Gehirn werden ausgeprägter.',
      en: 'A protective, cheese-like coating (vernix caseosa) covers the skin. Your baby develops a clear sleep-wake rhythm. Sensory regions in the brain become more defined.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥭', label: { de: 'so groß wie eine Mango', en: 'as big as a mango' } },
      { category: 'suessigkeit', emoji: '🍩', label: { de: 'schwer wie zwei Donuts', en: 'as heavy as two donuts' } },
      { category: 'spielzeug', emoji: '🧸', label: { de: 'wie ein kuscheliger kleiner Teddy', en: 'like a small cuddly teddy' } },
      { category: 'alltag', emoji: '🍌', label: { de: 'so lang wie eine kleine Banane', en: 'as long as a small banana' } },
      { category: 'sport', emoji: '🎾', label: { de: 'so lang wie 2 Tennisbälle', en: 'as long as 2 tennis balls' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie 4 nebeneinander aufgereihte Lippenstifte', en: 'like 4 lipsticks lined up side by side' } },
    ],
  },
  {
    ssw: 20,
    sizeMm: 160,
    weightG: 300,
    development: {
      de: 'Halbzeit! Das Baby wiegt etwa 300 Gramm und ist jetzt aktiv und beweglich. Es schmeckt das Fruchtwasser — Vorlieben für später entstehen schon hier. Das Geschlecht ist eindeutig erkennbar.',
      en: 'Halfway there! Your baby weighs about 300 grams and is now active and lively. It tastes the amniotic fluid — taste preferences begin forming here. The sex is clearly visible now.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍌', label: { de: 'so lang wie eine Banane', en: 'as long as a banana' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie 3 Tafeln Schokolade', en: 'as heavy as 3 chocolate bars' } },
      { category: 'spielzeug', emoji: '🧸', label: { de: 'wie ein normaler Teddybär', en: 'like a regular teddy bear' } },
      { category: 'alltag', emoji: '👟', label: { de: 'so lang wie ein Damen-Sneaker', en: 'as long as a women\'s sneaker' } },
      { category: 'tier', emoji: '🐹', label: { de: 'so schwer wie ein Meerschweinchen-Baby', en: 'as heavy as a baby guinea pig' } },
      { category: 'sport', emoji: '🎾', label: { de: 'wie ein dicker Tennisball', en: 'like a chunky tennis ball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'so lang wie eine Mascara mit Verlängerung', en: 'as long as a lengthening mascara' } },
    ],
    momBody: {
      de: 'Bauch wird sichtbar. Erste Kindsbewegungen sind oft jetzt spürbar — wie Schmetterlinge oder leichtes Trommeln. Halbzeit fühlt sich nach Meilenstein an, weil es genau das ist.',
      en: 'Belly becomes visible. First baby movements often felt now — like butterflies or gentle drumming. Halfway feels like a milestone because that\'s exactly what it is.',
    },
    funFact: {
      de: 'Dein Baby kann jetzt Geräusche von außen hören und reagiert auf vertraute Stimmen. Manche Babys erkennen nach der Geburt sofort die Titelmusik einer Lieblingsserie der Mama.',
      en: 'Your baby can hear external sounds now and reacts to familiar voices. Some babies recognize a mom\'s favorite show theme song right after birth.',
    },
    partnerTip: {
      de: 'Sprich oder sing regelmäßig mit dem Bauch. Die Stimme prägt sich ein — und dein Baby kennt dich schon, bevor es da ist.',
      en: 'Talk or sing to the belly regularly. Your voice imprints — your baby will know you before they\'re even born.',
    },
  },
  {
    ssw: 21,
    sizeMm: 270,
    weightG: 360,
    development: {
      de: 'Ab jetzt wird die Größe vom Scheitel bis zur Ferse gemessen — daher der scheinbare Sprung. Das Baby wächst in die Länge. Es kann jetzt schmecken, hören und sogar Lichtschein wahrnehmen.',
      en: 'From now on size is measured from head to heel — hence the jump. Your baby is stretching out in length. It can taste, hear, and even sense light through the belly.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥕', label: { de: 'so lang wie eine Karotte', en: 'as long as a carrot' } },
      { category: 'suessigkeit', emoji: '🍪', label: { de: 'schwer wie ein Glas Nutella (klein)', en: 'as heavy as a small jar of Nutella' } },
      { category: 'spielzeug', emoji: '🧸', label: { de: 'wie ein mittlerer Teddybär', en: 'like a medium teddy bear' } },
      { category: 'alltag', emoji: '📕', label: { de: 'so lang wie ein dickeres Hardcover', en: 'as long as a thick hardcover book' } },
      { category: 'sport', emoji: '🧘', label: { de: 'so lang wie ein Yoga-Block', en: 'as long as a yoga block' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein Haarspray-Mini', en: 'like a mini hairspray can' } },
    ],
  },
  {
    ssw: 22,
    sizeMm: 280,
    weightG: 430,
    development: {
      de: 'Augenbrauen und Wimpern sind sichtbar. Das Baby greift nach der Nabelschnur, übt Bewegungsabläufe. Du kannst seine Tritte jetzt von außen oft schon sehen — kleine Wellen unter der Haut.',
      en: 'Eyebrows and eyelashes are visible. Your baby grabs the umbilical cord and practices movements. You can often see kicks from the outside now — small waves rolling across your belly.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🎃', label: { de: 'so lang wie ein Spaghetti-Kürbis', en: 'as long as a spaghetti squash' } },
      { category: 'suessigkeit', emoji: '🍩', label: { de: 'schwer wie 4 große Donuts', en: 'as heavy as 4 big donuts' } },
      { category: 'spielzeug', emoji: '🪆', label: { de: 'wie eine große Holzpuppe', en: 'like a large wooden doll' } },
      { category: 'tier', emoji: '🐿️', label: { de: 'so schwer wie ein Eichhörnchen', en: 'as heavy as a squirrel' } },
      { category: 'sport', emoji: '🏓', label: { de: 'so lang wie ein Tischtennisschläger', en: 'as long as a table tennis paddle' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein voller Schmink-Pinsel-Beutel', en: 'like a full makeup brush pouch' } },
    ],
    momBody: {
      de: 'Tritte werden deutlich, oft auch von außen sichtbar. Heißhunger oder seltsame Kombinationen können auftauchen — Eis mit Gurke gehört dazu. Auch Sodbrennen kann sich melden.',
      en: 'Kicks become clear, often visible from the outside. Cravings or strange combos can show up — ice cream with pickles included. Heartburn may make a first appearance.',
    },
    funFact: {
      de: 'Dein Baby hat jetzt schon Augenbrauen und Wimpern — komplett. Manchmal sieht man sie sogar im Ultraschall.',
      en: 'Your baby already has eyebrows and eyelashes — fully formed. Sometimes you can even spot them on ultrasound.',
    },
    partnerTip: {
      de: 'Erkundige dich nach Geburtsvorbereitungskursen. Buche einen — gemeinsam, nicht nur sie alleine. Es zeigt: das ist auch dein Projekt.',
      en: 'Look up birth prep classes. Book one — together, not just her alone. It signals: this is your project too.',
    },
  },
  {
    ssw: 23,
    sizeMm: 290,
    weightG: 500,
    development: {
      de: 'Das Baby knackt die halbe-Kilo-Marke! Die Lungen üben fleißig — auch wenn sie noch nicht alleine arbeiten könnten. Das Innenohr ist fertig entwickelt — dein Baby hat jetzt ein eigenes Gleichgewichtsgefühl.',
      en: 'Your baby crosses the half-kilo mark! The lungs are practicing hard, though they couldn\'t work alone yet. The inner ear is fully developed — your baby has its own sense of balance now.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥭', label: { de: 'wie eine große Mango', en: 'like a large mango' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie 5 Tafeln Schokolade', en: 'as heavy as 5 chocolate bars' } },
      { category: 'alltag', emoji: '📦', label: { de: 'wie ein Paket Reis (500g)', en: 'like a 500g bag of rice' } },
      { category: 'tier', emoji: '🐹', label: { de: 'so schwer wie ein dickes Meerschweinchen', en: 'as heavy as a chunky guinea pig' } },
      { category: 'sport', emoji: '🥎', label: { de: 'so schwer wie ein Softball', en: 'as heavy as a softball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'so schwer wie ein voller Schmink-Beutel', en: 'as heavy as a full makeup pouch' } },
    ],
  },
  {
    ssw: 24,
    sizeMm: 300,
    weightG: 600,
    development: {
      de: 'Wichtige Schwelle: ab dieser Woche steigen die Überlebenschancen einer Frühgeburt deutlich. Das Baby hat jetzt einen klaren Tag-Nacht-Rhythmus — leider nicht immer derselbe wie deiner.',
      en: 'A critical threshold: from this week on, survival rates after preterm birth rise sharply. Your baby has a clear day-night rhythm now — though it may not match yours.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🌽', label: { de: 'so lang wie ein Maiskolben', en: 'as long as a corn cob' } },
      { category: 'suessigkeit', emoji: '🧁', label: { de: 'schwer wie 6 Cupcakes', en: 'as heavy as 6 cupcakes' } },
      { category: 'spielzeug', emoji: '🎀', label: { de: 'wie eine kleine Babypuppe', en: 'like a small baby doll' } },
      { category: 'alltag', emoji: '📕', label: { de: 'schwer wie ein Hardcover-Roman', en: 'as heavy as a hardcover novel' } },
      { category: 'tier', emoji: '🐰', label: { de: 'so schwer wie ein Zwergkaninchen', en: 'as heavy as a dwarf rabbit' } },
      { category: 'sport', emoji: '⚽', label: { de: 'so lang wie ein halber Fußball', en: 'as long as half a soccer ball' } },
      { category: 'beauty', emoji: '🧴', label: { de: 'so schwer wie eine kleine Shampoo-Flasche', en: 'as heavy as a small shampoo bottle' } },
    ],
    momBody: {
      de: 'Der Bauch ist jetzt deutlich da. Du fühlst dich vielleicht „richtig schwanger" — Kleidung wird enger, Blicke werden anders. Manche bemerken eine dunkle Linie (Linea nigra) am Bauch.',
      en: 'The belly is clearly here now. You may feel "really pregnant" — clothes tighten, glances shift. Some notice a dark line (linea nigra) on the belly.',
    },
    funFact: {
      de: 'Dein Baby könnte jetzt theoretisch außerhalb des Bauches überleben — die Lebensfähigkeitsgrenze gilt offiziell ab SSW 24.',
      en: 'Your baby could theoretically survive outside the womb now — the official viability threshold is week 24.',
    },
    partnerTip: {
      de: 'Geht zusammen Umstandsmode shoppen. Klingt klein, ist riesig: ihr Körper verändert sich, Kleidung passt nicht mehr — gemeinsam neue zu finden, ist Verbundenheit.',
      en: 'Go maternity-clothes shopping together. Sounds small, feels huge: her body is changing, clothes don\'t fit anymore — finding new ones together is connection.',
    },
  },
  {
    ssw: 25,
    sizeMm: 350,
    weightG: 660,
    development: {
      de: 'Die Haut wird langsam rosiger, weil sich kleine Kapillaren bilden. Das Baby reagiert auf Berührungen am Bauch — manchmal mit einem kräftigen Tritt. Es kann schon kleine Hand-Augen-Koordination üben.',
      en: 'The skin is gaining a pinker tone as tiny capillaries form. Your baby responds to touch on your belly — sometimes with a hearty kick. It practices small hand-eye coordination.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥦', label: { de: 'so groß wie ein Brokkoli', en: 'as big as a broccoli head' } },
      { category: 'suessigkeit', emoji: '🍬', label: { de: 'schwer wie 6 Tüten Gummibärchen', en: 'as heavy as 6 bags of gummy bears' } },
      { category: 'spielzeug', emoji: '🚂', label: { de: 'wie eine Holz-Lokomotive', en: 'like a wooden toy train' } },
      { category: 'alltag', emoji: '📖', label: { de: 'so lang wie ein dickes Magazin', en: 'as long as a thick magazine' } },
      { category: 'sport', emoji: '🏐', label: { de: 'fast wie ein halber Volleyball', en: 'almost like half a volleyball' } },
      { category: 'beauty', emoji: '🧴', label: { de: 'wie eine mittlere Body-Lotion-Flasche', en: 'like a medium body-lotion bottle' } },
    ],
  },
  {
    ssw: 26,
    sizeMm: 360,
    weightG: 760,
    development: {
      de: 'Die Augen öffnen sich zum ersten Mal! Das Baby kann auf Lichtreize reagieren. Die Lungen produzieren Surfactant — die Substanz, die später das Atmen ermöglicht.',
      en: 'The eyes open for the very first time! Your baby reacts to light through your belly. The lungs start producing surfactant — the substance that will make breathing possible.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍆', label: { de: 'so lang wie eine Aubergine', en: 'as long as an eggplant' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie 7 Tafeln Schokolade', en: 'as heavy as 7 chocolate bars' } },
      { category: 'spielzeug', emoji: '🧸', label: { de: 'wie ein großer Teddy', en: 'like a large teddy bear' } },
      { category: 'tier', emoji: '🐱', label: { de: 'so schwer wie ein junges Kätzchen', en: 'as heavy as a young kitten' } },
      { category: 'sport', emoji: '🎾', label: { de: 'so schwer wie 4 Tennisbälle', en: 'as heavy as 4 tennis balls' } },
      { category: 'beauty', emoji: '🧴', label: { de: 'wie eine 750-ml-Shampoo-Flasche', en: 'like a 750ml shampoo bottle' } },
    ],
    momBody: {
      de: 'Sodbrennen, leichte Atemnot beim Treppensteigen — die Gebärmutter drückt jetzt spürbar gegen Magen und Zwerchfell. Beine werden manchmal schwer, besonders abends.',
      en: 'Heartburn, slight breathlessness on stairs — the uterus is pressing noticeably against your stomach and diaphragm. Legs can feel heavy, especially in the evening.',
    },
    funFact: {
      de: 'Dein Baby öffnet diese Woche zum ersten Mal die Augen. Bis dahin waren sie wie zugeklebt — jetzt blinzelt es ins Dunkel.',
      en: 'Your baby opens its eyes for the first time this week. Until now they were sealed shut — now it blinks into the dark.',
    },
    partnerTip: {
      de: 'Massiere ihre Beine und Füße abends. 10 Minuten reichen. Schwere Beine sind ein realer Schmerz — und nichts entspannt mehr als deine Hände.',
      en: 'Massage her legs and feet in the evening. 10 minutes is enough. Heavy legs are a real pain — and nothing soothes more than your hands.',
    },
  },
  {
    ssw: 27,
    sizeMm: 370,
    weightG: 875,
    development: {
      de: 'Willkommen im dritten Trimester! Das Gehirn macht einen riesigen Entwicklungssprung. Das Baby kann jetzt Schluckauf bekommen — kleine rhythmische Stupser, die du deutlich spürst.',
      en: 'Welcome to the third trimester! The brain takes a massive developmental leap. Your baby can now have hiccups — small rhythmic taps you can clearly feel.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥬', label: { de: 'so groß wie ein Kopfsalat', en: 'as big as a head of lettuce' } },
      { category: 'suessigkeit', emoji: '🍩', label: { de: 'schwer wie 8 Donuts', en: 'as heavy as 8 donuts' } },
      { category: 'alltag', emoji: '🍞', label: { de: 'so schwer wie ein großer Brotlaib', en: 'as heavy as a large loaf of bread' } },
      { category: 'tier', emoji: '🐶', label: { de: 'so schwer wie ein Welpe', en: 'as heavy as a small puppy' } },
      { category: 'sport', emoji: '⚽', label: { de: 'fast so schwer wie ein Mini-Fußball', en: 'almost as heavy as a mini soccer ball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'so schwer wie 3 große Make-up-Beutel', en: 'as heavy as 3 large makeup pouches' } },
    ],
  },
  {
    ssw: 28,
    sizeMm: 380,
    weightG: 1000,
    development: {
      de: 'Das Baby knackt die 1-Kilo-Marke! Es träumt jetzt — REM-Phasen sind im EEG messbar. Die Wimpern sind komplett, das Baby kann blinzeln.',
      en: 'Your baby crosses the 1-kilo mark! It dreams now — REM sleep is detectable on EEG. Eyelashes are complete, and your baby can blink.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥥', label: { de: 'so groß wie ein Blumenkohl', en: 'as big as a cauliflower' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie 10 Tafeln Schokolade', en: 'as heavy as 10 chocolate bars' } },
      { category: 'alltag', emoji: '📦', label: { de: 'wie eine 1kg-Mehltüte', en: 'like a 1kg bag of flour' } },
      { category: 'spielzeug', emoji: '🪀', label: { de: 'so groß wie ein Bowling-Pin', en: 'as big as a bowling pin' } },
      { category: 'tier', emoji: '🐰', label: { de: 'so schwer wie ein kleines Kaninchen', en: 'as heavy as a small rabbit' } },
      { category: 'sport', emoji: '⚽', label: { de: 'schwer wie ein Fußball', en: 'as heavy as a soccer ball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein voller Make-up-Beutel zum Reisen', en: 'like a full travel makeup bag' } },
    ],
    momBody: {
      de: 'Drittes Trimester offiziell. Der Bauch wird schnell schwerer, Atmen tiefer wird schwierig. Erste Übungswehen (Braxton-Hicks) können auftreten — kurz, schmerzlos, normal.',
      en: 'Third trimester officially. The belly grows heavier fast, deep breathing gets harder. First practice contractions (Braxton-Hicks) may appear — short, painless, normal.',
    },
    funFact: {
      de: 'Dein Baby träumt jetzt schon — REM-Schlaf ist messbar. Wovon Föten träumen, weiß keiner. Vielleicht von Geräuschen, vielleicht von Geschmäckern.',
      en: 'Your baby dreams now — REM sleep is measurable. What fetuses dream of, nobody knows. Maybe sounds, maybe tastes.',
    },
    partnerTip: {
      de: 'Sprecht über die Geburt — wirklich. Wo wollt ihr hin? Wer wird dabei sein? Was ist für sie wichtig? Schreib mit. Nicht erst, wenn die Wehen einsetzen.',
      en: 'Talk about the birth — really talk. Where do you want to go? Who will be there? What matters to her? Write it down. Not first when contractions start.',
    },
  },
  {
    ssw: 29,
    sizeMm: 390,
    weightG: 1150,
    development: {
      de: 'Das Baby legt jetzt mächtig an Fettpolstern zu. Die Knochen härten weiter aus und brauchen extra Kalzium — gönn dir Milchprodukte. Die Tritte werden kräftig, manchmal schmerzhaft.',
      en: 'Your baby is rapidly building up fat reserves now. Bones keep hardening and need extra calcium — go for those dairy treats. Kicks are getting stronger, sometimes downright forceful.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍈', label: { de: 'so groß wie eine Honigmelone', en: 'as big as a honeydew melon' } },
      { category: 'suessigkeit', emoji: '🍰', label: { de: 'schwer wie eine kleine Sahnetorte', en: 'as heavy as a small layer cake' } },
      { category: 'alltag', emoji: '👜', label: { de: 'wie eine kleine Handtasche', en: 'like a small handbag' } },
      { category: 'tier', emoji: '🐰', label: { de: 'so schwer wie ein Hauskaninchen', en: 'as heavy as a house rabbit' } },
      { category: 'sport', emoji: '🏐', label: { de: 'fast so schwer wie ein Volleyball', en: 'almost as heavy as a volleyball' } },
      { category: 'beauty', emoji: '🧴', label: { de: 'so schwer wie eine 1-Liter-Bodylotion', en: 'as heavy as a 1L body lotion' } },
    ],
  },
  {
    ssw: 30,
    sizeMm: 400,
    weightG: 1320,
    development: {
      de: 'Die Augen können jetzt fokussieren — auch wenn sie nach der Geburt erst nach und nach scharf sehen. Das Baby produziert eigenes Knochenmark. Es nimmt jede Woche etwa 200g zu.',
      en: 'The eyes can focus now — even though sharp vision will only develop after birth. Your baby is producing its own bone marrow. It gains around 200g a week from now.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥬', label: { de: 'so groß wie ein Wirsing', en: 'as big as a Savoy cabbage' } },
      { category: 'frucht', emoji: '🍌', label: { de: 'so lang wie 5 Bananen', en: 'as long as 5 bananas' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie 13 Tafeln Schokolade', en: 'as heavy as 13 chocolate bars' } },
      { category: 'alltag', emoji: '📕', label: { de: 'wie ein dicker Roman im Hardcover', en: 'like a thick hardcover novel' } },
      { category: 'tier', emoji: '🐰', label: { de: 'so schwer wie ein mittleres Kaninchen', en: 'as heavy as a medium rabbit' } },
      { category: 'sport', emoji: '🏐', label: { de: 'so schwer wie ein Volleyball', en: 'as heavy as a volleyball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie 4 dicke Lippenstift-Sets', en: 'like 4 chunky lipstick sets' } },
    ],
    momBody: {
      de: 'Rückenschmerzen, Schlafprobleme, Sodbrennen. Die Geburt rückt näher — körperlich wird es jetzt spürbar anstrengend. Schlafe auf der linken Seite, ein Kissen zwischen den Knien.',
      en: 'Back pain, sleep issues, heartburn. Birth is approaching — your body is working hard. Sleep on your left side, a pillow between your knees.',
    },
    funFact: {
      de: 'Dein Baby träumt jetzt im REM-Schlaf — sein Gehirn entwickelt sich rasend schnell. Wenn du etwas isst, das du liebst, steigt sein Herzschlag manchmal mit.',
      en: 'Your baby is dreaming in REM sleep — their brain is developing rapidly. When you eat something you love, their heartbeat sometimes rises with yours.',
    },
    partnerTip: {
      de: 'Übernimm jetzt mehr Verantwortung. Schlepp, hol, kümmere dich um Tasche packen, Klinik anmelden, Hebamme kontaktieren. Sie hat jetzt nicht die Energie für Logistik.',
      en: 'Take on more responsibility now. Carry things, fetch things, pack the hospital bag, contact the clinic, reach out to the midwife. She doesn\'t have energy for logistics now.',
    },
  },
  {
    ssw: 31,
    sizeMm: 410,
    weightG: 1500,
    development: {
      de: 'Das Baby kann jetzt alle fünf Sinne nutzen. Es dreht den Kopf von einer Seite zur anderen, übt Trinken und Schlucken. Du fühlst seine Bewegungen jetzt rund um die Uhr.',
      en: 'Your baby uses all five senses now. It turns its head side to side, practices sucking and swallowing. You feel its movements around the clock.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍍', label: { de: 'so groß wie eine Ananas', en: 'as big as a pineapple' } },
      { category: 'suessigkeit', emoji: '🧁', label: { de: 'schwer wie 15 Cupcakes', en: 'as heavy as 15 cupcakes' } },
      { category: 'alltag', emoji: '🛒', label: { de: 'so schwer wie 1,5 Liter Wasser', en: 'as heavy as 1.5 litres of water' } },
      { category: 'tier', emoji: '🐱', label: { de: 'so schwer wie eine kleine Katze', en: 'as heavy as a small cat' } },
      { category: 'sport', emoji: '🏀', label: { de: 'fast wie ein Mini-Basketball', en: 'almost like a mini basketball' } },
      { category: 'beauty', emoji: '🧴', label: { de: 'wie eine große Conditioner-Flasche', en: 'like a large conditioner bottle' } },
    ],
  },
  {
    ssw: 32,
    sizeMm: 420,
    weightG: 1700,
    development: {
      de: 'Die meisten Babys drehen sich jetzt mit dem Kopf nach unten — die Geburtsposition. Die Fingernägel reichen bis zu den Fingerspitzen. Kratzhandschuhe für später schon einplanen!',
      en: 'Most babies now turn head-down — the birth position. Fingernails reach the tips of the fingers. Time to plan for those scratch mittens!',
    },
    comparisons: [
      { category: 'frucht', emoji: '🎃', label: { de: 'so groß wie ein großer Spaghetti-Kürbis', en: 'as big as a large spaghetti squash' } },
      { category: 'suessigkeit', emoji: '🍰', label: { de: 'schwer wie eine ganze Sahnetorte', en: 'as heavy as a whole layer cake' } },
      { category: 'alltag', emoji: '🛍️', label: { de: 'wie eine gut gefüllte Einkaufstasche', en: 'like a well-filled shopping bag' } },
      { category: 'tier', emoji: '🐱', label: { de: 'so schwer wie eine ausgewachsene Katze', en: 'as heavy as an adult cat' } },
      { category: 'sport', emoji: '🏀', label: { de: 'so schwer wie ein Basketball', en: 'as heavy as a basketball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein Profi-Schmink-Koffer', en: 'like a pro makeup case' } },
    ],
    momBody: {
      de: 'Wahre Erschöpfung. Nicht-Schlafen-Können trotz Müdigkeit. Druck auf die Blase — du gehst gefühlt jede halbe Stunde aufs Klo. Das ist alles normal.',
      en: 'Real exhaustion. Can\'t-sleep-despite-tiredness. Pressure on the bladder — you feel like you go every half hour. All normal.',
    },
    funFact: {
      de: 'Dein Baby dreht sich jetzt meistens mit dem Kopf nach unten — und bleibt da. Es weiß instinktiv, welche Position für die Geburt richtig ist.',
      en: 'Your baby usually turns head-down now — and stays there. It instinctively knows the right position for birth.',
    },
    partnerTip: {
      de: 'Wenn sie nachts wach liegt, sei nicht beleidigt, wenn sie ins Wohnzimmer geht. Schlafmangel im 8. Monat ist Realität. Stell ihr ein Glas Wasser und Snack bereit.',
      en: 'If she\'s awake at night, don\'t take it personally when she moves to the couch. Sleeplessness in month 8 is real. Leave a glass of water and a snack out for her.',
    },
  },
  {
    ssw: 33,
    sizeMm: 430,
    weightG: 1900,
    development: {
      de: 'Das Immunsystem fängt an, Antikörper von dir aufzunehmen — dein Schutz wird sein Schutz. Die Schädelknochen sind noch weich und beweglich, damit der Kopf durch den Geburtskanal passt.',
      en: 'The immune system starts taking in antibodies from you — your protection becomes its protection. The skull bones stay soft and flexible to fit through the birth canal.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥬', label: { de: 'so groß wie ein Sellerie', en: 'as big as a celery bunch' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie 19 Tafeln Schokolade', en: 'as heavy as 19 chocolate bars' } },
      { category: 'alltag', emoji: '🍍', label: { de: 'wie eine große Ananas', en: 'like a large pineapple' } },
      { category: 'tier', emoji: '🐱', label: { de: 'so schwer wie eine fülligere Katze', en: 'as heavy as a chunky cat' } },
      { category: 'sport', emoji: '🏐', label: { de: 'so schwer wie 2 Volleybälle', en: 'as heavy as 2 volleyballs' } },
      { category: 'beauty', emoji: '🧴', label: { de: 'wie 2 Liter Bodylotion', en: 'like 2 litres of body lotion' } },
    ],
  },
  {
    ssw: 34,
    sizeMm: 450,
    weightG: 2150,
    development: {
      de: 'Die Lungen sind fast reif. Wenn das Baby jetzt geboren würde, wäre es noch ein Frühchen, hätte aber sehr gute Chancen ohne große Komplikationen. Die Käseschmiere wird langsam dünner.',
      en: 'The lungs are nearly mature. If born now, your baby would still be premature but with very good chances and few complications. The vernix coating starts to thin out.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍈', label: { de: 'so groß wie eine Cantaloupe-Melone', en: 'as big as a cantaloupe melon' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie 21 Tafeln Schokolade', en: 'as heavy as 21 chocolate bars' } },
      { category: 'alltag', emoji: '🎒', label: { de: 'wie ein Schulrucksack mit Büchern', en: 'like a school backpack full of books' } },
      { category: 'tier', emoji: '🐶', label: { de: 'so schwer wie ein kleiner Hund', en: 'as heavy as a small dog' } },
      { category: 'sport', emoji: '🏀', label: { de: 'fast so schwer wie 2 Basketbälle', en: 'almost as heavy as 2 basketballs' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie 7 volle Lippenstift-Cases', en: 'like 7 full lipstick cases' } },
    ],
    momBody: {
      de: 'Wassereinlagerungen, geschwollene Knöchel und Hände. Ringe abnehmen, falls es eng wird. Das Becken bereitet sich vor — du spürst manchmal Stechen tief unten.',
      en: 'Water retention, swollen ankles and hands. Take off rings if they get tight. Your pelvis is prepping — you may feel sharp twinges deep down.',
    },
    funFact: {
      de: 'Dein Baby bekommt jetzt deine Antikörper über die Plazenta — dein Immunsystem schützt sein Immunsystem für Monate nach der Geburt.',
      en: 'Your baby is receiving your antibodies through the placenta — your immune system protects theirs for months after birth.',
    },
    partnerTip: {
      de: 'Bereite die Klinik-Tasche zu Ende vor. Stelle sie an die Tür. Speichere die Klinik-Adresse als Favorit ins Navi. Übe einmal die Strecke nachts — ohne Stress.',
      en: 'Finish packing the hospital bag. Put it by the door. Save the clinic address as a favorite in your GPS. Drive the route once at night — no pressure.',
    },
  },
  {
    ssw: 35,
    sizeMm: 460,
    weightG: 2400,
    development: {
      de: 'Das Baby ist jetzt eng in der Gebärmutter — du spürst eher Drehungen als Tritte. Das Gehirn wächst weiter rasant. Die Nieren sind voll funktionsfähig.',
      en: 'It\'s getting cozy in there — you feel rolls and stretches more than kicks. The brain keeps growing rapidly. The kidneys are fully functional.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍈', label: { de: 'so groß wie eine reife Honigmelone', en: 'as big as a ripe honeydew' } },
      { category: 'suessigkeit', emoji: '🍰', label: { de: 'schwer wie 2 Sahnetorten', en: 'as heavy as 2 layer cakes' } },
      { category: 'alltag', emoji: '🥛', label: { de: 'wie 2,4 Liter Milch', en: 'like 2.4 litres of milk' } },
      { category: 'tier', emoji: '🐶', label: { de: 'so schwer wie ein Mops', en: 'as heavy as a pug' } },
      { category: 'sport', emoji: '🥎', label: { de: 'so schwer wie 12 Softbälle', en: 'as heavy as 12 softballs' } },
      { category: 'beauty', emoji: '🧴', label: { de: 'wie 2 große Shampoo-Flaschen', en: 'like 2 large shampoo bottles' } },
    ],
  },
  {
    ssw: 36,
    sizeMm: 470,
    weightG: 2620,
    development: {
      de: 'Das Baby gilt jetzt als „spät-Frühchen" — die meisten Organe sind voll bereit. Es senkt sich bei vielen schon in das Becken ab. Der Magen-Darm-Trakt sammelt das erste Kind­spech (Mekonium).',
      en: 'Your baby is now a "late preterm" — most organs are fully ready. For many, baby starts dropping into the pelvis. The intestines fill with the first stool (meconium).',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥬', label: { de: 'so groß wie ein Romaine-Salat', en: 'as big as a head of romaine lettuce' } },
      { category: 'suessigkeit', emoji: '🍩', label: { de: 'schwer wie 22 Donuts', en: 'as heavy as 22 donuts' } },
      { category: 'alltag', emoji: '👜', label: { de: 'wie eine schwere Handtasche', en: 'like a heavy handbag' } },
      { category: 'tier', emoji: '🐶', label: { de: 'so schwer wie ein Beagle-Welpe', en: 'as heavy as a beagle puppy' } },
      { category: 'sport', emoji: '🏐', label: { de: 'wie ein dicker Volleyball', en: 'like a chunky volleyball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie 8 Lippenstifte zusammen', en: 'like 8 lipsticks combined' } },
    ],
    momBody: {
      de: 'Das Baby senkt sich oft jetzt — Atmen wird leichter, Wasserlassen häufiger. Erste Senkwehen kommen und gehen. Der Bauch ist riesig, jeder Schritt fühlt sich bedeutsam an.',
      en: 'Baby often drops now — breathing eases, peeing intensifies. First lightning contractions come and go. The belly is huge, each step feels meaningful.',
    },
    funFact: {
      de: 'Dein Baby hat jetzt Greifreflexe, die so kräftig sind, dass es sein eigenes Körpergewicht halten könnte — wenn man es probieren würde.',
      en: 'Your baby has a grip reflex strong enough to hold its own body weight — if you tested it.',
    },
    partnerTip: {
      de: 'Kläre die Arbeit. Sprich mit dem Chef über Elternzeit oder Vaterschaftsurlaub. Schreibe dir den Klinik-Notruf-Plan auf — wer ruft wen an, wer übernimmt was.',
      en: 'Sort out work. Talk to your boss about paternity leave or parental leave. Write a hospital-emergency plan — who calls whom, who covers what.',
    },
  },
  {
    ssw: 37,
    sizeMm: 480,
    weightG: 2850,
    development: {
      de: 'Das Baby gilt jetzt als „früh termingerecht" — eine Geburt jetzt wäre kein Frühchen mehr. Es übt fleißig das Atmen, Saugen und Greifen. Du kannst jeden Moment loslegen.',
      en: 'Your baby is now considered "early term" — a birth from now on isn\'t preterm anymore. It practices breathing, sucking, and grasping like crazy. Things can start any moment.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥬', label: { de: 'so groß wie ein Bund Mangold', en: 'as big as a bunch of Swiss chard' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie 28 Tafeln Schokolade', en: 'as heavy as 28 chocolate bars' } },
      { category: 'alltag', emoji: '🍉', label: { de: 'wie eine kleine Wassermelone', en: 'like a small watermelon' } },
      { category: 'tier', emoji: '🐱', label: { de: 'so schwer wie eine sehr gemütliche Katze', en: 'as heavy as a very chunky cat' } },
      { category: 'sport', emoji: '🎳', label: { de: 'fast so schwer wie eine Kinder-Bowlingkugel', en: 'almost as heavy as a kid\'s bowling ball' } },
      { category: 'beauty', emoji: '🧴', label: { de: 'wie ein Family-Size-Conditioner', en: 'like a family-size conditioner' } },
    ],
  },
  {
    ssw: 38,
    sizeMm: 490,
    weightG: 3080,
    development: {
      de: 'Das Baby knackt die 3-Kilo-Marke! Das Gehirn legt nochmal richtig zu. Lanugo (Flaumhaar) verschwindet weitgehend. Die Greifreflexe sind erstaunlich stark.',
      en: 'Your baby crosses the 3-kilo mark! The brain takes another big leap. The lanugo fuzz is mostly gone. The grasp reflex is surprisingly strong.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🥬', label: { de: 'so lang wie eine Lauchstange', en: 'as long as a leek' } },
      { category: 'suessigkeit', emoji: '🍰', label: { de: 'schwer wie 2 große Geburtstagskuchen', en: 'as heavy as 2 large birthday cakes' } },
      { category: 'alltag', emoji: '🥛', label: { de: 'wie 3 Liter Milch', en: 'like 3 litres of milk' } },
      { category: 'tier', emoji: '🐶', label: { de: 'so schwer wie ein Dackel', en: 'as heavy as a dachshund' } },
      { category: 'sport', emoji: '🎳', label: { de: 'wie eine Damen-Bowlingkugel', en: 'like a women\'s bowling ball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein voller Visagisten-Trolley', en: 'like a full makeup-artist trolley' } },
    ],
    momBody: {
      de: 'Bereit. Müde. Aufgeregt. Alles auf einmal. Der Bauch fühlt sich nach maximaler Dehnung an. Manche bekommen plötzlich einen „Nestbau-Schub" — putzen, sortieren, packen.',
      en: 'Ready. Tired. Excited. All at once. The belly feels stretched to the limit. Some suddenly get a "nesting urge" — cleaning, sorting, packing.',
    },
    funFact: {
      de: 'Dein Baby hat jetzt schon einen festen Greifreflex — sobald es geboren ist, klammert es deinen Finger so kräftig fest, dass du es hochheben könntest.',
      en: 'Your baby has a strong grip reflex — once born, it can grasp your finger so firmly you could nearly lift them up by it.',
    },
    partnerTip: {
      de: 'Frage konkret: „Was kann ich heute für dich tun?" Nicht „Wie geht\'s?" — das ist zu vage, wenn alles gleichzeitig schwer ist. Eine konkrete Aufgabe entlastet sofort.',
      en: 'Ask concretely: "What can I do for you today?" Not "How are you?" — too vague when everything feels heavy at once. A specific task lightens the load instantly.',
    },
  },
  {
    ssw: 39,
    sizeMm: 500,
    weightG: 3290,
    development: {
      de: 'Termin-gerecht! Alle Organe sind bereit. Die Fettpolster sorgen jetzt für weiche Pausbacken. Dein Baby kann jeden Moment seine Reise nach draußen beginnen.',
      en: 'Full term! All organs are ready. Fat padding gives baby those soft chubby cheeks. Your baby could start the journey out at any moment.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍉', label: { de: 'so groß wie eine Mini-Wassermelone', en: 'as big as a mini watermelon' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie 33 Tafeln Schokolade', en: 'as heavy as 33 chocolate bars' } },
      { category: 'alltag', emoji: '🛒', label: { de: 'wie ein gefüllter Wocheneinkaufs-Korb', en: 'like a full weekly grocery basket' } },
      { category: 'tier', emoji: '🐶', label: { de: 'so schwer wie ein französischer Bulldoggen-Welpe', en: 'as heavy as a French bulldog puppy' } },
      { category: 'sport', emoji: '🎳', label: { de: 'wie eine mittlere Bowlingkugel', en: 'like a medium bowling ball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie ein kompletter Profi-Schmink-Koffer', en: 'like a complete pro makeup case' } },
    ],
  },
  {
    ssw: 40,
    sizeMm: 510,
    weightG: 3460,
    development: {
      de: 'Errechneter Geburtstermin! Nur etwa 5 % der Babys kommen genau heute. Dein Baby ist vollständig entwickelt — bereit, deine Welt für immer zu verändern.',
      en: 'Estimated due date! Only about 5% of babies actually arrive on this exact day. Your baby is fully developed — ready to change your world forever.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🎃', label: { de: 'so groß wie ein kleiner Kürbis', en: 'as big as a small pumpkin' } },
      { category: 'suessigkeit', emoji: '🍰', label: { de: 'schwer wie ein Familien-Sahnetorte', en: 'as heavy as a family-sized layer cake' } },
      { category: 'alltag', emoji: '🛒', label: { de: 'wie ein kleiner Sack Kartoffeln', en: 'like a small sack of potatoes' } },
      { category: 'tier', emoji: '🐱', label: { de: 'so schwer wie ein Maine-Coon-Kater', en: 'as heavy as a Maine Coon cat' } },
      { category: 'sport', emoji: '🎳', label: { de: 'wie eine Herren-Bowlingkugel', en: 'like a men\'s bowling ball' } },
      { category: 'beauty', emoji: '🧴', label: { de: 'wie 4 große Shampoo-Flaschen', en: 'like 4 big shampoo bottles' } },
    ],
    momBody: {
      de: 'Warten. Jeden Tag. Jede Wehe könnte „die" sein — oder noch nicht. Ungeduld, Erschöpfung, Vorfreude im Wechsel. Dein Körper weiß, was er tut. Vertrau ihm.',
      en: 'Waiting. Every day. Every contraction could be "it" — or not yet. Impatience, exhaustion, excitement on rotation. Your body knows what it\'s doing. Trust it.',
    },
    funFact: {
      de: 'Nur 5 Prozent aller Babys kommen genau am errechneten Termin. Die meisten lassen sich ein paar Tage Zeit — oder kommen schon vorher.',
      en: 'Only 5% of all babies arrive exactly on the due date. Most take a few extra days — or come a little earlier.',
    },
    partnerTip: {
      de: 'Sei jetzt zuhause. Erreichbar. Tank vor. Schlaf, wenn du kannst — die nächsten Wochen werden intensiv. Und sage ihr jeden Tag, wie stark sie ist.',
      en: 'Stay home now. Be reachable. Fill up the tank. Sleep when you can — the coming weeks will be intense. And tell her every day how strong she is.',
    },
  },
  {
    ssw: 41,
    sizeMm: 515,
    weightG: 3600,
    development: {
      de: 'Eine Woche über Termin — kommt häufig vor und ist meistens kein Grund zur Sorge. Dein Baby legt vielleicht noch ein paar Gramm zu. Hebamme oder Ärztin checken jetzt regelmäßig.',
      en: 'One week past your due date — common and usually no reason to worry. Your baby may put on a few more grams. Your midwife or OB will start more frequent check-ins.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🍉', label: { de: 'so groß wie eine große Wassermelone', en: 'as big as a large watermelon' } },
      { category: 'suessigkeit', emoji: '🍫', label: { de: 'schwer wie 36 Tafeln Schokolade', en: 'as heavy as 36 chocolate bars' } },
      { category: 'alltag', emoji: '🛒', label: { de: 'wie ein voller Einkaufskorb', en: 'like a full grocery basket' } },
      { category: 'tier', emoji: '🐶', label: { de: 'so schwer wie ein erwachsener Dackel', en: 'as heavy as an adult dachshund' } },
      { category: 'sport', emoji: '🎳', label: { de: 'wie eine schwere Bowlingkugel', en: 'like a heavy bowling ball' } },
      { category: 'beauty', emoji: '💄', label: { de: 'wie zwei volle Visagisten-Trolleys', en: 'like two full makeup-artist trolleys' } },
    ],
  },
  {
    ssw: 42,
    sizeMm: 520,
    weightG: 3700,
    development: {
      de: 'Übertragen — die meisten Babys kommen jetzt spätestens. Falls nicht, wird oft eine Einleitung besprochen. Dein Baby ist groß, satt und bereit. Du auch.',
      en: 'Post-term — almost every baby arrives by now. If not, an induction is usually discussed. Your baby is big, content, and ready. So are you.',
    },
    comparisons: [
      { category: 'frucht', emoji: '🎃', label: { de: 'so groß wie ein großer Kürbis', en: 'as big as a large pumpkin' } },
      { category: 'suessigkeit', emoji: '🍰', label: { de: 'schwer wie zwei Familien-Torten', en: 'as heavy as two family layer cakes' } },
      { category: 'alltag', emoji: '🛒', label: { de: 'wie ein mittlerer Kartoffelsack', en: 'like a medium sack of potatoes' } },
      { category: 'tier', emoji: '🐶', label: { de: 'so schwer wie ein Cocker-Spaniel-Welpe', en: 'as heavy as a cocker spaniel puppy' } },
      { category: 'sport', emoji: '🎳', label: { de: 'wie eine sehr schwere Bowlingkugel', en: 'like a very heavy bowling ball' } },
      { category: 'beauty', emoji: '🧴', label: { de: 'wie 5 große Shampoo-Flaschen', en: 'like 5 large shampoo bottles' } },
    ],
  },
]

/**
 * Returns SSW info for the given week. Falls back to the nearest week
 * within the supported range (4–42) if the user's SSW is out of range.
 */
export function getSswInfo(ssw: number): SswInfo | null {
  const direct = SSW_DATA.find((s) => s.ssw === ssw)
  if (direct) return direct
  if (SSW_DATA.length === 0) return null

  const min = SSW_DATA[0].ssw
  const max = SSW_DATA[SSW_DATA.length - 1].ssw
  const clamped = Math.max(min, Math.min(max, ssw))
  return SSW_DATA.find((s) => s.ssw === clamped) ?? null
}

/**
 * Formats length nicely: under 100mm shows mm, otherwise cm with one decimal.
 */
export function formatSize(sizeMm: number, locale: 'de' | 'en'): string {
  if (sizeMm < 10) {
    const formatted = sizeMm.toLocaleString(locale === 'de' ? 'de-DE' : 'en-GB', {
      maximumFractionDigits: 1,
    })
    return `${formatted} mm`
  }
  if (sizeMm < 100) {
    const cm = sizeMm / 10
    const formatted = cm.toLocaleString(locale === 'de' ? 'de-DE' : 'en-GB', {
      maximumFractionDigits: 1,
    })
    return `${formatted} cm`
  }
  const cm = sizeMm / 10
  const formatted = cm.toLocaleString(locale === 'de' ? 'de-DE' : 'en-GB', {
    maximumFractionDigits: 0,
  })
  return `${formatted} cm`
}

/**
 * Formats weight nicely: under 1000g shows g, otherwise kg with one decimal.
 */
export function formatWeight(weightG: number, locale: 'de' | 'en'): string {
  if (weightG < 1000) {
    return `${weightG} g`
  }
  const kg = weightG / 1000
  const formatted = kg.toLocaleString(locale === 'de' ? 'de-DE' : 'en-GB', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
  return `${formatted} kg`
}
