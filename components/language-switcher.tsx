'use client'

import { cn } from '@/lib/utils'
import { dictionary, LANGUAGES, type Language } from '@/lib/i18n'

type LanguageSwitcherProps = {
  value: Language
  onChange: (language: Language) => void
}

export function LanguageSwitcher({ value, onChange }: LanguageSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Language / Idioma / زبان"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1"
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          lang={lang}
          aria-pressed={value === lang}
          onClick={() => onChange(lang)}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            value === lang
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          {dictionary[lang].languageName}
        </button>
      ))}
    </div>
  )
}
