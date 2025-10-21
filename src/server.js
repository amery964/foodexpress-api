// server.js (CommonJS)
require('dotenv').config();
const connectDB = require('../config/db');
const app = require('./app'); // <-- on importe l'app Express

// Connexion DB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
  console.log(`API:   http://localhost:${PORT}`);
  console.log(`Docs:  http://localhost:${PORT}/docs`);
  console.log(`Health http://localhost:${PORT}/health`);
});
