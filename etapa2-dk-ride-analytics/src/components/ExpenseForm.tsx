import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { emptyExpenseForm, validateExpenseForm } from '../domain/expenseValidation'
import type { ExpenseFormErrors, ExpenseFormValues } from '../domain/expenseValidation'
import { EXPENSE_CATEGORIES } from '../types/expense'
import type { ExpenseCategory, ExpenseInput } from '../types/expense'
import { Field } from './Field'

interface ExpenseFormProps {
  today: string
  onAdd: (expense: ExpenseInput) => void
}

export function ExpenseForm({ today, onAdd }: ExpenseFormProps) {
  const [values, setValues] = useState<ExpenseFormValues>(() => emptyExpenseForm(today))
  const [errors, setErrors] = useState<ExpenseFormErrors>({})
  const [saved, setSaved] = useState(false)

  function handleChange(field: keyof ExpenseFormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value
      setValues((previous) => ({
        ...previous,
        [field]: field === 'category' ? (value as ExpenseCategory) : value,
      }))
      setSaved(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateExpenseForm(values, today)
    if (!result.ok) {
      setErrors(result.errors)
      setSaved(false)
      return
    }
    onAdd(result.value)
    setErrors({})
    setValues({ ...emptyExpenseForm(today), date: values.date, category: values.category })
    setSaved(true)
  }

  function a11y(field: keyof ExpenseFormValues, id: string) {
    return {
      id,
      'aria-invalid': Boolean(errors[field]),
      'aria-describedby': `${id}-hint ${id}-error`,
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>Nova despesa</h2>
      <p className="muted">
        Registre cada gasto uma única vez, na data em que pagou. Ele entra no período
        pela data, sem ser dividido entre corridas.
      </p>

      <div className="field-row">
        <Field id="expense-date" label="Data" error={errors.date}>
          <input type="date" max={today} value={values.date} onChange={handleChange('date')} {...a11y('date', 'expense-date')} />
        </Field>
        <Field id="expense-amount" label="Valor (R$)" error={errors.amount}>
          <input type="text" inputMode="decimal" placeholder="50,00" value={values.amount} onChange={handleChange('amount')} {...a11y('amount', 'expense-amount')} />
        </Field>
      </div>

      <Field id="expense-category" label="Categoria" error={errors.category}>
        <select value={values.category} onChange={handleChange('category')} {...a11y('category', 'expense-category')}>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="expense-notes" label="Observações" hint="Opcional." error={errors.notes}>
        <input type="text" maxLength={200} value={values.notes} onChange={handleChange('notes')} {...a11y('notes', 'expense-notes')} />
      </Field>

      <button type="submit" className="button-primary">Salvar despesa</button>
      {saved && (
        <p className="form-status" role="status">
          Despesa salva.
        </p>
      )}
    </form>
  )
}
