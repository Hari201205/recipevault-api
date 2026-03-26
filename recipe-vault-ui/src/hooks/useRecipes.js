import { useLocalStorage } from './useLocalStorage'
import { MOCK_RECIPES } from '../data/mockRecipes'

let nextRecipeId     = 100  // start above mock seed IDs
let nextIngredientId = 200

/**
 * useRecipes
 * Central state management hook for all recipe and ingredient data.
 * Persists to localStorage so data survives page refreshes.
 *
 * Sprint 2 Note: All operations are purely local (no API calls).
 * API integration is covered in Sprint 3.
 */
export function useRecipes() {
  const [recipes, setRecipes] = useLocalStorage('rv_recipes', MOCK_RECIPES)

  // ─── Recipe CRUD ──────────────────────────────────────────────────────

  /**
   * Add a new recipe to the list.
   * @param {{ title, description, category, prep_time, cook_time, servings }} data
   * @returns {number} the new recipe's id
   */
  const addRecipe = (data) => {
    const newRecipe = {
      id:          nextRecipeId++,
      title:       data.title       || 'Untitled Recipe',
      description: data.description || '',
      category:    data.category    || 'Other',
      prep_time:   Number(data.prep_time)  || 0,
      cook_time:   Number(data.cook_time)  || 0,
      servings:    Number(data.servings)   || 1,
      created_at:  new Date().toISOString(),
      ingredients: [],
    }
    setRecipes((prev) => [newRecipe, ...prev])
    return newRecipe.id
  }

  /**
   * Update an existing recipe by id.
   * @param {number} id
   * @param {object} updates
   */
  const updateRecipe = (id, updates) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, ...updates, id, ingredients: r.ingredients }
          : r
      )
    )
  }

  /**
   * Remove a recipe (and all its ingredients) by id.
   * @param {number} id
   */
  const deleteRecipe = (id) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  // ─── Ingredient CRUD ──────────────────────────────────────────────────

  /**
   * Add an ingredient to a recipe.
   * @param {number} recipeId
   * @param {{ name, quantity, unit, notes }} data
   */
  const addIngredient = (recipeId, data) => {
    const newIngredient = {
      id:       nextIngredientId++,
      name:     data.name     || '',
      quantity: data.quantity ? Number(data.quantity) : null,
      unit:     data.unit     || '',
      notes:    data.notes    || '',
    }
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId
          ? { ...r, ingredients: [...r.ingredients, newIngredient] }
          : r
      )
    )
  }

  /**
   * Remove a single ingredient from its parent recipe.
   * @param {number} recipeId
   * @param {number} ingredientId
   */
  const deleteIngredient = (recipeId, ingredientId) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId
          ? { ...r, ingredients: r.ingredients.filter((i) => i.id !== ingredientId) }
          : r
      )
    )
  }

  // ─── Derived helpers ──────────────────────────────────────────────────

  const getRecipeById = (id) => recipes.find((r) => r.id === id) ?? null

  const totalTime = (recipe) =>
    (recipe?.prep_time ?? 0) + (recipe?.cook_time ?? 0)

  return {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    addIngredient,
    deleteIngredient,
    getRecipeById,
    totalTime,
  }
}
