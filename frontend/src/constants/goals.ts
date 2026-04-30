import type { DietGoal, GoalInfo } from '../types'

export const GOALS: GoalInfo[] = [
  {
    key: 'diet',
    label: '다이어트',
    emoji: '🥗',
    description: '체중 감량을 위한 저칼로리 고단백 식단',
    defaultCalories: 1500,
  },
  {
    key: 'bulk',
    label: '벌크업',
    emoji: '💪',
    description: '근육 증가를 위한 고칼로리 고단백 식단',
    defaultCalories: 3000,
  },
  {
    key: 'diabetes',
    label: '당뇨관리',
    emoji: '🩺',
    description: '혈당 안정화를 위한 저GI 식단',
    defaultCalories: 1800,
  },
  {
    key: 'vegan',
    label: '비건',
    emoji: '🌱',
    description: '동물성 식품 없는 완전 식물성 식단',
    defaultCalories: 2000,
  },
]

export const GOAL_VALUE_MAP: Record<DietGoal, string> = {
  diet: '다이어트',
  bulk: '벌크업',
  diabetes: '당뇨관리',
  vegan: '비건',
}
