import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { emptyRideForm, validateRideForm } from '../domain/rideValidation'
import type { RideFormErrors, RideFormValues } from '../domain/rideValidation'
import type { RideInput } from '../types/ride'
import { Field } from './Field'

interface RideFormProps {
  today: string
  onSubmit: (ride: RideInput) => void
  /** Se informado, o formulário está editando um registro existente. */
  initial?: RideFormValues
  onCancel?: () => void
}

export function RideForm({ today, onSubmit, initial, onCancel }: RideFormProps) {
  const [values, setValues] = useState<RideFormValues>(() => initial ?? emptyRideForm(today))
  const [errors, setErrors] = useState<RideFormErrors>({})
  const [saved, setSaved] = useState(false)

  const hasTimes = values.startTime !== '' || values.endTime !== ''

  function handleChange(field: keyof RideFormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((previous) => ({ ...previous, [field]: event.target.value }))
      setSaved(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateRideForm(values, today)
    if (!result.ok) {
      setErrors(result.errors)
      setSaved(false)
      return
    }
    onSubmit(result.value)
    if (initial) return
    setErrors({})
    setValues({ ...emptyRideForm(today), date: values.date, platform: values.platform })
    setSaved(true)
  }

  function a11y(field: keyof RideFormValues, id: string) {
    return {
      id,
      'aria-invalid': Boolean(errors[field]),
      'aria-describedby': `${id}-hint ${id}-error`,
    }
  }

  return (
    <form id="ride-form" className="card form" onSubmit={handleSubmit} noValidate>
      <h2>{initial ? 'Editar corrida' : 'Nova corrida'}</h2>

      <Field id="ride-date" label="Data" error={errors.date}>
        <input type="date" max={today} value={values.date} onChange={handleChange('date')} {...a11y('date', 'ride-date')} />
      </Field>

      <div className="field-row">
        <Field id="ride-start" label="Início" error={errors.startTime}>
          <input type="time" value={values.startTime} onChange={handleChange('startTime')} {...a11y('startTime', 'ride-start')} />
        </Field>
        <Field id="ride-end" label="Término" error={errors.endTime}>
          <input type="time" value={values.endTime} onChange={handleChange('endTime')} {...a11y('endTime', 'ride-end')} />
        </Field>
      </div>

      <div className="field-row">
        <Field
          id="ride-duration"
          label="Duração (min)"
          hint={hasTimes ? 'Calculada pelos horários.' : 'Use se não souber os horários.'}
          error={errors.durationMinutes}
        >
          <input
            type="text"
            inputMode="numeric"
            disabled={hasTimes}
            value={hasTimes ? '' : values.durationMinutes}
            onChange={handleChange('durationMinutes')}
            {...a11y('durationMinutes', 'ride-duration')}
          />
        </Field>
        <Field id="ride-km" label="Distância (km)" hint="Opcional. Ex.: 4,5" error={errors.distanceKm}>
          <input type="text" inputMode="decimal" value={values.distanceKm} onChange={handleChange('distanceKm')} {...a11y('distanceKm', 'ride-km')} />
        </Field>
      </div>

      <fieldset>
        <legend>Valores (R$)</legend>
        <div className="field-row">
          <Field id="ride-base" label="Valor da corrida" error={errors.base}>
            <input type="text" inputMode="decimal" placeholder="12,50" value={values.base} onChange={handleChange('base')} {...a11y('base', 'ride-base')} />
          </Field>
          <Field id="ride-tip" label="Gorjeta" error={errors.tip}>
            <input type="text" inputMode="decimal" value={values.tip} onChange={handleChange('tip')} {...a11y('tip', 'ride-tip')} />
          </Field>
        </div>
        <div className="field-row">
          <Field id="ride-bonus" label="Bônus" error={errors.bonus}>
            <input type="text" inputMode="decimal" value={values.bonus} onChange={handleChange('bonus')} {...a11y('bonus', 'ride-bonus')} />
          </Field>
          <Field id="ride-fees" label="Taxas e descontos" error={errors.fees}>
            <input type="text" inputMode="decimal" value={values.fees} onChange={handleChange('fees')} {...a11y('fees', 'ride-fees')} />
          </Field>
        </div>
      </fieldset>

      <Field id="ride-platform" label="Aplicativo" hint="Opcional." error={errors.platform}>
        <input type="text" maxLength={40} value={values.platform} onChange={handleChange('platform')} {...a11y('platform', 'ride-platform')} />
      </Field>

      <Field id="ride-notes" label="Observações" hint="Opcional." error={errors.notes}>
        <textarea rows={2} maxLength={200} value={values.notes} onChange={handleChange('notes')} {...a11y('notes', 'ride-notes')} />
      </Field>

      <div className="form-actions">
        <button type="submit" className="button-primary">
          {initial ? 'Salvar alterações' : 'Salvar corrida'}
        </button>
        {onCancel && (
          <button type="button" className="button-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
      {saved && (
        <p className="form-status" role="status">
          Corrida salva.
        </p>
      )}
    </form>
  )
}
