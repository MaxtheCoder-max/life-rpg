'use client'

import { useStore } from '@/lib/store'
import { STATUS_CONFIGS, formatDateKey, getWeekday } from '@/lib/status'
import { getHPPhase, getAPPhase, getSANPhase, HP_MAX, AP_MAX, SAN_MAX, ALL_TASKS } from '@/lib/tasks'
import { StatusOrb } from '@/components/dashboard/StatusOrb'
import Link from 'next/link'

const RESOURCE_META = [
  { key: 'HP' as const, label: '生命体征', icon: '❤️', color: '#10b981', max: HP_MAX },
  { key: 'AP' as const, label: '行动效率', icon: '⚡', color: '#3b82f6', max: AP_MAX },
  { key: 'SAN' as const, label: '精神状态', icon: '✦', color: '#a855f7', max: SAN_MAX },
]

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: color, transition: 'width 0.8s ease-out' }}
      />
    </div>
  )
}

export default function TodayPage() {
  const { state } = useStore()
  const { today, history } = state
  const { hp, ap, san, status, completedTaskIds, date } = today

  const cfg = STATUS_CONFIGS[status]
  const hpPhase = getHPPhase(hp)
  const apPhase = getAPPhase(ap)
  const sanPhase = getSANPhase(san)

  const completedTasks = ALL_TASKS.filter(t => completedTaskIds.includes(t.id))
  const completedByResource = {
    HP:  completedTasks.filter(t => t.resource === 'HP'),
    AP:  completedTasks.filter(t => t.resource === 'AP'),
    SAN: completedTasks.filter(t => t.resource === 'SAN'),
  }

  const resourceValues: Record<string, number> = { HP: hp, AP: ap, SAN: san }
  const phases: Record<string, string> = {
    HP:  hpPhase.label,
    AP:  apPhase.label,
    SAN: sanPhase.label,
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-5">
        <p className="text-[11px] font-medium tracking-widest uppercase mb-1" style={{ color: '#475569' }}>
          LIFE RPG
        </p>
        <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>今日</h1>
        <p className="text-xs mt-1" style={{ color: '#374151' }}>
          {formatDateKey(date)} · {getWeekday(date)}
        </p>
      </header>

      <div className="px-4 flex flex-col gap-4">
        {/* ── Status showcase ── */}
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{
            background: `radial-gradient(ellipse at 50% 20%, ${cfg.dimColor}99 0%, #0d0d18 65%)`,
            border: `1px solid ${cfg.color}25`,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}80, transparent)` }}
          />
          <div className="flex flex-col items-center py-6 px-4">
            <div className="mb-3">
              <StatusOrb hp={hp} ap={ap} san={san} size={160} />
            </div>
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-1"
              style={{ color: cfg.color }}
            >
              STATE {cfg.index.toString().padStart(2, '0')} · {cfg.emoji}
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: cfg.color }}>{cfg.name}</h2>
            <p className="text-[13px] text-center leading-relaxed max-w-xs" style={{ color: '#64748b' }}>
              {cfg.comment}
            </p>
          </div>
        </div>

        {/* ── Resource summary ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {RESOURCE_META.map((r, i) => {
            const val = resourceValues[r.key]
            const phase = phases[r.key]
            const count = completedByResource[r.key].length
            return (
              <div
                key={r.key}
                className="px-4 py-3"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{r.icon}</span>
                    <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>{r.label}</span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#475569' }}
                    >
                      {count} 项
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold tabular-nums" style={{ color: r.color }}>{val}</span>
                    <span className="text-xs" style={{ color: '#374151' }}>/{r.max}</span>
                    <span className="text-[11px]" style={{ color: '#475569' }}>{phase}</span>
                  </div>
                </div>
                <MiniBar value={val} max={r.max} color={r.color} />
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
                const bgColors: Record<string, string> = {
                  HP: 'rgba(16,185,129,0.1)', AP: 'rgba(59,130,246,0.1)', SAN: 'rgba(168,85,247,0.1)',
                }
                const txtColors: Record<string, string> = {
                  HP: '#34d399', AP: '#60a5fa', SAN: '#c084fc',
                }
                return (
                  <span
                    key={task.id}
                    className="text-xs px-3 py-1.5 rounded-xl"
                    style={{ background: bgColors[task.resource], color: txtColors[task.resource] }}
                  >
                    {task.name} +{task.value}
                  </span>
                )
              })}
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl px-4 py-6 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <p className="text-2xl mb-2">☁️</p>
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
                  <div
                    key={rec.date}
                    className="rounded-xl px-4 py-3 flex items-center justify-between"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div>
                      <span className="text-xs font-medium" style={{ color: '#64748b' }}>
                        {formatDateKey(rec.date)}
                      </span>
                      <div className="text-sm font-medium mt-0.5" style={{ color: hcfg.color }}>
                        {hcfg.emoji} {hcfg.name}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {[
                        { v: rec.hp,  c: '#10b981', l: 'HP'  },
                        { v: rec.ap,  c: '#3b82f6', l: 'AP'  },
                        { v: rec.san, c: '#a855f7', l: 'SAN' },
                      ].map(x => (
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
      </div>
    </div>
  )
}
