import { EXPENSE_CATEGORIES } from '../types/expense'
import type { ExpenseCategory, ExpenseInput } from '../types/expense'
import type { Expense } from '../types/expense'
import { centsToInput, parseMoneyToCents } from './money'

export interface ExpenseFormValues {
  date: string
  category: ExpenseCategory
  amount: string
  notes: string
}

export type ExpenseFormErrors = Partial<Record<keyof ExpenseFormValues, string>>

export type ExpenseValidation =
  | { ok: true; value: ExpenseInput }
  | { ok: false; errors: ExpenseFormErrors }

export function emptyExpenseForm(today: string): ExpenseFormValues {
  return { date: today, category: 'combustivel', amount: '', notes: '' }
}

export function expenseToFormValues(expense: Expense): ExpenseFormValues {
  return {
    date: expense.date,
    category: expense.category,
    amount: centsToInput(expense.amountCents),
    notes: expense.notes,
  }
}

export function validateExpenseForm(values: ExpenseFormValues, today: string): ExpenseValidation {
  const errors: ExpenseFormErrors = {}

  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
    errors.date = 'Informe a data da despesa.'
  } else if (values.date > today) {
    errors.date = 'A data não pode ser no futuro.'
  }

  if (!EXPENSE_CATEGORIES.some((category) => category.value === values.category)) {
    errors.category = 'Escolha uma categoria.'
  }

  const amountCents = parseMoneyToCents(values.amount)
  if (amountCents === null || amountCents <= 0) {
    errors.amount = 'Informe o valor, maior que zero. Use vírgula para centavos. Ex.: 50,00'
  }

  if (values.notes.trim().length > 200) errors.notes = 'Use até 200 caracteres.'

  if (Object.keys(errors).length > 0 || amountCents === null) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: {
      date: values.date,
      category: values.category,
      amountCents,
      notes: values.notes.trim(),
    },
  }
}
