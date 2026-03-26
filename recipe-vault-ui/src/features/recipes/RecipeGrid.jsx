import RecipeCard from './RecipeCard'
import EmptyState from '../../components/shared/EmptyState'
import { CATEGORIES } from '../../data/mockRecipes'

/**
 * RecipeGrid
 * Renders the filterable, searchable grid of recipe cards.
 *
 * Props:
 *   recipes         {array}    - full recipe list
 *   activeCategory  {string}   - 'All' or a category name
 *   searchQuery     {string}
 *   onSelectRecipe  {Function} - called with recipe id
 *   onDeleteRecipe  {Function} - called with recipe id
 *   onAddRecipe     {Function} - opens add-recipe modal
 */
export default function RecipeGrid({
  recipes,
  activeCategory,
  searchQuery,
  onSelectRecipe,
  onDeleteRecipe,
  onAddRecipe,
}) {
  // Filter by category
  const afterCategory =
    activeCategory === 'All'
      ? recipes
      : recipes.filter((r) => r.category === activeCategory)

  // Filter by search query (title + description, case-insensitive)
  const query = searchQuery.trim().toLowerCase()
  const visible = query
    ? afterCategory.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          (r.description ?? '').toLowerCase().includes(query)
      )
    : afterCategory

  return (
    <div>
      {/* Page top */}
      <div className="page-top">
        <div>
          <h2 className="page-top__heading">
            {activeCategory === 'All' ? 'All Recipes' : activeCategory}
          </h2>
          <p className="page-top__sub">
            {visible.length} recipe{visible.length !== 1 ? 's' : ''}
            {query ? ` matching "${query}"` : ''}
          </p>
        </div>
        <button className="btn btn--primary" onClick={onAddRecipe}>
          + New Recipe
        </button>
      </div>

      {/* Category filter pills */}
      <div className="filter-bar">
        <button
          className={`filter-pill ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => {/* handled by sidebar, but pill also works */}}
          style={{ pointerEvents: 'none', opacity: activeCategory === 'All' ? 1 : 0.5 }}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <span
            key={cat}
            className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
            style={{ pointerEvents: 'none', opacity: activeCategory === cat ? 1 : 0.4 }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Grid or empty state */}
      {visible.length === 0 ? (
        <EmptyState
          icon="📖"
          title={query ? 'No results found' : 'No recipes yet'}
          desc={
            query
              ? `No recipes match "${searchQuery}". Try a different search.`
              : 'Click "New Recipe" to add your first recipe to this collection.'
          }
          action={
            !query && (
              <button className="btn btn--primary" onClick={onAddRecipe}>
                Add your first recipe
              </button>
            )
          }
        />
      ) : (
        <div className="recipe-grid">
          {visible.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => onSelectRecipe(recipe.id)}
              onDelete={onDeleteRecipe}
            />
          ))}
        </div>
      )}
    </div>
  )
}
