import type { GoalInfo, DietGoal } from '../types'

interface Props {
  goal: GoalInfo
  selected: boolean
  onClick: (key: DietGoal) => void
}

export default function GoalCard({ goal, selected, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(goal.key)}
      className={`
        relative w-full rounded-2xl border text-left transition-all duration-300 overflow-hidden
        active:scale-[0.97]
        ${selected
          ? 'border-green-500/60 glow-green'
          : 'border-white/8 hover:border-white/20'
        }
      `}
      style={{
        backdropFilter: 'blur(12px)',
        background: selected
          ? 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(6,182,212,0.06))'
          : 'rgba(255,255,255,0.03)',
        minHeight: '140px',
        padding: '18px 16px',
      }}
    >
      {selected && (
        <div
          className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.25), transparent 70%)' }}
        />
      )}

      <div className="text-4xl mb-3">{goal.emoji}</div>

      <div className={`font-bold text-base mb-1 ${selected ? 'text-green-400' : 'text-slate-100'}`}>
        {goal.label}
      </div>

      <div className="text-xs text-slate-500 leading-relaxed">
        {goal.description}
      </div>

      <div className={`mt-2.5 text-xs font-medium ${selected ? 'text-green-500' : 'text-slate-600'}`}>
        기본 {goal.defaultCalories.toLocaleString()} kcal
      </div>
    </button>
  )
}
