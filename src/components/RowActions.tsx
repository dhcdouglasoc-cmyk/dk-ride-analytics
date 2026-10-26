import { useState } from 'react'

interface RowActionsProps {
  /** Descrição curta para leitores de tela, ex.: "corrida de 25/10/2026". */
  what: string
  onEdit: () => void
  onDelete: () => void
}

/** Editar / Excluir com confirmação na própria linha (sem janelas pop-up). */
export function RowActions({ what, onEdit, onDelete }: RowActionsProps) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="row-actions" role="group" aria-label={`Confirmar exclusão da ${what}`}>
        <span>Excluir?</span>
        <button type="button" className="button-danger" onClick={onDelete}>
          Sim, excluir
        </button>
        <button type="button" className="button-link" onClick={() => setConfirming(false)}>
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <div className="row-actions">
      <button type="button" className="button-link" onClick={onEdit} aria-label={`Editar ${what}`}>
        Editar
      </button>
      <button
        type="button"
        className="button-link"
        onClick={() => setConfirming(true)}
        aria-label={`Excluir ${what}`}
      >
        Excluir
      </button>
    </div>
  )
}
