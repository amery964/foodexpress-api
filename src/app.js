
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');


const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();
app.use(express.json());


app.get('/health', (req, res) => res.json({ ok: true }));

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);


let swaggerDoc = {
  openapi: '3.0.3',
  info: { title: 'FoodExpress API', version: '1.0.0' },
  paths: {}
};

try {
  const swaggerPath = path.join(__dirname, 'docs', 'swagger.json');
  if (fs.existsSync(swaggerPath)) {
    swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  }
} catch (e) {
  console.warn('Swagger doc non trouvée, utilisation du stub:', e?.message);
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Page d’accueil (test)
app.get('/', (req, res) => {
  res.send('FoodExpress API fonctionne !');
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// --- Gestion globale des erreurs ---

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
