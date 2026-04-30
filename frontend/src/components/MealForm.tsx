import { useState } from 'react'
import type { DietGoal } from '../types'
import { GOALS } from '../constants/goals'

interface Props {
  selectedGoal: DietGoal
  loading: boolean
  onSubmit: (days: number, calories: number | null, allergies: string[]) => void
}

const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7]

export default function MealForm({ selectedGoal, loading, onSubmit }: Props) {
  const goalInfo = GOALS.find(g => g.key === selectedGoal)!
  const [days, setDays] = useState(3)
  const [calories, setCalories] = useState('')
  const [allergyInput, setAllergyInput] = useState('')
  const [allergies, setAllergies] = useState<string[]>([])

  const addAllergy = () => {
    const trimmed = allergyInput.trim()
    if (trimmed && !allergies.includes(trimmed)) setAllergies([...allergies, trimmed])
    setAllergyInput('')
  }

  return (
    <div
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {/* 기간 선택 */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          식단 기간
        </label>
        <div className="flex gap-2">
          {DAY_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className="flex-1 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
              style={{
                height: '48px',
                background: days === d
                  ? 'linear-gradient(135deg, #22c55e, #06b6d4)'
                  : 'rgba(255,255,255,0.05)',
                border: days === d ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: days === d ? 'white' : '#64748b',
                boxShadow: days === d ? '0 4px 12px rgba(34,197,94,0.3)' : 'none',
              }}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-2 text-center">{days}일치 식단 생성</p>
      </div>

      {/* 칼로리 */}
      <div className="px-5 py-4 border-b border-white/5">
        <label className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-300">하루 목표 칼로리</span>
          <span className="text-xs text-slate-600">선택사항</span>
        </label>
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            placeholder={`기본 ${goalInfo.defaultCalories.toLocaleString()}`}
            value={calories}
            onChange={e => setCalories(e.target.value)}
            className="w-full rounded-xl px-4 py-3.5 pr-14 text-slate-200 placeholder-slate-600 outline-none border border-white/8 transition-all focus:border-green-500/50"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-600">kcal</span>
        </div>
      </div>

      {/* 알레르기 */}
      <div className="px-5 py-4 border-b border-white/5">
        <label className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-300">알레르기 / 제외 식품</span>
          <span className="text-xs text-slate-600">선택사항</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="예: 땅콩, 우유, 밀"
            value={allergyInput}
            onChange={e => setAllergyInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addAllergy()}
            className="flex-1 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-600 outline-none border border-white/8 transition-all focus:border-green-500/50"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          <button
            onClick={addAllergy}
            className="px-4 rounded-xl text-sm text-slate-400 border border-white/8 hover:border-white/20 hover:text-slate-200 transition-all active:scale-95 shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', minWidth: '56px' }}
          >
            추가
          </button>
        </div>
        {allergies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {allergies.map(item => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-red-400 text-sm px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {item}
                <button
                  onClick={() => setAllergies(allergies.filter(a => a !== item))}
                  className="hover:text-red-300 text-base leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 생성 버튼 */}
      <div className="p-5">
        <button
          onClick={() => onSubmit(days, calories ? Number(calories) : null, allergies)}
          disabled={loading}
          className="w-full rounded-xl font-bold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
          style={{
            height: '56px',
            fontSize: '16px',
            background: loading
              ? 'rgba(34,197,94,0.3)'
              : 'linear-gradient(135deg, #22c55e, #06b6d4)',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(34,197,94,0.3)',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              AI가 식단을 생성하는 중...
            </span>
          ) : '✦  AI 식단 생성하기'}
        </button>
      </div>
    </div>
  )
}
