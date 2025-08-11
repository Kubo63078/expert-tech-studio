/**
 * Authentication Tests
 * Test suite for authentication and user management
 */

import request from 'supertest';
import app from '../server';
import { UserRole } from '../types';

describe('Authentication Endpoints', () => {
  let authToken: string;
  let refreshToken: string;
  const testUser = {
    email: 'test@experttech.com',
    password: 'Test123!@#',
    role: UserRole.CLIENT,
  };

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toMatchObject({
        email: testUser.email,
        role: testUser.role,
      });
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();

      // Store tokens for subsequent tests
      authToken = response.body.data.tokens.accessToken;
      refreshToken = response.body.data.tokens.refreshToken;
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...testUser,
          email: 'test2@experttech.com',
          password: 'weak',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject duplicate email registration', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EMAIL_EXISTS');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();

      // Update tokens
      authToken = response.body.data.tokens.accessToken;
      refreshToken = response.body.data.tokens.refreshToken;
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@experttech.com',
          password: testUser.password,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('LOGIN_FAILED');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('LOGIN_FAILED');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.role).toBe(testUser.role);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NO_TOKEN');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
      
      // Update tokens
      authToken = response.body.data.tokens.accessToken;
      refreshToken = response.body.data.tokens.refreshToken;
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('REFRESH_FAILED');
    });
  });

  describe('PUT /api/v1/auth/change-password', () => {
    const newPassword = 'NewTest123!@#';

    it('should change password with valid current password', async () => {
      const response = await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('Password changed successfully');

      // Update test user password for future tests
      testUser.password = newPassword;
    });

    it('should reject password change with wrong current password', async () => {
      // Login again after password change forced logout
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      
      authToken = loginResponse.body.data.tokens.accessToken;

      const response = await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'NewTest456!@#',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_PASSWORD');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('Logged out successfully');
    });

    it('should reject already used refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('LOGOUT_ERROR');
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should accept forgot password request for existing email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: testUser.email })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('password reset link');
    });

    it('should accept forgot password request for non-existing email (security)', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent@experttech.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('password reset link');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/v1/auth/validate-token', () => {
    it('should validate valid access token', async () => {
      // Login to get fresh token
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const validToken = loginResponse.body.data.tokens.accessToken;

      const response = await request(app)
        .post('/api/v1/auth/validate-token')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should reject invalid access token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/validate-token')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });
  });
});