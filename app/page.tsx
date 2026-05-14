'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useCharacterStore } from '@/lib/characterStore'
import { CharacterSvg } from '@/components/character/CharacterSvg'
import { SLOT_LABELS, SLOT_CATEGORIES, SLOT_COLORS, COLOR_NAMES, BACKGROUND_LABELS, SLOT_ORDER } from '@/lib/slotData'
import type { SlotKey, BackgroundKey } from '@/types/character'
import { getHPPhase, getAPPhase, getSANPhase } from '@/lib/tasks'

const BG_KEYS: BackgroundKey[] = ['room', 'greenhouse', 'night', 'library', 'balcony']

export default function CharacterPage() {
  const { state } = useStore()
  const { hp, ap, san } = state.today
  const { outfit, savedOutfits, background, setSlot, setBackground, randomize, saveOutfit, loadOutfit, deleteOutfit } = useCharacterStore()

  const [activeSlot, setActiveSlot] = useState<SlotKey>('hair')
  const [tab, setTab] = useState<'outfit' | 'saved'>('outfit')
  const [saveName, setSaveName] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)

  const hpPhase  = getHPPhase(hp)
  const apPhase  = getAPPhase(ap)
  const sanPhase = getSANPhase(san)

  function handleSave() {
    if (!saveName.trim()) return
    saveOutfit(saveName.trim())
    setSaveName('')
    setShowSaveInput(false)
  }

  const cats      = SLOT_CATEGORIES[activeSlot]
  const colors    = SLOT_COLORS[activeSlot]
  const colorNames = COLOR_NAMES[activeSlot]
  const sel       = outfit[activeSlot]

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ── */}
      <header className="px-5 pt-10 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase mb-0.5" style={{ color: '#475569' }}>
            CHARACTER
          </p>
          <h1 className="text-xl font-bold" style={{ color: '#e2e8f0' }}>人物</h1>
        </div>
        <div className="flex gap-1.5">
          {[
            { label: 'HP', val: hp, color: '#10b981' },
            { label: 'AP', val: ap, color: '#3b82f6' },
            { label: 'SAN', val: san, color: '#a855f7' },
          ].map(r => (
            <div key={r.label} className="flex flex-col items-center px-2 py-1 rounded-xl"
              style={{ background: `${r.color}12`, border: `1px solid ${r.color}22` }}>
              <span className="text-[9px]" style={{ color: r.color }}>{r.label}</span>
              <span className="text-xs font-bold tabular-nums" style={{ color: r.color }}>{r.val}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Character Display ── */}
      <div className="px-4 mb-2">
        <div className="relative rounded-3xl overflow-hidden"
          style={{
            height: 300,
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
          <CharacterSvg outfit={outfit} background={background}
            hp={hp} ap={ap} san={san} animate/>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
            <div className="px-3 py-1 rounded-full text-[10px]"
              style={{ background: 'rgba(0,0,0,0.55)', color: '#64748b', backdropFilter: 'blur(8px)' }}>
              {hpPhase.label} · {apPhase.label} · {sanPhase.label}
            </div>
          </div>
        </div>
      </div>

      {/* ── Background selector ── */}
      <div className="px-4 mb-2">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {BG_KEYS.map(bg => (
            <button key={bg}
              className="flex-shrink-0 text-[10px] px-3 py-1.5 rounded-xl whitespace-nowrap transition-all"
              style={{
                background: background === bg ? 'rgba(192,132,252,0.18)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${background === bg ? '#c084fc44' : 'rgba(255,255,255,0.06)'}`,
                color: background === bg ? '#c084fc' : '#475569',
              }}
              onClick={() => setBackground(bg)}>
              {BACKGROUND_LABELS[bg]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="px-4 mb-2 flex gap-2 items-center">
        {(['outfit','saved'] as const).map(t => (
          <button key={t}
            className="text-xs px-4 py-1.5 rounded-xl transition-all"
            style={{
              background: tab === t ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.04)',
              color: tab === t ? '#c084fc' : '#475569',
              border: `1px solid ${tab === t ? '#c084fc33' : 'rgba(255,255,255,0.06)'}`,
            }}
            onClick={() => setTab(t)}>
            {t === 'outfit' ? '穿搭' : `已保存 ${savedOutfits.length}`}
          </button>
        ))}
        <div className="flex-1"/>
        <button
          className="text-xs px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
          onClick={randomize}>
          🎲 随机
        </button>
        <button
          className="text-xs px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(192,132,252,0.12)', color: '#c084fc' }}
          onClick={() => setShowSaveInput(v => !v)}>
          保存
        </button>
      </div>

      {showSaveInput && (
        <div className="px-4 mb-2 flex gap-2">
          <input
            className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e2e8f0',
            }}
            placeholder="穿搭方案名称…"
            value={saveName}
            onChange={e => setSaveName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <button
            className="text-xs px-4 py-2 rounded-xl font-medium"
            style={{ background: 'rgba(192,132,252,0.2)', color: '#c084fc' }}
            onClick={handleSave}>
            确认
          </button>
        </div>
      )}

      {tab === 'outfit' ? (
        <>
          {/* ── Slot tabs ── */}
          <div className="px-4 mb-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {SLOT_ORDER.map(slot => {
                const active = slot === activeSlot
                const dotColor = SLOT_COLORS[slot][outfit[slot].colorIndex]
                return (
                  <button key={slot}
                    className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all"
                    style={{
                      background: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
                      minWidth: 48,
                    }}
                    onClick={() => setActiveSlot(slot)}>
                    <div className="w-3 h-3 rounded-full"
                      style={{
                        background: dotColor,
                        boxShadow: active ? `0 0 6px ${dotColor}` : 'none',
                      }}/>
                    <span className="text-[10px] whitespace-nowrap"
                      style={{ color: active ? '#e2e8f0' : '#475569' }}>
                      {SLOT_LABELS[slot]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Category grid (3 cols × 4 rows) ── */}
          <div className="px-4 mb-2">
            <div className="grid grid-cols-3 gap-1.5">
              {cats.map((name, i) => {
                const isSelected = sel.categoryIndex === i
                return (
                  <button key={i}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-left transition-all active:scale-[0.97]"
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)'}`,
                    }}
                    onClick={() => setSlot(activeSlot, { categoryIndex: i, colorIndex: sel.colorIndex })}>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: SLOT_COLORS[activeSlot][sel.colorIndex] }}/>
                    )}
                    <span className="text-[10px] leading-tight"
                      style={{ color: isSelected ? '#e2e8f0' : '#64748b' }}>
                      {name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Color picker ── */}
          <div className="px-4 mb-3">
            <p className="text-[10px] mb-2 tracking-widest uppercase" style={{ color: '#374151' }}>配色</p>
            <div className="flex gap-3">
              {colors.map((hex, i) => {
                const isSelected = sel.colorIndex === i
                return (
                  <button key={i}
                    className="flex flex-col items-center gap-1 transition-all active:scale-95"
                    onClick={() => setSlot(activeSlot, { categoryIndex: sel.categoryIndex, colorIndex: i })}>
                    <div className="rounded-full transition-all"
                      style={{
                        width: 30, height: 30,
                        background: hex,
                        boxShadow: isSelected ? `0 0 0 2.5px rgba(255,255,255,0.4), 0 0 12px ${hex}88` : 'none',
                        border: isSelected ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent',
                      }}/>
                    <span className="text-[9px]" style={{ color: isSelected ? '#e2e8f0' : '#374151' }}>
                      {colorNames[i]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="px-4">
          {savedOutfits.length === 0 ? (
            <div className="rounded-2xl px-4 py-8 text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-2xl mb-2">👗</p>
              <p className="text-sm" style={{ color: '#374151' }}>还没有保存的穿搭</p>
              <p className="text-xs mt-1" style={{ color: '#1e293b' }}>搭配好后点"保存"记录</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {savedOutfits.map(s => (
                <div key={s.id}
                  className="flex items-center justify-between rounded-xl px-3 py-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{s.name}</p>
                    <div className="flex gap-1 mt-1">
                      {SLOT_ORDER.slice(0, 6).map(slot => (
                        <div key={slot} className="w-2.5 h-2.5 rounded-full"
                          style={{ background: SLOT_COLORS[slot][s.outfit[slot].colorIndex] }}/>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-xs px-3 py-1.5 rounded-xl"
                      style={{ background: 'rgba(192,132,252,0.15)', color: '#c084fc' }}
                      onClick={() => { loadOutfit(s.id); setTab('outfit') }}>
                      穿上
                    </button>
                    <button
                      className="text-xs px-2 py-1.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', color: '#374151' }}
                      onClick={() => deleteOutfit(s.id)}>
                      删
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
