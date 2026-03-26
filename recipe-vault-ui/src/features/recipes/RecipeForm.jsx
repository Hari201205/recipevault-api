import { useState } from 'react'
import { CATEGORIES } from '../../data/mockRecipes'

// Multi-step form – three steps to add a new recipe
// Step 1: Basic info  (title, category, description)
// Step 2: Timing      (prep_time, cook_time, servings)
// Step 3: Review & Save

const STEPS = ['Basic Info', 'Timing', 'Review']

const EMPTY = {
  title:       '',
  category:    'Other',
  description: '',
  prep_time:   '',
  cook_time:   '',
  servings:    '1',
}

function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {STEPS.map((label, i) => {
        const done   = i < current
        const active = i === current
        return (
          <div key={label} className="step-indicator__step">
            <div className={`step-indicator__dot ${done ? 'done' : active ? 'active' : ''}`}>
              {done ? '✓' : i + 1}
            </div>
            <span className={`step-indicator__label ${active ? 'active' : ''}`}>{label}</span>
            {i < STEPS.length - 1 && (
              <div className={`step-indicator__line ${done ? 'done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/**
 * RecipeForm
 * Multi-step controlled form for creating a new recipe.
 *
 * Props:
 *   onSubmit {Function} - called with the completed recipe data object
 *   onCancel {Function}
 */
export default function RecipeForm({ onSubmit, onCancel }) {
  const [step,   setStep]   = useState(0)
  const [fields, setFields] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const update = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // Step-level validation
  const validateStep = () => {
    const errs = {}
    if (step === 0) {
      if (!fields.title.trim()) errs.title = 'Recipe title is required.'
    }
    if (step === 1) {
      if (fields.prep_time && isNaN(Number(fields.prep_time))) errs.prep_time = 'Must be a number.'
      if (fields.cook_time && isNaN(Number(fields.cook_time))) errs.cook_time = 'Must be a number.'
      if (!fields.servings || Number(fields.servings) < 1)    errs.servings  = 'Servings must be at least 1.'
    }
    return errs
  }

  const next = () => {
    const errs = validateStep()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep((s) => s + 1)
  }

  const back = () => setStep((s) => s - 1)

  const handleSubmit = () => {
    onSubmit({
      title:       fields.title.trim(),
      description: fields.description.trim(),
      category:    fields.category,
      prep_time:   Number(fields.prep_time) || 0,
      cook_time:   Number(fields.cook_time) || 0,
      servings:    Number(fields.servings)  || 1,
    })
  }

  return (
    <div>
      <StepIndicator current={step} />

      {/* ── Step 0: Basic Info ── */}
      {step === 0 && (
        <div className="form-fields">
          <div className="field">
            <label htmlFor="rf-title">Recipe Title *</label>
            <input
              id="rf-title"
              name="title"
              type="text"
              placeholder="e.g. Beef Bourguignon"
              value={fields.title}
              onChange={update}
              className={errors.title ? 'error' : ''}
              autoFocus
            />
            {errors.title && <span className="field__error">{errors.title}</span>}
          </div>

          <div className="field">
            <label htmlFor="rf-category">Category</label>
            <select id="rf-category" name="category" value={fields.category} onChange={update}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="rf-desc">Description</label>
            <textarea
              id="rf-desc"
              name="description"
              placeholder="A short description of the dish…"
              value={fields.description}
              onChange={update}
              rows={3}
            />
          </div>
        </div>
      )}

      {/* ── Step 1: Timing ── */}
      {step === 1 && (
        <div className="form-fields">
          <div className="form-row">
            <div className="field">
              <label htmlFor="rf-prep">Prep Time (min)</label>
              <input
                id="rf-prep"
                name="prep_time"
                type="number"
                min="0"
                placeholder="15"
                value={fields.prep_time}
                onChange={update}
                className={errors.prep_time ? 'error' : ''}
              />
              {errors.prep_time && <span className="field__error">{errors.prep_time}</span>}
            </div>

            <div className="field">
              <label htmlFor="rf-cook">Cook Time (min)</label>
              <input
                id="rf-cook"
                name="cook_time"
                type="number"
                min="0"
                placeholder="30"
                value={fields.cook_time}
                onChange={update}
                className={errors.cook_time ? 'error' : ''}
              />
              {errors.cook_time && <span className="field__error">{errors.cook_time}</span>}
            </div>
          </div>

          <div className="field" style={{ maxWidth: '160px' }}>
            <label htmlFor="rf-servings">Servings</label>
            <input
              id="rf-servings"
              name="servings"
              type="number"
              min="1"
              placeholder="4"
              value={fields.servings}
              onChange={update}
              className={errors.servings ? 'error' : ''}
            />
            {errors.servings && <span className="field__error">{errors.servings}</span>}
          </div>

          {(fields.prep_time || fields.cook_time) && (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Total time:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {(Number(fields.prep_time) || 0) + (Number(fields.cook_time) || 0)} min
              </strong>
            </p>
          )}
        </div>
      )}

      {/* ── Step 2: Review ── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Review your recipe details before saving.
          </p>

          {[
            { label: 'Title',       val: fields.title       || '—' },
            { label: 'Category',    val: fields.category    || '—' },
            { label: 'Description', val: fields.description || '—' },
            { label: 'Prep time',   val: fields.prep_time   ? `${fields.prep_time} min` : '—' },
            { label: 'Cook time',   val: fields.cook_time   ? `${fields.cook_time} min` : '—' },
            { label: 'Servings',    val: fields.servings    || '1' },
          ].map(({ label, val }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '10px 0',
                borderBottom: '1px solid var(--cream-dark)',
                fontSize: '0.875rem',
              }}
            >
              <span style={{ width: '100px', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{val}</span>
            </div>
          ))}

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            You can add ingredients after saving.
          </p>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="form-step-actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={step === 0 ? onCancel : back}
        >
          {step === 0 ? 'Cancel' : '← Back'}
        </button>

        {step < STEPS.length - 1 ? (
          <button type="button" className="btn btn--primary" onClick={next}>
            Continue →
          </button>
        ) : (
          <button type="button" className="btn btn--secondary" onClick={handleSubmit}>
            ✓ Save Recipe
          </button>
        )}
      </div>
    </div>
  )
}
