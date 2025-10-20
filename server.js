const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

// Connexion à la base de données
connectDB();
//routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/menus', require('./routes/menuRoutes'));
// Route test
app.get('/', (req, res) => {
  res.send('FoodExpress API fonctionne !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
