import type { SlotKey, BackgroundKey } from '@/types/character'

export const SLOT_LABELS: Record<SlotKey, string> = {
  hair:      '发型',
  headDecor: '头顶',
  faceDecor: '脸部',
  innerTop:  '内搭',
  outerTop:  '外搭',
  legs:      '腿部',
  hands:     '手部',
  feet:      '脚部',
}

export const SLOT_CATEGORIES: Record<SlotKey, string[]> = {
  hair:      ['空气短发','自然碎发','低马尾','中长卷发','晨雾长发','柔顺直发','慵懒层次短发','轻盈波浪长发','半扎发','森林长卷发','清爽学生短发','夜色长发'],
  headDecor: ['星环发饰','玻璃发卡','植物冠饰','耳机头梁','柔光发箍','轻羽装饰','小型光环','花枝装饰','透明护目镜','针织帽','夜灯耳饰','月亮发冠'],
  faceDecor: ['细框眼镜','透明眼镜','创可贴','泪痣贴纸','口罩','星点贴纸','耳挂装饰','轻薄围巾','机械单片镜','柔光耳坠','脸侧花饰','通讯耳机'],
  innerTop:  ['高领打底','宽松衬衫','针织内搭','轻运动背心','柔软卫衣','修身长袖','轻薄毛衣','学院衬衣','棉质短袖','宽松居家服','轻机能内搭','睡衣内搭'],
  outerTop:  ['长风衣','宽松外套','轻机能夹克','针织开衫','羽织外搭','学院风外套','短款夹克','长款大衣','防风外套','居家披肩','夜行斗篷','温室围披'],
  legs:      ['宽松长裤','束脚裤','学院短裤','长裙','机能裤','针织长裙','居家短裤','牛仔裤','运动裤','轻薄长裙','工装裤','睡裤风长裤'],
  hands:     ['指环','透明手链','编织手绳','机械腕表','植物手环','暖手袖','长手套','机能护腕','发光细链','温室工作手套','针织护手','电子终端手环'],
  feet:      ['运动鞋','短靴','长靴','居家拖鞋','学院皮鞋','厚底鞋','帆布鞋','机能鞋','凉鞋','温室雨靴','轻便跑鞋','针织居家鞋'],
}

export const SLOT_COLORS: Record<SlotKey, string[]> = {
  hair:      ['#9ca3af', '#b08060', '#607090', '#d8dce4'],
  headDecor: ['#d8dce4', '#7aaa88', '#7890a8', '#e0c498'],
  faceDecor: ['#9aa0a8', '#ede8e0', '#e0ccd0', '#a8c0d0'],
  innerTop:  ['#f0ede8', '#8090a8', '#a8a0c0', '#c0a080'],
  outerTop:  ['#405068', '#907860', '#3d5840', '#d0d4d8'],
  legs:      ['#282830', '#b0a088', '#687888', '#786050'],
  hands:     ['#b8bcc0', '#a09888', '#88a888', '#7888a8'],
  feet:      ['#ece8e0', '#788090', '#c0a080', '#282830'],
}

export const COLOR_NAMES: Record<SlotKey, string[]> = {
  hair:      ['雾灰', '奶茶棕', '深海蓝灰', '月光银'],
  headDecor: ['柔雾白', '浅森林绿', '灰蓝', '暖杏'],
  faceDecor: ['浅灰', '暖白', '灰粉', '冷蓝'],
  innerTop:  ['奶油白', '雾蓝', '浅灰紫', '暖咖'],
  outerTop:  ['深灰蓝', '暖卡其', '墨绿', '月光白'],
  legs:      ['雾黑', '浅卡其', '灰蓝', '暖棕'],
  hands:     ['浅银', '暖灰', '柔绿', '冷蓝灰'],
  feet:      ['暖白', '灰蓝', '浅棕', '深夜灰'],
}

export const BACKGROUND_LABELS: Record<BackgroundKey, string> = {
  room:       '🏠 房间',
  greenhouse: '🌿 温室',
  night:      '🌙 夜城',
  library:    '📚 图书馆',
  balcony:    '🌅 阳台',
}

export const SLOT_ORDER: SlotKey[] = ['hair', 'headDecor', 'faceDecor', 'innerTop', 'outerTop', 'legs', 'hands', 'feet']
