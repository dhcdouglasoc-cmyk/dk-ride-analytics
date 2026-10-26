import { useEffect, useState } from 'react'
import { loadList, saveList } from '../data/storage'

/**
 * Lista guardada no localStorage. Lê uma vez na criação do estado e
 * grava sempre que a lista muda.
 */
export function usePersistentList<T>(key: string, isItem: (value: unknown) => value is T) {
  const [items, setItems] = useState<T[]>(() => loadList(key, isItem))

  useEffect(() => {
    saveList(key, items)
  }, [key, items])

  return [items, setItems] as const
}
