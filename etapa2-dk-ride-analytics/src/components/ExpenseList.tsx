import { formatCents, formatDateBR } from '../domain/money'
import { EXPENSE_CATEGORIES } from '../types/expense'
import type { Expense } from '../types/expense'

function categoryLabel(value: string): string {
  return EXPENSE_CATEGORIES.find((category) => category.value === value)?.label ?? value
}

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  const sorted = [...expenses].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  )

  return (
    <section className="card" aria-labelledby="expenses-title">
      <h2 id="expenses-title">Despesas ({expenses.length})</h2>
      {sorted.length === 0 ? (
        <p className="muted">Nenhuma despesa neste período.</p>
      ) : (
        <div className="table-wrap">
          <table className="records">
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Categoria</th>
                <th scope="col">Valor</th>
                <th scope="col">Observações</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((expense) => (
                <tr key={expense.id}>
                  <td data-label="Data">
                    {formatDateBR(expense.date)}
                    {expense.isDemo && <span className="demo-tag">Demo</span>}
                  </td>
                  <td data-label="Categoria">{categoryLabel(expense.category)}</td>
                  <td data-label="Valor">{formatCents(expense.amountCents)}</td>
                  <td data-label="Observações">{expense.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
