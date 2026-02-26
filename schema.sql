-- ============================================================
-- RecipeVault – PostgreSQL Database Schema (Render)
-- Run this once using the Render Shell or psql with your
-- External Database URL.
-- ============================================================

-- ── Table 1: Users ────────────────────────────────────────────────────────────
-- Stores user account information. Passwords are bcrypt-hashed.
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL, -- bcrypt hashed, never plain text
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Table 2: Recipes ──────────────────────────────────────────────────────────
-- Each recipe belongs to one user (1-to-many: users → recipes).
-- ON DELETE CASCADE removes recipes when the parent user is deleted.
CREATE TABLE IF NOT EXISTS recipes (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER      NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  category    VARCHAR(50),
  prep_time   INTEGER,     -- preparation time in minutes
  cook_time   INTEGER,     -- cooking time in minutes
  servings    INTEGER      DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trigger to auto-update updated_at on recipe changes (PostgreSQL requires this)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Table 3: Ingredients ──────────────────────────────────────────────────────
-- Each ingredient belongs to one recipe (1-to-many: recipes → ingredients).
-- ON DELETE CASCADE removes ingredients when the parent recipe is deleted.
CREATE TABLE IF NOT EXISTS ingredients (
  id         SERIAL PRIMARY KEY,
  recipe_id  INTEGER       NOT NULL,
  name       VARCHAR(150)  NOT NULL,
  quantity   NUMERIC(10,2),
  unit       VARCHAR(50),
  notes      TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
