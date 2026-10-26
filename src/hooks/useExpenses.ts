import { useCallback } from 'react'
import { isExpense } from '../data/guards'
import { EXPENSES_KEY } from '../data/storage'
import type { Expense, ExpenseInput } from '../types/expense'
import { usePersistentList } from './usePersistentList'

export function useExpenses() {
  const [expenses, setExpenses] = usePersistentList<Expense>(EXPENSES_KEY, isExpense)

  const addExpense = useCallback(
    (input: ExpenseInput) => {
      const now = new Date().toISOString()
      const expense: Expense = {
        ...input,
        id: crypto.randomUUID(),
        isDemo: false,
        createdAt: now,
        updatedAt: now,
      }
      setExpenses((previous) => [...previous, expense])
    },
    [setExpenses],
  )

  const updateExpense = useCallback(
    (id: string, input: ExpenseInput) => {
      const now = new Date().toISOString()
      setExpenses((previous) =>
        previous.map((expense) =>
          expense.id === id ? { ...expense, ...input, updatedAt: now } : expense,
        ),
      )
    },
    [setExpenses],
  )

  const deleteExpense = useCallback(
    (id: string) => setExpenses((previous) => previous.filter((expense) => expense.id !== id)),
    [setExpenses],
  )

  const addDemoExpenses = useCallback(
    (demoExpenses: Expense[]) => setExpenses((previous) => [...previous, ...demoExpenses]),
    [setExpenses],
  )

  const removeDemoExpenses = useCallback(
    () => setExpenses((previous) => previous.filter((expense) => !expense.isDemo)),
    [setExpenses],
  )

  return { expenses, addExpense, updateExpense, deleteExpense, addDemoExpenses, removeDemoExpenses }
}
