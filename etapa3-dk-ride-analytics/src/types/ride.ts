/** Valores em dinheiro são sempre guardados em centavos (inteiros). */
export type Cents = number

export interface Ride {
  id: string
  /** Data local da corrida, formato AAAA-MM-DD. */
  date: string
  /** HH:MM. Só existe junto com endTime. */
  startTime: string | null
  endTime: string | null
  /** Duração informada à mão. Só é usada quando não há horários. */
  durationMinutes: number | null
  distanceKm: number | null
  baseAmountCents: Cents
  tipAmountCents: Cents
  bonusAmountCents: Cents
  platformFeesCents: Cents
  platform: string | null
  notes: string
  /** true = registro fictício de demonstração. */
  isDemo: boolean
  createdAt: string
  updatedAt: string
}

/** Dados que o usuário informa. O resto (id, datas de controle) o sistema gera. */
export type RideInput = Omit<Ride, 'id' | 'isDemo' | 'createdAt' | 'updatedAt'>
