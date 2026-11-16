'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/pdf/download-pdf-button.tsx
//
// Generates the PDF client-side on demand and triggers a browser download.
// Uses the pdf() helper from @react-pdf/renderer — no server round-trip,
// works fully offline after the first page load.
//
// Dynamically imports LifeMapDocument to avoid SSR issues with react-pdf
// (react-pdf uses browser-only Canvas APIs).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Language } from '@/lib/i18n'
import { type Topic } from '@/lib/milestones'
import { type MilestoneWithStatus } from '@/hooks/use-milestones'

interface DownloadPdfButtonProps {
  userName: string
  language: Language
  topic: Topic
  nodes: MilestoneWithStatus[]
  className?: string
}

const BUTTON_LABELS: Record<Language, { idle: string; generating: string; done: string }> = {
  en: { idle: 'Download My Plan (PDF)', generating: 'Building PDF…', done: 'Downloaded! ✓' },
  es: { idle: 'Descargar Mi Plan (PDF)', generating: 'Generando PDF…', done: '¡Descargado! ✓' },
  fa: { idle: 'دانلود برنامه (PDF)', generating: 'در حال ساخت PDF…', done: 'دانلود شد! ✓' },
}

type ButtonState = 'idle' | 'generating' | 'done' | 'error'

export function DownloadPdfButton({
  userName,
  language,
  topic,
  nodes,
  className,
}: DownloadPdfButtonProps) {
  const [state, setState] = useState<ButtonState>('idle')
  const labels = BUTTON_LABELS[language]

  const handleDownload = useCallback(async () => {
    if (state === 'generating') return
    setState('generating')

    try {
      // Dynamically import react-pdf to avoid SSR canvas errors
      const [{ pdf }, { LifeMapDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/pdf/life-map-document'),
      ])

      // Generate the PDF as a Blob entirely in the browser
      const blob = await pdf(
        <LifeMapDocument
          userName={userName}
          language={language}
          topic={topic}
          nodes={nodes}
        />,
      ).toBlob()

      // Trigger download
      const url  = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href     = url
      link.download = `camino-life-map-${userName.toLowerCase().replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setState('done')
      // Reset button after 3 seconds
      setTimeout(() => setState('idle'), 3000)
    } catch (err) {
      console.error('[DownloadPdfButton] PDF generation failed:', err)
      setState('error')
      setTimeout(() => setState('idle'), 4000)
    }
  }, [state, userName, language, topic, nodes])

  const isGenerating = state === 'generating'

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      aria-label={
        isGenerating
          ? labels.generating
          : state === 'done'
          ? labels.done
          : labels.idle
      }
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        // State-based styles
        state === 'idle' && [
          'border border-primary/40 bg-secondary text-primary',
          'hover:bg-primary hover:text-primary-foreground',
        ],
        state === 'generating' && 'border border-border bg-muted text-muted-foreground cursor-wait',
        state === 'done'       && 'border border-primary bg-primary text-primary-foreground',
        state === 'error'      && 'border border-destructive bg-destructive/10 text-destructive',
        className,
      )}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-4 w-4" aria-hidden="true" />
      )}

      <span>
        {state === 'idle'       && labels.idle}
        {state === 'generating' && labels.generating}
        {state === 'done'       && labels.done}
        {state === 'error'      && (
          language === 'en' ? 'Error — try again' :
          language === 'es' ? 'Error — intenta de nuevo' :
          'خطا — دوباره امتحان کن'
        )}
      </span>
    </button>
  )
}
