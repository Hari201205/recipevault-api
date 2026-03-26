import { CATEGORIES, CATEGORY_COLORS } from '../../data/mockRecipes'

/**
 * Sidebar
 * Fixed left navigation panel.
 *
 * Props:
 *   user            {object}   - { name, email }
 *   activeCategory  {string}   - currently selected category filter
 *   onCategory      {Function} - called with category string (or 'All')
 *   onLogout        {Function}
 *   recipeCount     {number}
 */
export default function Sidebar({
  user,
  activeCategory,
  onCategory,
  onLogout,
  recipeCount,
}) {
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">🍳</div>
        <span className="sidebar__logo-text">RecipeVault</span>
      </div>

      {/* Main nav */}
      <div className="sidebar__section">
        <p className="sidebar__section-label">Menu</p>
        <nav className="sidebar__nav">
          <button
            className={`sidebar__nav-item ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => onCategory('All')}
          >
            <span className="sidebar__nav-item-icon">🏠</span>
            All Recipes
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.6 }}>
              {recipeCount}
            </span>
          </button>
        </nav>
      </div>

      {/* Category filters */}
      <div className="sidebar__section">
        <p className="sidebar__section-label">Categories</p>
      </div>
      <div className="sidebar__categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`sidebar__cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onCategory(cat)}
          >
            <span
              className="sidebar__cat-dot"
              style={{ background: CATEGORY_COLORS[cat] ?? '#7a8899' }}
            />
            {cat}
          </button>
        ))}
      </div>

      {/* User footer */}
      <div className="sidebar__footer">
        <div className="sidebar__avatar">{initials}</div>
        <div className="sidebar__user-info">
          <p className="sidebar__user-name">{user?.name ?? 'Guest'}</p>
          <p className="sidebar__user-email">{user?.email ?? ''}</p>
        </div>
        <button
          className="btn btn--icon"
          onClick={onLogout}
          title="Sign out"
          style={{ color: '#8899aa' }}
        >
          ⇥
        </button>
      </div>
    </aside>
  )
}
