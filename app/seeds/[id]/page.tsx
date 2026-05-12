'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSeedStore } from '@/lib/seedStore'
import { LogEditor } from '@/components/seeds/LogEditor'

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

export default function SeedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { seeds, addSeedLog, updateSeedLog, deleteSeedLog, archiveSeed } = useSeedStore()
  const seed = seeds.find(s => s.id === id)

  if (!seed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-2xl">🌰</p>
        <p className="text-sm" style={{ color: '#374151' }}>找不到这颗种子</p>
        <Link href="/seeds" className="text-xs" style={{ color: '#c084fc' }}>返回种子系统</Link>
      </div>
    )
  }

  function handleArchive() {
    const plant = archiveSeed(seed!.id)
    if (plant) router.push(`/greenhouse/${plant.id}`)
  }

  const statusLabel: Record<string, string> = {
    pool: '种子池',
    cultivating: '培育中',
    archived: '已归档',
  }
  const statusColor: Record<string, string> = {
    pool: '#64748b',
    cultivating: '#10b981',
    archived: '#a855f7',
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Link href="/seeds" className="text-sm" style={{ color: '#475569' }}>← 种子系统</Link>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full ml-auto"
            style={{
              background: `${statusColor[seed.status]}18`,
              color: statusColor[seed.status],
              border: `1px solid ${statusColor[seed.status]}30`,
            }}
          >
            {statusLabel[seed.status]}
          </span>
        </div>

        {/* Seed content */}
        <h1 className="text-xl font-bold leading-snug mb-1" style={{ color: '#e2e8f0' }}>
          {seed.content}
        </h1>
        <p className="text-xs" style={{ color: '#374151' }}>
          种下于 {formatDate(seed.createdAt)}
          {seed.startedAt && ` · 培育始于 ${formatDate(seed.startedAt)}`}
        </p>
      </header>

      <div className="px-4 flex flex-col gap-4">
        {/* ── Archive button (only for cultivating) ── */}
        {seed.status === 'cultivating' && (
          <button
            className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium transition-all active:scale-[0.97]"
            style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}
            onClick={handleArchive}
          >
            <span>🌱</span>
            归档到温室 · 这颗种子成长了
          </button>
        )}

        {/* ── Logs ── */}
        <section>
          <h2 className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#475569' }}>
            探索日志
          </h2>
          {seed.status !== 'pool' ? (
            <LogEditor
              logs={seed.logs}
              accentColor={seed.status === 'archived' ? '#a855f7' : '#10b981'}
              onAdd={(text, img) => addSeedLog(seed.id, text, img)}
              onUpdate={(lid, text, img) => updateSeedLog(seed.id, lid, text, img)}
              onDelete={(lid) => deleteSeedLog(seed.id, lid)}
            />
          ) : (
            <div
              className="rounded-2xl px-4 py-5 text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="text-sm" style={{ color: '#374151' }}>先开始培育，再记录探索过程</p>
              <Link
                href="/seeds"
                className="text-xs mt-2 block"
                style={{ color: '#c084fc' }}
              >返回种子池开始培育</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
