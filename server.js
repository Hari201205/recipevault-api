// RecipeVault API – Entry Point
// Loads environment variables and starts the Express server
require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`RecipeVault API is running on port ${PORT}`);
});
