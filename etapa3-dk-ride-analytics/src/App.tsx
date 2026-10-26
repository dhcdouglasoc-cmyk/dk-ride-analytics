import { useState } from 'react'
import { DemoBadge } from './components/DemoBadge'
import { DemoPanel } from './components/DemoPanel'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { KpiGrid } from './components/KpiGrid'
import { PeriodFilter } from './components/PeriodFilter'
import { RideForm } from './components/RideForm'
import { RideList } from './components/RideList'
import { createDemoData } from './data/demoData'
import { expenseToFormValues } from './domain/expenseValidation'
import { rideToFormValues } from './domain/rideValidation'
import { calculateMetrics } from './domain/metrics'
import { filterByRange, periodRange, todayISO } from './domain/period'
import type { PeriodKey } from './domain/period'
import { useExpenses } from './hooks/useExpenses'
import { useRides } from './hooks/useRides'
import type { Expense, ExpenseInput } from './types/expense'
import type { Ride, RideInput } from './types/ride'

function App() {
  // Data de hoje fixada na abertura do app (se ficar aberto após a meia-noite, recarregue).
  const [today] = useState(() => todayISO())
  const [period, setPeriod] = useState<PeriodKey>('7dias')
  const [showDemo, setShowDemo] = useState(true)

  const [editingRideId, setEditingRideId] = useState<string | null>(null)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)

  const { rides, addRide, updateRide, deleteRide, addDemoRides, removeDemoRides } = useRides()
  const { expenses, addExpense, updateExpense, deleteExpense, addDemoExpenses, removeDemoExpenses } =
    useExpenses()

  const editingRide = rides.find((ride) => ride.id === editingRideId) ?? null
  const editingExpense = expenses.find((expense) => expense.id === editingExpenseId) ?? null

  const hasDemo = rides.some((ride) => ride.isDemo) || expenses.some((expense) => expense.isDemo)
  const range = periodRange(period, today)

  const periodRides = filterByRange(
    rides.filter((ride) => showDemo || !ride.isDemo),
    range,
  )
  const periodExpenses = filterByRange(
    expenses.filter((expense) => showDemo || !expense.isDemo),
    range,
  )
  const metrics = calculateMetrics(periodRides, periodExpenses)

  const demoInView =
    periodRides.some((ride) => ride.isDemo) || periodExpenses.some((expense) => expense.isDemo)

  function scrollToForm(formId: string) {
    window.requestAnimationFrame(() => {
      document.getElementById(formId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function handleSubmitRide(input: RideInput) {
    if (editingRide) {
      updateRide(editingRide.id, input)
      setEditingRideId(null)
    } else {
      addRide(input)
    }
  }

  function handleSubmitExpense(input: ExpenseInput) {
    if (editingExpense) {
      updateExpense(editingExpense.id, input)
      setEditingExpenseId(null)
    } else {
      addExpense(input)
    }
  }

  function handleEditRide(ride: Ride) {
    setEditingRideId(ride.id)
    scrollToForm('ride-form')
  }

  function handleEditExpense(expense: Expense) {
    setEditingExpenseId(expense.id)
    scrollToForm('expense-form')
  }

  function handleDeleteRide(id: string) {
    deleteRide(id)
    if (id === editingRideId) setEditingRideId(null)
  }

  function handleDeleteExpense(id: string) {
    deleteExpense(id)
    if (id === editingExpenseId) setEditingExpenseId(null)
  }

  function handleLoadDemo() {
    const demo = createDemoData(today, new Date().toISOString(), () => crypto.randomUUID())
    addDemoRides(demo.rides)
    addDemoExpenses(demo.expenses)
    setShowDemo(true)
  }

  function handleRemoveDemo() {
    removeDemoRides()
    removeDemoExpenses()
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">DK Ride Analytics</h1>
        {demoInView && <DemoBadge />}
      </header>

      <main className="app-main">
        <div className="toolbar">
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        <section aria-label="Indicadores do período">
          <KpiGrid metrics={metrics} />
          {demoInView && (
            <p className="notice">
              Os valores acima incluem dados de demonstração (fictícios).
            </p>
          )}
          <p className="muted small">
            O lucro estimado só é confiável se todas as despesas do período estiverem
            lançadas. Em períodos curtos ele pode oscilar, porque cada despesa entra
            inteira na data em que foi paga.
          </p>
        </section>

        <div className="layout">
          <div className="layout-column">
            <RideForm
              key={editingRide?.id ?? 'new-ride'}
              today={today}
              onSubmit={handleSubmitRide}
              initial={editingRide ? rideToFormValues(editingRide) : undefined}
              onCancel={editingRide ? () => setEditingRideId(null) : undefined}
            />
            <ExpenseForm
              key={editingExpense?.id ?? 'new-expense'}
              today={today}
              onSubmit={handleSubmitExpense}
              initial={editingExpense ? expenseToFormValues(editingExpense) : undefined}
              onCancel={editingExpense ? () => setEditingExpenseId(null) : undefined}
            />
            <DemoPanel
              hasDemo={hasDemo}
              showDemo={showDemo}
              onShowDemoChange={setShowDemo}
              onLoad={handleLoadDemo}
              onRemove={handleRemoveDemo}
            />
          </div>
          <div className="layout-column">
            <RideList rides={periodRides} onEdit={handleEditRide} onDelete={handleDeleteRide} />
            <ExpenseList
              expenses={periodExpenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
