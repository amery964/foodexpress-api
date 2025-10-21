const request = require('supertest');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const app = require('../src/app');
const { User } = require('../src/models/userModel');
const { Restaurant } = require('../src/models/restaurantModel');

describe('Auth & ACL', () => {
  let userToken;

  beforeAll(async () => {
    process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodexpress_test';
    await connectDB();
    await Promise.all([User.deleteMany({}), Restaurant.deleteMany({})]);

    // create normal user + login (username >= 3 chars)
    await request(app)
      .post('/api/users')
      .send({ email: 'u@test.com', username: 'usernorm', password: 'pass1234' })
      .expect(201);

    const login = await request(app)
      .post('/api/users/login')
      .send({ email: 'u@test.com', password: 'pass1234' })
      .expect(200);

    userToken = login.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test('POST /api/restaurants without token -> 401', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .send({ name: 'R', address: 'A', phone: '0', opening_hours: '9-18' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/restaurants with non-admin token -> 403', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'R2', address: 'B', phone: '1', opening_hours: '9-18' });

    expect(res.statusCode).toBe(403);
  });
});
