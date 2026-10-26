import type { Cents } from './ride'

export const EXPENSE_CATEGORIES = [
  { value: 'combustivel', label: 'Combustível' },
  { value: 'manutencao', label: 'Manutenção (óleo, pneus, corrente)' },
  { value: 'seguro_documentacao', label: 'Seguro e documentação' },
  { value: 'plano_celular', label: 'Plano de celular' },
  { value: 'equipamentos', label: 'Equipamentos (capacete, capa)' },
  { value: 'outros', label: 'Outros' },
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]['value']

export interface Expense {
  id: string
  date: string
  category: ExpenseCategory
  amountCents: Cents
  notes: string
  isDemo: boolean
  createdAt: string
  updatedAt: string
}

export type ExpenseInput = Omit<Expense, 'id' | 'isDemo' | 'createdAt' | 'updatedAt'>
