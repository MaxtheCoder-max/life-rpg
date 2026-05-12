'use client'

import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'
import { HP_TASKS, AP_TASKS, SAN_TASKS, HP_MAX, AP_MAX, SAN_MAX } from '@/lib/tasks'
import { getHPPhase, getAPPhase, getSANPhase } from '@/lib/tasks'
import { TaskCard } from '@/components/tasks/TaskCard'

import type { Task } from '@/types'

type TabKey = 'HP' | 'AP' | 'SAN'

const GROUPS = [
  {
    key: 'HP' as const,
    title: '生命体征',
    icon: '❤️',
    color: '#10b981',
    dimColor: 'rgba(16,185,129,0.08)',
    borderColor: 'rgba(16,185,129,0.2)',
    tasks: HP_TASKS,
    max: HP_MAX,
    getPhase: getHPPhase,
  },
  {
    key: 'AP' as const,
    title: '行动效率',
    icon: '⚡',
    color: '#3b82f6',
    dimColor: 'rgba(59,130,246,0.08)',
    borderColor: 'rgba(59,130,246,0.2)',
    tasks: AP_TASKS,
    max: AP_MAX,
    getPhase: getAPPhase,
  },
  {
    key: 'SAN' as const,
    title: '精神状态',
    icon: '✦',
    color: '#a855f7',
    dimColor: 'rgba(168,85,247,0.08)',
    borderColor: 'rgba(168,85,247,0.2)',
    tasks: SAN_TASKS,
    max: SAN_MAX,
    getPhase: getSANPhase,
  },
]

/** Sort task IDs: uncompleted first, then completed, preserving relative order within each group */
function computeSortedIds(tasks: Task[], completedIds: Set<string>): string[] {
  const uncompleted = tasks.filter(t => !completedIds.has(t.id)).map(t => t.id)
  const completed   = tasks.filter(t =>  completedIds.has(t.id)).map(t => t.id)
  return [...uncompleted, ...completed]
}

export default function TasksPage() {
  const { state, toggleTask, isCompleted } = useStore()
  const { today } = state
  const { hp, ap, san } = today

  const completedSet = new Set(today.completedTaskIds)

  const [activeTab, setActiveTab] = useState<TabKey>('HP')

  // Stable display order per tab — re-sorted with uncompleted first each time you arrive
  const [taskOrder, setTaskOrder] = useState<Record<TabKey, string[]>>(() => ({
    HP:  computeSortedIds(HP_TASKS, completedSet),
    AP:  computeSortedIds(AP_TASKS, completedSet),
    SAN: computeSortedIds(SAN_TASKS, completedSet),
  }))

  // Track previous tab so we can re-sort it when leaving
  const prevTabRef = useRef<TabKey>(activeTab)

  function switchTab(newTab: TabKey) {
    if (newTab === activeTab) return
    // Re-sort the tab we're leaving (uncompleted first)
    const leavingGroup = GROUPS.find(g => g.key === activeTab)!
    setTaskOrder(prev => ({
      ...prev,
      [activeTab]: computeSortedIds(leavingGroup.tasks, completedSet),
    }))
    prevTabRef.current = activeTab
    setActiveTab(newTab)
  }

  // Also re-sort when navigating back to this page (completedSet may have changed)
  useEffect(() => {
    setTaskOrder(prev => ({
      ...prev,
      [activeTab]: computeSortedIds(
        GROUPS.find(g => g.key === activeTab)!.tasks,
        completedSet
      ),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally run only on mount

  const resourceValues: Record<TabKey, number> = { HP: hp, AP: ap, SAN: san }
  const activeGroup = GROUPS.find(g => g.key === activeTab)!

  // Ordered task list for current tab
  const orderedTasks = taskOrder[activeTab]
    .map(id => activeGroup.tasks.find(t => t.id === id))
    .filter((t): t is Task => t !== undefined)

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-4">
        <p className="text-[11px] font-medium tracking-widest uppercase mb-1" style={{ color: '#475569' }}>
          DAILY TASKS
        </p>
        <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>今日任务</h1>
        <p className="text-xs mt-1" style={{ color: '#374151' }}>
          点击行为即可记录，随时可以取消 · 没有惩罚
        </p>
      </header>

      {/* ── Tab selector ── */}
      <div className="px-4 mb-4 flex gap-2 items-stretch">
        {GROUPS.map(group => {
          const isActive  = group.key === activeTab
          const val       = resourceValues[group.key]
          const pct       = Math.min((val / group.max) * 100, 100)
          const phase     = group.getPhase(val)
          const doneCnt   = group.tasks.filter(t => completedSet.has(t.id)).length

          if (isActive) {
            // ── Expanded rectangle ──────────────────────────────
            return (
              <div
                key={group.key}
                className="flex-1 rounded-2xl p-4 flex flex-col justify-between"
                style={{
                  background: group.dimColor,
                  border: `1px solid ${group.borderColor}`,
                  minHeight: 76,
                }}
              >
                {/* Title row */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{group.icon}</span>
                    <span className="text-sm font-bold" style={{ color: group.color }}>
                      {group.title}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold tabular-nums leading-none" style={{ color: group.color }}>
                      {val}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
                      {phase.label}
                    </div>
                  </div>
                </div>

                {/* Progress bar + count */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: group.color,
                        transition: 'width 0.5s ease-out',
                      }}
                    />
                  </div>
                  <span className="text-[10px] tabular-nums whitespace-nowrap" style={{ color: '#475569' }}>
                    {doneCnt} / {group.tasks.length}
                  </span>
                </div>
              </div>
            )
          }

          // ── Collapsed square ────────────────────────────────
          return (
            <button
              key={group.key}
              onClick={() => switchTab(group.key)}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl active:scale-95 transition-transform"
              style={{
                width: 60,
                minHeight: 76,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                flexShrink: 0,
              }}
            >
              <span className="text-xl leading-none">{group.icon}</span>
              {/* Tiny progress bar — no number */}
              <div
                className="rounded-full overflow-hidden"
                style={{ width: 32, height: 3, background: 'rgba(255,255,255,0.07)' }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: group.color,
                    borderRadius: 9999,
                    transition: 'width 0.5s ease-out',
                  }}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Task list (active tab) ── */}
      <div className="px-4 flex flex-col gap-1.5">
        {orderedTasks.map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            completed={isCompleted(task.id)}
            onToggle={() => toggleTask(task.id)}
          />
        ))}
      </div>

      {/* ── Bottom hint ── */}
      <div className="px-4 mt-5 mb-2">
        <div
          className="rounded-2xl px-4 py-3 flex items-start gap-2"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span className="text-sm">🔄</span>
          <p className="text-[11px] leading-relaxed" style={{ color: '#374151' }}>
            切换栏目时，未完成的任务自动置顶 · 每天零点重置 · 不会因为断签被惩罚
          </p>
        </div>
      </div>

    </div>
  )
}
