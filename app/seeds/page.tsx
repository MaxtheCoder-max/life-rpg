'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSeedStore } from '@/lib/seedStore'
import type { Seed } from '@/types/seeds'

function formatAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 30) return `${days} 天前`
  return `${Math.floor(days / 30)} 个月前`
}

export default function SeedsPage() {
  const { seeds, addSeed, deleteSeed, startCultivating } = useSeedStore()
  const [input, setInput] = useState('')
  const [drawnIndex, setDrawnIndex] = useState<number | null>(null)
  const [drawKey, setDrawKey] = useState(0)

  const poolSeeds = seeds.filter(s => s.status === 'pool')
  const cultivatingSeeds = seeds.filter(s => s.status === 'cultivating')

  function handleAdd() {
    const trimmed = input.trim()
    if (!trimmed) return
    addSeed(trimmed)
    setInput('')
  }

  function handleDraw() {
    if (poolSeeds.length === 0) return
    let next: number
    do {
      next = Math.floor(Math.random() * poolSeeds.length)
    } while (poolSeeds.length > 1 && next === drawnIndex)
    setDrawnIndex(next)
    setDrawKey(k => k + 1)
  }

  const drawnSeed = drawnIndex !== null ? poolSeeds[drawnIndex] : null

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-4">
        <p className="text-[11px] font-medium tracking-widest uppercase mb-1" style={{ color: '#475569' }}>
          SEED GARDEN
        </p>
        <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>种子系统</h1>
        <p className="text-xs mt-1" style={{ color: '#374151' }}>
          好奇心的收纳盒 · 想做的、想试的、想了解的
        </p>
      </header>

      <div className="px-4 flex flex-col gap-5">
        {/* ── Input ── */}
        <div
          className="flex items-center gap-2 rounded-2xl px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#e2e8f0' }}
            placeholder="种下一个想法…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            maxLength={80}
          />
          <button
            className="text-sm px-3 py-1.5 rounded-xl font-medium transition-all active:scale-95"
            style={{
              background: input.trim() ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.04)',
              color: input.trim() ? '#c084fc' : '#374151',
            }}
            onClick={handleAdd}
          >
            种下
          </button>
        </div>

        {/* ── Random Draw ── */}
        {poolSeeds.length > 0 && (
          <section>
            <h2 className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#475569' }}>
              随机抽取
            </h2>

            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(168,85,247,0.05)' }}
            >
              {/* Drawn seed display */}
              <div className="min-h-[72px] flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                  {drawnSeed ? (
                    <motion.div
                      key={drawKey}
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col items-center gap-2 w-full"
                    >
                      <p className="text-base font-medium text-center" style={{ color: '#e2e8f0' }}>
                        {drawnSeed.content}
                      </p>
                      <p className="text-[10px]" style={{ color: '#475569' }}>
                        {formatAgo(drawnSeed.createdAt)} 种下
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-center"
                      style={{ color: '#374151' }}
                    >
                      点击「随机抽取」看看今天想做什么
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Action buttons */}
              <div
                className="flex border-t"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <button
                  className="flex-1 py-3 text-sm transition-all active:scale-[0.97]"
                  style={{ color: '#64748b' }}
                  onClick={handleDraw}
                >
                  {drawnSeed ? '换一个 ↻' : '随机抽取'}
                </button>
                {drawnSeed && (
                  <>
                    <div style={{ width: 1, background: 'rgba(255,255,255,0.05)' }} />
                    <button
                      className="flex-1 py-3 text-sm font-medium transition-all active:scale-[0.97]"
                      style={{ color: '#c084fc' }}
                      onClick={() => {
                        startCultivating(drawnSeed.id)
                        setDrawnIndex(null)
                      }}
                    >
                      开始培育 →
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Cultivating ── */}
        {cultivatingSeeds.length > 0 && (
          <section>
            <h2 className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#475569' }}>
              培育中 · {cultivatingSeeds.length}
            </h2>
            <div className="flex flex-col gap-2">
              {cultivatingSeeds.map(seed => (
                <Link
                  key={seed.id}
                  href={`/seeds/${seed.id}`}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)' }}
                >
                  <span className="text-lg">🌿</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#34d399' }}>
                      {seed.content}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#374151' }}>
                      {seed.logs.length} 条记录 · {formatAgo(seed.startedAt ?? seed.createdAt)}
                    </p>
                  </div>
                  <span style={{ color: '#374151' }}>›</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Seed pool ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium tracking-widest uppercase" style={{ color: '#475569' }}>
              种子池 · {poolSeeds.length}
            </h2>
          </div>

          {poolSeeds.length === 0 ? (
            <div
              className="rounded-2xl px-4 py-8 text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)' }}
            >
              <p className="text-2xl mb-2">🌰</p>
              <p className="text-sm" style={{ color: '#374151' }}>还没有种子</p>
              <p className="text-xs mt-1" style={{ color: '#1e293b' }}>把脑子里飘过的想法种下来</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {poolSeeds.map(seed => (
                <SeedChip key={seed.id} seed={seed} onDelete={() => deleteSeed(seed.id)} onStart={() => startCultivating(seed.id)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function SeedChip({ seed, onDelete, onStart }: { seed: Seed; onDelete: () => void; onStart: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative">
      <button
        className="text-xs px-3 py-2 rounded-xl text-left transition-all active:scale-[0.97]"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#94a3b8',
        }}
        onClick={() => setExpanded(v => !v)}
      >
        {seed.content}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-1 flex gap-1 z-10"
            style={{ whiteSpace: 'nowrap' }}
          >
            <button
              className="text-[10px] px-2.5 py-1.5 rounded-lg font-medium"
              style={{ background: 'rgba(16,185,129,0.18)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}
              onClick={() => { onStart(); setExpanded(false) }}
            >培育</button>
            <button
              className="text-[10px] px-2.5 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={() => { onDelete(); setExpanded(false) }}
            >删除</button>
            <button
              className="text-[10px] px-2.5 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}
              onClick={() => setExpanded(false)}
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
