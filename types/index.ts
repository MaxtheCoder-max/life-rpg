export type ResourceType = 'HP' | 'AP' | 'SAN'

export interface Task {
  id: string
  name: string
  resource: ResourceType
  value: number
  category: string
  note?: string
}

export type StatusKey =
  | 'offline'    // 系统离线
  | 'lowpower'   // 低功耗模式
  | 'mechanical' // 机械运转中
  | 'normal'     // 正常运行
  | 'easy'       // 轻松推进日
  | 'efficient'  // 高效模式启动
  | 'burst'      // 爆发推进日
  | 'flowlow'    // 低压流动日
  | 'ideal'      // 理想片段
  | 'highlight'  // 人生高光日
  | 'happy'      // 幸福日常
  | 'recovery'   // 恢复与整理

export interface StatusConfig {
  key: StatusKey
  name: string
  index: number
  comment: string
  color: string
  dimColor: string
  emoji: string
}

export interface HPPhase { label: string; min: number; max: number }
export interface APPhase { label: string; min: number; max: number }
export interface SANPhase { label: string; min: number; max: number }

export interface DayRecord {
  date: string       // YYYY-MM-DD
  completedTaskIds: string[]
  hp: number
  ap: number
  san: number
  status: StatusKey
}

export interface AppState {
  today: DayRecord
  history: DayRecord[]
}

export type AppAction =
  | { type: 'TOGGLE_TASK'; taskId: string; taskResource: ResourceType; taskValue: number }
  | { type: 'LOAD_STATE'; state: AppState }
  | { type: 'NEW_DAY' }
