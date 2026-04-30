export type DietGoal = 'diet' | 'bulk' | 'diabetes' | 'vegan'

export interface GoalInfo {
  key: DietGoal
  label: string
  emoji: string
  description: string
  defaultCalories: number
}

export interface Ingredient {
  name: string
  amount: string
}

export interface MealItem {
  name: string
  ingredients: Ingredient[]
  calories: number
  description: string
}

export interface DailyMeal {
  day: number
  breakfast: MealItem
  lunch: MealItem
  dinner: MealItem
  total_calories: number
}

export interface MealPlan {
  goal: string
  days: number
  plan: DailyMeal[]
}
