'use client'

import { useChat } from '@ai-sdk/react'
import { ArrowUp, Check, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { MessageBubble } from '@/components/chat/message-bubble'
import { Button } from '@/components/ui/button'
import {
  dictionary,
  parseTopic,
  SITUATIONS,
  TOPICS,
  type Language,
  type Situation,
  type Topic,
} from '@/lib/i18n'
import { cn } from '@/lib/utils'

type Step = 'name' | 'situation' | 'topic' | 'chat'

type ScriptItem =
  | { id: string; role: 'bot'; kind: 'askName' | 'askSituation' | 'askTopic' | 'topicRetry' }
  | { id: string; role: 'bot'; kind: 'greetName'; name: string }
  | { id: string; role: 'user'; kind: 'text'; text: string }
  | { id: string; role: 'user'; kind: 'situations'; situations: Situation[]; custom: string }

const initialScript: ScriptItem[] = [{ id: 'ask-name', role: 'bot', kind: 'askName' }]

let idCounter = 0
const nextId = () => `s-${++idCounter}`

export function ChatPanel({ language }: { language: Language }) {
  const t = dictionary[language]
  const [script, setScript] = useState<ScriptItem[]>(initialScript)
  const [step, setStep] = useState<Step>('name')
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<Situation[]>([])
  const [customSituation, setCustomSituation] = useState('')
  const [topic, setTopic] = useState<Topic | null>(null)

  const { messages, sendMessage, status, error, setMessages, stop } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [script, messages, step])

  const isBusy = status === 'submitted' || status === 'streaming'

  const requestBody = (chosenTopic: Topic | null) => ({
    language,
    name,
    situations: selected,
    customSituation,
    topic: chosenTopic,
  })

  const submitName = (value: string) => {
    setName(value)
    setScript((s) => [
      ...s,
      { id: nextId(), role: 'user', kind: 'text', text: value },
      { id: nextId(), role: 'bot', kind: 'greetName', name: value },
      { id: nextId(), role: 'bot', kind: 'askSituation' },
    ])
    setStep('situation')
  }

  const submitSituations = (custom: string) => {
    if (selected.length === 0 && !custom) return
    setCustomSituation(custom)
    setScript((s) => [
      ...s,
      { id: nextId(), role: 'user', kind: 'situations', situations: selected, custom },
      { id: nextId(), role: 'bot', kind: 'askTopic' },
    ])
    setStep('topic')
  }

  const chooseTopic = (chosen: Topic) => {
    setTopic(chosen)
    setStep('chat')
    sendMessage(
      { text: `${t.topicLetters[chosen]}. ${t.topics[chosen]}` },
      { body: requestBody(chosen) },
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = input.trim()

    if (step === 'situation') {
      submitSituations(value)
      setInput('')
      return
    }
    if (!value) return
    setInput('')

    if (step === 'name') {
      submitName(value.slice(0, 60))
    } else if (step === 'topic') {
      const parsed = parseTopic(value)
      if (parsed) {
        chooseTopic(parsed)
      } else {
        setScript((s) => [
          ...s,
          { id: nextId(), role: 'user', kind: 'text', text: value },
          { id: nextId(), role: 'bot', kind: 'topicRetry' },
        ])
      }
    } else if (!isBusy) {
      sendMessage({ text: value }, { body: requestBody(topic) })
    }
  }

  const restart = () => {
    stop()
    setMessages([])
    setScript(initialScript)
    setStep('name')
    setName('')
    setSelected([])
    setCustomSituation('')
    setTopic(null)
    setInput('')
    inputRef.current?.focus()
  }

  const toggleSituation = (situation: Situation) => {
    setSelected((prev) =>
      prev.includes(situation) ? prev.filter((s) => s !== situation) : [...prev, situation],
    )
  }

  const renderScriptItem = (item: ScriptItem) => {
    if (item.role === 'user') {
      const text =
        item.kind === 'text'
          ? item.text
          : [...item.situations.map((s) => t.situations[s]), item.custom]
              .filter(Boolean)
              .join(language === 'fa' ? '، ' : ', ')
      return (
        <MessageBubble key={item.id} role="user">
          {text}
        </MessageBubble>
      )
    }
    let text = ''
    switch (item.kind) {
      case 'askName':
        text = t.askName
        break
      case 'greetName':
        text = t.greetName(item.name)
        break
      case 'askSituation':
        text = t.askSituation
        break
      case 'askTopic':
        text = [
          t.askTopic,
          ...TOPICS.map((tp) => `${t.topicLetters[tp]}. ${t.topics[tp]}`),
        ].join('\n')
        break
      case 'topicRetry':
        text = t.topicRetry
        break
    }
    return (
      <MessageBubble key={item.id} role="bot">
        {text}
      </MessageBubble>
    )
  }

  return (
    <section
      aria-labelledby="chat-title"
      className="flex h-[min(680px,calc(100dvh-7rem))] min-h-[480px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
    >
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2.5" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
          <div>
            <h2 id="chat-title" className="text-base font-semibold text-card-foreground">
              {t.chatTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{t.chatSubtitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={restart} className="text-muted-foreground">
          <RotateCcw aria-hidden="true" />
          <span>{t.restart}</span>
        </Button>
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label={t.chatTitle}
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5"
      >
        {script.map(renderScriptItem)}

        {messages.map((message) => {
          const text = message.parts
            .map((part) => (part.type === 'text' ? part.text : ''))
            .join('')
          if (!text) return null
          return (
            <MessageBubble key={message.id} role={message.role === 'user' ? 'user' : 'bot'}>
              {text}
            </MessageBubble>
          )
        })}

        {status === 'submitted' && (
          <MessageBubble role="bot">
            <span className="text-muted-foreground">{t.thinking}</span>
          </MessageBubble>
        )}
        {error && (
          <p role="alert" className="text-center text-sm text-destructive">
            {t.error}
          </p>
        )}
      </div>

      {step === 'situation' && (
        <div className="flex flex-col gap-3 border-t border-border px-5 py-4">
          <p className="text-sm text-muted-foreground">{t.situationHint}</p>
          <div className="flex flex-wrap gap-2">
            {SITUATIONS.map((situation) => {
              const active = selected.includes(situation)
              return (
                <button
                  key={situation}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleSituation(situation)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:bg-accent',
                  )}
                >
                  {active && <Check className="size-3.5" aria-hidden="true" />}
                  {t.situations[situation]}
                </button>
              )
            })}
          </div>
          <Button
            onClick={() => {
              submitSituations(input.trim())
              setInput('')
            }}
            disabled={selected.length === 0 && !input.trim()}
            className="self-start"
          >
            {t.continueLabel}
          </Button>
        </div>
      )}

      {step === 'topic' && (
        <div className="flex flex-col gap-2 border-t border-border px-5 py-4">
          <p className="text-sm text-muted-foreground">{t.topicHint}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {TOPICS.map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => chooseTopic(tp)}
                className="flex items-center gap-2.5 rounded-2xl border border-border bg-background px-3.5 py-3 text-start text-sm text-foreground transition-colors hover:border-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {t.topicLetters[tp]}
                </span>
                <span className="leading-snug">{t.topics[tp]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 rounded-full border border-input bg-background ps-4 pe-1.5 py-1.5 focus-within:ring-2 focus-within:ring-ring">
          <label htmlFor="chat-input" className="sr-only">
            {t.placeholder}
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) {
                e.preventDefault()
              }
            }}
            placeholder={t.placeholder}
            autoComplete={step === 'name' ? 'given-name' : 'off'}
            maxLength={step === 'name' ? 60 : 2000}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full"
            disabled={(step === 'chat' && isBusy) || (step !== 'situation' && !input.trim())}
          >
            <ArrowUp className="rtl:-scale-x-100" aria-hidden="true" />
            <span className="sr-only">{t.send}</span>
          </Button>
        </div>
        <p className="px-2 text-xs leading-relaxed text-muted-foreground">{t.disclaimer}</p>
      </form>
    </section>
  )
}
