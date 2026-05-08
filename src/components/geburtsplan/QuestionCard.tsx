'use client'

import { useEffect, useRef, useState } from 'react'
import { Question } from '@/lib/questions'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { useLocale, useT } from '@/lib/i18n/client'
import { localized } from '@/lib/i18n/localized'

interface Props {
  question: Question
  value: string | string[] | undefined
  onChange: (id: string, value: string | string[]) => void
}

const CUSTOM_SENTINEL = '__custom__'

export function QuestionCard({ question, value, onChange }: Props) {
  const { locale } = useLocale()
  const t = useT()
  const isAnswered = Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim().length > 0
  const [hintOpen, setHintOpen] = useState(false)

  return (
    <div id={question.id} className={`scroll-mt-4 rounded-xl border bg-white p-4 transition-all ${isAnswered ? 'border-rose-200' : 'border-orange-200 bg-orange-50/30'}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug text-gray-800">{localized(question.label, locale)}</p>
        {question.optional && !isAnswered && (
          <Badge variant="secondary" className="shrink-0 text-xs">{t.geburtsplan.optionalBadge}</Badge>
        )}
        {isAnswered && (
          <span className="shrink-0 text-rose-400">✓</span>
        )}
      </div>

      {question.type === 'single' && question.options && (
        <SingleChoice question={question} value={value} onChange={onChange} />
      )}

      {question.type === 'multi' && question.options && (
        <MultiChoice question={question} value={value} onChange={onChange} />
      )}

      {question.type === 'text' && (
        <Textarea
          placeholder={t.geburtsplan.textPlaceholder}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(question.id, e.target.value)}
          className="min-h-[80px] text-sm resize-none"
        />
      )}

      {question.hint && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={() => setHintOpen(!hintOpen)}
            aria-expanded={hintOpen}
            aria-controls={`${question.id}-hint`}
            className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700"
          >
            <span>{hintOpen ? '▲' : '▼'}</span>
            <span>{t.geburtsplan.hintToggle}</span>
          </button>
          {hintOpen && (
            <p
              id={`${question.id}-hint`}
              className="mt-2 text-xs leading-relaxed text-gray-600 rounded-lg bg-blue-50 p-3"
            >
              {localized(question.hint, locale)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function SingleChoice({ question, value, onChange }: Props) {
  const { locale } = useLocale()
  const t = useT()
  const options = question.options ?? []
  const optionKeys = options.map((opt) => opt.de)
  const stringValue = typeof value === 'string' ? value : ''
  const isCustomValue =
    stringValue.length > 0 && stringValue !== CUSTOM_SENTINEL && !optionKeys.includes(stringValue)
  const [customSelected, setCustomSelected] = useState(isCustomValue || stringValue === CUSTOM_SENTINEL)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep customSelected in sync if value changes externally to a known option
  useEffect(() => {
    if (stringValue && !isCustomValue && stringValue !== CUSTOM_SENTINEL) {
      setCustomSelected(false)
    } else if (isCustomValue) {
      setCustomSelected(true)
    }
  }, [stringValue, isCustomValue])

  const radioValue = customSelected || isCustomValue ? CUSTOM_SENTINEL : stringValue
  const inputValue = isCustomValue ? stringValue : ''

  return (
    <RadioGroup
      value={radioValue}
      onValueChange={(v) => {
        if (v === CUSTOM_SENTINEL) {
          setCustomSelected(true)
          // Don't overwrite existing custom text if any
          if (!isCustomValue) {
            onChange(question.id, '')
          }
          // Focus input on next tick
          setTimeout(() => inputRef.current?.focus(), 0)
        } else {
          setCustomSelected(false)
          onChange(question.id, v)
        }
      }}
      className="space-y-2"
    >
      {options.map((opt) => (
        <div key={opt.de} className="flex items-center gap-2">
          <RadioGroupItem value={opt.de} id={`${question.id}-${opt.de}`} />
          <Label htmlFor={`${question.id}-${opt.de}`} className="text-sm font-normal text-gray-700 cursor-pointer">
            {localized(opt, locale)}
          </Label>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <RadioGroupItem value={CUSTOM_SENTINEL} id={`${question.id}-custom`} />
        <Label htmlFor={`${question.id}-custom`} className="text-sm font-normal text-gray-700 cursor-pointer">
          {t.geburtsplan.customOption.single}
        </Label>
      </div>
      {(customSelected || isCustomValue) && (
        <Input
          ref={inputRef}
          placeholder={t.geburtsplan.customOption.placeholder}
          value={inputValue}
          onChange={(e) => onChange(question.id, e.target.value)}
          className="mt-2 text-sm ml-6"
        />
      )}
    </RadioGroup>
  )
}

function MultiChoice({ question, value, onChange }: Props) {
  const { locale } = useLocale()
  const t = useT()
  const options = question.options ?? []
  const optionKeys = options.map((opt) => opt.de)
  const valueArray = Array.isArray(value) ? value : []
  const initialCustom = valueArray.find((v) => !optionKeys.includes(v)) ?? ''

  const [customChecked, setCustomChecked] = useState(initialCustom.length > 0)
  const [customText, setCustomText] = useState(initialCustom)

  const toggleOption = (optKey: string, checked: boolean) => {
    const current = Array.isArray(value) ? value : []
    onChange(question.id, checked ? [...current, optKey] : current.filter((v) => v !== optKey))
  }

  const handleCustomCheckedChange = (checked: boolean) => {
    setCustomChecked(checked)
    const current = Array.isArray(value) ? value : []
    const withoutCustom = current.filter((v) => optionKeys.includes(v))
    if (checked && customText.trim().length > 0) {
      onChange(question.id, [...withoutCustom, customText])
    } else {
      onChange(question.id, withoutCustom)
    }
  }

  const handleCustomTextChange = (next: string) => {
    setCustomText(next)
    if (customChecked) {
      const current = Array.isArray(value) ? value : []
      const withoutCustom = current.filter((v) => optionKeys.includes(v))
      if (next.trim().length > 0) {
        onChange(question.id, [...withoutCustom, next])
      } else {
        onChange(question.id, withoutCustom)
      }
    }
  }

  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const checked = valueArray.includes(opt.de)
        return (
          <div key={opt.de} className="flex items-center gap-2">
            <Checkbox
              id={`${question.id}-${opt.de}`}
              checked={checked}
              onCheckedChange={(c) => toggleOption(opt.de, Boolean(c))}
            />
            <Label htmlFor={`${question.id}-${opt.de}`} className="text-sm font-normal text-gray-700 cursor-pointer">
              {localized(opt, locale)}
            </Label>
          </div>
        )
      })}
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${question.id}-custom`}
          checked={customChecked}
          onCheckedChange={(c) => handleCustomCheckedChange(Boolean(c))}
        />
        <Label htmlFor={`${question.id}-custom`} className="text-sm font-normal text-gray-700 cursor-pointer">
          {t.geburtsplan.customOption.multi}
        </Label>
      </div>
      {customChecked && (
        <Input
          placeholder={t.geburtsplan.customOption.placeholder}
          value={customText}
          onChange={(e) => handleCustomTextChange(e.target.value)}
          className="mt-2 text-sm ml-6"
        />
      )}
    </div>
  )
}
