export type SeedStatus = 'pool' | 'cultivating' | 'archived'
export type PlantShape = 'succulent' | 'fern' | 'flower' | 'tree'
export type PlantTheme = 'emerald' | 'lavender' | 'amber' | 'sky'

export interface SeedLog {
  id: string
  text: string
  imageBase64?: string
  createdAt: string
  updatedAt: string
}

export interface Seed {
  id: string
  content: string
  status: SeedStatus
  createdAt: string
  startedAt?: string
  archivedAt?: string
  logs: SeedLog[]
}

export interface Plant {
  id: string
  seedId: string
  content: string
  shape: PlantShape
  theme: PlantTheme
  growthLevel: number      // 0=幼苗 1=发芽 2=繁茂 3=开花
  visitLog: string[]       // 'YYYY-MM-DD' strings
  lastGrowthWeek?: string  // 'YYYY-Www' — prevents double growth per week
  logs: SeedLog[]
  archivedAt: string
}
