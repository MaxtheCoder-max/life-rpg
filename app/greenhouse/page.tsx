'use client'

import { useSeedStore } from '@/lib/seedStore'
import { PlantCard } from '@/components/greenhouse/PlantCard'
import { GROWTH_EMOJIS } from '@/lib/seedStore'

export default function GreenhousePage() {
  const { plants } = useSeedStore()

  const total = plants.length
  const bloomCount = plants.filter(p => p.growthLevel === 3).length

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-4">
        <p className="text-[11px] font-medium tracking-widest uppercase mb-1" style={{ color: '#475569' }}>
          GREENHOUSE
        </p>
        <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>温室</h1>
        <p className="text-xs mt-1" style={{ color: '#374151' }}>
          你真正探索过的每一件事都在这里
        </p>
      </header>

      <div className="px-4 flex flex-col gap-5">
        {/* ── Summary bar ── */}
        {total > 0 && (
          <div
            className="flex items-center justify-between rounded-2xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="text-lg font-bold" style={{ color: '#e2e8f0' }}>{total}</div>
                <div className="text-[10px]" style={{ color: '#374151' }}>株植物</div>
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: '#c084fc' }}>{bloomCount}</div>
                <div className="text-[10px]" style={{ color: '#374151' }}>已开花</div>
              </div>
            </div>
            {/* Growth distribution */}
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(lvl => {
                const count = plants.filter(p => p.growthLevel === lvl).length
                if (count === 0) return null
                return (
                  <div key={lvl} className="flex flex-col items-center gap-0.5">
                    <span className="text-sm">{GROWTH_EMOJIS[lvl]}</span>
                    <span className="text-[10px]" style={{ color: '#374151' }}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Growth hint ── */}
        {total > 0 && (
          <div
            className="rounded-2xl px-4 py-3 flex items-start gap-2"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <span>💡</span>
            <p className="text-[11px] leading-relaxed" style={{ color: '#374151' }}>
              一周内回顾某株植物 3 次，它就会成长一级 · 最高开花 · 成长与回顾有关，与打卡无关
            </p>
          </div>
        )}

        {/* ── Plant grid ── */}
        {total === 0 ? (
          <div
            className="rounded-3xl px-6 py-12 flex flex-col items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)' }}
          >
            <div className="text-4xl mb-1">🌿</div>
            <p className="text-sm font-medium" style={{ color: '#64748b' }}>温室还是空的</p>
            <p className="text-xs text-center leading-relaxed" style={{ color: '#374151' }}>
              在种子系统里开始培育一颗想法<br />完成后归档，它就会在这里生根发芽
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {plants.map(plant => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
