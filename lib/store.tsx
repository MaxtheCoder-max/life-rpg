'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { AppState, AppAction, DayRecord } from '@/types'
import { calculateResources } from './tasks'
import { getStatus, getTodayKey } from './status'

const STORAGE_KEY = 'life-rpg-state-v1'

function makeEmptyDay(date: string): DayRecord {
  return { date, completedTaskIds: [], hp: 0, ap: 0, san: 0, status: 'offline' }
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.state

    case 'NEW_DAY': {
      const todayKey = getTodayKey()
      if (state.today.date === todayKey) return state
      const history = [state.today, ...state.history].slice(0, 365)
      return { today: makeEmptyDay(todayKey), history }
    }

    case 'TOGGLE_TASK': {
      const { taskId } = action
      const ids = state.today.completedTaskIds
      const newIds = ids.includes(taskId)
        ? ids.filter(id => id !== taskId)
        : [...ids, taskId]

      const { hp, ap, san } = calculateResources(newIds)
      const status = getStatus(hp, ap, san)

      return {
        ...state,
        today: { ...state.today, completedTaskIds: newIds, hp, ap, san, status },
      }
    }

    default:
      return state
  }
}

interface StoreContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  toggleTask: (taskId: string) => void
  isCompleted: (taskId: string) => boolean
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    today: makeEmptyDay(getTodayKey()),
    history: [],
  })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved: AppState = JSON.parse(raw)
        dispatch({ type: 'LOAD_STATE', state: saved })
        // Immediately check if it's a new day after loading
        dispatch({ type: 'NEW_DAY' })
      }
    } catch {
      // silently ignore corrupt storage
    }
  }, [])

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore storage errors
    }
  }, [state])

  const toggleTask = useCallback((taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', taskId, taskResource: 'HP', taskValue: 0 })
  }, [])

  const isCompleted = useCallback(
    (taskId: string) => state.today.completedTaskIds.includes(taskId),
    [state.today.completedTaskIds]
  )

  return (
    <StoreContext.Provider value={{ state, dispatch, toggleTask, isCompleted }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
