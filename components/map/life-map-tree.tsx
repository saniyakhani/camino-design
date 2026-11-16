'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/map/life-map-tree.tsx
//
// The full Life Map "tech tree" for a single topic.
// Renders three tier rows, SVG connector lines between tiers,
// a progress bar, and topic tabs. RTL-aware for Farsi.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react'
import { Briefcase, Heart, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Language } from '@/lib/i18n'
import { type Topic, type MilestoneNode } from '@/lib/milestones'
import { useMilestones, type MilestoneWithStatus } from '@/hooks/use-milestones'
import { MilestoneNode as MilestoneNodeCard } from './milestone-node'

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────

interface LifeMapTreeProps {
  userName: string
  language: Language
  /** Pre-selects a tab — pass the topic the user chose in the chat flow */
  initialTopic?: Topic
}

const TOPIC_CONFIG: {
  id: Topic
  icon: React.ElementType
  labels: Record<Language, string>
  tierLabels: Record<Language, [string, string, string]>
}[] = [
  {
    id: 'financeJobs',
    icon: Briefcase,
    labels: { en: 'Finance & Jobs', es: 'Finanzas y Trabajo', fa: 'مالی و شغل' },
    tierLabels: {
      en: ['Foundation', 'Building Up', 'Advanced'],
      es: ['Fundamento', 'Avanzando', 'Avanzado'],
      fa: ['پایه', 'در حال رشد', 'پیشرفته'],
    },
  },
  {
    id: 'health',
    icon: Heart,
    labels: { en: 'Health', es: 'Salud', fa: 'سلامت' },
    tierLabels: {
      en: ['Foundation', 'Building Up', 'Advanced'],
      es: ['Fundamento', 'Avanzando', 'Avanzado'],
      fa: ['پایه', 'در حال رشد', 'پیشرفته'],
    },
  },
  {
    id: 'immigration',
    icon: Globe,
    labels: { en: 'Immigration', es: 'Inmigración', fa: 'مهاجرت' },
    tierLabels: {
      en: ['Foundation', 'Building Up', 'Advanced'],
      es: ['Fundamento', 'Avanzando', 'Avanzado'],
      fa: ['پایه', 'در حال رشد', 'پیشرفته'],
    },
  },
]

const PROGRESS_LABELS: Record<Language, (done: number, total: number) => string> = {
  en: (d, t) => `${d} of ${t} milestones complete`,
  es: (d, t) => `${d} de ${t} logros completados`,
  fa: (d, t) => `${d} از ${t} مرحله تکمیل شده`,
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG Connector layer
// Draws curved lines between nodes in adjacent tiers.
// Uses percentage-based x positions derived from column index,
// so the layout stays correct at any container width.
// ─────────────────────────────────────────────────────────────────────────────

interface TierConnectorsProps {
  upperTier: MilestoneWithStatus[]
  lowerTier: MilestoneWithStatus[]
}

function TierConnectors({ upperTier, lowerTier }: TierConnectorsProps) {
  // Compute x-center (0–100) for each node based on its column position
  const colX = (index: number, total: number) =>
    ((index + 0.5) / total) * 100

  const lines = useMemo(() => {
    const result: { x1: number; x2: number; active: boolean }[] = []
    lowerTier.forEach((child, childIdx) => {
      child.dependsOn.forEach((parentId) => {
        const parentIdx = upperTier.findIndex((n) => n.id === parentId)
        if (parentIdx === -1) return
        result.push({
          x1: colX(parentIdx, upperTier.length),
          x2: colX(childIdx, lowerTier.length),
          // Line glows when both nodes are unlocked or complete
          active:
            upperTier[parentIdx].status !== 'locked' &&
            child.status !== 'locked',
        })
      })
    })
    return result
  }, [upperTier, lowerTier])

  return (
    // Height of 48px gives enough room for the curved lines
    <svg
      viewBox="0 0 100 48"
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: 48 }}
      aria-hidden="true"
    >
      {lines.map((line, i) => (
        <path
          key={i}
          // Cubic bezier: start at top-center of parent col, end at bottom-center of child col
          d={`M ${line.x1} 0 C ${line.x1} 24, ${line.x2} 24, ${line.x2} 48`}
          fill="none"
          strokeWidth="0.8"
          stroke={line.active ? '#4f6b4c' : '#ddd3c0'}
          strokeDasharray={line.active ? undefined : '3 2'}
          className="transition-all duration-500"
        />
      ))}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function LifeMapTree({
  userName,
  language,
  initialTopic = 'financeJobs',
}: LifeMapTreeProps) {
  const [activeTopic, setActiveTopic] = useState<Topic>(initialTopic)
  const isRtl = language === 'fa'

  const { getNodesForTopic, completeNode } = useMilestones(userName)

  // Get nodes for the active topic, split by tier
  const allNodes = getNodesForTopic(activeTopic)
  const tier1 = allNodes.filter((n) => n.tier === 1)
  const tier2 = allNodes.filter((n) => n.tier === 2)
  const tier3 = allNodes.filter((n) => n.tier === 3)

  // Progress stats for the active topic only
  const topicCompleted = allNodes.filter((n) => n.status === 'complete').length
  const topicTotal = allNodes.length
  const progressPct = topicTotal > 0 ? (topicCompleted / topicTotal) * 100 : 0

  const activeCfg = TOPIC_CONFIG.find((t) => t.id === activeTopic)!

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <nav
        role="tablist"
        aria-label="Life Map topics"
        className="flex gap-1 rounded-xl bg-muted p-1"
      >
        {TOPIC_CONFIG.map(({ id, icon: Icon, labels }) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={activeTopic === id}
            onClick={() => setActiveTopic(id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 px-1 text-xs font-medium transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              activeTopic === id
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{labels[language]}</span>
          </button>
        ))}
      </nav>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{PROGRESS_LABELS[language](topicCompleted, topicTotal)}</span>
          <span className="font-semibold text-primary">
            {Math.round(progressPct)}%
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={topicCompleted}
          aria-valuemin={0}
          aria-valuemax={topicTotal}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Tree ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col">

        {/* Tier 1 — Foundation */}
        <TierRow
          label={activeCfg.tierLabels[language][0]}
          nodes={tier1}
          language={language}
          onComplete={completeNode}
        />

        {/* Connectors: Tier 1 → Tier 2 */}
        <TierConnectors upperTier={tier1} lowerTier={tier2} />

        {/* Tier 2 — Building Up */}
        <TierRow
          label={activeCfg.tierLabels[language][1]}
          nodes={tier2}
          language={language}
          onComplete={completeNode}
        />

        {/* Connectors: Tier 2 → Tier 3 */}
        <TierConnectors upperTier={tier2} lowerTier={tier3} />

        {/* Tier 3 — Advanced */}
        <TierRow
          label={activeCfg.tierLabels[language][2]}
          nodes={tier3}
          language={language}
          onComplete={completeNode}
        />

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TierRow — one horizontal row of nodes with a tier label
// ─────────────────────────────────────────────────────────────────────────────

interface TierRowProps {
  label: string
  nodes: MilestoneWithStatus[]
  language: Language
  onComplete: (id: string) => void
}

function TierRow({ label, nodes, language, onComplete }: TierRowProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Tier label pill */}
      <span className="rounded-full bg-secondary px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>

      {/* Node grid — always 3 equal columns */}
      <div className="grid w-full grid-cols-3 place-items-center gap-2">
        {nodes.map((node) => (
          <MilestoneNodeCard
            key={node.id}
            node={node}
            language={language}
            onComplete={onComplete}
          />
        ))}
      </div>
    </div>
  )
}
