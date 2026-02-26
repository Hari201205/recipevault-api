// Recipe Routes
// All routes are protected – authenticate middleware runs first.
const express = require('express');
const router  = express.Router();

const authenticate = require('../middleware/authMiddleware');

const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

const {
  getIngredientsByRecipe,
  createIngredient,
} = require('../controllers/ingredientController');

// Apply JWT check to every recipe route
router.use(authenticate);

// Standard CRUD for recipes
router.get('/',    getAllRecipes);   // GET  /api/recipes
router.get('/:id', getRecipeById);  // GET  /api/recipes/:id
router.post('/',   createRecipe);   // POST /api/recipes
router.put('/:id', updateRecipe);   // PUT  /api/recipes/:id
router.delete('/:id', deleteRecipe);// DELETE /api/recipes/:id

// Nested ingredient routes (scoped to a recipe)
router.get('/:recipeId/ingredients',  getIngredientsByRecipe); // GET  /api/recipes/:recipeId/ingredients
router.post('/:recipeId/ingredients', createIngredient);       // POST /api/recipes/:recipeId/ingredients

module.exports = router;
