'use client'

import type { PlantShape, PlantTheme } from '@/types/seeds'
import { THEME_COLORS } from '@/lib/seedStore'

interface Props {
  shape: PlantShape
  theme: PlantTheme
  growthLevel: number
  size?: number
  animate?: boolean
}

// ── Succulent (多肉植物) ─────────────────────────────────────────
function Succulent({ p: p0, s, l }: { p: string; s: string; l: number }) {
  const leafCounts = [2, 4, 6, 6]
  const count = leafCounts[l]
  const angles = Array.from({ length: count }, (_, i) => (360 / count) * i)
  const r = 22
  const scale = l === 0 ? 0.55 : l === 1 ? 0.75 : 1

  return (
    <g transform={`translate(50,50) scale(${scale}) translate(-50,-50)`}>
      {/* Outer leaves */}
      {angles.map(a => {
        const rad = ((a - 90) * Math.PI) / 180
        const cx = 50 + r * Math.cos(rad)
        const cy = 50 + r * Math.sin(rad)
        return (
          <ellipse
            key={a}
            cx={cx} cy={cy}
            rx={7} ry={14}
            fill={p0}
            opacity={0.82}
            transform={`rotate(${a},${cx},${cy})`}
          />
        )
      })}
      {/* Inner secondary ring (level 3 only) */}
      {l === 3 &&
        Array.from({ length: 6 }, (_, i) => (360 / 6) * i + 30).map(a => {
          const rad = ((a - 90) * Math.PI) / 180
          const cx = 50 + 12 * Math.cos(rad)
          const cy = 50 + 12 * Math.sin(rad)
          return (
            <ellipse key={a} cx={cx} cy={cy} rx={4} ry={8}
              fill={s} opacity={0.7} transform={`rotate(${a},${cx},${cy})`} />
          )
        })}
      {/* Center */}
      <circle cx={50} cy={50} r={l >= 2 ? 8 : 6} fill={s} opacity={0.95} />
      {l === 3 && <circle cx={50} cy={50} r={4} fill="rgba(255,255,255,0.5)" />}
    </g>
  )
}

// ── Flower (花) ─────────────────────────────────────────────────
function Flower({ p: p0, s, l }: { p: string; s: string; l: number }) {
  if (l === 0) {
    // Closed bud on a stem
    return (
      <g>
        <line x1={50} y1={80} x2={50} y2={52} stroke={s} strokeWidth={2.5} strokeLinecap="round" />
        <ellipse cx={50} cy={40} rx={7} ry={16} fill={p0} opacity={0.9} />
        <ellipse cx={50} cy={38} rx={5} ry={13} fill={s} opacity={0.6} />
      </g>
    )
  }

  const petalCount = l === 1 ? 3 : 5
  const outerAngles = Array.from({ length: petalCount }, (_, i) => (360 / petalCount) * i)
  const pr = 18 // petal center distance from plant center
  const scale = l === 1 ? 0.8 : 1

  return (
    <g transform={`translate(50,50) scale(${scale}) translate(-50,-50)`}>
      {/* Stem */}
      <line x1={50} y1={80} x2={50} y2={58} stroke={s} strokeWidth={2.5} strokeLinecap="round" />
      {/* Outer petals */}
      {outerAngles.map(a => {
        const rad = ((a - 90) * Math.PI) / 180
        const cx = 50 + pr * Math.cos(rad)
        const cy = 50 + pr * Math.sin(rad)
        return (
          <ellipse key={a} cx={cx} cy={cy} rx={8} ry={14}
            fill={p0} opacity={0.8} transform={`rotate(${a},${cx},${cy})`} />
        )
      })}
      {/* Inner petal ring (level 3) */}
      {l === 3 &&
        Array.from({ length: 5 }, (_, i) => (360 / 5) * i + 36).map(a => {
          const rad = ((a - 90) * Math.PI) / 180
          const cx = 50 + 12 * Math.cos(rad)
          const cy = 50 + 12 * Math.sin(rad)
          return (
            <ellipse key={a} cx={cx} cy={cy} rx={5} ry={9}
              fill={s} opacity={0.75} transform={`rotate(${a},${cx},${cy})`} />
          )
        })}
      {/* Center */}
      <circle cx={50} cy={50} r={8} fill={s} />
      {l === 3 && (
        <>
          <circle cx={50} cy={50} r={5} fill="rgba(255,240,100,0.7)" />
          {Array.from({ length: 8 }, (_, i) => (360 / 8) * i).map(a => {
            const rad = ((a - 90) * Math.PI) / 180
            return <circle key={a} cx={50 + 11 * Math.cos(rad)} cy={50 + 11 * Math.sin(rad)}
              r={1.5} fill={s} opacity={0.9} />
          })}
        </>
      )}
    </g>
  )
}

