import type { Task } from '@/types'

export const HP_MAX = 75
export const AP_MAX = 95
export const SAN_MAX = 40

export const HP_PHASES = [
  { label: '掉线了？', min: 0,  max: 25 },
  { label: '还不赖~',  min: 26, max: 46 },
  { label: '好日子~',  min: 47, max: 65 },
  { label: '夯爆了！', min: 66, max: 75 },
]

export const AP_PHASES = [
  { label: '你累了吗？', min: 0,  max: 26 },
  { label: '继续加油~',  min: 27, max: 55 },
  { label: '高效运转~',  min: 56, max: 75 },
  { label: '立即奖励！', min: 76, max: 95 },
]

export const SAN_PHASES = [
  { label: '精神沙漠。', min: 0,  max: 5  },
  { label: '安然自适~',  min: 6,  max: 17 },
  { label: '逍遥自在~',  min: 18, max: 27 },
  { label: '心旷神怡！', min: 28, max: 40 },
]

export function getHPPhase(hp: number) {
  return HP_PHASES.find(p => hp >= p.min && hp <= p.max) ?? HP_PHASES[0]
}

export function getAPPhase(ap: number) {
  return AP_PHASES.find(p => ap >= p.min && ap <= p.max) ?? AP_PHASES[AP_PHASES.length - 1]
}

export function getSANPhase(san: number) {
  return SAN_PHASES.find(p => san >= p.min && san <= p.max) ?? SAN_PHASES[SAN_PHASES.length - 1]
}

export const ALL_TASKS: Task[] = [
  // ── HP 基本生活需求 ──
  { id: 'wake_up',           name: '起床',                 resource: 'HP', value: 5,  category: 'HP' },
  { id: 'brush_teeth',       name: '刷牙',                 resource: 'HP', value: 3,  category: 'HP' },
  { id: 'wash_face',         name: '洗脸',                 resource: 'HP', value: 2,  category: 'HP' },
  { id: 'face_cleanser',     name: '用洗面奶',              resource: 'HP', value: 3,  category: 'HP' },
  { id: 'breakfast',         name: '吃早饭',               resource: 'HP', value: 7,  category: 'HP' },
  { id: 'canteen_breakfast', name: '去食堂吃早饭',          resource: 'HP', value: 3,  category: 'HP' },
  { id: 'lunch',             name: '吃午饭',               resource: 'HP', value: 5,  category: 'HP' },
  { id: 'dinner',            name: '吃晚饭',               resource: 'HP', value: 5,  category: 'HP' },
  { id: 'sunshine',          name: '晒太阳',               resource: 'HP', value: 4,  category: 'HP' },
  { id: 'shower',            name: '洗澡',                 resource: 'HP', value: 6,  category: 'HP' },
  { id: 'laundry',           name: '洗衣服',            resource: 'HP', value: 8,  category: 'HP' },
  { id: 'tidy_desk',         name: '收拾桌面',              resource: 'HP', value: 4,  category: 'HP' },
  { id: 'sleep',             name: '睡觉',                 resource: 'HP', value: 5,  category: 'HP' },
  { id: 'sleep_early',       name: '昨天23:30前入睡',       resource: 'HP', value: 10, category: 'HP', note: '昨天在23点30分前睡觉' },
  { id: 'drink_water',       name: '喝水',                 resource: 'HP', value: 5,  category: 'HP' },

  // ── AP 每日任务 ──
  { id: 'attend_class',      name: '去上课',               resource: 'AP', value: 10, category: 'AP', note: '没课默认完成' },
  { id: 'library',           name: '去图书馆',              resource: 'AP', value: 3,  category: 'AP' },
  { id: 'start_focus',       name: '开始专注',              resource: 'AP', value: 3,  category: 'AP' },
  { id: 'focus_10min',       name: '专注 10 分钟',          resource: 'AP', value: 5,  category: 'AP' },
  { id: 'focus_30min',       name: '专注半小时',            resource: 'AP', value: 4,  category: 'AP' },
  { id: 'focus_1h',          name: '专注 1 小时',           resource: 'AP', value: 6,  category: 'AP' },
  { id: 'focus_2h',          name: '专注 2 小时',           resource: 'AP', value: 8,  category: 'AP' },
  { id: 'focus_3h',          name: '专注 3 小时',           resource: 'AP', value: 11, category: 'AP' },
  { id: 'focus_35h',         name: '专注 3.5 小时',         resource: 'AP', value: 6,  category: 'AP' },
  { id: 'start_vocab',       name: '开始看单词',            resource: 'AP', value: 4,  category: 'AP' },
  { id: 'vocab_done',        name: '背完今日单词',           resource: 'AP', value: 6,  category: 'AP' },
  { id: 'phone_in_bag',      name: '学习时手机放包里',       resource: 'AP', value: 4,  category: 'AP' },
  { id: 'game_on_time',      name: '玩游戏按时退出',         resource: 'AP', value: 4,  category: 'AP' },
  { id: 'stop_phone',        name: '主动停止刷手机',         resource: 'AP', value: 5,  category: 'AP' },
  { id: 'gym',               name: '去健身',               resource: 'AP', value: 8,  category: 'AP' },
  { id: 'cardio',            name: '做有氧',               resource: 'AP', value: 8,  category: 'AP' },
  { id: 'workout_full',      name: '练到位',               resource: 'AP', value: 7,  category: 'AP' },

  // ── SAN 附加奖励 ──
  { id: 'journal',           name: '记点什么',              resource: 'SAN', value: 2,  category: 'SAN' },
  { id: 'music',             name: '听歌',                 resource: 'SAN', value: 2,  category: 'SAN' },
  { id: 'fresh_air',         name: '起来透透气',            resource: 'SAN', value: 3,  category: 'SAN' },
  { id: 'meditate',          name: '冥想 10 分钟',          resource: 'SAN', value: 3,  category: 'SAN' },
  { id: 'reading',           name: '阅读',                 resource: 'SAN', value: 7,  category: 'SAN' },
  { id: 'eat_with_friends',  name: '和朋友吃饭',            resource: 'SAN', value: 3,  category: 'SAN' },
  { id: 'msg_family',        name: '给家里发消息',           resource: 'SAN', value: 3,  category: 'SAN' },
  { id: 'less_video',        name: '刷视频少于 2 小时',      resource: 'SAN', value: 5,  category: 'SAN' },
  { id: 'self_discipline',   name: '自律动作都做了一遍',     resource: 'SAN', value: 3,  category: 'SAN' },
  { id: 'scenery',           name: '看到美景',              resource: 'SAN', value: 4,  category: 'SAN' },
  { id: 'hobby',             name: '做爱好的事',            resource: 'SAN', value: 5,  category: 'SAN' },
]

export const HP_TASKS  = ALL_TASKS.filter(t => t.resource === 'HP')
export const AP_TASKS  = ALL_TASKS.filter(t => t.resource === 'AP')
export const SAN_TASKS = ALL_TASKS.filter(t => t.resource === 'SAN')

export function calculateResources(completedIds: string[]): { hp: number; ap: number; san: number } {
  let hp = 0, ap = 0, san = 0
  for (const id of completedIds) {
    const task = ALL_TASKS.find(t => t.id === id)
    if (!task) continue
    if (task.resource === 'HP')  hp  += task.value
    if (task.resource === 'AP')  ap  += task.value
    if (task.resource === 'SAN') san += task.value
  }
  return { hp, ap, san }
}
