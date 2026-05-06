import { QUESTIONS, getStageQuestions } from './questions'

export async function exportGeburtsplanPDF(params: {
  babyName: string
  dueDate: string
  answers: Record<string, unknown>
}) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const marginL = 20
  const marginR = 190
  const lineH = 7
  let y = 20

  function addText(text: string, size: number, bold = false, color = '#1f2937') {
    doc.setFontSize(size)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(color)
    doc.text(text, marginL, y)
    y += lineH * (size / 11)
  }

  function addWrappedText(text: string, size = 10) {
    doc.setFontSize(size)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor('#374151')
    const lines = doc.splitTextToSize(text, marginR - marginL) as string[]
    lines.forEach((line) => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.text(line, marginL, y)
      y += lineH
    })
  }

  function addLine() {
    doc.setDrawColor('#e5e7eb')
    doc.line(marginL, y, marginR, y)
    y += 4
  }

  const formattedDate = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
  const formattedET = new Date(params.dueDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })

  addText('Mein Geburtsplan', 22, true, '#f43f5e')
  y += 2
  addText(`für ${params.babyName}`, 14, false, '#6b7280')
  y += 2
  addText(`Errechneter Geburtstermin: ${formattedET}`, 10, false, '#9ca3af')
  addText(`Erstellt am: ${formattedDate}`, 10, false, '#9ca3af')
  y += 4
  addLine()

  const stageLabels: Record<number, string> = {
    1: 'Kern-Entscheidungen',
    2: 'Vertiefung',
    3: 'Wochenbett',
  }

  for (const stage of [1, 2, 3] as const) {
    const questions = getStageQuestions(stage)
    const answered = questions.filter((q) => {
      const a = params.answers[q.id]
      return Array.isArray(a) ? a.length > 0 : typeof a === 'string' && a.trim().length > 0
    })
    if (answered.length === 0) continue

    if (y > 240) { doc.addPage(); y = 20 }
    y += 2
    addText(stageLabels[stage], 13, true, '#1f2937')
    y += 1
    addLine()

    for (const q of answered) {
      if (y > 255) { doc.addPage(); y = 20 }
      const questionDef = QUESTIONS.find((x) => x.id === q.id)!
      addText(questionDef.label, 10, true, '#374151')
      const answer = params.answers[q.id]
      const answerText = Array.isArray(answer) ? answer.join(', ') : (answer as string) || 'Noch nicht entschieden'
      addWrappedText(answerText)
      y += 2
    }
  }

  doc.save(`Geburtsplan-${params.babyName}.pdf`)
}
