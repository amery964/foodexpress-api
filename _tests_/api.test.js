// __tests__/api.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const connectDB = require('../config/db'); // ton connecteur Mongo
const app = require('../src/app');
const { Restaurant } = require('../src/models/restaurantModel');
const { Menu } = require('../src/models/menuModel');
const { User } = require('../src/models/userModel');

describe('FoodExpress API (smoke)', () => {
  let adminToken;
  let restaurantId;

  beforeAll(async () => {
    // DB de test (si MONGO_URI non défini, on force une DB dédiée aux tests)
    process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodexpress_test';
    await connectDB();

    // Nettoyage base
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      Menu.deleteMany({})
    ]);
  });

  afterAll(async () => {
    // Optionnel : vider la DB de test
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test('GET /health -> 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test('POST /api/users -> create normal user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'user@test.com', username: 'user1', password: 'password123' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('email', 'user@test.com');
    expect(res.body).toHaveProperty('role', 'user');
  });

  test('POST /api/users/login -> token for normal user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'user@test.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('Create admin + login -> admin token', async () => {
    await request(app)
      .post('/api/users')
      .send({ email: 'admin@test.com', username: 'admin1', password: 'password123', role: 'admin' })
      .expect(201);

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'admin@test.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    adminToken = res.body.token;
  });

  test('GET /api/users/me (with token) -> profile', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'admin@test.com');
    expect(res.body).toHaveProperty('role', 'admin');
  });

  test('GET /api/restaurants (public) -> 200 + pagination shape', async () => {
    const res = await request(app).get('/api/restaurants');
    expect(res.statusCode).toBe(200);
    // selon ton contrôleur, ça renvoie { items, total, page, limit }
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('limit');
  });

  test('POST /api/restaurants (admin only) -> 201', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Pizza Palace',
        address: '123 Rue A',
        phone: '0102030405',
        opening_hours: '11:00-23:00'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    restaurantId = res.body._id;
  });

  test('POST /api/menus (admin only) -> 201', async () => {
    const res = await request(app)
      .post('/api/menus')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        restaurant_id: restaurantId,
        name: 'Margherita',
        description: 'Tomate, mozzarella, basilic',
        price: 8.5,
        category: 'Pizza'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  test('GET /api/menus?restaurant_id=... (public) -> 200 + pagination shape', async () => {
    const res = await request(app)
      .get(`/api/menus?restaurant_id=${restaurantId}&sortBy=price&order=asc&page=1&limit=10`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('limit', 10);
  });
});
