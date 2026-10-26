import type { Expense } from '../types/expense'
import type { Ride } from '../types/ride'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** Confere só o essencial, para ignorar registros corrompidos no localStorage. */
export function isRide(value: unknown): value is Ride {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.date === 'string' &&
    typeof value.baseAmountCents === 'number' &&
    typeof value.tipAmountCents === 'number' &&
    typeof value.bonusAmountCents === 'number' &&
    typeof value.platformFeesCents === 'number' &&
    typeof value.isDemo === 'boolean'
  )
}

export function isExpense(value: unknown): value is Expense {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.date === 'string' &&
    typeof value.category === 'string' &&
    typeof value.amountCents === 'number' &&
    typeof value.isDemo === 'boolean'
  )
}
