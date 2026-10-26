interface DemoPanelProps {
  hasDemo: boolean
  showDemo: boolean
  onShowDemoChange: (show: boolean) => void
  onLoad: () => void
  onRemove: () => void
}

export function DemoPanel({ hasDemo, showDemo, onShowDemoChange, onLoad, onRemove }: DemoPanelProps) {
  if (!hasDemo) {
    return (
      <section className="card demo-panel" aria-labelledby="demo-title">
        <h2 id="demo-title">Comece com dados de demonstração</h2>
        <p className="muted">
          Carregue 14 dias de corridas e despesas fictícias para ver os indicadores
          funcionando. Elas aparecem marcadas como demonstração e podem ser removidas
          a qualquer momento, sem afetar o que você cadastrar.
        </p>
        <button type="button" className="button-secondary" onClick={onLoad}>
          Carregar demonstração
        </button>
      </section>
    )
  }

  return (
    <section className="card demo-panel" aria-labelledby="demo-title">
      <h2 id="demo-title">Dados de demonstração</h2>
      <p className="muted">
        Valores fictícios, gerados só para testar a tela. Não representam corridas reais.
      </p>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={showDemo}
          onChange={(event) => onShowDemoChange(event.target.checked)}
        />
        Incluir nos indicadores e nas listas
      </label>
      <button type="button" className="button-secondary" onClick={onRemove}>
        Remover demonstração
      </button>
    </section>
  )
}
