// Ingredient Routes
// Handles individual ingredient operations (read, update, delete by ID).
// Create and list-by-recipe are handled in recipeRoutes as nested routes.
const express = require('express');
const router  = express.Router();

const authenticate = require('../middleware/authMiddleware');

const {
  getIngredientById,
  updateIngredient,
  deleteIngredient,
} = require('../controllers/ingredientController');

// Protect all ingredient routes with JWT authentication
router.use(authenticate);

router.get('/:id',    getIngredientById); // GET    /api/ingredients/:id
router.put('/:id',    updateIngredient);  // PUT    /api/ingredients/:id
router.delete('/:id', deleteIngredient); // DELETE /api/ingredients/:id

module.exports = router;
