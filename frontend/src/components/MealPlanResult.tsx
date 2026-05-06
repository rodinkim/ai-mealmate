import type { MealPlan } from '../types'
import CoupangSpotlight from './CoupangSpotlight'
import DayCard from './DayCard'

function dayTotalCalories(d: MealPlan['plan'][number]): number {
  if (typeof d.total_calories === 'number') return d.total_calories
  const sum =
    (d.breakfast?.calories ?? 0) + (d.lunch?.calories ?? 0) + (d.dinner?.calories ?? 0)
  return sum
}

export default function MealPlanResult({ plan }: { plan: MealPlan }) {
  const n = plan.plan.length
  const avgCalories =
    n === 0 ? 0 : Math.round(plan.plan.reduce((sum, d) => sum + dayTotalCalories(d), 0) / n)

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

      <CoupangSpotlight />

      <p className="text-xs text-slate-500 leading-relaxed pt-3 border-t border-white/8">
        재료 링크는 쿠팡 검색 페이지로 연결됩니다. 본 서비스는 쿠팡 파트너스 활동의 일환으로, 이에 따른
        일정액의 수수료를 제공받을 수 있습니다.
      </p>
    </div>
  )
}
