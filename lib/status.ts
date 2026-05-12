import type { StatusKey, StatusConfig } from '@/types'

export const STATUS_CONFIGS: Record<StatusKey, StatusConfig> = {
  offline: {
    key: 'offline',
    name: '系统离线',
    index: 1,
    comment: '今天有点艰难对吧。先照顾好自己，喝口水，一切随时都可以重来。',
    color: '#64748b',
    dimColor: '#1e293b',
    emoji: '💤',
  },
  lowpower: {
    key: 'lowpower',
    name: '低功耗模式',
    index: 2,
    comment: '身体在线，今天这样就够了。不是每一天都要冲刺，好好喘口气。',
    color: '#94a3b8',
    dimColor: '#1e293b',
    emoji: '🔋',
  },
  mechanical: {
    key: 'mechanical',
    name: '机械运转中',
    index: 3,
    comment: '事情在推，日子在转。虽然不算轻松，但你始终保持在线，挺好的。',
    color: '#38bdf8',
    dimColor: '#0c2840',
    emoji: '⚙️',
  },
  normal: {
    key: 'normal',
    name: '正常运行',
    index: 4,
    comment: '稳稳的一天，生活有序，心情平和。这才是真正可持续的日常节奏。',
    color: '#22d3ee',
    dimColor: '#083344',
    emoji: '✅',
  },
  easy: {
    key: 'easy',
    name: '轻松推进日',
    index: 5,
    comment: '不急不躁，进展有序，心里还有余裕。这种状态很难得，好好感受它。',
    color: '#34d399',
    dimColor: '#022c22',
    emoji: '🌿',
  },
  efficient: {
    key: 'efficient',
    name: '高效模式启动',
    index: 6,
    comment: '身体在线，大脑启动，今天你发挥出了自己的真实水平。值得记下来。',
    color: '#60a5fa',
    dimColor: '#172554',
    emoji: '⚡',
  },
  burst: {
    key: 'burst',
    name: '爆发推进日',
    index: 7,
    comment: '今天完全燃起来了！这种状态不常见，好好珍惜，也记得适时停下来。',
    color: '#f472b6',
    dimColor: '#2d0a1c',
    emoji: '🔥',
  },
  flowlow: {
    key: 'flowlow',
    name: '低压流动日',
    index: 8,
    comment: '生活照顾好了，内心也有了点余白。这样的日子就是在给自己默默充电。',
    color: '#a78bfa',
    dimColor: '#1e1040',
    emoji: '🌊',
  },
  ideal: {
    key: 'ideal',
    name: '理想片段',
    index: 9,
    comment: '生活、效率、内心三线并行——这是你理想状态的真实切片，记住它。',
    color: '#c084fc',
    dimColor: '#2e1065',
    emoji: '✨',
  },
  highlight: {
    key: 'highlight',
    name: '人生高光日',
    index: 10,
    comment: '今天真的了不起！身心俱佳、全力以赴。好好记录这一天，你做到了！',
    color: '#fbbf24',
    dimColor: '#2d1b00',
    emoji: '🌟',
  },
  happy: {
    key: 'happy',
    name: '幸福日常',
    index: 11,
    comment: '不是最高效，但生活有质感，心里有满足。这样的日子其实就是好日子。',
    color: '#f87171',
    dimColor: '#2d0a0a',
    emoji: '🌸',
  },
  recovery: {
    key: 'recovery',
    name: '恢复与整理',
    index: 12,
    comment: '今天选择了放慢，给身心好好充电。这不是懈怠，而是明天出发的准备。',
    color: '#86efac',
    dimColor: '#052e16',
    emoji: '🌱',
  },
}

export function getStatus(hp: number, ap: number, san: number): StatusKey {
  if (hp <= 25) return 'offline'

  if (hp >= 66) {
    if (ap >= 76 && san >= 28) return 'highlight'
    if (ap >= 56 && san >= 18) return 'ideal'
    if (ap >= 27 && san >= 28) return 'happy'
    if (ap >= 27 && san >= 18) return 'flowlow'
    if (ap <= 26 && san >= 18) return 'recovery'
    if (ap >= 76) return 'burst'
    if (ap >= 56) return 'efficient'
    if (ap >= 27) return 'normal'
    return 'lowpower'
  }

  if (hp >= 47) {
    if (ap >= 76) return 'burst'
    if (ap >= 56) return 'efficient'
    if (ap >= 27 && san >= 28) return 'happy'
    if (ap >= 27 && san >= 18) return 'easy'
    if (ap >= 27 && san >= 6)  return 'normal'
    if (ap >= 27) return 'mechanical'
    return 'lowpower'
  }

  if (ap >= 27) return 'mechanical'
  return 'lowpower'
}

export function getTodayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDateKey(key: string): string {
  const [y, m, d] = key.split('-')
  return `${y}年${parseInt(m)}月${parseInt(d)}日`
}

export function getWeekday(key: string): string {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  const d = new Date(key + 'T00:00:00')
  return `周${days[d.getDay()]}`
}
