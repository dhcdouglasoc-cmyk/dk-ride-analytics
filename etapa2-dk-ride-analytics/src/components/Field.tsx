import type { ReactNode } from 'react'

interface FieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

/**
 * Rótulo + campo + dica + erro. O campo (children) deve usar
 * aria-describedby={`${id}-hint ${id}-error`} e aria-invalid.
 */
export function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}
