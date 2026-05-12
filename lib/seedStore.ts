'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Seed, Plant, SeedLog, PlantShape, PlantTheme } from '@/types/seeds'

const SHAPES: PlantShape[] = ['succulent', 'fern', 'flower', 'tree']
const THEMES: PlantTheme[] = ['emerald', 'lavender', 'amber', 'sky']

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isoWeekKey(date: Date = new Date()): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const w1 = new Date(d.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(((d.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface SeedStore {
  seeds: Seed[]
  plants: Plant[]

  addSeed: (content: string) => void
  deleteSeed: (id: string) => void
  startCultivating: (id: string) => void
  archiveSeed: (id: string) => Plant | null
  addSeedLog: (seedId: string, text: string, imageBase64?: string) => void
  updateSeedLog: (seedId: string, logId: string, text: string, imageBase64?: string) => void
  deleteSeedLog: (seedId: string, logId: string) => void

  visitPlant: (plantId: string) => void
  addPlantLog: (plantId: string, text: string, imageBase64?: string) => void
  updatePlantLog: (plantId: string, logId: string, text: string, imageBase64?: string) => void
  deletePlantLog: (plantId: string, logId: string) => void
}

export const useSeedStore = create<SeedStore>()(
  persist(
    (set, get) => ({
      seeds: [],
      plants: [],

      addSeed: (content) => {
        const seed: Seed = {
          id: uid(),
          content: content.trim(),
          status: 'pool',
          createdAt: new Date().toISOString(),
          logs: [],
        }
        set(s => ({ seeds: [seed, ...s.seeds] }))
      },

      deleteSeed: (id) => {
        set(s => ({ seeds: s.seeds.filter(seed => seed.id !== id) }))
      },

      startCultivating: (id) => {
        set(s => ({
          seeds: s.seeds.map(seed =>
            seed.id === id
              ? { ...seed, status: 'cultivating' as const, startedAt: new Date().toISOString() }
              : seed
          ),
        }))
      },

      archiveSeed: (id) => {
        const seed = get().seeds.find(s => s.id === id)
        if (!seed) return null
        const shape = randomItem(SHAPES)
        const theme = randomItem(THEMES)
        const now = new Date().toISOString()
        const plant: Plant = {
          id: uid(),
          seedId: id,
          content: seed.content,
          shape,
          theme,
          growthLevel: 0,
          visitLog: [],
          logs: [],
          archivedAt: now,
        }
        set(s => ({
          seeds: s.seeds.map(seed =>
            seed.id === id
              ? { ...seed, status: 'archived' as const, archivedAt: now }
              : seed
          ),
          plants: [plant, ...s.plants],
        }))
        return plant
      },

      addSeedLog: (seedId, text, imageBase64) => {
        const log: SeedLog = {
          id: uid(), text, imageBase64,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(s => ({
          seeds: s.seeds.map(seed =>
            seed.id === seedId ? { ...seed, logs: [...seed.logs, log] } : seed
          ),
        }))
      },

      updateSeedLog: (seedId, logId, text, imageBase64) => {
        set(s => ({
          seeds: s.seeds.map(seed =>
            seed.id === seedId
              ? {
                  ...seed,
                  logs: seed.logs.map(l =>
                    l.id === logId ? { ...l, text, imageBase64, updatedAt: new Date().toISOString() } : l
                  ),
                }
              : seed
          ),
        }))
      },

      deleteSeedLog: (seedId, logId) => {
        set(s => ({
          seeds: s.seeds.map(seed =>
            seed.id === seedId
              ? { ...seed, logs: seed.logs.filter(l => l.id !== logId) }
              : seed
          ),
        }))
      },

      visitPlant: (plantId) => {
        const today = todayKey()
        const week = isoWeekKey()
        set(s => ({
          plants: s.plants.map(plant => {
            if (plant.id !== plantId) return plant
            const visitLog = plant.visitLog.includes(today)
              ? plant.visitLog
              : [...plant.visitLog, today]
            const weekVisits = visitLog.filter(d => isoWeekKey(new Date(d)) === week).length
            const canGrow =
              weekVisits >= 3 &&
              plant.growthLevel < 3 &&
              plant.lastGrowthWeek !== week
            return {
              ...plant,
              visitLog,
              growthLevel: canGrow ? plant.growthLevel + 1 : plant.growthLevel,
              lastGrowthWeek: canGrow ? week : plant.lastGrowthWeek,
            }
          }),
        }))
      },

      addPlantLog: (plantId, text, imageBase64) => {
        const log: SeedLog = {
          id: uid(), text, imageBase64,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(s => ({
          plants: s.plants.map(plant =>
            plant.id === plantId ? { ...plant, logs: [...plant.logs, log] } : plant
          ),
        }))
      },

      updatePlantLog: (plantId, logId, text, imageBase64) => {
        set(s => ({
          plants: s.plants.map(plant =>
            plant.id === plantId
              ? {
                  ...plant,
                  logs: plant.logs.map(l =>
                    l.id === logId ? { ...l, text, imageBase64, updatedAt: new Date().toISOString() } : l
                  ),
                }
              : plant
          ),
        }))
      },

      deletePlantLog: (plantId, logId) => {
        set(s => ({
          plants: s.plants.map(plant =>
            plant.id === plantId
              ? { ...plant, logs: plant.logs.filter(l => l.id !== logId) }
              : plant
          ),
        }))
      },
    }),
    { name: 'life-rpg-seeds' }
  )
)

export const GROWTH_LABELS = ['幼苗', '发芽', '繁茂', '开花']
export const GROWTH_EMOJIS = ['🌱', '🌿', '🍃', '🌸']

export const THEME_COLORS: Record<string, { primary: string; light: string; pale: string; bg: string; border: string }> = {
  emerald:  { primary: '#10b981', light: '#34d399', pale: 'rgba(16,185,129,0.25)',  bg: 'rgba(16,185,129,0.07)',  border: 'rgba(16,185,129,0.2)'  },
  lavender: { primary: '#a855f7', light: '#c084fc', pale: 'rgba(168,85,247,0.25)', bg: 'rgba(168,85,247,0.07)', border: 'rgba(168,85,247,0.2)' },
  amber:    { primary: '#f59e0b', light: '#fbbf24', pale: 'rgba(245,158,11,0.25)', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)'  },
  sky:      { primary: '#0ea5e9', light: '#38bdf8', pale: 'rgba(14,165,233,0.25)', bg: 'rgba(14,165,233,0.07)', border: 'rgba(14,165,233,0.2)'  },
}
