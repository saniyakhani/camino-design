'use client'

import { Leaf } from 'lucide-react'
import { useState } from 'react'
import { ChatPanel } from '@/components/chat/chat-panel'
import { LanguageSwitcher } from '@/components/language-switcher'
import { RotatingHello } from '@/components/rotating-hello'
import { dictionary, type Language } from '@/lib/i18n'

export function PlannerApp() {
  const [language, setLanguage] = useState<Language>('en')
  const t = dictionary[language]
  const dir = language === 'fa' ? 'rtl' : 'ltr'

  return (
    <div lang={language} dir={dir} className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5">
        <div className="flex items-center gap-2 text-foreground">
          <Leaf className="size-5 text-primary" aria-hidden="true" />
          <span className="text-lg font-semibold tracking-tight">{t.brand}</span>
        </div>
        <LanguageSwitcher value={language} onChange={setLanguage} />
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 pb-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="flex flex-col gap-6 pt-4 lg:pt-0">
          <RotatingHello />
          <p className="max-w-md text-2xl leading-snug text-foreground text-balance">{t.tagline}</p>
          <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">{t.intro}</p>
        </div>
        <ChatPanel language={language} />
      </main>
    </div>
  )
}
