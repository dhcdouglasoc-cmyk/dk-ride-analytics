import type { Ride, RideInput } from '../types/ride'
import { centsToInput, parseKm, parseMoneyToCents } from './money'
import { MAX_RIDE_MINUTES, minutesBetween } from './rides'

export interface RideFormValues {
  date: string
  startTime: string
  endTime: string
  durationMinutes: string
  distanceKm: string
  base: string
  tip: string
  bonus: string
  fees: string
  platform: string
  notes: string
}

export type RideFormErrors = Partial<Record<keyof RideFormValues, string>>

export type RideValidation =
  | { ok: true; value: RideInput }
  | { ok: false; errors: RideFormErrors }

export function emptyRideForm(today: string): RideFormValues {
  return {
    date: today,
    startTime: '',
    endTime: '',
    durationMinutes: '',
    distanceKm: '',
    base: '',
    tip: '',
    bonus: '',
    fees: '',
    platform: '',
    notes: '',
  }
}

export function rideToFormValues(ride: Ride): RideFormValues {
  return {
    date: ride.date,
    startTime: ride.startTime ?? '',
    endTime: ride.endTime ?? '',
    durationMinutes: ride.durationMinutes === null ? '' : String(ride.durationMinutes),
    distanceKm: ride.distanceKm === null ? '' : String(ride.distanceKm).replace('.', ','),
    base: centsToInput(ride.baseAmountCents),
    tip: centsToInput(ride.tipAmountCents),
    bonus: centsToInput(ride.bonusAmountCents),
    fees: centsToInput(ride.platformFeesCents),
    platform: ride.platform ?? '',
    notes: ride.notes,
  }
}

const MONEY_HINT = 'Use números, com vírgula para centavos. Ex.: 12,50'

/** Campo de dinheiro opcional: vazio vale 0. */
function optionalMoney(text: string, errors: RideFormErrors, field: keyof RideFormValues): number {
  if (text.trim() === '') return 0
  const cents = parseMoneyToCents(text)
  if (cents === null) {
    errors[field] = MONEY_HINT
    return 0
  }
  return cents
}

export function validateRideForm(values: RideFormValues, today: string): RideValidation {
  const errors: RideFormErrors = {}

  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
    errors.date = 'Informe a data da corrida.'
  } else if (values.date > today) {
    errors.date = 'A data não pode ser no futuro.'
  }

  const hasStart = values.startTime !== ''
  const hasEnd = values.endTime !== ''
  if (hasStart && !hasEnd) errors.endTime = 'Informe também o horário de término.'
  if (!hasStart && hasEnd) errors.startTime = 'Informe também o horário de início.'

  let durationMinutes: number | null = null
  if (hasStart && hasEnd) {
    const minutes = minutesBetween(values.startTime, values.endTime)
    if (values.startTime === values.endTime) {
      errors.endTime = 'Início e término não podem ser iguais.'
    } else if (minutes > MAX_RIDE_MINUTES) {
      errors.endTime = 'Duração acima de 12 horas. Confira os horários.'
    }
  } else if (values.durationMinutes.trim() !== '') {
    const parsed = Number(values.durationMinutes)
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_RIDE_MINUTES) {
      errors.durationMinutes = 'Informe minutos inteiros, de 1 a 720.'
    } else {
      durationMinutes = parsed
    }
  }

  let distanceKm: number | null = null
  if (values.distanceKm.trim() !== '') {
    const parsed = parseKm(values.distanceKm)
    if (parsed === null || parsed <= 0 || parsed > 300) {
      errors.distanceKm = 'Informe a distância entre 0,1 e 300 km. Ex.: 4,5'
    } else {
      distanceKm = parsed
    }
  }

  const baseAmountCents = parseMoneyToCents(values.base)
  if (baseAmountCents === null || baseAmountCents <= 0) {
    errors.base = 'Informe o valor da corrida, maior que zero. ' + MONEY_HINT
  }
  const tipAmountCents = optionalMoney(values.tip, errors, 'tip')
  const bonusAmountCents = optionalMoney(values.bonus, errors, 'bonus')
  const platformFeesCents = optionalMoney(values.fees, errors, 'fees')

  if (
    baseAmountCents !== null &&
    !errors.tip &&
    !errors.bonus &&
    !errors.fees &&
    platformFeesCents > baseAmountCents + tipAmountCents + bonusAmountCents
  ) {
    errors.fees = 'As taxas não podem ser maiores que o valor bruto.'
  }

  if (values.platform.trim().length > 40) errors.platform = 'Use até 40 caracteres.'
  if (values.notes.trim().length > 200) errors.notes = 'Use até 200 caracteres.'

  if (Object.keys(errors).length > 0 || baseAmountCents === null) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: {
      date: values.date,
      startTime: hasStart && hasEnd ? values.startTime : null,
      endTime: hasStart && hasEnd ? values.endTime : null,
      durationMinutes,
      distanceKm,
      baseAmountCents,
      tipAmountCents,
      bonusAmountCents,
      platformFeesCents,
      platform: values.platform.trim() === '' ? null : values.platform.trim(),
      notes: values.notes.trim(),
    },
  }
}
