import type { Termin } from './types'
import type { Locale } from '@/lib/i18n/types'
import { localized } from '@/lib/i18n/localized'
import { TERMIN_TYPES } from './data'

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function toIcsDate(date: string, time?: string): string {
  // YYYYMMDD or YYYYMMDDTHHMMSS for floating local time
  const [y, m, d] = date.split('-')
  if (!time) return `${y}${m}${d}`
  const [hh, mm] = time.split(':')
  return `${y}${m}${d}T${hh}${mm}00`
}

function escape(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

export function buildIcs(termine: Termin[], locale: Locale): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  const events = termine
    .map((t) => {
      const def = TERMIN_TYPES.find((x) => x.id === t.type)
      const summary = t.title || (def ? localized(def.title, locale) : 'Termin')
      const description = [
        def ? localized(def.description, locale) : '',
        t.doctor ? `${locale === 'de' ? 'Arzt' : 'Doctor'}: ${t.doctor}` : '',
        t.notes ?? '',
      ]
        .filter(Boolean)
        .join('\\n')
      const dtStart = toIcsDate(t.date, t.time)
      const dtEndDate = new Date(t.date)
      if (t.time) {
        const [hStr, mStr] = t.time.split(':')
        dtEndDate.setHours(parseInt(hStr, 10) + 1, parseInt(mStr, 10), 0, 0)
      } else {
        // For all-day events, DTEND is the day after DTSTART
        dtEndDate.setDate(dtEndDate.getDate() + 1)
      }
      const dtEnd = t.time
        ? toIcsDate(t.date, `${pad(dtEndDate.getHours())}:${pad(dtEndDate.getMinutes())}`)
        : `${dtEndDate.getFullYear()}${pad(dtEndDate.getMonth() + 1)}${pad(dtEndDate.getDate())}`
      const lines = [
        'BEGIN:VEVENT',
        `UID:${t.id}@mamamap`,
        `DTSTAMP:${stamp}`,
        t.time ? `DTSTART:${dtStart}` : `DTSTART;VALUE=DATE:${dtStart}`,
        t.time ? `DTEND:${dtEnd}` : `DTEND;VALUE=DATE:${dtEnd}`,
        `SUMMARY:${escape(summary)}`,
        description ? `DESCRIPTION:${escape(description)}` : '',
        t.location ? `LOCATION:${escape(t.location)}` : '',
        'END:VEVENT',
      ].filter(Boolean)
      return lines.join('\r\n')
    })
    .join('\r\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MamaMap//DE',
    'CALSCALE:GREGORIAN',
    events,
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.ics') ? filename : `${filename}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
