import { addDays } from '../domain/period'
import type { Expense } from '../types/expense'
import type { Ride } from '../types/ride'

/** [início, duração(min), km, base, gorjeta, bônus, taxas] — valores em centavos. null = desconhecido. */
type Template = [string | null, number | null, number | null, number, number, number, number]

const RIDE_TEMPLATES: Template[] = [
  ['11:40', 22, 4.2, 1090, 0, 0, 218],
  ['12:30', 35, 6.8, 1480, 200, 0, 296],
  ['13:15', 18, 3.1, 890, 0, 0, 178],
  [null, 25, 5.0, 1200, 0, 300, 240],
  ['19:05', 30, 5.6, 1350, 150, 0, 270],
  [null, null, null, 980, 0, 0, 196],
  ['20:30', 28, 7.4, 1620, 0, 0, 324],
  ['21:10', 20, 3.8, 940, 100, 0, 188],
]

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const total = (hours * 60 + mins + minutes) % (24 * 60)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

/**
 * Gera 14 dias de registros FICTÍCIOS (isDemo = true). Os valores não vêm de
 * nenhuma corrida real. As funções de id e relógio entram por parâmetro para
 * esta função continuar pura.
 */
export function createDemoData(
  today: string,
  nowISO: string,
  newId: () => string,
): { rides: Ride[]; expenses: Expense[] } {
  const rides: Ride[] = []

  for (let offset = 13; offset >= 0; offset -= 1) {
    const ridesThatDay = 2 + (offset % 3)
    for (let i = 0; i < ridesThatDay; i += 1) {
      const [start, duration, km, base, tip, bonus, fees] =
        RIDE_TEMPLATES[(offset * 3 + i) % RIDE_TEMPLATES.length]
      const hasTimes = start !== null && duration !== null
      rides.push({
        id: newId(),
        date: addDays(today, -offset),
        startTime: hasTimes ? start : null,
        endTime: hasTimes ? addMinutes(start, duration) : null,
        durationMinutes: hasTimes ? null : duration,
        distanceKm: km,
        baseAmountCents: base,
        tipAmountCents: tip,
        bonusAmountCents: bonus,
        platformFeesCents: fees,
        platform: null,
        notes: 'Demonstração',
        isDemo: true,
        createdAt: nowISO,
        updatedAt: nowISO,
      })
    }
  }

  const expenseTemplates: [number, Expense['category'], number, string][] = [
    [12, 'combustivel', 5000, 'Abastecimento (demonstração)'],
    [6, 'combustivel', 4800, 'Abastecimento (demonstração)'],
    [1, 'combustivel', 5200, 'Abastecimento (demonstração)'],
    [9, 'manutencao', 8500, 'Troca de óleo (demonstração)'],
    [10, 'plano_celular', 3990, 'Plano mensal (demonstração)'],
  ]
  const expenses: Expense[] = expenseTemplates.map(([offset, category, amountCents, notes]) => ({
    id: newId(),
    date: addDays(today, -offset),
    category,
    amountCents,
    notes,
    isDemo: true,
    createdAt: nowISO,
    updatedAt: nowISO,
  }))

  return { rides, expenses }
}
