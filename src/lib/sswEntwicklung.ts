import type { LocalizedString } from '@/lib/i18n/localized'

export type SswComparisonCategory =
  | 'frucht'
  | 'suessigkeit'
  | 'spielzeug'
  | 'tier'
  | 'alltag'

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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
