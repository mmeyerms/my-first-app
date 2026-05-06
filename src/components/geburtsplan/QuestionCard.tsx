'use client'

import { Question } from '@/lib/questions'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'

interface Props {
  question: Question
  value: string | string[] | undefined
  onChange: (id: string, value: string | string[]) => void
}

export function QuestionCard({ question, value, onChange }: Props) {
  const isAnswered = Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim().length > 0

  return (
    <div className={`rounded-xl border bg-white p-4 transition-all ${isAnswered ? 'border-rose-200' : 'border-gray-100'}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug text-gray-800">{question.label}</p>
        {question.optional && !isAnswered && (
          <Badge variant="secondary" className="shrink-0 text-xs">Optional</Badge>
        )}
        {isAnswered && (
          <span className="shrink-0 text-rose-400">✓</span>
        )}
      </div>

      {question.type === 'single' && question.options && (
        <RadioGroup
          value={typeof value === 'string' ? value : ''}
          onValueChange={(v) => onChange(question.id, v)}
          className="space-y-2"
        >
          {question.options.map((opt) => (
            <div key={opt} className="flex items-center gap-2">
              <RadioGroupItem value={opt} id={`${question.id}-${opt}`} />
              <Label htmlFor={`${question.id}-${opt}`} className="text-sm font-normal text-gray-700 cursor-pointer">
                {opt}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {question.type === 'multi' && question.options && (
        <div className="space-y-2">
          {question.options.map((opt) => {
            const checked = Array.isArray(value) && value.includes(opt)
            return (
              <div key={opt} className="flex items-center gap-2">
                <Checkbox
                  id={`${question.id}-${opt}`}
                  checked={checked}
                  onCheckedChange={(c) => {
                    const current = Array.isArray(value) ? value : []
                    onChange(question.id, c ? [...current, opt] : current.filter((v) => v !== opt))
                  }}
                />
                <Label htmlFor={`${question.id}-${opt}`} className="text-sm font-normal text-gray-700 cursor-pointer">
                  {opt}
                </Label>
              </div>
            )
          })}
        </div>
      )}

      {question.type === 'text' && (
        <Textarea
          placeholder="Deine Gedanken..."
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(question.id, e.target.value)}
          className="min-h-[80px] text-sm resize-none"
        />
      )}
    </div>
  )
}
