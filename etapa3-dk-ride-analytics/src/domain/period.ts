export type PeriodKey = 'hoje' | '7dias' | 'mes' | 'tudo'

export const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: 'hoje', label: 'Hoje' },
  { key: '7dias', label: '7 dias' },
  { key: 'mes', label: 'Mês atual' },
  { key: 'tudo', label: 'Tudo' },
]

export interface DateRange {
  from: string | null
  to: string | null
}

/** Data local de hoje em AAAA-MM-DD (toISOString usaria UTC e erraria à noite no Brasil). */
export function todayISO(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function periodRange(key: PeriodKey, today: string): DateRange {
  switch (key) {
    case 'hoje':
      return { from: today, to: today }
    case '7dias':
      return { from: addDays(today, -6), to: today }
    case 'mes':
      return { from: `${today.slice(0, 8)}01`, to: today }
    case 'tudo':
      return { from: null, to: null }
  }
}

/** Datas ISO podem ser comparadas como texto. */
export function filterByRange<T extends { date: string }>(items: T[], range: DateRange): T[] {
  return items.filter(
    (item) =>
      (range.from === null || item.date >= range.from) &&
      (range.to === null || item.date <= range.to),
  )
}
