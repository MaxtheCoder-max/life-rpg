'use client'

interface Props {
  type: 'HP' | 'AP' | 'SAN'
  value: number
  max: number
  phase: string
  label: string
  icon: string
}

const COLORS = {
  HP: {
    bar: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
    text: '#10b981',
    track: 'rgba(16,185,129,0.1)',
    badge: 'rgba(16,185,129,0.12)',
    badgeText: '#34d399',
  },
  AP: {
    bar: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa)',
    text: '#3b82f6',
    track: 'rgba(59,130,246,0.1)',
    badge: 'rgba(59,130,246,0.12)',
    badgeText: '#60a5fa',
  },
  SAN: {
    bar: 'linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)',
    text: '#a855f7',
    track: 'rgba(168,85,247,0.1)',
    badge: 'rgba(168,85,247,0.12)',
    badgeText: '#c084fc',
  },
}

export function ResourceBar({ type, value, max, phase, label, icon }: Props) {
  const c = COLORS[type]
  const pct = Math.min((value / max) * 100, 100)
  const overflow = value > max

  return (
    <div
      className="rounded-2xl p-4 anim-in"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-medium" style={{ color: '#cbd5e1' }}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tabular-nums" style={{ color: c.text }}>
            {value}
          </span>
          <span className="text-xs" style={{ color: '#475569' }}>/{max}</span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: c.badge, color: c.badgeText }}
          >
            {phase}
          </span>
          {overflow && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-bold"
              style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
            >
              MAX
            </span>
          )}
        </div>
      </div>

      {/* Progress track */}
      <div
        className="h-2 rounded-full overflow-hidden relative"
        style={{ background: c.track }}
      >
        <div
          className="h-full rounded-full bar-shimmer"
          style={{
            width: `${pct}%`,
            background: c.bar,
            transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </div>
    </div>
  )
}
