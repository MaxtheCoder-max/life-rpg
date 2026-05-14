'use client'

import { useStore } from '@/lib/store'
import { STATUS_CONFIGS, formatDateKey } from '@/lib/status'
import { HP_MAX, AP_MAX, SAN_MAX } from '@/lib/tasks'

import type { DayRecord } from '@/types'

// ── Mini SVG line chart ──────────────────────────────────────────
function TrendLine({
  records,
  width = 300,
  height = 120,
}: {
  records: DayRecord[]
  width?: number
  height?: number
}) {
  if (records.length < 2) {
    return (
      <div className="flex items-center justify-center h-28" style={{ color: '#374151' }}>
        <p className="text-sm">数据积累中…至少需要 2 天的记录</p>
      </div>
    )
  }

  const padL = 8, padR = 16, padT = 12, padB = 8
  const W = width - padL - padR
  const H = height - padT - padB

  const lines = [
    { key: 'hp' as const, max: HP_MAX, color: '#10b981', label: 'HP' },
    { key: 'ap' as const, max: AP_MAX, color: '#3b82f6', label: 'AP' },
    { key: 'san' as const, max: SAN_MAX, color: '#a855f7', label: 'SAN' },
  ]

  const n = records.length
  const xStep = n > 1 ? W / (n - 1) : W

  function pts(values: number[], max: number) {
    return values
      .map((v, i) => {
        const x = padL + i * xStep
        const y = padT + H - (Math.min(v, max) / max) * H
        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(t => {
        const y = padT + H - t * H
        return (
          <line
            key={t}
            x1={padL} y1={y} x2={padL + W} y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        )
      })}

      {/* Data lines */}
      {lines.map(line => {
        const values = records.map(r => r[line.key])
        const pointsStr = pts(values, line.max)
        return (
          <g key={line.key}>
            <polyline
              points={pointsStr}
              fill="none"
              stroke={line.color}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Dots */}
            {values.map((v, i) => (
              <circle
                key={i}
                cx={padL + i * xStep}
                cy={padT + H - (Math.min(v, line.max) / line.max) * H}
                r="2.5"
                fill={line.color}
                opacity="0.9"
              />
            ))}
          </g>
        )
      })}

      {/* Date labels */}
      {records.map((r, i) => {
        if (n > 7 && i % 2 !== 0) return null
        const x = padL + i * xStep
        const parts = r.date.split('-')
        const label = `${parseInt(parts[1])}/${parseInt(parts[2])}`
        return (
          <text
            key={i}
            x={x}
            y={height - 1}
            textAnchor="middle"
            fontSize="7"
            fill="#374151"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}

// ── Heatmap (GitHub-style) ────────────────────────────────────────
function HeatMap({ records }: { records: DayRecord[] }) {
  const today = new Date()
  const WEEKS = 14
  const DAYS = WEEKS * 7

  // Build date → record map
  const recordMap: Record<string, DayRecord> = {}
  for (const r of records) {
    recordMap[r.date] = r
  }

  // Generate last DAYS days
  const cells: Array<{ date: string; record?: DayRecord }> = []
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    cells.push({ date: key, record: recordMap[key] })
  }

  function cellColor(cell: typeof cells[0]) {
    if (!cell.record) return 'rgba(255,255,255,0.04)'
    const { status } = cell.record
    const cfg = STATUS_CONFIGS[status]
    const idx = cfg.index
    if (idx >= 10) return `${cfg.color}cc`
    if (idx >= 8)  return `${cfg.color}88`
    if (idx >= 6)  return `${cfg.color}55`
    if (idx >= 4)  return `${cfg.color}33`
    if (idx >= 2)  return `${cfg.color}1a`
    return 'rgba(255,255,255,0.04)'
  }

  // Group into weeks (columns)
  const weeks: typeof cells[] = []
  for (let i = 0; i < WEEKS; i++) {
    weeks.push(cells.slice(i * 7, (i + 1) * 7))
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex gap-1" style={{ width: `${WEEKS * 14}px` }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell, di) => (
              <div
                key={di}
                title={cell.date + (cell.record ? ` · ${STATUS_CONFIGS[cell.record.status].name}` : '')}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 2,
                  background: cellColor(cell),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Summary stats ─────────────────────────────────────────────────
function SummaryStats({ records }: { records: DayRecord[] }) {
  if (records.length === 0) return null

  const recent = records.slice(0, 30)
  const avgHP  = Math.round(recent.reduce((s, r) => s + r.hp, 0)  / recent.length)
  const avgAP  = Math.round(recent.reduce((s, r) => s + r.ap, 0)  / recent.length)
  const avgSAN = Math.round(recent.reduce((s, r) => s + r.san, 0) / recent.length)

  const best = recent.reduce((a, b) =>
    STATUS_CONFIGS[a.status].index >= STATUS_CONFIGS[b.status].index ? a : b
  )

  const activeDays = recent.filter(r => r.hp > 0 || r.ap > 0 || r.san > 0).length

  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: '30天活跃',  value: `${activeDays} 天`,   color: '#c084fc' },
        { label: '最高状态',  value: STATUS_CONFIGS[best.status].name, color: STATUS_CONFIGS[best.status].color },
        { label: '平均 HP',   value: avgHP,  color: '#10b981' },
        { label: '平均 AP',   value: avgAP,  color: '#3b82f6' },
        { label: '平均 SAN',  value: avgSAN, color: '#a855f7' },
        { label: '累计记录',  value: `${records.length} 天`, color: '#64748b' },
      ].map(item => (
        <div
          key={item.label}
          className="rounded-2xl p-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-[10px] mb-1" style={{ color: '#374151' }}>{item.label}</p>
          <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
        </div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────
export default function StatsPage() {
  const { state } = useStore()

  // Build full records list: today + history, most recent first
  const allRecords = [state.today, ...state.history].filter(
    r => r.hp > 0 || r.ap > 0 || r.san > 0
  )
  const recent7 = allRecords.slice(0, 7).reverse()

  // Legend entries
  const legendItems = [
    { color: '#10b981', label: 'HP' },
    { color: '#3b82f6', label: 'AP' },
    { color: '#a855f7', label: 'SAN' },
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-5">
        <p className="text-[11px] font-medium tracking-widest uppercase mb-1" style={{ color: '#475569' }}>
          STATISTICS
        </p>
        <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>数据统计</h1>
        <p className="text-xs mt-1" style={{ color: '#374151' }}>本地数据 · 隐私优先</p>
      </header>

      <div className="px-4 flex flex-col gap-5">
        {/* ── 7-day trend ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium tracking-widest uppercase" style={{ color: '#475569' }}>
              近 7 日趋势
            </h2>
            <div className="flex gap-3">
              {legendItems.map(l => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-[10px]" style={{ color: '#475569' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="rounded-2xl p-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <TrendLine records={recent7} />
          </div>
        </section>

        {/* ── Activity heatmap ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium tracking-widest uppercase" style={{ color: '#475569' }}>
              活跃热力图
            </h2>
            <div className="flex items-center gap-1">
              <span className="text-[10px]" style={{ color: '#374151' }}>低</span>
              {['rgba(255,255,255,0.04)', 'rgba(192,132,252,0.2)', 'rgba(192,132,252,0.5)', 'rgba(192,132,252,0.8)'].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
              ))}
              <span className="text-[10px]" style={{ color: '#374151' }}>高</span>
            </div>
          </div>
          <div
            className="rounded-2xl p-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <HeatMap records={[state.today, ...state.history]} />
          </div>
        </section>

        {/* ── Summary ── */}
        <section>
          <h2 className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#475569' }}>
            综合概况
          </h2>
          {allRecords.length > 0 ? (
            <SummaryStats records={allRecords} />
          ) : (
            <div
              className="rounded-2xl px-4 py-8 text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <p className="text-2xl mb-2">📊</p>
              <p className="text-sm" style={{ color: '#374151' }}>先去记录几天的行为，统计就会出现在这里</p>
            </div>
          )}
        </section>

        {/* ── Status color legend ── */}
        <section>
          <h2 className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#475569' }}>
            状态图例
          </h2>
          <div className="flex flex-col gap-1.5">
            {Object.values(STATUS_CONFIGS).map(cfg => (
              <div
                key={cfg.key}
                className="flex items-center justify-between rounded-xl px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cfg.emoji}</span>
                  <span className="text-xs font-medium" style={{ color: cfg.color }}>{cfg.name}</span>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: `${cfg.color}15`, color: cfg.color }}
                >
                  #{cfg.index.toString().padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  )
}
