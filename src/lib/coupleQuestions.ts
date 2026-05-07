import type { Locale } from './i18n/types'
import type { LocalizedString } from './i18n/localized'
import { localized } from './i18n/localized'

export type CoupleQuestion = {
  id: string
  question: LocalizedString
  category: 'traum' | 'erinnerung' | 'zukunft' | 'spass' | 'gefuehl'
  emoji: string
}

export const COUPLE_QUESTIONS: CoupleQuestion[] = [
  // Träume & Wünsche
  {
    id: 'cq01',
    category: 'traum',
    emoji: '✨',
    question: {
      de: 'Was wünschst du dir für das erste Jahr mit Baby am meisten?',
      en: 'What do you most wish for in the first year with the baby?',
    },
  },
  {
    id: 'cq02',
    category: 'traum',
    emoji: '🌙',
    question: {
      de: 'Welche Tradition aus deiner Kindheit möchtest du weitergeben?',
      en: 'Which tradition from your own childhood do you want to pass on?',
    },
  },
  {
    id: 'cq03',
    category: 'traum',
    emoji: '🗺️',
    question: {
      de: 'Wohin wollt ihr mit dem Kind als erstes verreisen?',
      en: 'Where do you want to travel first with your child?',
    },
  },
  {
    id: 'cq04',
    category: 'traum',
    emoji: '🎨',
    question: {
      de: 'Was hofft ihr, dass euer Kind mal leidenschaftlich mag?',
      en: 'What do you hope your child will be passionate about one day?',
    },
  },
  {
    id: 'cq05',
    category: 'traum',
    emoji: '🌱',
    question: {
      de: 'Welchen Wert wollt ihr eurem Kind als erstes beibringen?',
      en: 'What is the first value you want to teach your child?',
    },
  },
  {
    id: 'cq06',
    category: 'traum',
    emoji: '🏡',
    question: {
      de: 'Wie stellt ihr euch euer Leben in 5 Jahren vor?',
      en: 'How do you imagine your life in five years?',
    },
  },
  {
    id: 'cq07',
    category: 'traum',
    emoji: '💫',
    question: {
      de: 'Was soll euer Kind einmal über seine Kindheit sagen?',
      en: 'What do you want your child to say about their childhood one day?',
    },
  },

  // Erinnerungen
  {
    id: 'cq08',
    category: 'erinnerung',
    emoji: '📸',
    question: {
      de: 'Was war der schönste Moment dieser Schwangerschaft bisher?',
      en: 'What has been the most beautiful moment of this pregnancy so far?',
    },
  },
  {
    id: 'cq09',
    category: 'erinnerung',
    emoji: '💕',
    question: {
      de: 'Wann hast du zum ersten Mal gedacht: "Ja, mit dem/der will ich Eltern sein"?',
      en: 'When did you first think: "Yes, this is the person I want to be a parent with"?',
    },
  },
  {
    id: 'cq10',
    category: 'erinnerung',
    emoji: '🌅',
    question: {
      de: 'Was war euer schönstes gemeinsames Erlebnis vor der Schwangerschaft?',
      en: 'What was your favourite shared experience before the pregnancy?',
    },
  },
  {
    id: 'cq11',
    category: 'erinnerung',
    emoji: '🎉',
    question: {
      de: 'Wie habt ihr die Schwangerschaft zum ersten Mal gefeiert?',
      en: 'How did you celebrate the pregnancy for the first time?',
    },
  },
  {
    id: 'cq12',
    category: 'erinnerung',
    emoji: '🤝',
    question: {
      de: 'Was war ein Moment, in dem ihr als Team besonders stark wart?',
      en: 'When was a moment you were especially strong as a team?',
    },
  },
  {
    id: 'cq13',
    category: 'erinnerung',
    emoji: '😂',
    question: {
      de: 'Was ist in dieser Schwangerschaft so passiert, dass ihr heute noch lachen müsst?',
      en: 'What happened during this pregnancy that still makes you laugh?',
    },
  },

  // Zukunft & Eltern
  {
    id: 'cq14',
    category: 'zukunft',
    emoji: '👶',
    question: {
      de: 'Welche Elternteil-Rolle macht dir mehr Sorgen — und welche freut dich am meisten?',
      en: 'Which part of being a parent worries you most — and which excites you most?',
    },
  },
  {
    id: 'cq15',
    category: 'zukunft',
    emoji: '🌙',
    question: {
      de: 'Wie wollt ihr die Nächte aufteilen?',
      en: 'How do you want to divide the nights between you?',
    },
  },
  {
    id: 'cq16',
    category: 'zukunft',
    emoji: '⚖️',
    question: {
      de: 'Was ist euer Plan, wenn ihr in der Erziehung unterschiedlicher Meinung seid?',
      en: 'What is your plan when you disagree about parenting?',
    },
  },
  {
    id: 'cq17',
    category: 'zukunft',
    emoji: '🧑‍🍳',
    question: {
      de: 'Wer kocht in den ersten Wochen nach der Geburt?',
      en: 'Who is going to cook in the first weeks after the birth?',
    },
  },
  {
    id: 'cq18',
    category: 'zukunft',
    emoji: '💼',
    question: {
      de: 'Wie stellt ihr euch die Arbeit und Elternzeit vor — langfristig?',
      en: 'How do you picture work and parental leave long-term?',
    },
  },
  {
    id: 'cq19',
    category: 'zukunft',
    emoji: '🏃',
    question: {
      de: 'Was wollt ihr als Paar beibehalten, wenn das Baby da ist?',
      en: 'What do you want to keep as a couple once the baby arrives?',
    },
  },
  {
    id: 'cq20',
    category: 'zukunft',
    emoji: '📚',
    question: {
      de: 'Welche Bücher oder Ressourcen habt ihr euch für Eltern-Themen vorgenommen?',
      en: 'Which books or resources have you lined up on parenting topics?',
    },
  },

  // Spaß & Leichtigkeit
  {
    id: 'cq21',
    category: 'spass',
    emoji: '😂',
    question: {
      de: 'Wer von euch wird nachts öfter aufstehen — wirklich, ehrlich?',
      en: 'Which of you will get up more often at night — really, honestly?',
    },
  },
  {
    id: 'cq22',
    category: 'spass',
    emoji: '🎵',
    question: {
      de: 'Welches Lied werdet ihr dem Baby garantiert vorsingen? (Bitte aufführen.)',
      en: 'Which song are you guaranteed to sing to the baby? (Please demonstrate.)',
    },
  },
  {
    id: 'cq23',
    category: 'spass',
    emoji: '🍕',
    question: {
      de: 'Was ist das erste Essen, das ihr nach der Geburt bestellen werdet?',
      en: 'What is the first meal you will order after the birth?',
    },
  },
  {
    id: 'cq24',
    category: 'spass',
    emoji: '🧠',
    question: {
      de: 'Welche seltsame Angewohnheit von dir wird das Baby wahrscheinlich erben?',
      en: 'Which weird habit of yours will the baby probably inherit?',
    },
  },
  {
    id: 'cq25',
    category: 'spass',
    emoji: '🎬',
    question: {
      de: 'Welchen Film wollt ihr eurem Kind als erstes zeigen?',
      en: 'Which film do you want to show your child first?',
    },
  },
  {
    id: 'cq26',
    category: 'spass',
    emoji: '🏆',
    question: {
      de: 'Wer von euch ist der strengere Elternteil — schon jetzt eine Prognose!',
      en: 'Which of you is the stricter parent — make your prediction now!',
    },
  },
  {
    id: 'cq27',
    category: 'spass',
    emoji: '🤔',
    question: {
      de: 'Was ist die erste "Warum?"-Frage deines Kindes, auf die du noch keine Antwort hast?',
      en: 'What is the first "why?" question from your child you do not have an answer to?',
    },
  },
  {
    id: 'cq28',
    category: 'spass',
    emoji: '🎠',
    question: {
      de: 'Welcher Freizeitpark oder welches Kindheitserlebnis willst du unbedingt mit dem Kind erleben?',
      en: 'Which theme park or childhood experience do you absolutely want to share with your child?',
    },
  },

  // Gefühle & Verbindung
  {
    id: 'cq29',
    category: 'gefuehl',
    emoji: '💛',
    question: {
      de: 'Was bewunderst du gerade am meisten an deinem Partner?',
      en: 'What do you admire most about your partner right now?',
    },
  },
  {
    id: 'cq30',
    category: 'gefuehl',
    emoji: '🌊',
    question: {
      de: 'Wie geht es dir gerade wirklich — in einem ehrlichen Satz?',
      en: 'How are you really doing right now — in one honest sentence?',
    },
  },
  {
    id: 'cq31',
    category: 'gefuehl',
    emoji: '🌿',
    question: {
      de: 'Was brauchst du in den nächsten Wochen am meisten von mir?',
      en: 'What do you need most from me in the coming weeks?',
    },
  },
  {
    id: 'cq32',
    category: 'gefuehl',
    emoji: '💬',
    question: {
      de: 'Gibt es etwas, das du dir für diese Schwangerschaft gewünscht hättest, das wir noch nicht getan haben?',
      en: 'Is there something you wish for this pregnancy that we have not done yet?',
    },
  },
  {
    id: 'cq33',
    category: 'gefuehl',
    emoji: '🫂',
    question: {
      de: 'Wann hast du dich zuletzt wirklich gut um dich selbst gekümmert?',
      en: 'When did you last truly take good care of yourself?',
    },
  },
  {
    id: 'cq34',
    category: 'gefuehl',
    emoji: '🌸',
    question: {
      de: 'Was macht dich in dieser Zeit am meisten glücklich?',
      en: 'What makes you happiest during this time?',
    },
  },
  {
    id: 'cq35',
    category: 'gefuehl',
    emoji: '🙏',
    question: {
      de: 'Wofür bist du heute dankbar?',
      en: 'What are you grateful for today?',
    },
  },
  {
    id: 'cq36',
    category: 'gefuehl',
    emoji: '💪',
    question: {
      de: 'In welchem Moment dieser Schwangerschaft hast du dich besonders stark gefühlt?',
      en: 'In which moment of this pregnancy did you feel especially strong?',
    },
  },
  {
    id: 'cq37',
    category: 'gefuehl',
    emoji: '🔮',
    question: {
      de: 'Welche Sorge aus dem ersten Trimester hat sich als unbegründet herausgestellt?',
      en: 'Which worry from the first trimester turned out to be unfounded?',
    },
  },
  {
    id: 'cq38',
    category: 'gefuehl',
    emoji: '🌟',
    question: {
      de: 'Was bist du überrascht, wie gut du es machst?',
      en: 'What are you surprised at how well you are doing?',
    },
  },
]

export function getCoupleQuestionForDay(date: Date = new Date()): CoupleQuestion {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return COUPLE_QUESTIONS[dayOfYear % COUPLE_QUESTIONS.length]
}

export function getCoupleQuestionText(question: CoupleQuestion, locale: Locale): string {
  return localized(question.question, locale)
}
