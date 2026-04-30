import { useState } from 'react'
import type { DailyMeal, MealItem } from '../types'

const MEAL_META = {
  breakfast: { label: '아침', icon: '🌅' },
  lunch:     { label: '점심', icon: '☀️' },
  dinner:    { label: '저녁', icon: '🌙' },
} as const

function MealRow({ type, meal }: { type: keyof typeof MEAL_META; meal: MealItem }) {
  const [open, setOpen] = useState(false)
  const { label, icon } = MEAL_META[type]

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 hover:bg-white/3 transition-colors text-left active:bg-white/5"
        style={{ minHeight: '60px' }}
      >
        <div className="flex items-center gap-3 min-w-0 py-3">
          <span className="text-xl shrink-0">{icon}</span>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-slate-200 truncate">{meal.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="text-xs text-slate-500 font-medium">{meal.calories} kcal</span>
          <span
            className="text-slate-600 text-xs transition-transform duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >▼</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <p className="text-sm text-slate-500 mb-3 leading-relaxed pt-2">{meal.description}</p>
          <div className="flex flex-wrap gap-2">
            {meal.ingredients.map((ing, i) => (
              <span
                key={i}
                className="text-sm px-3 py-1.5 rounded-full text-slate-400"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {ing.name}
                <span className="text-slate-600 ml-1">{ing.amount}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DayCard({ meal }: { meal: DailyMeal }) {
  return (
    <div
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{ background: 'rgba(34,197,94,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="font-bold text-green-400">Day {meal.day}</span>
        <span className="text-sm text-slate-500">
          총 <span className="text-green-400 font-bold">{meal.total_calories.toLocaleString()}</span> kcal
        </span>
      </div>
      <MealRow type="breakfast" meal={meal.breakfast} />
      <MealRow type="lunch"     meal={meal.lunch} />
      <MealRow type="dinner"    meal={meal.dinner} />
    </div>
  )
}
