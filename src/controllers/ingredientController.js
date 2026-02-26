// Ingredient Controller
// Handles full CRUD for the ingredients resource.
// Authorization is enforced by verifying the parent recipe belongs to the logged-in user.
const pool = require('../config/db');

// ── Helper ────────────────────────────────────────────────────────────────────
// Confirms the recipe exists AND belongs to the requesting user.
const verifyRecipeOwnership = async (recipeId, userId) => {
  const result = await pool.query(
    'SELECT id FROM recipes WHERE id = $1 AND user_id = $2',
    [recipeId, userId]
  );
  return result.rows.length > 0;
};

// ── GET /api/recipes/:recipeId/ingredients ────────────────────────────────────
// Returns all ingredients for a specific recipe (owned by the user).
const getIngredientsByRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const isOwner = await verifyRecipeOwnership(recipeId, req.user.userId);
    if (!isOwner) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    const result = await pool.query(
      'SELECT * FROM ingredients WHERE recipe_id = $1 ORDER BY id ASC',
      [recipeId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('getIngredientsByRecipe error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── GET /api/ingredients/:id ──────────────────────────────────────────────────
// Returns a single ingredient. Uses a JOIN to confirm the parent recipe belongs to the user.
const getIngredientById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT i.*
       FROM ingredients i
       JOIN recipes r ON i.recipe_id = r.id
       WHERE i.id = $1 AND r.user_id = $2`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('getIngredientById error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── POST /api/recipes/:recipeId/ingredients ───────────────────────────────────
// Adds a new ingredient to a recipe. Recipe must belong to the user.
const createIngredient = async (req, res) => {
  const { recipeId } = req.params;
  const { name, quantity, unit, notes } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Ingredient name is required.' });
  }

  try {
    const isOwner = await verifyRecipeOwnership(recipeId, req.user.userId);
    if (!isOwner) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    const result = await pool.query(
      'INSERT INTO ingredients (recipe_id, name, quantity, unit, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [recipeId, name, quantity || null, unit || null, notes || null]
    );

    res.status(201).json({
      message:      'Ingredient added successfully.',
      ingredientId: result.rows[0].id,
    });
  } catch (err) {
    console.error('createIngredient error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── PUT /api/ingredients/:id ──────────────────────────────────────────────────
// Updates an ingredient. Verifies ownership via the parent recipe.
const updateIngredient = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, unit, notes } = req.body;

  try {
    // JOIN ensures only the owner can modify the ingredient
    const existing = await pool.query(
      `SELECT i.id
       FROM ingredients i
       JOIN recipes r ON i.recipe_id = r.id
       WHERE i.id = $1 AND r.user_id = $2`,
      [id, req.user.userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found.' });
    }

    await pool.query(
      'UPDATE ingredients SET name = $1, quantity = $2, unit = $3, notes = $4 WHERE id = $5',
      [name, quantity, unit, notes, id]
    );

    res.status(200).json({ message: 'Ingredient updated successfully.' });
  } catch (err) {
    console.error('updateIngredient error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── DELETE /api/ingredients/:id ───────────────────────────────────────────────
// Deletes an ingredient. Verifies ownership via the parent recipe.
const deleteIngredient = async (req, res) => {
  const { id } = req.params;
  try {
    // JOIN ensures only the owner can delete the ingredient
    const existing = await pool.query(
      `SELECT i.id
       FROM ingredients i
       JOIN recipes r ON i.recipe_id = r.id
       WHERE i.id = $1 AND r.user_id = $2`,
      [id, req.user.userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found.' });
    }

    await pool.query('DELETE FROM ingredients WHERE id = $1', [id]);

    res.status(200).json({ message: 'Ingredient deleted successfully.' });
  } catch (err) {
    console.error('deleteIngredient error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  getIngredientsByRecipe,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
