'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SlotKey, BackgroundKey, Outfit, SavedOutfit, SlotSelection } from '@/types/character'

const DEFAULT_OUTFIT: Outfit = {
  hair:      { categoryIndex: 0,  colorIndex: 0 },
  headDecor: { categoryIndex: 1,  colorIndex: 0 },
  faceDecor: { categoryIndex: 0,  colorIndex: 0 },
  innerTop:  { categoryIndex: 0,  colorIndex: 0 },
  outerTop:  { categoryIndex: 3,  colorIndex: 0 },
  legs:      { categoryIndex: 0,  colorIndex: 0 },
  hands:     { categoryIndex: 0,  colorIndex: 0 },
  feet:      { categoryIndex: 0,  colorIndex: 0 },
}

interface CharacterState {
  outfit: Outfit
  savedOutfits: SavedOutfit[]
  background: BackgroundKey
  setSlot: (slot: SlotKey, sel: SlotSelection) => void
  setBackground: (bg: BackgroundKey) => void
  randomize: () => void
  saveOutfit: (name: string) => void
  loadOutfit: (id: string) => void
  deleteOutfit: (id: string) => void
}

const SLOTS: SlotKey[] = ['hair','headDecor','faceDecor','innerTop','outerTop','legs','hands','feet']

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      outfit: DEFAULT_OUTFIT,
      savedOutfits: [],
      background: 'room',

      setSlot: (slot, sel) =>
        set(s => ({ outfit: { ...s.outfit, [slot]: sel } })),

      setBackground: (bg) => set({ background: bg }),

      randomize: () =>
        set({
          outfit: Object.fromEntries(
            SLOTS.map(slot => [slot, {
              categoryIndex: Math.floor(Math.random() * 12),
              colorIndex: Math.floor(Math.random() * 4),
            }])
          ) as Outfit,
        }),

      saveOutfit: (name) => {
        const { outfit, savedOutfits } = get()
        set({
          savedOutfits: [...savedOutfits, {
            id: Date.now().toString(),
            name,
            outfit: { ...outfit },
            createdAt: new Date().toISOString(),
          }],
        })
      },

      loadOutfit: (id) => {
        const found = get().savedOutfits.find(o => o.id === id)
        if (found) set({ outfit: { ...found.outfit } })
      },

      deleteOutfit: (id) =>
        set(s => ({ savedOutfits: s.savedOutfits.filter(o => o.id !== id) })),
    }),
    { name: 'life-rpg-character' }
  )
)
