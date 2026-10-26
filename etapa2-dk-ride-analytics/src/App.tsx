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
import { calculateMetrics } from './domain/metrics'
import { filterByRange, periodRange, todayISO } from './domain/period'
import type { PeriodKey } from './domain/period'
import { useExpenses } from './hooks/useExpenses'
import { useRides } from './hooks/useRides'

function App() {
  // Data de hoje fixada na abertura do app (se ficar aberto após a meia-noite, recarregue).
  const [today] = useState(() => todayISO())
  const [period, setPeriod] = useState<PeriodKey>('7dias')
  const [showDemo, setShowDemo] = useState(true)

  const { rides, addRide, addDemoRides, removeDemoRides } = useRides()
  const { expenses, addExpense, addDemoExpenses, removeDemoExpenses } = useExpenses()

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
            <RideForm today={today} onAdd={addRide} />
            <ExpenseForm today={today} onAdd={addExpense} />
            <DemoPanel
              hasDemo={hasDemo}
              showDemo={showDemo}
              onShowDemoChange={setShowDemo}
              onLoad={handleLoadDemo}
              onRemove={handleRemoveDemo}
            />
          </div>
          <div className="layout-column">
            <RideList rides={periodRides} />
            <ExpenseList expenses={periodExpenses} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
