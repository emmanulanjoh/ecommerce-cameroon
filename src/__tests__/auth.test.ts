import request from 'supertest';
import app from '../app';
import User from '../models/User';

// Test data constants
const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: process.env.TEST_PASSWORD || 'TestPass123!@#'
};

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: TEST_USER.name,
        email: TEST_USER.email,
        password: TEST_USER.password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        name: TEST_USER.name,
        email: 'invalid-email',
        password: TEST_USER.password
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const user = new User({
        name: TEST_USER.name,
        email: TEST_USER.email,
        password: TEST_USER.password
      });
      await user.save();
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: TEST_USER.email,
        password: TEST_USER.password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      // Get CSRF token first with error handling
      let csrfToken = '';
      try {
        const csrfResponse = await request(app).get('/api/csrf-token');
        csrfToken = csrfResponse.body.csrfToken;
      } catch (error) {
        console.warn('CSRF token request failed, proceeding without token');
      }
      
      const loginData = {
        email: TEST_USER.email,
        password: 'wrongpassword'
      };

      const loginRequest = request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      if (csrfToken) {
        loginRequest.set('X-CSRF-Token', csrfToken);
      }
      
      await loginRequest.expect(401);
    });
  });
});