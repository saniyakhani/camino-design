'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/planner-app.tsx  (updated)
//
// Root shell. Lifts userName + topic state so both ChatPanel and LifeMapTree
// share the same source of truth. Adds a Chat / My Map tab switcher.
// ─────────────────────────────────────────────────────────────────────────────

import { Leaf, MessageCircle, Map } from 'lucide-react'
import { useState, useCallback } from 'react'
import { ChatPanel } from '@/components/chat/chat-panel'
import { LifeMapTree } from '@/components/map/life-map-tree'
import { DownloadPdfButton } from '@/components/pdf/download-pdf-button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { RotatingHello } from '@/components/rotating-hello'
import { dictionary, type Language } from '@/lib/i18n'
import { type Topic } from '@/lib/milestones'
import { useMilestones } from '@/hooks/use-milestones'
import { cn } from '@/lib/utils'

type ActiveView = 'chat' | 'map'

// ─────────────────────────────────────────────────────────────────────────────
// Milestone unlock toast — appears briefly when the AI triggers a node
// ─────────────────────────────────────────────────────────────────────────────

const TOAST_COPY: Record<Language, string> = {
  en: '🌿 New milestone unlocked!',
  es: '🌿 ¡Nuevo logro desbloqueado!',
  fa: '🌿 مرحله جدید باز شد!',
}

function MilestoneToast({ language, visible }: { language: Language; visible: boolean }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2',
        'rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg',
        'transition-all duration-500',
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0',
      )}
    >
      {TOAST_COPY[language]}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab bar — only shown after the user has entered their name
// ─────────────────────────────────────────────────────────────────────────────

const TAB_LABELS: Record<ActiveView, Record<Language, string>> = {
  chat: { en: 'Chat', es: 'Chat', fa: 'گفتگو' },
  map:  { en: 'My Map', es: 'Mi Mapa', fa: 'نقشه من' },
}

interface TabBarProps {
  active: ActiveView
  onChange: (v: ActiveView) => void
  language: Language
}

function TabBar({ active, onChange, language }: TabBarProps) {
  return (
    <nav
      role="tablist"
      aria-label="Main view"
      className="flex gap-1 rounded-xl bg-muted p-1 w-full"
    >
      {(['chat', 'map'] as ActiveView[]).map((view) => {
        const Icon = view === 'chat' ? MessageCircle : Map
        return (
          <button
            key={view}
            role="tab"
            type="button"
            aria-selected={active === view}
            onClick={() => onChange(view)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 px-3 text-sm font-medium transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active === view
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {TAB_LABELS[view][language]}
          </button>
        )
      })}
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PlannerApp — root component
// ─────────────────────────────────────────────────────────────────────────────

export function PlannerApp() {
  const [language, setLanguage]     = useState<Language>('en')
  const [userName, setUserName]     = useState<string>('')
  const [userTopic, setUserTopic]   = useState<Topic | null>(null)
  const [activeView, setActiveView] = useState<ActiveView>('chat')
  const [toastVisible, setToastVisible] = useState(false)

  const t   = dictionary[language]
  const dir = language === 'fa' ? 'rtl' : 'ltr'

  // Default display name when user hasn't entered one yet
  const defaultName = language === 'fa' ? 'همسفر' : language === 'es' ? 'Compañero' : 'Explorer'
  const activeName = userName || defaultName

  // useMilestones at this level so the tree and the AI handler share one store
  const { processAiMessage, getNodesForTopic } = useMilestones(activeName)

  // Called by ChatPanel whenever a full AI message arrives
  const handleAiMessage = useCallback(
    (text: string) => {
      const newIds = processAiMessage(text)
      if (newIds.length > 0) {
        setToastVisible(true)
        setTimeout(() => setToastVisible(false), 3500)
      }
    },
    [processAiMessage],
  )

  // Called by ChatPanel the moment the user submits their name
  const handleNameSet = useCallback((name: string) => {
    setUserName(name)
  }, [])

  // Called by ChatPanel when the user picks a topic (finance/health/immigration)
  const handleTopicSet = useCallback((topic: Topic) => {
    setUserTopic(topic)
  }, [])

  return (
    <div lang={language} dir={dir} className="flex min-h-dvh flex-col">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5">
        <div className="flex items-center gap-2 text-foreground">
          <Leaf className="size-5 text-primary" aria-hidden="true" />
          <span className="text-lg font-semibold tracking-tight">{t.brand}</span>
        </div>
        <LanguageSwitcher value={language} onChange={setLanguage} />
      </header>

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-start gap-10 px-5 pb-16 lg:grid-cols-[1fr_1.15fr] lg:gap-16">

        {/* Left — hero copy (always visible) */}
        <div className="flex flex-col gap-6 pt-4 lg:pt-10">
          <RotatingHello />
          <p className="max-w-md text-2xl leading-snug text-foreground text-balance">
            {t.tagline}
          </p>
          <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">
            {t.intro}
          </p>

          {/* Map view button */}
          {activeView === 'chat' && (
            <button
              type="button"
              onClick={() => setActiveView('map')}
              className={cn(
                'inline-flex items-center gap-2 self-start rounded-full',
                'border border-primary/40 bg-secondary px-4 py-2 text-sm font-medium text-primary',
                'transition-colors hover:bg-primary hover:text-primary-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <Map className="h-4 w-4" aria-hidden="true" />
              {language === 'en' && 'View Interactive Life Map →'}
              {language === 'es' && 'Ver Mapa Interactivo →'}
              {language === 'fa' && '← مشاهده نقشه تعاملی زندگی'}
            </button>
          )}
        </div>

        {/* Right — tab switcher + content */}
        <div className="flex flex-col gap-4 pt-4 lg:pt-10">

          {/* Tab bar is always visible so user can switch between Chat and Map anytime */}
          <TabBar
            active={activeView}
            onChange={setActiveView}
            language={language}
          />

          {/* Chat view — always mounted to preserve conversation state */}
          <div className={activeView === 'chat' ? 'block' : 'hidden'}>
            <ChatPanel
              language={language}
              onNameSet={handleNameSet}
              onTopicSet={handleTopicSet}
              onAiMessage={handleAiMessage}
            />
          </div>

          {/* Map view */}
          {activeView === 'map' && (
            <div className="flex flex-col gap-4">
              <LifeMapTree
                userName={activeName}
                language={language}
                initialTopic={userTopic ?? 'financeJobs'}
              />
              {/* PDF download — appears below the map */}
              <DownloadPdfButton
                userName={activeName}
                language={language}
                topic={userTopic ?? 'financeJobs'}
                nodes={getNodesForTopic(userTopic ?? 'financeJobs')}
                className="self-center"
              />
            </div>
          )}

        </div>
      </main>

      {/* ── Milestone unlock toast ────────────────────────────────────────── */}
      <MilestoneToast language={language} visible={toastVisible} />

    </div>
  )
}
