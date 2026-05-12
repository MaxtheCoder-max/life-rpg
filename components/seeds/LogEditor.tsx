'use client'

import { useState, useRef } from 'react'
import type { SeedLog } from '@/types/seeds'

interface Props {
  logs: SeedLog[]
  accentColor: string
  onAdd: (text: string, imageBase64?: string) => void
  onUpdate: (logId: string, text: string, imageBase64?: string) => void
  onDelete: (logId: string) => void
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function LogEditor({ logs, accentColor, onAdd, onUpdate, onDelete }: Props) {
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState('')
  const [draftImage, setDraftImage] = useState<string | undefined>()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editImage, setEditImage] = useState<string | undefined>()
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const editFileRef = useRef<HTMLInputElement>(null)

  function pickImage(cb: (b64: string) => void, inputRef: React.RefObject<HTMLInputElement | null>) {
    inputRef.current?.click()
    const handler = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = ev => cb(ev.target?.result as string)
      reader.readAsDataURL(file)
      ;(e.target as HTMLInputElement).value = ''
    }
    inputRef.current?.addEventListener('change', handler, { once: true })
  }

  function submitNew() {
    if (!draft.trim()) return
    onAdd(draft.trim(), draftImage)
    setDraft('')
    setDraftImage(undefined)
    setComposing(false)
  }

  function startEdit(log: SeedLog) {
    setEditingId(log.id)
    setEditText(log.text)
    setEditImage(log.imageBase64)
  }

  function submitEdit() {
    if (!editingId || !editText.trim()) return
    onUpdate(editingId, editText.trim(), editImage)
    setEditingId(null)
  }

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
    <div className="flex flex-col gap-3">
      {/* Existing logs */}
      {logs.length === 0 && !composing && (
        <p className="text-xs text-center py-4" style={{ color: '#374151' }}>
          还没有记录 · 随手写点什么吧
        </p>
      )}

      {[...logs].reverse().map(log => (
        <div
          key={log.id}
          className="rounded-2xl p-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {editingId === log.id ? (
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full bg-transparent text-sm resize-none outline-none"
                style={{ color: '#e2e8f0', minHeight: 72 }}
                value={editText}
                onChange={e => setEditText(e.target.value)}
                autoFocus
              />
              {editImage && (
                <div className="relative">
                  <img src={editImage} alt="" className="w-full rounded-xl object-cover max-h-40" />
                  <button
                    className="absolute top-1 right-1 rounded-full px-2 py-0.5 text-[10px]"
                    style={{ background: 'rgba(0,0,0,0.6)', color: '#e2e8f0' }}
                    onClick={() => setEditImage(undefined)}
                  >移除</button>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <input ref={editFileRef} type="file" accept="image/*" className="hidden" />
                <button
                  className="text-xs px-3 py-1.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
                  onClick={() => pickImage(setEditImage, editFileRef)}
                >图片</button>
                <button
                  className="text-xs px-3 py-1.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
                  onClick={() => setEditingId(null)}
                >取消</button>
                <button
                  className="text-xs px-3 py-1.5 rounded-xl font-medium"
                  style={{ background: `${accentColor}22`, color: accentColor }}
                  onClick={submitEdit}
                >保存</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2" style={{ color: '#cbd5e1' }}>
                {log.text}
              </p>
              {log.imageBase64 && (
                <img
                  src={log.imageBase64}
                  alt=""
                  className="w-full rounded-xl object-cover max-h-48 mb-2 cursor-zoom-in active:opacity-90"
                  onClick={() => setLightboxSrc(log.imageBase64!)}
                />
              )}
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: '#374151' }}>{formatDate(log.createdAt)}</span>
                <div className="flex gap-2">
                  <button
                    className="text-[10px]"
                    style={{ color: '#374151' }}
                    onClick={() => startEdit(log)}
                  >编辑</button>
                  <button
                    className="text-[10px]"
                    style={{ color: '#374151' }}
                    onClick={() => onDelete(log.id)}
                  >删除</button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      {/* New log composer */}
      {composing ? (
        <div
          className="rounded-2xl p-3 flex flex-col gap-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accentColor}30` }}
        >
          <textarea
            className="w-full bg-transparent text-sm resize-none outline-none"
            style={{ color: '#e2e8f0', minHeight: 80 }}
            placeholder="写点什么…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
          />
          {draftImage && (
            <div className="relative">
              <img src={draftImage} alt="" className="w-full rounded-xl object-cover max-h-40" />
              <button
                className="absolute top-1 right-1 rounded-full px-2 py-0.5 text-[10px]"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#e2e8f0' }}
                onClick={() => setDraftImage(undefined)}
              >移除</button>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" />
            <button
              className="text-xs px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
              onClick={() => pickImage(setDraftImage, fileRef)}
            >📷 图片</button>
            <button
              className="text-xs px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
              onClick={() => { setComposing(false); setDraft(''); setDraftImage(undefined) }}
            >取消</button>
            <button
              className="text-xs px-3 py-1.5 rounded-xl font-medium"
              style={{ background: `${accentColor}22`, color: accentColor }}
              onClick={submitNew}
            >记录</button>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm transition-all active:scale-[0.97]"
          style={{ background: 'rgba(255,255,255,0.03)', border: `1px dashed ${accentColor}40`, color: accentColor }}
          onClick={() => setComposing(true)}
        >
          <span className="text-base">✦</span>
          添加记录
        </button>
      )}
    </div>
    </>
  )
}
