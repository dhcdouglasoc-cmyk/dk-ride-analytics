import { formatCents, formatDuration, formatKm } from '../domain/money'
import type { Metrics } from '../domain/metrics'
import { KpiCard } from './KpiCard'

const NO_DATA = '—'

function coverage(known: number, total: number, what: string): string | undefined {
  if (total === 0) return undefined
  if (known === 0) return `Sem ${what} nas corridas`
  if (known < total) return `Calculado sobre ${known} de ${total} corridas`
  return undefined
}

export function KpiGrid({ metrics }: { metrics: Metrics }) {
  const m = metrics
  return (
    <dl className="kpi-grid">
      <KpiCard
        label="Ganhos brutos"
        value={formatCents(m.grossCents)}
        hint={`Líquido de taxas: ${formatCents(m.netCents)}`}
      />
      <KpiCard label="Corridas" value={String(m.rideCount)} />
      <KpiCard
        label="Distância"
        value={m.ridesWithDistance > 0 ? formatKm(m.distanceKm) : NO_DATA}
        hint={coverage(m.ridesWithDistance, m.rideCount, 'distância')}
      />
      <KpiCard
        label="Tempo trabalhado"
        value={m.ridesWithDuration > 0 ? formatDuration(m.minutesWorked) : NO_DATA}
        hint={coverage(m.ridesWithDuration, m.rideCount, 'duração')}
      />
      <KpiCard
        label="Média por corrida"
        value={m.avgPerRideCents !== null ? formatCents(m.avgPerRideCents) : NO_DATA}
      />
      <KpiCard
        label="Média por hora"
        value={m.avgPerHourCents !== null ? formatCents(m.avgPerHourCents) : NO_DATA}
        hint={coverage(m.ridesWithDuration, m.rideCount, 'duração') ?? 'Líquido de taxas'}
      />
      <KpiCard
        label="Custos registrados"
        value={formatCents(m.expensesCents)}
        hint={m.costPerKmCents !== null ? `${formatCents(m.costPerKmCents)} por km` : undefined}
      />
      <KpiCard
        label="Lucro estimado"
        value={formatCents(m.estimatedProfitCents)}
        hint="Líquido de taxas − custos lançados"
        tone={m.estimatedProfitCents < 0 ? 'negative' : 'default'}
      />
    </dl>
  )
}
