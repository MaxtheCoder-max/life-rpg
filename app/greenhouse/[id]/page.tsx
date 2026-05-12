'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSeedStore, THEME_COLORS, GROWTH_LABELS, GROWTH_EMOJIS, isoWeekKey } from '@/lib/seedStore'
import { PlantSvg } from '@/components/greenhouse/PlantSvg'
import { LogEditor } from '@/components/seeds/LogEditor'

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

export default function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { plants, seeds, visitPlant, addPlantLog, updatePlantLog, deletePlantLog } = useSeedStore()
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const plant = plants.find(p => p.id === id)

  // Record visit on page open
  useEffect(() => {
    if (plant) visitPlant(plant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!plant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-2xl">🌿</p>
        <p className="text-sm" style={{ color: '#374151' }}>找不到这株植物</p>
        <Link href="/greenhouse" className="text-xs" style={{ color: '#c084fc' }}>返回温室</Link>
      </div>
    )
  }

  const colors = THEME_COLORS[plant.theme]
  const week = isoWeekKey()
  const weekVisits = plant.visitLog.filter(d => isoWeekKey(new Date(d)) === week).length
  const canGrowNext = plant.growthLevel < 3 && weekVisits < 3
  const growthPct = (weekVisits / 3) * 100

  // Find original seed logs
  const originalSeed = seeds.find(s => s.id === plant.seedId)
  const seedLogs = originalSeed?.logs ?? []
  const allLogs = [...seedLogs, ...plant.logs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  return (
    <>
    {/* ── Lightbox ── */}
    {lightboxSrc && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.92)' }}
        onClick={() => setLightboxSrc(null)}
      >
        <button
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-lg"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0' }}
          onClick={() => setLightboxSrc(null)}
        >✕</button>
        <img
          src={lightboxSrc}
          alt=""
          className="rounded-xl object-contain"
          style={{ maxHeight: '90vh', maxWidth: '95vw' }}
          onClick={e => e.stopPropagation()}
        />
      </div>
    )}
    <div className="flex flex-col min-h-full">
      {/* ── Header ── */}
      <header
        className="relative px-5 pt-12 pb-6 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${colors.bg} 0%, transparent 70%)`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)` }}
        />
        <Link href="/greenhouse" className="text-sm mb-4 block" style={{ color: '#475569' }}>
          ← 温室
        </Link>

        {/* Plant SVG centered */}
        <div className="flex flex-col items-center gap-3">
          <PlantSvg
            shape={plant.shape}
            theme={plant.theme}
            growthLevel={plant.growthLevel}
            size={160}
            animate
          />
          <h1 className="text-lg font-bold text-center" style={{ color: '#e2e8f0' }}>
            {plant.content}
          </h1>
          <p className="text-[11px]" style={{ color: '#374151' }}>
            归档于 {formatDate(plant.archivedAt)}
          </p>
        </div>
      </header>

      <div className="px-4 flex flex-col gap-5">
        {/* ── Growth status ── */}
        <div
          className="rounded-2xl p-4"
          style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
        >
          {/* Growth level */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{GROWTH_EMOJIS[plant.growthLevel]}</span>
              <div>
                <div className="text-sm font-bold" style={{ color: colors.primary }}>
                  {GROWTH_LABELS[plant.growthLevel]}
                </div>
                <div className="text-[10px]" style={{ color: '#374151' }}>
                  等级 {plant.growthLevel + 1} / 4
                </div>
              </div>
            </div>
            {/* Growth dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 8, height: 8,
                    background: i <= plant.growthLevel ? colors.primary : 'rgba(255,255,255,0.08)',
                    boxShadow: i === plant.growthLevel ? `0 0 6px ${colors.primary}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Weekly visit progress */}
          {plant.growthLevel < 3 && (
            <>
              <div
                className="h-1.5 rounded-full overflow-hidden mb-1.5"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${growthPct}%`,
                    background: colors.primary,
                    transition: 'width 0.6s ease-out',
                    boxShadow: weekVisits >= 3 ? `0 0 8px ${colors.primary}` : 'none',
                  }}
                />
              </div>
              <p className="text-[10px]" style={{ color: '#374151' }}>
                {canGrowNext
                  ? `本周回访 ${weekVisits}/3 · 再来 ${3 - weekVisits} 次可成长`
                  : weekVisits >= 3
                  ? '本周已满足成长条件 ✦'
                  : ''}
              </p>
            </>
          )}

          {plant.growthLevel === 3 && (
            <p className="text-xs text-center py-1" style={{ color: colors.primary }}>
              ✦ 已完全开花 · 这段探索成就了你
            </p>
          )}
        </div>

        {/* ── Full log timeline ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium tracking-widest uppercase" style={{ color: '#475569' }}>
              成长日志
            </h2>
            <span className="text-[10px]" style={{ color: '#374151' }}>
              {allLogs.length} 条记录
            </span>
          </div>

          <LogEditor
            logs={plant.logs}
            accentColor={colors.primary}
            onAdd={(text, img) => addPlantLog(plant.id, text, img)}
            onUpdate={(lid, text, img) => updatePlantLog(plant.id, lid, text, img)}
            onDelete={(lid) => deletePlantLog(plant.id, lid)}
          />

          {/* Seed logs (read-only, if any) */}
          {seedLogs.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] mb-2 tracking-widest uppercase" style={{ color: '#1e293b' }}>
                培育阶段的记录
              </p>
              {[...seedLogs].reverse().map(log => (
                <div
                  key={log.id}
                  className="rounded-xl px-3 py-2.5 mb-2"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#64748b' }}>
                    {log.text}
                  </p>
                  {log.imageBase64 && (
                    <img
                      src={log.imageBase64}
                      alt=""
                      className="w-full rounded-lg mt-2 max-h-40 object-cover cursor-zoom-in"
                      onClick={() => setLightboxSrc(log.imageBase64!)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  )
}
