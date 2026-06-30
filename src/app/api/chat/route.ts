import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { calculateSSW } from '@/lib/utils'

export const runtime = 'nodejs'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(8000),
})

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
  locale: z.enum(['de', 'en']).optional(),
})

type ChatMessage = z.infer<typeof messageSchema>

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 600

interface PregnancyContext {
  ssw: number | null
  babyName: string | null
  status: 'planning' | 'pregnant' | 'born' | 'sternenkind' | 'unknown'
  locale: 'de' | 'en'
}

function buildSystemPrompt(ctx: PregnancyContext): string {
  const sswText =
    ctx.ssw !== null ? `SSW ${ctx.ssw}` : ctx.locale === 'en' ? 'not yet known' : 'noch nicht bekannt'
  const babyName =
    ctx.babyName ?? (ctx.locale === 'en' ? 'not yet set' : 'noch nicht eingetragen')

  if (ctx.locale === 'en') {
    return `You are an experienced digital midwife companion inside the MamaMap app. You speak at eye level, warm and honest. You are NOT a doctor and you do not give medical diagnoses.

Current context of the user:
- Pregnancy week: ${sswText}
- Baby name: ${babyName}
- Stage: ${ctx.status}
- Language: en

Answer style:
- 2-5 sentences, no essays
- Concrete and empathetic
- If something is medically unclear: recommend midwife/doctor
- On emergency signs (bleeding, severe pain, no baby movement, sudden swelling, fever): immediate clear escalation: "Please call your midwife or the clinic right away — 112 (or 911) in case of acute emergency."
- Never recommend medication
- For star child / grief context: be especially gentle, with a reference to grief support (/trauer in the app)

Always reply in English.`
  }

  return `Du bist eine erfahrene digitale Hebammen-Begleiterin in der App MamaMap. Du sprichst auf Augenhöhe, warm und ehrlich. Du bist KEINE Ärztin und gibst keine medizinischen Diagnosen.

Aktueller Kontext der Nutzerin:
- Schwangerschaftswoche: ${sswText}
- Baby-Name: ${babyName}
- Stand: ${ctx.status}
- Sprache: de

Antwort-Stil:
- 2-5 Sätze, keine Romane
- Konkret und einfühlsam
- Wenn etwas medizinisch unklar ist: Hebamme/Ärztin empfehlen
- Bei Notfall-Anzeichen (Blutung, starke Schmerzen, kein Babybewegen, plötzliche Schwellungen, Fieber): SOFORT klare Eskalation: "Bitte umgehend deine Hebamme oder die Klinik anrufen — 112 bei akutem Notfall."
- Niemals Medikamente empfehlen
- Bei Sternenkind/Trauer: besonders behutsam, mit Verweis auf Begleitung in Trauer (/trauer)

Sprich immer auf Deutsch.`
}

// Lightweight keyword-based mock when no API key is present.
function buildMockReply(userMessage: string, ctx: PregnancyContext): string {
  const m = userMessage.toLowerCase()
  const en = ctx.locale === 'en'
  const demoPrefix = en
    ? '(Demo mode — please set ANTHROPIC_API_KEY in your env vars for real answers.)\n\n'
    : '(Demo-Modus — bitte ANTHROPIC_API_KEY in den Env-Vars setzen für echte Antworten.)\n\n'

  let body: string
  if (m.includes('blut') || m.includes('bleed')) {
    body = en
      ? 'Bleeding in pregnancy should always be checked. Please call your midwife or the clinic right away — 112 in case of acute emergency. I cannot replace that conversation.'
      : 'Blutungen in der Schwangerschaft sollten immer abgeklärt werden. Bitte ruf umgehend deine Hebamme oder die Klinik an — 112 bei akutem Notfall. Diese Einschätzung kann ich dir nicht abnehmen.'
  } else if (m.includes('wehe') || m.includes('contraction')) {
    body = en
      ? 'Real labour contractions usually come regularly, get stronger, and do not ease up when you change position. Practice contractions (Braxton Hicks) feel hard but go away. If you are unsure or before 37 weeks, call your midwife.'
      : 'Echte Geburtswehen kommen meist regelmäßig, werden stärker und lassen sich nicht durch Bewegung wegatmen. Übungswehen fühlen sich hart an, gehen aber wieder weg. Wenn du unsicher bist oder vor SSW 37 — ruf deine Hebamme an.'
  } else if (m.includes('bewegung') || m.includes('movement') || m.includes('tritt')) {
    body = en
      ? 'A clear drop in baby movements is something to take seriously. Lie down on your left side, drink something cold, and observe for 30 minutes. If movements stay reduced, please contact your midwife or clinic right away.'
      : 'Eine deutliche Abnahme der Kindsbewegungen nimmst du ernst. Leg dich auf die linke Seite, trink etwas Kaltes, und beobachte 30 Minuten. Bleiben die Bewegungen weniger, ruf bitte sofort deine Hebamme oder die Klinik an.'
  } else if (m.includes('übel') || m.includes('nausea') || m.includes('erbrech') || m.includes('vomit')) {
    body = en
      ? 'Nausea in early pregnancy is very common and usually eases by week 14. Small frequent snacks, ginger tea, and a glass of water before getting up can help. If you cannot keep fluids down, please see your doctor.'
      : 'Übelkeit in der Frühschwangerschaft ist sehr häufig und legt sich meist bis zur 14. Woche. Kleine, häufige Snacks, Ingwertee oder ein Glas Wasser vor dem Aufstehen helfen oft. Wenn du gar keine Flüssigkeit bei dir behältst, geh bitte zur Ärztin.'
  } else if (m.includes('schmerz') || m.includes('pain')) {
    body = en
      ? 'Strong or persistent pain in pregnancy is always worth a phone call to your midwife. Light pulling on the sides is often the round ligaments stretching. If pain is one-sided, cramping or with bleeding: please call right away.'
      : 'Starke oder anhaltende Schmerzen in der Schwangerschaft sind immer einen Anruf bei deiner Hebamme wert. Leichtes Ziehen seitlich kommt oft von den Mutterbändern. Bei einseitigen, krampfartigen Schmerzen oder mit Blutung — bitte sofort melden.'
  } else if (m.includes('ernähr') || m.includes('essen') || m.includes('nutrition') || m.includes('eat') || m.includes('food')) {
    body = en
      ? 'Eat what nourishes you, in small calm portions. Plenty of vegetables, whole grains, good fats, and enough protein. Avoid raw fish, raw meat, and unpasteurised cheese. You do not need to eat for two — just well.'
      : 'Iss, was dir gut tut, in kleinen ruhigen Portionen. Viel Gemüse, Vollkorn, gute Fette und genug Eiweiß. Rohen Fisch, rohes Fleisch und Rohmilchkäse meiden. Du musst nicht für zwei essen — nur gut.'
  } else if (ctx.status === 'sternenkind') {
    body = en
      ? 'I am so sorry. Whatever you feel right now is allowed. You are not alone. In the app you will find grief support under /trauer, and the helpline 0800-1110111 is there for you 24/7.'
      : 'Es tut mir so leid. Was auch immer du gerade fühlst, ist erlaubt. Du bist nicht allein. In der App findest du Begleitung in Trauer unter /trauer, und das Hilfetelefon 0800-1110111 ist 24/7 für dich da.'
  } else {
    body = en
      ? 'Thank you for trusting me with that. I cannot replace your midwife, but I am here to think out loud with you. If something feels wrong physically, please reach out to your midwife or doctor — they know you and your pregnancy.'
      : 'Danke, dass du mir das anvertraust. Ich kann deine Hebamme nicht ersetzen, aber ich denke gern mit dir mit. Wenn sich etwas körperlich nicht richtig anfühlt, ruf bitte deine Hebamme oder Ärztin an — sie kennen dich und deine Schwangerschaft.'
  }

  return demoPrefix + body
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ungültige Anfrage', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const messages: ChatMessage[] = parsed.data.messages

  // Last message must be from the user — otherwise we have nothing to answer.
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUser) {
    return NextResponse.json({ error: 'Keine Nutzer-Nachricht' }, { status: 400 })
  }

  // Build pregnancy context for the system prompt.
  let ssw: number | null = null
  let babyName: string | null = null
  let status: PregnancyContext['status'] = 'unknown'

  try {
    const pregnancy = await getActivePregnancy(supabase, user.id)
    if (pregnancy) {
      status = pregnancy.status
      babyName = pregnancy.baby_name
      if (pregnancy.due_date) {
        const calculated = calculateSSW(pregnancy.due_date)
        if (calculated > 0 && calculated <= 42) ssw = calculated
      }
    }
  } catch {
    // Best-effort: missing context is non-fatal.
  }

  // Locale: from request body first, then profile.
  let locale: 'de' | 'en' = parsed.data.locale ?? 'de'
  if (!parsed.data.locale) {
    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('locale')
        .eq('user_id', user.id)
        .single()
      if (prof?.locale === 'en' || prof?.locale === 'de') {
        locale = prof.locale
      }
    } catch {
      // ignore — default 'de'
    }
  }

  const ctx: PregnancyContext = { ssw, babyName, status, locale }
  const apiKey = process.env.ANTHROPIC_API_KEY

  // --- Mock fallback ---
  if (!apiKey) {
    const reply = buildMockReply(lastUser.content, ctx)
    return NextResponse.json({
      role: 'assistant',
      content: reply,
      demoMode: true,
    })
  }

  // --- Anthropic non-streaming call ---
  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(ctx),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n')
      .trim()

    if (!text) {
      return NextResponse.json(
        { error: 'Leere Antwort vom Modell' },
        { status: 502 },
      )
    }

    return NextResponse.json({
      role: 'assistant',
      content: text,
      demoMode: false,
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler'
    // Log server-side for debugging, do not leak details to client.
    console.error('[chat] Anthropic call failed:', errorMessage)
    return NextResponse.json(
      { error: 'KI-Antwort konnte nicht generiert werden' },
      { status: 502 },
    )
  }
}
