import { useState } from 'react'

const EMPTY = { name: '', quantity: '', unit: '', notes: '' }

/**
 * IngredientForm
 * Inline controlled form for adding a single ingredient.
 *
 * Props:
 *   onSubmit {Function} - called with { name, quantity, unit, notes }
 *   onCancel {Function}
 */
export default function IngredientForm({ onSubmit, onCancel }) {
  const [fields, setFields] = useState(EMPTY)
  const [error,  setError]  = useState('')

  const update = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (name === 'name') setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!fields.name.trim()) {
      setError('Ingredient name is required.')
      return
    }
    onSubmit({
      name:     fields.name.trim(),
      quantity: fields.quantity ? Number(fields.quantity) : null,
      unit:     fields.unit.trim(),
      notes:    fields.notes.trim(),
    })
    setFields(EMPTY)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--cream)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '.04em', color: 'var(--text-secondary)' }}>
        Add Ingredient
      </p>

      {/* Name */}
      <div className="field">
        <label htmlFor="ing-name">Name *</label>
        <input
          id="ing-name"
          name="name"
          type="text"
          placeholder="e.g. Olive oil"
          value={fields.name}
          onChange={update}
          className={error ? 'error' : ''}
          autoFocus
        />
        {error && <span className="field__error">{error}</span>}
      </div>

      {/* Quantity + Unit on same row */}
      <div className="form-row">
        <div className="field">
          <label htmlFor="ing-qty">Quantity</label>
          <input
            id="ing-qty"
            name="quantity"
            type="number"
            min="0"
            step="any"
            placeholder="2"
            value={fields.quantity}
            onChange={update}
          />
        </div>
        <div className="field">
          <label htmlFor="ing-unit">Unit</label>
          <input
            id="ing-unit"
            name="unit"
            type="text"
            placeholder="cups, g, tbsp…"
            value={fields.unit}
            onChange={update}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="field">
        <label htmlFor="ing-notes">Notes</label>
        <input
          id="ing-notes"
          name="notes"
          type="text"
          placeholder="e.g. finely chopped"
          value={fields.notes}
          onChange={update}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--secondary btn--sm">
          + Add
        </button>
      </div>
    </form>
  )
}
