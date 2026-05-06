export type PackItem = {
  id: string
  label: string
  tip?: string
}

export type PackCategory = {
  id: string
  emoji: string
  title: string
  items: PackItem[]
}

export const PACK_CATEGORIES: PackCategory[] = [
  {
    id: 'mutter',
    emoji: '👩',
    title: 'Für die Mama',
    items: [
      { id: 'pk-m-1', label: 'Mutterpass', tip: 'Das wichtigste Dokument — nie vergessen!' },
      { id: 'pk-m-2', label: 'Krankenversicherungskarte' },
      { id: 'pk-m-3', label: 'Personalausweis / Reisepass' },
      { id: 'pk-m-4', label: 'Geburtsplan (ausgedruckt)', tip: 'Drucke 2-3 Kopien für Hebamme, Ärztin und dich' },
      { id: 'pk-m-5', label: 'Bequeme Kleidung für die Geburt' },
      { id: 'pk-m-6', label: 'Warme Socken', tip: 'Kalte Füße unter der Geburt ist sehr verbreitet' },
      { id: 'pk-m-7', label: 'Stillbustier / Still-BH (2x)' },
      { id: 'pk-m-8', label: 'Bequeme Nachthemden (2-3x)' },
      { id: 'pk-m-9', label: 'Einweg-Unterwäsche oder alte Unterwäsche' },
      { id: 'pk-m-10', label: 'Bademantel und Hausschuhe' },
      { id: 'pk-m-11', label: 'Wochenbetteinlagen / starke Binden' },
      { id: 'pk-m-12', label: 'Brustpads / Stilleinlagen' },
      { id: 'pk-m-13', label: 'Toilettenartikel (Shampoo, Duschgel, Zahnbürste)' },
      { id: 'pk-m-14', label: 'Lippenpflege', tip: 'Unter der Geburt atmet man viel durch den Mund — Lippen werden schnell trocken' },
      { id: 'pk-m-15', label: 'Haargummi / Haarband' },
      { id: 'pk-m-16', label: 'Handy-Ladekabel' },
      { id: 'pk-m-17', label: 'Snacks für nach der Geburt', tip: 'Du wirst riesenhungrig sein! Nüsse, Kekse, Riegel' },
      { id: 'pk-m-18', label: 'Wasserflaschen' },
      { id: 'pk-m-19', label: 'Kopfhörer und Entspannungsmusik' },
      { id: 'pk-m-20', label: 'Kamera oder geladenes Handy für Fotos' },
    ],
  },
  {
    id: 'baby',
    emoji: '👶',
    title: 'Für das Baby',
    items: [
      { id: 'pk-b-1', label: 'Body (3-5x), Größe 50-56' },
      { id: 'pk-b-2', label: 'Strampler / Schlafanzüge (3-5x)' },
      { id: 'pk-b-3', label: 'Mützchen für den Kopf' },
      { id: 'pk-b-4', label: 'Socken (3-4 Paar)' },
      { id: 'pk-b-5', label: 'Decke / Pucktuch' },
      { id: 'pk-b-6', label: 'Autositz (muss vorher montiert sein!)', tip: 'Ohne gültigen Autositz darfst du mit dem Baby nicht nach Hause' },
      { id: 'pk-b-7', label: 'Windeln Gr. 1 (Neugeborene), ca. 10 Stück' },
      { id: 'pk-b-8', label: 'Feuchttücher (parfümfrei)' },
      { id: 'pk-b-9', label: 'Wundschutzcreme (z.B. Bepanthen)' },
      { id: 'pk-b-10', label: 'Schnuller (falls gewünscht)' },
    ],
  },
  {
    id: 'partner',
    emoji: '🧑',
    title: 'Für den Partner',
    items: [
      { id: 'pk-p-1', label: 'Kleidung für 1-2 Nächte' },
      { id: 'pk-p-2', label: 'Zahnbürste & Hygieneartikel' },
      { id: 'pk-p-3', label: 'Snacks und Getränke' },
      { id: 'pk-p-4', label: 'Kissen (Krankenhäuser haben oft harte Liegen)' },
      { id: 'pk-p-5', label: 'Buch oder Beschäftigung für Wartezeiten' },
      { id: 'pk-p-6', label: 'Ladekabel' },
      { id: 'pk-p-7', label: 'Kamera' },
    ],
  },
  {
    id: 'dokumente',
    emoji: '📄',
    title: 'Dokumente',
    items: [
      { id: 'pk-d-1', label: 'Mutterpass' },
      { id: 'pk-d-2', label: 'Krankenversicherungskarte' },
      { id: 'pk-d-3', label: 'Personalausweis' },
      { id: 'pk-d-4', label: 'Geburtsplan' },
      { id: 'pk-d-5', label: 'Einweisung vom Arzt / Hebamme (falls vorhanden)' },
      { id: 'pk-d-6', label: 'Krankenhausanmeldung (falls bereits vorab)', tip: 'Viele Krankenhäuser bieten Voranmeldung ab SSW 30 an' },
      { id: 'pk-d-7', label: 'Notfallkontakte aufgeschrieben' },
    ],
  },
]
