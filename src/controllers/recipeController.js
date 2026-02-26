// Recipe Controller
// Handles full CRUD for the recipes resource.
// Every operation is scoped to the authenticated user (req.user.userId).
const pool = require('../config/db');

// ── GET /api/recipes ──────────────────────────────────────────────────────────
// Returns all recipes belonging to the logged-in user, newest first.
const getAllRecipes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('getAllRecipes error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── GET /api/recipes/:id ──────────────────────────────────────────────────────
// Returns a single recipe with its full ingredients list.
// Returns 404 if the recipe doesn't exist or doesn't belong to this user.
const getRecipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const recipeResult = await pool.query(
      'SELECT * FROM recipes WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    // Eagerly load ingredients so clients get everything in one request
    const ingredientResult = await pool.query(
      'SELECT * FROM ingredients WHERE recipe_id = $1 ORDER BY id ASC',
      [id]
    );

    res.status(200).json({ ...recipeResult.rows[0], ingredients: ingredientResult.rows });
  } catch (err) {
    console.error('getRecipeById error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── POST /api/recipes ─────────────────────────────────────────────────────────
// Creates a new recipe for the authenticated user.
const createRecipe = async (req, res) => {
  const { title, description, category, prep_time, cook_time, servings } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO recipes (user_id, title, description, category, prep_time, cook_time, servings)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        req.user.userId,
        title,
        description || null,
        category    || null,
        prep_time   || null,
        cook_time   || null,
        servings    || 1,
      ]
    );

    res.status(201).json({
      message:  'Recipe created successfully.',
      recipeId: result.rows[0].id,
    });
  } catch (err) {
    console.error('createRecipe error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── PUT /api/recipes/:id ──────────────────────────────────────────────────────
// Updates an existing recipe. Only the owner can update it.
const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, prep_time, cook_time, servings } = req.body;

  try {
    // Confirm ownership before updating
    const existing = await pool.query(
      'SELECT id FROM recipes WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    await pool.query(
      `UPDATE recipes
       SET title = $1, description = $2, category = $3, prep_time = $4, cook_time = $5, servings = $6
       WHERE id = $7 AND user_id = $8`,
      [title, description, category, prep_time, cook_time, servings, id, req.user.userId]
    );

    res.status(200).json({ message: 'Recipe updated successfully.' });
  } catch (err) {
    console.error('updateRecipe error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── DELETE /api/recipes/:id ───────────────────────────────────────────────────
// Deletes a recipe and all its ingredients (cascades via FK constraint).
const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM recipes WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully.' });
  } catch (err) {
    console.error('deleteRecipe error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe };
