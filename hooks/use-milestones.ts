'use client'

// ─────────────────────────────────────────────────────────────────────────────
// hooks/use-milestones.ts
//
// Manages a named user's Life Map progress.
// Progress is stored in localStorage so it persists between sessions with
// no login required. Each user name gets its own isolated storage key.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ALL_MILESTONES,
  detectMilestonesInText,
  getMilestonesByTopic,
  type MilestoneNode,
  type NodeStatus,
  type Topic,
} from '@/lib/milestones'

// ── Types ────────────────────────────────────────────────────────────────────

export interface MilestoneWithStatus extends MilestoneNode {
  status: NodeStatus
}

export interface UseMilestonesReturn {
  /** All nodes for a given topic, each decorated with its current status. */
  getNodesForTopic: (topic: Topic) => MilestoneWithStatus[]
  /** Mark a single node as complete. Silently ignored if already complete. */
  completeNode: (id: string) => void
  /** Get the status of any single node by ID. */
  getStatus: (id: string) => NodeStatus
  /**
   * Scan an AI message string and auto-complete any node whose keywords
   * appear in the text. Returns the IDs that were newly completed.
   */
  processAiMessage: (text: string) => string[]
  /** Number of completed nodes across all topics. */
  totalCompleted: number
  /** Total number of nodes across all topics. */
  totalNodes: number
}

// ── Storage helpers ───────────────────────────────────────────────────────────

const storageKey = (name: string) =>
  `camino:progress:${name.trim().toLowerCase()}`

function loadCompleted(name: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(storageKey(name))
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return new Set<string>(parsed)
  } catch {
    // Corrupted storage — start fresh rather than crashing
    console.warn('[useMilestones] Could not parse saved progress. Starting fresh.')
  }
  return new Set()
}

function saveCompleted(name: string, ids: Set<string>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(storageKey(name), JSON.stringify([...ids]))
  } catch (e) {
    // localStorage may be full or blocked (e.g., private browsing on some browsers)
    console.warn('[useMilestones] Could not save progress:', e)
  }
}

// ── Core hook ─────────────────────────────────────────────────────────────────

/**
 * @param userName - The name the user entered in the chat onboarding flow.
 *                   Pass an empty string before the user has entered their name;
 *                   the hook will start returning data once a non-empty name is set.
 */
export function useMilestones(userName: string): UseMilestonesReturn {
  const [completedIds, setCompletedIds] = useState<Set<string>>(() =>
    loadCompleted(userName),
  )

  // Re-load from storage whenever the user name changes
  // (e.g., the user restarts the chat and enters a different name)
  useEffect(() => {
    if (!userName) return
    setCompletedIds(loadCompleted(userName))
  }, [userName])

  // ── Derived: which node IDs are currently unlocked ──────────────────────
  const unlockedIds = useMemo<Set<string>>(() => {
    const unlocked = new Set<string>()
    for (const node of ALL_MILESTONES) {
      const alreadyDone = completedIds.has(node.id)
      if (alreadyDone) continue
      const prereqsMet = node.dependsOn.every((dep) => completedIds.has(dep))
      if (prereqsMet) unlocked.add(node.id)
    }
    return unlocked
  }, [completedIds])

  // ── getStatus ────────────────────────────────────────────────────────────
  const getStatus = useCallback(
    (id: string): NodeStatus => {
      if (completedIds.has(id)) return 'complete'
      if (unlockedIds.has(id)) return 'unlocked'
      return 'locked'
    },
    [completedIds, unlockedIds],
  )

  // ── completeNode ─────────────────────────────────────────────────────────
  const completeNode = useCallback(
    (id: string) => {
      // Guard: only complete nodes that actually exist
      const nodeExists = ALL_MILESTONES.some((n) => n.id === id)
      if (!nodeExists) {
        console.warn(`[useMilestones] Unknown node id: "${id}"`)
        return
      }
      if (completedIds.has(id)) return // already complete — no-op

      setCompletedIds((prev) => {
        const next = new Set(prev)
        next.add(id)
        saveCompleted(userName, next)
        return next
      })
    },
    [completedIds, userName],
  )

  // ── processAiMessage ─────────────────────────────────────────────────────
  const processAiMessage = useCallback(
    (text: string): string[] => {
      if (!text) return []
      const detectedIds = detectMilestonesInText(text)

      // Only auto-complete nodes that are currently unlocked (not locked)
      // to prevent skipping the tier progression system
      const newlyCompleted = detectedIds.filter(
        (id) => unlockedIds.has(id) && !completedIds.has(id),
      )

      if (newlyCompleted.length === 0) return []

      setCompletedIds((prev) => {
        const next = new Set(prev)
        for (const id of newlyCompleted) next.add(id)
        saveCompleted(userName, next)
        return next
      })

      return newlyCompleted
    },
    [completedIds, unlockedIds, userName],
  )

  // ── getNodesForTopic ─────────────────────────────────────────────────────
  const getNodesForTopic = useCallback(
    (topic: Topic): MilestoneWithStatus[] => {
      return getMilestonesByTopic(topic).map((node) => ({
        ...node,
        status: getStatus(node.id),
      }))
    },
    [getStatus],
  )

  // ── Totals ───────────────────────────────────────────────────────────────
  const totalCompleted = completedIds.size
  const totalNodes = ALL_MILESTONES.length

  return {
    getNodesForTopic,
    completeNode,
    getStatus,
    processAiMessage,
    totalCompleted,
    totalNodes,
  }
}
