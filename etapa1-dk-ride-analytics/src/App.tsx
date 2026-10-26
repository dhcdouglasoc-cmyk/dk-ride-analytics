import { DemoBadge } from './components/DemoBadge'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">DK Ride Analytics</h1>
        <DemoBadge />
      </header>

      <main className="app-main">
        <section className="card" aria-labelledby="status-title">
          <h2 id="status-title">Base do projeto pronta</h2>
          <p>
            Os indicadores, o formulário de corridas e o histórico entram na
            próxima etapa, depois da validação das fórmulas.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
