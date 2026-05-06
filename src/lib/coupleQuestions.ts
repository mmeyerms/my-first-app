export type CoupleQuestion = {
  id: string
  question: string
  category: 'traum' | 'erinnerung' | 'zukunft' | 'spass' | 'gefuehl'
  emoji: string
}

export const COUPLE_QUESTIONS: CoupleQuestion[] = [
  // Träume & Wünsche
  { id: 'cq01', category: 'traum', emoji: '✨', question: 'Was wünschst du dir für das erste Jahr mit Baby am meisten?' },
  { id: 'cq02', category: 'traum', emoji: '🌙', question: 'Welche Tradition aus deiner Kindheit möchtest du weitergeben?' },
  { id: 'cq03', category: 'traum', emoji: '🗺️', question: 'Wohin wollt ihr mit dem Kind als erstes verreisen?' },
  { id: 'cq04', category: 'traum', emoji: '🎨', question: 'Was hofft ihr, dass euer Kind mal leidenschaftlich mag?' },
  { id: 'cq05', category: 'traum', emoji: '🌱', question: 'Welchen Wert wollt ihr eurem Kind als erstes beibringen?' },
  { id: 'cq06', category: 'traum', emoji: '🏡', question: 'Wie stellt ihr euch euer Leben in 5 Jahren vor?' },
  { id: 'cq07', category: 'traum', emoji: '💫', question: 'Was soll euer Kind einmal über seine Kindheit sagen?' },

  // Erinnerungen
  { id: 'cq08', category: 'erinnerung', emoji: '📸', question: 'Was war der schönste Moment dieser Schwangerschaft bisher?' },
  { id: 'cq09', category: 'erinnerung', emoji: '💕', question: 'Wann hast du zum ersten Mal gedacht: "Ja, mit dem/der will ich Eltern sein"?' },
  { id: 'cq10', category: 'erinnerung', emoji: '🌅', question: 'Was war euer schönstes gemeinsames Erlebnis vor der Schwangerschaft?' },
  { id: 'cq11', category: 'erinnerung', emoji: '🎉', question: 'Wie habt ihr die Schwangerschaft zum ersten Mal gefeiert?' },
  { id: 'cq12', category: 'erinnerung', emoji: '🤝', question: 'Was war ein Moment, in dem ihr als Team besonders stark wart?' },
  { id: 'cq13', category: 'erinnerung', emoji: '😂', question: 'Was ist in dieser Schwangerschaft so passiert, dass ihr heute noch lachen müsst?' },

  // Zukunft & Eltern
  { id: 'cq14', category: 'zukunft', emoji: '👶', question: 'Welche Elternteil-Rolle macht dir mehr Sorgen — und welche freut dich am meisten?' },
  { id: 'cq15', category: 'zukunft', emoji: '🌙', question: 'Wie wollt ihr die Nächte aufteilen?' },
  { id: 'cq16', category: 'zukunft', emoji: '⚖️', question: 'Was ist euer Plan, wenn ihr in der Erziehung unterschiedlicher Meinung seid?' },
  { id: 'cq17', category: 'zukunft', emoji: '🧑‍🍳', question: 'Wer kocht in den ersten Wochen nach der Geburt?' },
  { id: 'cq18', category: 'zukunft', emoji: '💼', question: 'Wie stellt ihr euch die Arbeit und Elternzeit vor — langfristig?' },
  { id: 'cq19', category: 'zukunft', emoji: '🏃', question: 'Was wollt ihr als Paar beibehalten, wenn das Baby da ist?' },
  { id: 'cq20', category: 'zukunft', emoji: '📚', question: 'Welche Bücher oder Ressourcen habt ihr euch für Eltern-Themen vorgenommen?' },

  // Spaß & Leichtigkeit
  { id: 'cq21', category: 'spass', emoji: '😂', question: 'Wer von euch wird nachts öfter aufstehen — wirklich, ehrlich?' },
  { id: 'cq22', category: 'spass', emoji: '🎵', question: 'Welches Lied werdet ihr dem Baby garantiert vorsingen? (Bitte aufführen.)' },
  { id: 'cq23', category: 'spass', emoji: '🍕', question: 'Was ist das erste Essen, das ihr nach der Geburt bestellen werdet?' },
  { id: 'cq24', category: 'spass', emoji: '🧠', question: 'Welche seltsame Angewohnheit von dir wird das Baby wahrscheinlich erben?' },
  { id: 'cq25', category: 'spass', emoji: '🎬', question: 'Welchen Film wollt ihr eurem Kind als erstes zeigen?' },
  { id: 'cq26', category: 'spass', emoji: '🏆', question: 'Wer von euch ist der strengere Elternteil — schon jetzt eine Prognose!' },
  { id: 'cq27', category: 'spass', emoji: '🤔', question: 'Was ist die erste "Warum?"-Frage deines Kindes, auf die du noch keine Antwort hast?' },
  { id: 'cq28', category: 'spass', emoji: '🎠', question: 'Welcher Freizeitpark oder welches Kindheitserlebnis willst du unbedingt mit dem Kind erleben?' },

  // Gefühle & Verbindung
  { id: 'cq29', category: 'gefuehl', emoji: '💛', question: 'Was bewunderst du gerade am meisten an deinem Partner?' },
  { id: 'cq30', category: 'gefuehl', emoji: '🌊', question: 'Wie geht es dir gerade wirklich — in einem ehrlichen Satz?' },
  { id: 'cq31', category: 'gefuehl', emoji: '🌿', question: 'Was brauchst du in den nächsten Wochen am meisten von mir?' },
  { id: 'cq32', category: 'gefuehl', emoji: '💬', question: 'Gibt es etwas, das du dir für diese Schwangerschaft gewünscht hättest, das wir noch nicht getan haben?' },
  { id: 'cq33', category: 'gefuehl', emoji: '🫂', question: 'Wann hast du dich zuletzt wirklich gut um dich selbst gekümmert?' },
  { id: 'cq34', category: 'gefuehl', emoji: '🌸', question: 'Was macht dich in dieser Zeit am meisten glücklich?' },
  { id: 'cq35', category: 'gefuehl', emoji: '🙏', question: 'Wofür bist du heute dankbar?' },
  { id: 'cq36', category: 'gefuehl', emoji: '💪', question: 'In welchem Moment dieser Schwangerschaft hast du dich besonders stark gefühlt?' },
  { id: 'cq37', category: 'gefuehl', emoji: '🔮', question: 'Welche Sorge aus dem ersten Trimester hat sich als unbegründet herausgestellt?' },
  { id: 'cq38', category: 'gefuehl', emoji: '🌟', question: 'Was bist du überrascht, wie gut du es machst?' },
]

export function getCoupleQuestionForDay(date: Date = new Date()): CoupleQuestion {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return COUPLE_QUESTIONS[dayOfYear % COUPLE_QUESTIONS.length]
}
