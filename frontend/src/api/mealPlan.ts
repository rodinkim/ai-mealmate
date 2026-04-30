import type { DietGoal, MealPlan } from '../types'
import { GOAL_VALUE_MAP } from '../constants/goals'

interface GenerateRequest {
  goal: DietGoal
  days: number
  calories_per_day: number | null
  allergies: string[]
}

export async function generateMealPlan(req: GenerateRequest): Promise<MealPlan> {
  const response = await fetch('/api/meal-plan/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...req,
      goal: GOAL_VALUE_MAP[req.goal],
    }),
  })

  if (!response.ok) {
    throw new Error('식단 생성에 실패했습니다. 다시 시도해주세요.')
  }

  return response.json()
}
