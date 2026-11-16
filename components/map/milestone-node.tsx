'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/map/milestone-node.tsx
//
// A single interactive node in the Life Map tech tree.
// Renders three distinct visual states: locked, unlocked, complete.
// Clicking an unlocked node marks it complete.
// Clicking any node opens an inline description panel.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { Check, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Language } from '@/lib/i18n'
import type { MilestoneWithStatus } from '@/hooks/use-milestones'

interface MilestoneNodeProps {
  node: MilestoneWithStatus
  language: Language
  onComplete: (id: string) => void
}

export function MilestoneNode({ node, language, onComplete }: MilestoneNodeProps) {
  const [expanded, setExpanded] = useState(false)

  const isLocked = node.status === 'locked'
  const isUnlocked = node.status === 'unlocked'
  const isComplete = node.status === 'complete'

  const title = node.title[language]
  const description = node.description[language]

  // ── Interaction ────────────────────────────────────────────────────────
  const handleClick = () => {
    if (isLocked) return
    setExpanded((prev) => !prev)
  }

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation() // Don't toggle expanded panel
    onComplete(node.id)
  }

  // ── Aria label for screen readers ──────────────────────────────────────
  const ariaLabel = isLocked
    ? `${title} — locked. Complete earlier steps first.`
    : isComplete
    ? `${title} — completed.`
    : `${title} — ready to complete. Click to learn more.`

  return (
    <div className="flex flex-col items-center gap-2">

      {/* ── Node circle ──────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLocked}
        aria-label={ariaLabel}
        aria-expanded={!isLocked ? expanded : undefined}
        aria-pressed={isComplete}
        className={cn(
          // Base shape
          'relative flex h-16 w-16 items-center justify-center rounded-full',
          'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'select-none',

          // Locked state — greyed out, not interactive
          isLocked && [
            'cursor-not-allowed opacity-40',
            'bg-muted border-2 border-border',
          ],

          // Unlocked state — sage ring with subtle pulse, inviting click
          isUnlocked && [
            'cursor-pointer',
            'bg-card border-2 border-primary',
            'shadow-[0_0_0_4px_rgba(79,107,76,0.15)]',
            'hover:shadow-[0_0_0_6px_rgba(79,107,76,0.25)] hover:scale-105',
            'animate-pulse-ring',
          ],

          // Complete state — filled sage green, celebratory
          isComplete && [
            'cursor-pointer',
            'bg-primary border-2 border-primary',
            'shadow-[0_0_0_4px_rgba(79,107,76,0.2)]',
            'hover:scale-105',
          ],
        )}
      >
        {/* Icon inside the node */}
        {isLocked && (
          <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        )}
        {isUnlocked && (
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
        )}
        {isComplete && (
          <Check className="h-6 w-6 text-primary-foreground" strokeWidth={3} aria-hidden="true" />
        )}

        {/* Tier badge — small dot in the top-right corner */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold',
            isLocked && 'bg-muted-foreground/30 text-muted-foreground',
            isUnlocked && 'bg-secondary text-foreground',
            isComplete && 'bg-primary-foreground text-primary',
          )}
        >
          {node.tier}
        </span>
      </button>

      {/* ── Node title ───────────────────────────────────────────────────── */}
      <p
        className={cn(
          'max-w-[80px] text-center text-[11px] leading-tight font-medium',
          isLocked && 'text-muted-foreground',
          isUnlocked && 'text-foreground',
          isComplete && 'text-primary font-semibold',
        )}
      >
        {title}
      </p>

      {/* ── Expandable description panel ──────────────────────────────────
           Only visible when the node is clicked and not locked.
           Uses max-height transition for smooth open/close animation.
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out w-48',
          expanded && !isLocked ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0',
        )}
        aria-hidden={!expanded}
      >
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm text-left">
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {description}
          </p>

          {/* Show "Mark Complete" button only for unlocked nodes */}
          {isUnlocked && (
            <button
              type="button"
              onClick={handleComplete}
              className={cn(
                'w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground',
                'transition-colors hover:bg-primary/90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              ✓ Mark as Complete
            </button>
          )}

          {/* Completed message */}
          {isComplete && (
            <p className="text-center text-xs font-semibold text-primary">
              🌿 Completed!
            </p>
          )}
        </div>
      </div>

    </div>
  )
}
