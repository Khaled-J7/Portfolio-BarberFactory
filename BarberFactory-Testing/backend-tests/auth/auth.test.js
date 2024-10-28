const request = require('supertest');
const app = require('../../Portfolio-BarberFactory/backend/server');
const mongoose = require('mongoose');

describe('Authentication Tests', () => {
  const testUser = {
    fullName: 'Test User',
    phoneNumber: '1234567890',
    password: 'password123'
  };

  // Test Registration
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('fullName', testUser.fullName);
    });

    it('should not allow duplicate phone numbers', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Attempt duplicate registration
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Phone number already registered');
    });
  });

  // Test Login
  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Register a user before testing login
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: testUser.phoneNumber,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: testUser.phoneNumber,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
    });
  });
});