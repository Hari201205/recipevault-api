import Badge from '../../components/ui/Badge'
import { CATEGORY_COLORS } from '../../data/mockRecipes'

/**
 * RecipeCard
 * Displays a compact summary of a single recipe.
 *
 * Props:
 *   recipe   {object}   - recipe data object
 *   onClick  {Function} - called when the card body is clicked
 *   onDelete {Function} - called when the delete button is clicked
 */
export default function RecipeCard({ recipe, onClick, onDelete }) {
  const accentColor = CATEGORY_COLORS[recipe.category] ?? '#7a8899'
  const totalTime   = (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0)
  const ingredientCount = recipe.ingredients?.length ?? 0

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${recipe.title}"? This cannot be undone.`)) {
      onDelete(recipe.id)
    }
  }

  return (
    <article className="recipe-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Coloured accent bar based on category */}
      <div className="recipe-card__accent" style={{ background: accentColor }} />

      <div className="recipe-card__body">
        <div className="recipe-card__top">
          <h3 className="recipe-card__title">{recipe.title}</h3>
          <Badge label={recipe.category} />
        </div>

        {recipe.description && (
          <p className="recipe-card__desc">{recipe.description}</p>
        )}

        <div className="recipe-card__meta">
          {totalTime > 0 && (
            <span className="recipe-card__meta-item">
              <span className="recipe-card__meta-icon">⏱</span>
              {totalTime} min
            </span>
          )}
          <span className="recipe-card__meta-item">
            <span className="recipe-card__meta-icon">👤</span>
            {recipe.servings ?? 1} serving{recipe.servings !== 1 ? 's' : ''}
          </span>
          <span className="recipe-card__meta-item">
            <span className="recipe-card__meta-icon">🧂</span>
            {ingredientCount} ingredient{ingredientCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="recipe-card__footer">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {new Date(recipe.created_at).toLocaleDateString('en-CA', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>
        <button
          className="btn btn--icon btn--sm"
          style={{ color: 'var(--rust)', fontSize: '0.85rem' }}
          onClick={handleDelete}
          title="Delete recipe"
          aria-label={`Delete ${recipe.title}`}
        >
          🗑
        </button>
      </div>
    </article>
  )
}
