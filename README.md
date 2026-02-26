# RecipeVault API

A RESTful "headless" backend API for managing personal recipes and their ingredients.
Built with **Node.js**, **Express**, **PostgreSQL** (pg), **bcrypt**, and **JWT**.

---

## Project Concept

RecipeVault lets users securely store and manage their own recipes. Each recipe can have
multiple ingredients, forming a clean one-to-many relationship chain:

```
Users ──< Recipes ──< Ingredients
```

---

## Tech Stack

| Layer        | Technology           |
|--------------|----------------------|
| Runtime      | Node.js              |
| Framework    | Express.js           |
| Database     | PostgreSQL (Render)  |
| DB Driver    | pg (node-postgres)   |
| Auth         | JWT (jsonwebtoken)   |
| Passwords    | bcrypt (12 rounds)   |
| Environment  | dotenv               |

---

## Project Structure

```
.
├── server.js                           # Entry point
├── schema.sql                          # Run once to create tables (PostgreSQL)
├── .env.example                        # Template – copy to .env
├── RecipeVault.postman_collection.json # API documentation (import into Postman)
├── src/
│   ├── app.js                          # Express app setup & route registration
│   ├── config/
│   │   └── db.js                       # pg connection pool (DATABASE_URL)
│   ├── middleware/
│   │   └── authMiddleware.js           # JWT Bearer token verification
│   ├── controllers/
│   │   ├── authController.js           # Register / Login logic
│   │   ├── recipeController.js         # Recipe CRUD
│   │   └── ingredientController.js     # Ingredient CRUD
│   └── routes/
│       ├── authRoutes.js               # POST /api/auth/...
│       ├── recipeRoutes.js             # /api/recipes/...
│       └── ingredientRoutes.js         # /api/ingredients/...
```

---

## Data Models

### Table 1: Users
| Column     | Type         | Notes                     |
|------------|--------------|---------------------------|
| id         | SERIAL PK    | Auto-increment            |
| name       | VARCHAR(100) | Required                  |
| email      | VARCHAR(150) | Unique                    |
| password   | VARCHAR(255) | bcrypt hashed – 12 rounds |
| created_at | TIMESTAMP    | Auto set                  |

### Table 2: Recipes
| Column      | Type         | Notes                          |
|-------------|--------------|--------------------------------|
| id          | SERIAL PK    |                                |
| user_id     | INTEGER FK   | → users.id (CASCADE DELETE)    |
| title       | VARCHAR(200) | Required                       |
| description | TEXT         |                                |
| category    | VARCHAR(50)  |                                |
| prep_time   | INTEGER      | Minutes                        |
| cook_time   | INTEGER      | Minutes                        |
| servings    | INTEGER      | Default 1                      |
| created_at  | TIMESTAMP    |                                |
| updated_at  | TIMESTAMP    | Auto-updated via trigger       |

### Table 3: Ingredients
| Column     | Type          | Notes                          |
|------------|---------------|--------------------------------|
| id         | SERIAL PK     |                                |
| recipe_id  | INTEGER FK    | → recipes.id (CASCADE DELETE)  |
| name       | VARCHAR(150)  | Required                       |
| quantity   | NUMERIC(10,2) |                                |
| unit       | VARCHAR(50)   | e.g. "cups", "g"               |
| notes      | TEXT          |                                |
| created_at | TIMESTAMP     |                                |

**Relationships:**
- Users → Recipes: One-to-Many (one user can have many recipes)
- Recipes → Ingredients: One-to-Many (one recipe can have many ingredients)
- Foreign keys enforce referential integrity with ON DELETE CASCADE

---

## API Endpoints

### Auth (Public — no token required)
| Method | Endpoint              | Description         | Status |
|--------|-----------------------|---------------------|--------|
| POST   | /api/auth/register    | Create account      | 201    |
| POST   | /api/auth/login       | Get JWT token       | 200    |

### Recipes (Protected — Bearer Token required)
| Method | Endpoint                           | Description                   | Status  |
|--------|------------------------------------|-------------------------------|---------|
| GET    | /api/recipes                       | Get all recipes for user      | 200     |
| GET    | /api/recipes/:id                   | Get recipe + ingredients      | 200/404 |
| POST   | /api/recipes                       | Create a recipe               | 201     |
| PUT    | /api/recipes/:id                   | Update a recipe               | 200/404 |
| DELETE | /api/recipes/:id                   | Delete a recipe               | 200/404 |
| GET    | /api/recipes/:recipeId/ingredients | List ingredients for a recipe | 200/404 |
| POST   | /api/recipes/:recipeId/ingredients | Add ingredient to a recipe    | 201     |

### Ingredients (Protected — Bearer Token required)
| Method | Endpoint                  | Description             | Status  |
|--------|---------------------------|-------------------------|---------|
| GET    | /api/ingredients/:id      | Get single ingredient   | 200/404 |
| PUT    | /api/ingredients/:id      | Update an ingredient    | 200/404 |
| DELETE | /api/ingredients/:id      | Delete an ingredient    | 200/404 |

---

## HTTP Status Codes Used

| Code | Meaning                                    |
|------|--------------------------------------------|
| 200  | OK – successful GET / UPDATE / DELETE      |
| 201  | Created – successful POST                  |
| 400  | Bad Request – missing required fields      |
| 401  | Unauthorized – invalid or missing JWT      |
| 404  | Not Found – resource doesn't exist         |
| 409  | Conflict – email already registered        |
| 500  | Internal Server Error                      |

---

## Authentication Flow

1. `POST /api/auth/register` → returns `userId`
2. `POST /api/auth/login` → returns `token`
3. Add this header to every protected request:
   ```
   Authorization: Bearer <token>
   ```

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env from template
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET

# 3. Start dev server
npm run dev
```

---

## Deployment

- **Live API:** https://recipevault-api.onrender.com
- **Database:** Render PostgreSQL
- **Environment variables on Render:** `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`
