interface KpiCardProps {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'negative'
}

export function KpiCard({ label, value, hint, tone = 'default' }: KpiCardProps) {
  return (
    <div className="kpi">
      <dt className="kpi-label">{label}</dt>
      <dd className={`kpi-value${tone === 'negative' ? ' kpi-negative' : ''}`}>{value}</dd>
      {hint && <dd className="kpi-hint">{hint}</dd>}
    </div>
  )
}
