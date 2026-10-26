import type { Expense } from '../types/expense'
import type { Ride } from '../types/ride'
import { rideDurationMinutes, rideGrossCents, rideNetCents } from './rides'

export interface Metrics {
  rideCount: number
  grossCents: number
  feesCents: number
  netCents: number
  expensesCents: number
  /** Ganho líquido de taxas − custos registrados no período. */
  estimatedProfitCents: number
  distanceKm: number
  ridesWithDistance: number
  minutesWorked: number
  ridesWithDuration: number
  /** Ganhos brutos ÷ número de corridas. */
  avgPerRideCents: number | null
  /** Líquido ÷ horas, só sobre corridas com duração conhecida. */
  avgPerHourCents: number | null
  /** Líquido ÷ km, só sobre corridas com distância conhecida. */
  perKmCents: number | null
  /** Custos registrados ÷ km total. Indicativo. */
  costPerKmCents: number | null
}

export function calculateMetrics(rides: Ride[], expenses: Expense[]): Metrics {
  let grossCents = 0
  let feesCents = 0
  let distanceKm = 0
  let ridesWithDistance = 0
  let minutesWorked = 0
  let ridesWithDuration = 0
  let netWithDurationCents = 0
  let netWithDistanceCents = 0

  for (const ride of rides) {
    grossCents += rideGrossCents(ride)
    feesCents += ride.platformFeesCents

    const duration = rideDurationMinutes(ride)
    if (duration !== null) {
      minutesWorked += duration
      ridesWithDuration += 1
      netWithDurationCents += rideNetCents(ride)
    }
    if (ride.distanceKm !== null) {
      distanceKm += ride.distanceKm
      ridesWithDistance += 1
      netWithDistanceCents += rideNetCents(ride)
    }
  }

  const rideCount = rides.length
  const netCents = grossCents - feesCents
  const expensesCents = expenses.reduce((sum, expense) => sum + expense.amountCents, 0)

  return {
    rideCount,
    grossCents,
    feesCents,
    netCents,
    expensesCents,
    estimatedProfitCents: netCents - expensesCents,
    distanceKm,
    ridesWithDistance,
    minutesWorked,
    ridesWithDuration,
    avgPerRideCents: rideCount > 0 ? Math.round(grossCents / rideCount) : null,
    avgPerHourCents:
      minutesWorked > 0 ? Math.round((netWithDurationCents * 60) / minutesWorked) : null,
    perKmCents: distanceKm > 0 ? Math.round(netWithDistanceCents / distanceKm) : null,
    costPerKmCents: distanceKm > 0 ? Math.round(expensesCents / distanceKm) : null,
  }
}
