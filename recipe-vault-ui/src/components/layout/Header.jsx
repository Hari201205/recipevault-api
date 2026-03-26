import { useState } from 'react'

/**
 * Header
 * Top navigation bar with page title, live search, and add-recipe button.
 *
 * Props:
 *   title       {string}
 *   breadcrumb  {string}
 *   searchQuery {string}
 *   onSearch    {Function}  - called with the current input value
 *   onAddRecipe {Function}  - opens the add-recipe modal
 */
export default function Header({ title, breadcrumb, searchQuery, onSearch, onAddRecipe }) {
  const [focused, setFocused] = useState(false)

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">{title}</h1>
        {breadcrumb && <span className="header__breadcrumb">{breadcrumb}</span>}
      </div>

      <div className="header__right">
        {/* Live search */}
        <div className={`search-bar${focused ? ' focused' : ''}`}>
          <span className="search-bar__icon">🔍</span>
          <input
            type="text"
            placeholder="Search recipes…"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search recipes"
          />
          {searchQuery && (
            <button
              className="btn btn--icon"
              style={{ padding: '2px 4px', fontSize: '0.75rem' }}
              onClick={() => onSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Add recipe */}
        {onAddRecipe && (
          <button className="btn btn--primary btn--sm" onClick={onAddRecipe}>
            + Add Recipe
          </button>
        )}
      </div>
    </header>
  )
}
