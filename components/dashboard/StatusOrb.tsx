'use client'

import { HP_MAX, AP_MAX, SAN_MAX } from '@/lib/tasks'

interface Props {
  hp: number
  ap: number
  san: number
  size?: number
}

const CX = 110
const CY = 110

const RINGS = [
  {
    key: 'HP',
    radius: 92,
    width: 9,
    color: '#10b981',
    trackColor: 'rgba(16,185,129,0.08)',
    glowId: 'glow-hp',
    max: HP_MAX,
  },
  {
    key: 'AP',
    radius: 70,
    width: 9,
    color: '#3b82f6',
    trackColor: 'rgba(59,130,246,0.08)',
    glowId: 'glow-ap',
    max: AP_MAX,
  },
  {
    key: 'SAN',
    radius: 48,
    width: 9,
    color: '#a855f7',
    trackColor: 'rgba(168,85,247,0.08)',
    glowId: 'glow-san',
    max: SAN_MAX,
  },
]

function phaseThresholds(ring: typeof RINGS[0]) {
  if (ring.key === 'HP') return [25, 46, 65]
  if (ring.key === 'AP') return [26, 55, 75]
  return [5, 17, 27]
}

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export function StatusOrb({ hp, ap, san, size = 220 }: Props) {
  const values: Record<string, number> = { HP: hp, AP: ap, SAN: san }

  return (
    <svg
      viewBox={`0 0 ${CX * 2} ${CY * 2}`}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <defs>
        {RINGS.map(ring => (
          <filter key={ring.glowId} id={ring.glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
        {/* Outer ambient glow */}
        <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(168,85,247,0.12)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0)" />
        </radialGradient>
      </defs>

      {/* Ambient center glow */}
      <circle cx={CX} cy={CY} r={38} fill="url(#center-glow)" />

      {RINGS.map(ring => {
        const val = Math.min(values[ring.key] ?? 0, ring.max)
        const progress = val / ring.max
        const circumference = 2 * Math.PI * ring.radius
        const dashOffset = circumference * (1 - progress)
        const thresholds = phaseThresholds(ring)

        return (
          <g key={ring.key}>
            {/* Background track */}
            <circle
              cx={CX} cy={CY} r={ring.radius}
              fill="none"
              stroke={ring.trackColor}
              strokeWidth={ring.width}
            />

            {/* Phase threshold tick marks */}
            {thresholds.map(thresh => {
              const angleDeg = (thresh / ring.max) * 360 - 90
              const inner = polarPoint(CX, CY, ring.radius - ring.width / 2 - 2, angleDeg)
              const outer = polarPoint(CX, CY, ring.radius + ring.width / 2 + 2, angleDeg)
              return (
                <line
                  key={thresh}
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
              )
            })}

            {/* Progress arc */}
            <circle
              cx={CX} cy={CY} r={ring.radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={ring.width}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${CX} ${CY})`}
              filter={`url(#${ring.glowId})`}
              className="arc-progress"
            />

          </g>
        )
      })}

      {/* Center dot */}
      <circle cx={CX} cy={CY} r={3} fill="rgba(255,255,255,0.25)" />
    </svg>
  )
}
