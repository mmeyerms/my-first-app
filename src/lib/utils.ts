import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateSSW(dueDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const daysUntilDue = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const ssw = 40 - Math.floor(daysUntilDue / 7)
  return Math.max(1, Math.min(42, ssw))
}

export function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'E-Mail oder Passwort falsch'
  if (message.includes('Email not confirmed')) return 'Bitte bestätige zuerst deine E-Mail-Adresse'
  if (message.includes('User already registered')) return 'Diese E-Mail-Adresse ist bereits registriert'
  if (message.includes('Password should be at least')) return 'Das Passwort muss mindestens 8 Zeichen haben'
  return 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
}
