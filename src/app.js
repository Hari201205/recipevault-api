// RecipeVault API – Express Application Configuration
// Registers global middleware and mounts all route modules
const express = require('express');
const cors = require('cors');

const authRoutes       = require('./routes/authRoutes');
const recipeRoutes     = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');

const app = express();

// ── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json()); // Parse incoming JSON request bodies

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({ message: 'RecipeVault API is running' });
});

// ── Route Modules ─────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);       // POST /register, /login
app.use('/api/recipes',     recipeRoutes);     // CRUD for recipes + nested ingredients
app.use('/api/ingredients', ingredientRoutes); // CRUD for individual ingredients

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
