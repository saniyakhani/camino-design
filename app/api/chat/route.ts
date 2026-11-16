import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import {
  dictionary,
  isLanguage,
  SITUATIONS,
  TOPICS,
  type Situation,
  type Topic,
} from '@/lib/i18n'

export const maxDuration = 30

const languageNames = { en: 'English', es: 'Spanish', fa: 'Farsi (Persian)' }

type ChatBody = {
  messages: UIMessage[]
  language?: unknown
  name?: unknown
  situations?: unknown
  customSituation?: unknown
  topic?: unknown
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatBody
  const messages = Array.isArray(body.messages) ? body.messages.slice(-30) : []

  const language = isLanguage(body.language) ? body.language : 'en'
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 60) : ''
  const situations = Array.isArray(body.situations)
    ? body.situations.filter((s): s is Situation =>
        (SITUATIONS as readonly string[]).includes(s),
      )
    : []
  const customSituation =
    typeof body.customSituation === 'string' ? body.customSituation.trim().slice(0, 200) : ''
  const topic: Topic | null =
    typeof body.topic === 'string' && (TOPICS as readonly string[]).includes(body.topic)
      ? (body.topic as Topic)
      : null

  const en = dictionary.en
  const situationText = [
    ...situations.map((s) => en.situations[s]),
    customSituation,
  ]
    .filter(Boolean)
    .join(', ')

  const system = `You are Camino, a warm, patient life-planning assistant for refugees, immigrants, asylees, students, and families who are building a new life, primarily in the United States.

User profile:
- Name: ${name || 'unknown'}
- Life situation: ${situationText || 'not shared'}
- Main area of help: ${topic ? en.topics[topic] : 'not chosen yet'}

Rules:
- Always reply in ${languageNames[language]}, even if the user writes in another language, unless they explicitly ask you to switch.
- Use plain, simple words (around a 6th-grade reading level). Avoid jargon; when a legal or medical term is necessary, explain it briefly.
- Keep answers short: a 1-2 sentence summary, then up to 5 concrete next steps as a simple numbered list. Use plain text only, no markdown symbols like ** or #.
- Tailor advice to the user's life situation. Mention well-known free or low-cost resources (for example USCIS.gov, local refugee resettlement agencies, legal aid organizations, community health centers, 211, Medicaid, school financial aid offices) when relevant.
- Never invent laws, deadlines, fees, or phone numbers. If unsure, say so and point to an official source or a qualified professional.
- Immigration questions: remind the user that only a licensed immigration attorney or a DOJ-accredited representative can give legal advice, and warn against "notarios" who are not lawyers.
- Health questions: you are not a doctor. If something sounds urgent or dangerous, tell them to call 911 or go to the nearest emergency room.
- Be kind and never judgmental about immigration status. Do not ask for sensitive identifying details like ID numbers or addresses.
- End with one short follow-up question to help them take the next step.`

  const result = streamText({
    model: 'openai/gpt-5.4-mini',
    system,
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