// ── Fern (蕨类) ─────────────────────────────────────────────────
function Fern({ p: p0, s, l }: { p: string; s: string; l: number }) {
  // frond = { cx1,cy1 = bezier control, x2,y2 = tip }
  const fronds = [
    { x2: 50, y2: 22, cx: 50, cy: 52 },      // center up
    { x2: 25, y2: 32, cx: 38, cy: 58 },       // left
    { x2: 75, y2: 32, cx: 62, cy: 58 },       // right
    { x2: 18, y2: 52, cx: 28, cy: 68 },       // far left
  ]
  const visibleFronds = l === 0 ? 1 : l === 1 ? 2 : l === 2 ? 3 : 4
  const scale = l === 0 ? 0.65 : l === 1 ? 0.8 : 1

  return (
    <g transform={`translate(50,80) scale(${scale}) translate(-50,-80)`}>
      {fronds.slice(0, visibleFronds).map((f, fi) => {
        const steps = l <= 1 ? 3 : 4
        // Quadratic bezier leaflets
        const leaflets = Array.from({ length: steps }, (_, i) => {
          const t = (i + 1) / (steps + 1)
          const mt = 1 - t
          const lx = mt * mt * 50 + 2 * mt * t * f.cx + t * t * f.x2
          const ly = mt * mt * 80 + 2 * mt * t * f.cy + t * t * f.y2
          const dx = 2 * mt * (f.cx - 50) + 2 * t * (f.x2 - f.cx)
          const dy = 2 * mt * (f.cy - 80) + 2 * t * (f.y2 - f.cy)
          const tang = (Math.atan2(dy, dx) * 180) / Math.PI
          return { lx, ly, tang }
        })
        return (
          <g key={fi}>
            {/* Stem */}
            <path
              d={`M 50,80 Q ${f.cx},${f.cy} ${f.x2},${f.y2}`}
              stroke={p0} strokeWidth={l <= 1 ? 1.8 : 2}
              fill="none" strokeLinecap="round"
            />
            {/* Leaflets on each side */}
            {leaflets.map(({ lx, ly, tang }, li) => (
              <g key={li}>
                <ellipse cx={lx} cy={ly} rx={2.5} ry={6}
                  fill={p0} opacity={0.72}
                  transform={`rotate(${tang - 80},${lx},${ly})`} />
                <ellipse cx={lx} cy={ly} rx={2.5} ry={6}
                  fill={p0} opacity={0.72}
                  transform={`rotate(${tang + 80},${lx},${ly})`} />
              </g>
            ))}
          </g>
        )
      })}
      {/* Spore dots for blooming */}
      {l === 3 && [
        [50, 30], [28, 42], [72, 42], [22, 58],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5} fill={s} opacity={0.6} />
      ))}
    </g>
  )
}

// ── Tree (树) ─────────────────────────────────────────────────
function Tree({ p: p0, s, l }: { p: string; s: string; l: number }) {
  if (l === 0) {
    return (
      <g>
        <line x1={50} y1={80} x2={50} y2={62} stroke={p0} strokeWidth={3} strokeLinecap="round" />
        <ellipse cx={43} cy={58} rx={5} ry={8} fill={p0} opacity={0.8} transform="rotate(-30,43,58)" />
        <ellipse cx={57} cy={58} rx={5} ry={8} fill={p0} opacity={0.8} transform="rotate(30,57,58)" />
      </g>
    )
  }
  if (l === 1) {
    return (
      <g>
        <rect x={47} y={62} width={6} height={20} rx={3} fill={p0} opacity={0.7} />
        <circle cx={50} cy={52} r={14} fill={p0} opacity={0.75} />
        <circle cx={50} cy={48} r={10} fill={s} opacity={0.5} />
      </g>
    )
  }

  const blossoms = l === 3
    ? [[38, 38], [57, 34], [64, 48], [40, 52], [55, 55], [50, 28]] as const
    : []

  return (
    <g>
      {/* Trunk */}
      <rect x={46} y={62} width={8} height={22} rx={4} fill={p0} opacity={0.75} />
      {/* Canopy */}
      <circle cx={50} cy={48} r={22} fill={p0} opacity={0.72} />
      <circle cx={36} cy={54} r={14} fill={p0} opacity={0.65} />
      <circle cx={64} cy={54} r={14} fill={p0} opacity={0.65} />
      <circle cx={50} cy={34} r={14} fill={s} opacity={0.55} />
      {/* Blossoms */}
      {blossoms.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill={s} opacity={0.85} />
      ))}
      {l === 3 && blossoms.map(([x, y], i) => (
        <circle key={`c${i}`} cx={x} cy={y} r={1.5} fill="rgba(255,255,255,0.6)" />
      ))}
    </g>
  )
}

// ── Bloom glow filter ─────────────────────────────────────────
const GLOW_ID = 'plant-glow'

// ── Main export ───────────────────────────────────────────────
export function PlantSvg({ shape, theme, growthLevel, size = 120, animate = false }: Props) {
  const colors = THEME_COLORS[theme]
  const p = colors.primary
  const s = colors.light
  const isBloom = growthLevel === 3

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={animate ? 'plant-float' : undefined}
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        <filter id={GLOW_ID} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={isBloom ? '3' : '1.5'} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p} stopOpacity={isBloom ? 0.12 : 0.06} />
          <stop offset="100%" stopColor={p} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Subtle ambient glow behind plant */}
      <circle cx={50} cy={50} r={44} fill="url(#bg-glow)" />

      <g filter={`url(#${GLOW_ID})`}>
        {shape === 'succulent' && <Succulent p={p} s={s} l={growthLevel} />}
        {shape === 'flower'    && <Flower    p={p} s={s} l={growthLevel} />}
        {shape === 'fern'      && <Fern      p={p} s={s} l={growthLevel} />}
        {shape === 'tree'      && <Tree      p={p} s={s} l={growthLevel} />}
      </g>
    </svg>
  )
}
