import { useState } from 'react'
import { useRecipes }  from './hooks/useRecipes'
import { useLocalStorage } from './hooks/useLocalStorage'

import AuthPage     from './features/auth/AuthPage'
import RecipeGrid   from './features/recipes/RecipeGrid'
import RecipeDetail from './features/recipes/RecipeDetail'
import RecipeForm   from './features/recipes/RecipeForm'

import Sidebar from './components/layout/Sidebar'
import Header  from './components/layout/Header'
import Modal   from './components/ui/Modal'

/**
 * App
 * Root component – owns all top-level UI state.
 *
 * State overview:
 *   user            – authenticated user object (null = logged out)
 *   selectedId      – id of the recipe currently being viewed (null = grid)
 *   activeCategory  – category filter applied to the grid
 *   searchQuery     – live search string
 *   showModal       – whether the "Add Recipe" modal is open
 */
export default function App() {
  // Auth state persisted across page refreshes
  const [user, setUser, clearUser] = useLocalStorage('rv_user', null)

  // View state
  const [selectedId,     setSelectedId]     = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery,    setSearchQuery]     = useState('')
  const [showModal,      setShowModal]       = useState(false)

  // Recipe state via custom hook (persists to localStorage)
  const {
    recipes,
    addRecipe,
    deleteRecipe,
    addIngredient,
    deleteIngredient,
    getRecipeById,
  } = useRecipes()

  // ─── Auth handlers ─────────────────────────────────────────────────────────
  const handleAuth = (userObj) => setUser(userObj)

  const handleLogout = () => {
    if (window.confirm('Sign out?')) {
      clearUser()
      setSelectedId(null)
    }
  }

  // ─── Recipe handlers ────────────────────────────────────────────────────────
  const handleAddRecipe = (data) => {
    const newId = addRecipe(data)
    setShowModal(false)
    setSelectedId(newId)   // jump straight to the new recipe's detail view
  }

  const handleDeleteRecipe = (id) => {
    deleteRecipe(id)
    if (selectedId === id) setSelectedId(null)
  }

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setSelectedId(null)    // go back to grid when the user changes category
  }

  // ─── Derived ───────────────────────────────────────────────────────────────
  const selectedRecipe = selectedId ? getRecipeById(selectedId) : null

  // Determine the header title / breadcrumb
  const headerTitle = selectedRecipe
    ? selectedRecipe.title
    : activeCategory === 'All' ? 'My Recipes' : activeCategory

  const headerBreadcrumb = selectedRecipe
    ? `Recipes › ${selectedRecipe.category}`
    : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} saved`

  // ─── Not logged in ─────────────────────────────────────────────────────────
  if (!user) return <AuthPage onAuth={handleAuth} />

  // ─── Logged in ─────────────────────────────────────────────────────────────
  return (
    <>
      <div className="app-shell">
        <Sidebar
          user={user}
          activeCategory={activeCategory}
          onCategory={handleCategoryChange}
          onLogout={handleLogout}
          recipeCount={recipes.length}
        />

        <Header
          title={headerTitle}
          breadcrumb={headerBreadcrumb}
          searchQuery={searchQuery}
          onSearch={(q) => { setSearchQuery(q); setSelectedId(null) }}
          onAddRecipe={selectedRecipe ? null : () => setShowModal(true)}
        />

        <main className="main-content">
          {selectedRecipe ? (
            <RecipeDetail
              recipe={selectedRecipe}
              onBack={() => setSelectedId(null)}
              onAddIngredient={addIngredient}
              onDeleteIngredient={deleteIngredient}
              onDeleteRecipe={handleDeleteRecipe}
            />
          ) : (
            <RecipeGrid
              recipes={recipes}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              onSelectRecipe={setSelectedId}
              onDeleteRecipe={handleDeleteRecipe}
              onAddRecipe={() => setShowModal(true)}
            />
          )}
        </main>
      </div>

      {/* Add Recipe Modal */}
      {showModal && (
        <Modal title="New Recipe" onClose={() => setShowModal(false)}>
          <RecipeForm
            onSubmit={handleAddRecipe}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </>
  )
}
