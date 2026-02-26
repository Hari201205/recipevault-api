# RecipeVault API

A RESTful "headless" backend API for managing personal recipes and their ingredients.
Built with **Node.js**, **Express**, **MySQL** (mysql2), **bcrypt**, and **JWT**.

---

## Project Concept

RecipeVault lets users securely store and manage their own recipes. Each recipe can have
multiple ingredients, forming a clean one-to-many relationship chain:

```
Users ──< Recipes ──< Ingredients
```

---

## Tech Stack

| Layer        | Technology          |
|--------------|---------------------|
| Runtime      | Node.js             |
| Framework    | Express.js          |
| Database     | MySQL / MariaDB     |
| DB Driver    | mysql2/promise      |
| Auth         | JWT (jsonwebtoken)  |
| Passwords    | bcrypt (12 rounds)  |
| Environment  | dotenv              |

---

## Project Structure

```
.
├── server.js                      # Entry point
├── schema.sql                     # Run once to create tables
├── .env.example                   # Template – copy to .env
├── src/
│   ├── app.js                     # Express app setup
│   ├── config/
│   │   └── db.js                  # mysql2 connection pool
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── controllers/
│   │   ├── authController.js      # Register / Login logic
│   │   ├── recipeController.js    # Recipe CRUD
│   │   └── ingredientController.js# Ingredient CRUD
│   └── routes/
│       ├── authRoutes.js          # POST /api/auth/...
│       ├── recipeRoutes.js        # /api/recipes/...
│       └── ingredientRoutes.js    # /api/ingredients/...
```

---

## Data Models

### Users
| Column     | Type         | Notes                    |
|------------|--------------|--------------------------|
| id         | INT PK AI    |                          |
| name       | VARCHAR(100) | Required                 |
| email      | VARCHAR(150) | Unique                   |
| password   | VARCHAR(255) | bcrypt hashed            |
| created_at | TIMESTAMP    | Auto set                 |

### Recipes
| Column      | Type         | Notes                    |
|-------------|--------------|--------------------------|
| id          | INT PK AI    |                          |
| user_id     | INT FK       | → users.id (CASCADE)     |
| title       | VARCHAR(200) | Required                 |
| description | TEXT         |                          |
| category    | VARCHAR(50)  |                          |
| prep_time   | INT          | Minutes                  |
| cook_time   | INT          | Minutes                  |
| servings    | INT          | Default 1                |
| created_at  | TIMESTAMP    |                          |
| updated_at  | TIMESTAMP    | Auto-updates on change   |

### Ingredients
| Column    | Type          | Notes                    |
|-----------|---------------|--------------------------|
| id        | INT PK AI     |                          |
| recipe_id | INT FK        | → recipes.id (CASCADE)   |
| name      | VARCHAR(150)  | Required                 |
| quantity  | DECIMAL(10,2) |                          |
| unit      | VARCHAR(50)   | e.g. "cups", "g"         |
| notes     | TEXT          |                          |
| created_at| TIMESTAMP     |                          |

---

## API Endpoints

### Auth (Public)
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/auth/register    | Create account      |
| POST   | /api/auth/login       | Get JWT token       |

### Recipes (Protected – Bearer Token required)
| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | /api/recipes                      | Get all recipes for user       |
| GET    | /api/recipes/:id                  | Get recipe + ingredients       |
| POST   | /api/recipes                      | Create a recipe                |
| PUT    | /api/recipes/:id                  | Update a recipe                |
| DELETE | /api/recipes/:id                  | Delete a recipe                |
| GET    | /api/recipes/:recipeId/ingredients| List ingredients for a recipe  |
| POST   | /api/recipes/:recipeId/ingredients| Add ingredient to a recipe     |

### Ingredients (Protected)
| Method | Endpoint                  | Description             |
|--------|---------------------------|-------------------------|
| GET    | /api/ingredients/:id      | Get single ingredient   |
| PUT    | /api/ingredients/:id      | Update an ingredient    |
| DELETE | /api/ingredients/:id      | Delete an ingredient    |

---

## Local Setup

### 1. Clone & install
```bash
git clone <your-repo-url>
cd recipevault-api
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your DB credentials and JWT secret
```

### 3. Create the database
Log into MySQL and run:
```bash
mysql -u root -p < schema.sql
```

### 4. Start the server
```bash
npm run dev     # development (nodemon)
npm start       # production
```

---

## Deployment (Render + Aiven)

### Database – Aiven (free tier)
1. Sign up at **aiven.io**
2. Create a **MySQL** service (free tier)
3. Copy the host, port, user, password, database name
4. Set `DB_SSL=true` in Render environment variables

### API – Render (free tier)
1. Push this repo to GitHub
2. Go to **render.com** → New → Web Service
3. Connect your GitHub repo
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add all environment variables from `.env.example`
7. Deploy — Render gives you a public URL

---

## Authentication Flow

1. `POST /api/auth/register` → returns `userId`
2. `POST /api/auth/login` → returns `token`
3. Add header to all protected requests:
   ```
   Authorization: Bearer <token>
   ```

---

## HTTP Status Codes Used

| Code | Meaning                                  |
|------|------------------------------------------|
| 200  | OK – successful GET / UPDATE / DELETE    |
| 201  | Created – successful POST                |
| 400  | Bad Request – missing required fields    |
| 401  | Unauthorized – invalid/missing JWT       |
| 404  | Not Found – resource doesn't exist       |
| 409  | Conflict – email already registered      |
| 500  | Internal Server Error                    |
