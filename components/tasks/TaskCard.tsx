'use client'

import type { Task } from '@/types'

interface Props {
  task: Task
  completed: boolean
  onToggle: () => void
}

const RESOURCE_STYLES = {
  HP: {
    valueBg:   'rgba(16,185,129,0.1)',
    valueText: '#34d399',
    checkBg:   '#10b981',
    ringColor: 'rgba(16,185,129,0.4)',
  },
  AP: {
    valueBg:   'rgba(59,130,246,0.1)',
    valueText: '#60a5fa',
    checkBg:   '#3b82f6',
    ringColor: 'rgba(59,130,246,0.4)',
  },
  SAN: {
    valueBg:   'rgba(168,85,247,0.1)',
    valueText: '#c084fc',
    checkBg:   '#a855f7',
    ringColor: 'rgba(168,85,247,0.4)',
  },
}

export function TaskCard({ task, completed, onToggle }: Props) {
  const s = RESOURCE_STYLES[task.resource]

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 active:scale-[0.98]"
      style={{
        background: completed ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${completed ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
      }}
    >
      {/* Checkbox */}
      <div
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: completed ? s.checkBg : 'transparent',
          border: `1.5px solid ${completed ? s.checkBg : 'rgba(255,255,255,0.2)'}`,
          boxShadow: completed ? `0 0 8px ${s.ringColor}` : 'none',
        }}
      >
        {completed && (
          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Task name */}
      <div className="flex-1 min-w-0">
        <span
          className="text-sm font-medium block truncate transition-colors duration-200"
          style={{ color: completed ? '#475569' : '#cbd5e1' }}
        >
          {task.name}
        </span>
        {task.note && (
          <span className="text-[11px] mt-0.5 block" style={{ color: '#374151' }}>
            {task.note}
          </span>
        )}
      </div>

      {/* Value badge */}
      <div
        className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-lg tabular-nums"
        style={{
          background: completed ? 'transparent' : s.valueBg,
          color: completed ? '#374151' : s.valueText,
        }}
      >
        +{task.value} {task.resource}
      </div>
    </button>
  )
}
