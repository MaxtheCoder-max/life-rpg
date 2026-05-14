'use client'

import { useStore } from '@/lib/store'
import { STATUS_CONFIGS, formatDateKey, getWeekday } from '@/lib/status'
import { HP_MAX, AP_MAX, SAN_MAX, getHPPhase, getAPPhase, getSANPhase, ALL_TASKS } from '@/lib/tasks'
import { StatusOrb } from '@/components/dashboard/StatusOrb'
import Link from 'next/link'

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

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div className="h-full rounded-full"
        style={{ width: `${pct}%`, background: color, transition: 'width 0.8s ease-out' }}/>
    </div>
  )
}

const RESOURCE_META = [
  { key: 'HP'  as const, label: '生命体征', icon: '❤️', color: '#10b981', max: HP_MAX },
  { key: 'AP'  as const, label: '行动效率', icon: '⚡', color: '#3b82f6', max: AP_MAX },
  { key: 'SAN' as const, label: '精神状态', icon: '✦', color: '#a855f7', max: SAN_MAX },
]

// ── Page ──────────────────────────────────────────────────────────
export default function StatsPage() {
  const { state } = useStore()
  const { today, history } = state
  const { hp, ap, san, status, completedTaskIds, date } = today

  const cfg        = STATUS_CONFIGS[status]
  const hpPhase    = getHPPhase(hp)
  const apPhase    = getAPPhase(ap)
  const sanPhase   = getSANPhase(san)

  const completedTasks      = ALL_TASKS.filter(t => completedTaskIds.includes(t.id))
  const completedByResource = {
    HP:  completedTasks.filter(t => t.resource === 'HP'),
    AP:  completedTasks.filter(t => t.resource === 'AP'),
    SAN: completedTasks.filter(t => t.resource === 'SAN'),
  }
  const resourceValues: Record<string, number> = { HP: hp, AP: ap, SAN: san }
  const phases: Record<string, string> = {
    HP: hpPhase.label, AP: apPhase.label, SAN: sanPhase.label,
  }

  // Build full records list: today + history, most recent first
  const allRecords = [today, ...history].filter(
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
      <header className="px-5 pt-12 pb-4">
        <p className="text-[11px] font-medium tracking-widest uppercase mb-1" style={{ color: '#475569' }}>
          TODAY · STATISTICS
        </p>
        <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>今日</h1>
        <p className="text-xs mt-1" style={{ color: '#374151' }}>
          {formatDateKey(date)} · {getWeekday(date)}
        </p>
      </header>

      <div className="px-4 flex flex-col gap-5">
        {/* ── Status showcase ── */}
        <div className="rounded-3xl overflow-hidden relative"
          style={{
            background: `radial-gradient(ellipse at 50% 20%, ${cfg.dimColor}99 0%, #0d0d18 65%)`,
            border: `1px solid ${cfg.color}25`,
          }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}80, transparent)` }}/>
          <div className="flex flex-col items-center py-6 px-4">
            <div className="mb-3">
              <StatusOrb hp={hp} ap={ap} san={san} size={140}/>
            </div>
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1"
              style={{ color: cfg.color }}>
              STATE {cfg.index.toString().padStart(2,'0')} · {cfg.emoji}
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: cfg.color }}>{cfg.name}</h2>
            <p className="text-[13px] text-center leading-relaxed max-w-xs" style={{ color: '#64748b' }}>
              {cfg.comment}
            </p>
          </div>
        </div>

        {/* ── Resource summary ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          {RESOURCE_META.map((r, i) => {
            const val   = resourceValues[r.key]
            const phase = phases[r.key]
            const count = completedByResource[r.key].length
            return (
              <div key={r.key} className="px-4 py-3"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{r.icon}</span>
                    <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>{r.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#475569' }}>
                      {count} 项
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold tabular-nums" style={{ color: r.color }}>{val}</span>
                    <span className="text-xs" style={{ color: '#374151' }}>/{r.max}</span>
                    <span className="text-[11px]" style={{ color: '#475569' }}>{phase}</span>
                  </div>
                </div>
                <MiniBar value={val} max={r.max} color={r.color}/>
              </div>
            )
          })}
        </div>

        {/* ── Completed task tags ── */}
        {completedTasks.length > 0 ? (
          <div>
            <h3 className="text-xs font-medium mb-3 tracking-widest uppercase" style={{ color: '#374151' }}>
              今日已完成 · {completedTasks.length} 项
            </h3>
            <div className="flex flex-wrap gap-2">
              {completedTasks.map(task => {
                const bgColors: Record<string,string> = { HP:'rgba(16,185,129,0.1)', AP:'rgba(59,130,246,0.1)', SAN:'rgba(168,85,247,0.1)' }
                const txtColors: Record<string,string> = { HP:'#34d399', AP:'#60a5fa', SAN:'#c084fc' }
                return (
                  <span key={task.id} className="text-xs px-3 py-1.5 rounded-xl"
                    style={{ background: bgColors[task.resource], color: txtColors[task.resource] }}>
                    {task.name} +{task.value}
                  </span>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl px-4 py-5 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-sm" style={{ color: '#374151' }}>今天还没有记录任何行为</p>
            <Link href="/tasks" className="text-xs mt-1 block" style={{ color: '#c084fc' }}>
              去任务页随手打个卡 →
            </Link>
          </div>
        )}

        {/* ── History ── */}
        {history.length > 0 && (
          <div>
            <h3 className="text-xs font-medium mb-3 tracking-widest uppercase" style={{ color: '#374151' }}>
              近期记录
            </h3>
            <div className="flex flex-col gap-2">
              {history.slice(0, 5).map(rec => {
                const hcfg = STATUS_CONFIGS[rec.status]
                return (
                  <div key={rec.date}
                    className="rounded-xl px-4 py-3 flex items-center justify-between"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <span className="text-xs font-medium" style={{ color: '#64748b' }}>
                        {formatDateKey(rec.date)}
                      </span>
                      <div className="text-sm font-medium mt-0.5" style={{ color: hcfg.color }}>
                        {hcfg.emoji} {hcfg.name}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {[{v:rec.hp,c:'#10b981',l:'HP'},{v:rec.ap,c:'#3b82f6',l:'AP'},{v:rec.san,c:'#a855f7',l:'SAN'}].map(x=>(
                        <div key={x.l} className="flex flex-col items-center">
                          <span className="text-[10px]" style={{ color: '#374151' }}>{x.l}</span>
                          <span className="text-sm font-bold tabular-nums" style={{ color: x.c }}>{x.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }}/>
          <span className="text-[10px] tracking-widest uppercase" style={{ color: '#1e293b' }}>历史统计</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }}/>
        </div>
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
