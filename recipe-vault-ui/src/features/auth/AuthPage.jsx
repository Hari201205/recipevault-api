import { useState } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validate(mode, fields) {
  const errs = {}
  if (!fields.email.trim())                  errs.email    = 'Email is required.'
  else if (!/\S+@\S+\.\S+/.test(fields.email)) errs.email = 'Enter a valid email address.'
  if (!fields.password)                      errs.password = 'Password is required.'
  else if (fields.password.length < 6)       errs.password = 'Password must be at least 6 characters.'
  if (mode === 'register') {
    if (!fields.name.trim())                 errs.name = 'Name is required.'
    if (fields.password !== fields.confirm)  errs.confirm = 'Passwords do not match.'
  }
  return errs
}

// ─── LoginForm ────────────────────────────────────────────────────────────────

function LoginForm({ onAuth, onSwitch }) {
  const [fields,  setFields]  = useState({ email: '', password: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [alert,   setAlert]   = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    // Clear individual field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setAlert('')
    const errs = validate('login', fields)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    // Simulate a 600 ms network delay (no real API call in Sprint 2)
    setTimeout(() => {
      setLoading(false)
      onAuth({ id: 1, name: 'Chef', email: fields.email })
    }, 600)
  }

  return (
    <div className="auth-form-box">
      <div>
        <h2 className="auth-form-box__heading">Welcome back</h2>
        <p className="auth-form-box__sub">Sign in to access your recipe collection.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-fields">
          {alert && <div className="form-alert form-alert--error">{alert}</div>}

          <div className="field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={fields.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field__error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={fields.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="field__error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </div>
      </form>

      <p className="auth-toggle">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitch}>Create one</button>
      </p>
    </div>
  )
}

// ─── RegisterForm ─────────────────────────────────────────────────────────────

function RegisterForm({ onAuth, onSwitch }) {
  const [fields,  setFields]  = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate('register', fields)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onAuth({ id: 1, name: fields.name.trim(), email: fields.email.trim() })
    }, 700)
  }

  return (
    <div className="auth-form-box">
      <div>
        <h2 className="auth-form-box__heading">Create account</h2>
        <p className="auth-form-box__sub">Start building your personal recipe collection.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-fields">
          <div className="field">
            <label htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Gordon Ramsay"
              value={fields.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="field__error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={fields.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field__error">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 6 chars"
                value={fields.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="field__error">{errors.password}</span>}
            </div>

            <div className="field">
              <label htmlFor="reg-confirm">Confirm</label>
              <input
                id="reg-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={fields.confirm}
                onChange={handleChange}
                className={errors.confirm ? 'error' : ''}
              />
              {errors.confirm && <span className="field__error">{errors.confirm}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </div>
      </form>

      <p className="auth-toggle">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch}>Sign in</button>
      </p>
    </div>
  )
}

// ─── AuthPage (exported) ──────────────────────────────────────────────────────

/**
 * AuthPage
 * Splits the viewport into a brand panel and a form panel.
 * Toggles between LoginForm and RegisterForm using local state.
 *
 * Props:
 *   onAuth {Function} - called with user object on successful auth
 */
export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login')

  return (
    <div className="auth-shell">
      {/* Left brand panel */}
      <div className="auth-brand">
        <div className="auth-brand__logo">🍳</div>
        <h1 className="auth-brand__title">RecipeVault</h1>
        <p className="auth-brand__subtitle">
          Your personal kitchen notebook — organise, discover, and perfect your favourite recipes.
        </p>
        <ul className="auth-brand__features">
          <li>Store unlimited recipes with ingredients</li>
          <li>Organise by cuisine and category</li>
          <li>Track prep and cook times</li>
          <li>Access your collection anywhere</li>
        </ul>
      </div>

      {/* Right form panel */}
      <div className="auth-panel">
        {mode === 'login' ? (
          <LoginForm    onAuth={onAuth} onSwitch={() => setMode('register')} />
        ) : (
          <RegisterForm onAuth={onAuth} onSwitch={() => setMode('login')} />
        )}
      </div>
    </div>
  )
}
