export type SlotKey = 'hair' | 'headDecor' | 'faceDecor' | 'innerTop' | 'outerTop' | 'legs' | 'hands' | 'feet'

export type BackgroundKey = 'room' | 'greenhouse' | 'night' | 'library' | 'balcony'

export interface SlotSelection {
  categoryIndex: number  // 0–11
  colorIndex: number     // 0–3
}

export type Outfit = Record<SlotKey, SlotSelection>

export interface SavedOutfit {
  id: string
  name: string
  outfit: Outfit
  createdAt: string
}
