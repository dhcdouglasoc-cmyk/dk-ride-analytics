import { PERIOD_OPTIONS } from '../domain/period'
import type { PeriodKey } from '../domain/period'

interface PeriodFilterProps {
  value: PeriodKey
  onChange: (key: PeriodKey) => void
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <div className="period-filter" role="radiogroup" aria-label="Período">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          role="radio"
          aria-checked={option.key === value}
          className="period-option"
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
