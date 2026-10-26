const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatCents(cents: number): string {
  return brl.format(cents / 100)
}

/**
 * Converte texto digitado ("12,50", "1.234,56", "12.5") em número com até
 * 2 casas decimais. Devolve null se o formato não for claro.
 * "1.234" (sem vírgula) é rejeitado de propósito: poderia ser 1,234 ou 1234.
 */
function parseDecimal(text: string): number | null {
  const cleaned = text.replace(/\s|R\$/g, '')
  if (cleaned === '') return null
  const normalized = cleaned.includes(',')
    ? cleaned.replace(/\./g, '').replace(',', '.')
    : cleaned
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null
  return Number(normalized)
}

export function parseMoneyToCents(text: string): number | null {
  const value = parseDecimal(text)
  return value === null ? null : Math.round(value * 100)
}

/** 1250 -> "12,50" (para preencher campos ao editar). Zero vira vazio. */
export function centsToInput(cents: number): string {
  return cents === 0 ? '' : (cents / 100).toFixed(2).replace('.', ',')
}

export function parseKm(text: string): number | null {
  return parseDecimal(text)
}

export function formatKm(km: number): string {
  return `${km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)
  if (hours === 0) return `${minutes}min`
  return `${hours}h ${String(minutes).padStart(2, '0')}min`
}

/** "2026-10-25" -> "25/10/2026" (sem usar Date, para evitar problemas de fuso). */
export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}
