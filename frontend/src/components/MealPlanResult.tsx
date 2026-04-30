import type { MealPlan } from '../types'
import DayCard from './DayCard'

export default function MealPlanResult({ plan }: { plan: MealPlan }) {
  const avgCalories = Math.round(
    plan.plan.reduce((sum, d) => sum + d.total_calories, 0) / plan.plan.length
  )

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-widest">생성된 식단</span>
          <h3 className="font-bold text-slate-100 mt-0.5">{plan.goal} · {plan.days}일</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500">일 평균</span>
          <div className="text-sm font-bold text-green-400">{avgCalories.toLocaleString()} kcal</div>
        </div>
      </div>

      <div className="space-y-3">
        {plan.plan.map(day => (
          <DayCard key={day.day} meal={day} />
        ))}
      </div>
    </div>
  )
}
