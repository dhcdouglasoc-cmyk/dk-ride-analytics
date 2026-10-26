export const RIDES_KEY = 'dk-ride-analytics:rides:v1'
export const EXPENSES_KEY = 'dk-ride-analytics:expenses:v1'

export function loadList<T>(key: string, isItem: (value: unknown) => value is T): T[] {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isItem) : []
  } catch {
    return []
  }
}

export function saveList<T>(key: string, items: T[]): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(items))
    return true
  } catch {
    return false
  }
}
