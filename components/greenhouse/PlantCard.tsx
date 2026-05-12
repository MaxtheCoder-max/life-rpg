'use client'

import Link from 'next/link'
import { PlantSvg } from './PlantSvg'
import { THEME_COLORS, GROWTH_LABELS, GROWTH_EMOJIS, isoWeekKey } from '@/lib/seedStore'
import type { Plant } from '@/types/seeds'

export function PlantCard({ plant }: { plant: Plant }) {
  const colors = THEME_COLORS[plant.theme]
  const week = isoWeekKey()
  const weekVisits = plant.visitLog.filter(d => isoWeekKey(new Date(d)) === week).length

  return (
    <Link
      href={`/greenhouse/${plant.id}`}
      className="flex flex-col items-center rounded-2xl p-4 transition-all duration-200 active:scale-[0.97]"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Plant illustration */}
      <div className="relative mb-2">
        <PlantSvg
          shape={plant.shape}
          theme={plant.theme}
          growthLevel={plant.growthLevel}
          size={88}
          animate={plant.growthLevel === 3}
        />
        {/* Growth badge */}
        <span
          className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full font-medium"
          style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.primary, fontSize: 10 }}
        >
          {GROWTH_EMOJIS[plant.growthLevel]}
        </span>
      </div>

      {/* Name */}
      <p
        className="text-xs font-medium text-center leading-snug line-clamp-2 mb-2"
        style={{ color: colors.primary }}
      >
        {plant.content}
      </p>

      {/* Growth label + weekly visits */}
      <div className="flex items-center gap-1.5 w-full justify-between">
        <span className="text-[10px]" style={{ color: '#374151' }}>
          {GROWTH_LABELS[plant.growthLevel]}
        </span>
        {weekVisits > 0 && (
          <span className="text-[10px]" style={{ color: colors.primary }}>
            本周 {weekVisits}/3
          </span>
        )}
      </div>

      {/* Growth progress dots */}
      <div className="flex gap-1 mt-1.5">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: 5, height: 5,
              background: i <= plant.growthLevel ? colors.primary : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>
    </Link>
  )
}
