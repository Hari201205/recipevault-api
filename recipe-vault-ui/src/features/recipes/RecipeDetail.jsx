import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import IngredientForm from '../ingredients/IngredientForm'
import { CATEGORY_COLORS } from '../../data/mockRecipes'

/**
 * RecipeDetail
 * Full-page view for a single recipe with its ingredient list.
 *
 * Props:
 *   recipe          {object}   - full recipe object (with ingredients array)
 *   onBack          {Function} - navigate back to grid
 *   onAddIngredient {Function} - (recipeId, data) => void
 *   onDeleteIngredient {Function} - (recipeId, ingredientId) => void
 *   onDeleteRecipe  {Function} - (recipeId) => void
 */
export default function RecipeDetail({
  recipe,
  onBack,
  onAddIngredient,
  onDeleteIngredient,
  onDeleteRecipe,
}) {
  const [showIngForm, setShowIngForm] = useState(false)
  const accentColor = CATEGORY_COLORS[recipe.category] ?? '#7a8899'
  const totalTime   = (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0)

  const handleAddIngredient = (data) => {
    onAddIngredient(recipe.id, data)
    setShowIngForm(false)
  }

  const handleDeleteRecipe = () => {
    if (window.confirm(`Permanently delete "${recipe.title}"?`)) {
      onDeleteRecipe(recipe.id)
      onBack()
    }
  }

  return (
    <div>
      {/* Back link */}
      <button className="back-btn" onClick={onBack}>
        ← Back to recipes
      </button>

      <div className="detail-layout">
        {/* ── Main card ── */}
        <div className="detail-card">
          <div className="detail-card__header">
            {/* Coloured accent strip */}
            <div
              style={{
                height: '4px',
                background: accentColor,
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <h2 className="detail-card__title">{recipe.title}</h2>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <Badge label={recipe.category} />
                <button
                  className="btn btn--danger btn--sm"
                  onClick={handleDeleteRecipe}
                  title="Delete this recipe"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="detail-card__meta">
            {recipe.prep_time > 0 && (
              <div className="detail-card__meta-stat">
                <span className="detail-card__meta-val">{recipe.prep_time}</span>
                <span className="detail-card__meta-label">Prep (min)</span>
              </div>
            )}
            {recipe.cook_time > 0 && (
              <div className="detail-card__meta-stat">
                <span className="detail-card__meta-val">{recipe.cook_time}</span>
                <span className="detail-card__meta-label">Cook (min)</span>
              </div>
            )}
            {totalTime > 0 && (
              <div className="detail-card__meta-stat">
                <span className="detail-card__meta-val">{totalTime}</span>
                <span className="detail-card__meta-label">Total (min)</span>
              </div>
            )}
            <div className="detail-card__meta-stat">
              <span className="detail-card__meta-val">{recipe.servings ?? 1}</span>
              <span className="detail-card__meta-label">Servings</span>
            </div>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="detail-card__desc">{recipe.description}</p>
          )}

          {/* Ingredients section */}
          <h3 className="detail-card__section-heading">
            <span>🧂</span> Ingredients
            <span style={{ fontSize: '0.8rem', fontFamily: 'Inter', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>
              ({recipe.ingredients?.length ?? 0})
            </span>
          </h3>

          {recipe.ingredients?.length > 0 ? (
            <div className="ingredient-list">
              {recipe.ingredients.map((ing) => (
                <div key={ing.id} className="ingredient-item">
                  <div className="ingredient-item__left">
                    <span className="ingredient-item__name">{ing.name}</span>
                    {ing.notes && (
                      <span className="ingredient-item__notes">{ing.notes}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {(ing.quantity || ing.unit) && (
                      <span className="ingredient-item__qty">
                        {ing.quantity ?? ''} {ing.unit ?? ''}
                      </span>
                    )}
                    <button
                      className="btn btn--icon btn--sm"
                      style={{ color: 'var(--rust)', fontSize: '0.8rem' }}
                      onClick={() => onDeleteIngredient(recipe.id, ing.id)}
                      title="Remove ingredient"
                      aria-label={`Remove ${ing.name}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No ingredients added yet.
            </p>
          )}

          {/* Toggle inline ingredient form */}
          <div style={{ marginTop: '16px' }}>
            {showIngForm ? (
              <IngredientForm
                onSubmit={handleAddIngredient}
                onCancel={() => setShowIngForm(false)}
              />
            ) : (
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => setShowIngForm(true)}
              >
                + Add Ingredient
              </button>
            )}
          </div>
        </div>

        {/* ── Side panel: stats ── */}
        <div>
          <div className="stats-card">
            <h4 className="stats-card__title">Recipe Info</h4>
            <div className="stats-list">
              {[
                { label: 'Category',    val: recipe.category ?? 'Other' },
                { label: 'Servings',    val: recipe.servings ?? 1 },
                { label: 'Prep time',   val: recipe.prep_time  ? `${recipe.prep_time} min`  : '—' },
                { label: 'Cook time',   val: recipe.cook_time  ? `${recipe.cook_time} min`  : '—' },
                { label: 'Total time',  val: totalTime > 0     ? `${totalTime} min`          : '—' },
                { label: 'Ingredients', val: recipe.ingredients?.length ?? 0 },
                {
                  label: 'Added',
                  val: new Date(recipe.created_at).toLocaleDateString('en-CA', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  }),
                },
              ].map(({ label, val }) => (
                <div key={label} className="stats-list__item">
                  <span className="stats-list__label">{label}</span>
                  <span className="stats-list__val">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-card">
            <h4 className="stats-card__title">Time Breakdown</h4>
            {totalTime > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                {recipe.prep_time > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Prep</span>
                      <span style={{ fontWeight: 600 }}>{recipe.prep_time} min</span>
                    </div>
                    <div style={{ background: 'var(--cream-dark)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(recipe.prep_time / totalTime) * 100}%`,
                        background: '#3d7a5b',
                        borderRadius: '999px',
                        transition: 'width .4s ease',
                      }} />
                    </div>
                  </div>
                )}
                {recipe.cook_time > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Cook</span>
                      <span style={{ fontWeight: 600 }}>{recipe.cook_time} min</span>
                    </div>
                    <div style={{ background: 'var(--cream-dark)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(recipe.cook_time / totalTime) * 100}%`,
                        background: 'var(--rust)',
                        borderRadius: '999px',
                        transition: 'width .4s ease',
                      }} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No time set.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
