import type { Cents, Ride } from '../types/ride'

export const MAX_RIDE_MINUTES = 720

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/** Minutos entre início e fim. Se o fim for "menor", assume que virou a meia-noite. */
export function minutesBetween(start: string, end: string): number {
  const diff = timeToMinutes(end) - timeToMinutes(start)
  return diff <= 0 ? diff + 24 * 60 : diff
}

/** Duração em minutos, ou null se desconhecida. Horários têm prioridade sobre a duração manual. */
export function rideDurationMinutes(ride: Ride): number | null {
  if (ride.startTime !== null && ride.endTime !== null) {
    return minutesBetween(ride.startTime, ride.endTime)
  }
  return ride.durationMinutes
}

/** Valor bruto = base + gorjeta + bônus. */
export function rideGrossCents(ride: Ride): Cents {
  return ride.baseAmountCents + ride.tipAmountCents + ride.bonusAmountCents
}

/** Valor líquido de taxas = bruto − taxas. */
export function rideNetCents(ride: Ride): Cents {
  return rideGrossCents(ride) - ride.platformFeesCents
}
