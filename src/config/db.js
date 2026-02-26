// Database Configuration – PostgreSQL (Render)
// Uses the pg Pool with a single DATABASE_URL connection string.
// SSL is enabled automatically in production (required by Render).
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render requires SSL; set NODE_ENV=production in Render env vars
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
