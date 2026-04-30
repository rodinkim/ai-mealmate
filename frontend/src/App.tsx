import { useState, useRef } from 'react'
import type { DietGoal, MealPlan } from './types'
import { GOALS } from './constants/goals'
import { generateMealPlan } from './api/mealPlan'
import GoalCard from './components/GoalCard'
import MealForm from './components/MealForm'
import MealPlanResult from './components/MealPlanResult'

export default function App() {
  const [selectedGoal, setSelectedGoal] = useState<DietGoal | null>(null)
  const [loading, setLoading] = useState(false)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const handleGoalSelect = (goal: DietGoal) => {
    setSelectedGoal(goal)
    setMealPlan(null)
    setError(null)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }

  const handleGenerate = async (days: number, calories: number | null, allergies: string[]) => {
    if (!selectedGoal) return
    setLoading(true)
    setError(null)
    setMealPlan(null)
    try {
      const plan = await generateMealPlan({ goal: selectedGoal, days, calories_per_day: calories, allergies })
      setMealPlan(plan)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#060d1a' }}>

      {/* 배경 오브 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.07), transparent 70%)' }} />
        <div className="absolute top-1/2 -right-40 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.05), transparent 70%)' }} />
      </div>

      {/* 헤더 */}
      <header
        className="sticky top-0 z-50 border-b border-white/6"
        style={{ backdropFilter: 'blur(20px)', background: 'rgba(6,13,26,0.85)' }}
      >
        <div className="max-w-lg mx-auto px-5 flex items-center gap-2.5" style={{ height: '56px' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
            style={{ background: 'linear-gradient(135deg, #22c55e, #06b6d4)' }}
          >🥦</div>
          <span className="font-bold text-slate-100 text-base">AI 식단 플래너</span>
        </div>
      </header>

      <main className="relative max-w-lg mx-auto px-4 pb-safe">

        {/* 히어로 */}
        <div className="pt-10 pb-8 space-y-4 animate-fade-up">
          <div
            className="inline-flex items-center gap-2 text-xs text-slate-500 rounded-full px-3 py-1.5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Claude AI 기반 식단 생성
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-100">
            내 목표에 맞는
            <br />
            <span style={{ background: 'linear-gradient(135deg, #22c55e, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI 맞춤 식단
            </span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            목표를 선택하면 AI가 최적의 식단을 생성합니다
          </p>
        </div>

        <div className="space-y-10">
          {/* 01 목표 선택 */}
          <section className="space-y-4 animate-fade-up-delay">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-green-500 tracking-widest">01</span>
              <span className="text-base font-semibold text-slate-200">목표를 선택하세요</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(goal => (
                <GoalCard
                  key={goal.key}
                  goal={goal}
                  selected={selectedGoal === goal.key}
                  onClick={handleGoalSelect}
                />
              ))}
            </div>
          </section>

          {/* 02 조건 설정 */}
          {selectedGoal && (
            <section ref={formRef} className="space-y-4 animate-fade-up">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-green-500 tracking-widest">02</span>
                <span className="text-base font-semibold text-slate-200">조건을 설정하세요</span>
              </div>
              <MealForm selectedGoal={selectedGoal} loading={loading} onSubmit={handleGenerate} />
            </section>
          )}

          {/* 에러 */}
          {error && (
            <div
              className="rounded-2xl px-5 py-4 text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              {error}
            </div>
          )}

          {/* 03 결과 */}
          {mealPlan && (
            <section ref={resultRef} className="space-y-4 pb-10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-green-500 tracking-widest">03</span>
                <span className="text-base font-semibold text-slate-200">생성된 식단</span>
              </div>
              <MealPlanResult plan={mealPlan} />
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
