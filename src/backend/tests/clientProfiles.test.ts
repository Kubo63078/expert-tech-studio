import request from 'supertest';
import app from '../src/server';
import { db } from '../src/services/database';
import AuthService from '../src/services/authService';
import { UserRole, ClientStatus } from '../src/types';
import jwt from 'jsonwebtoken';

describe('Client Profile API', () => {
  let clientToken: string;
  let adminToken: string;
  let managerToken: string;
  let clientUserId: string;
  let adminUserId: string;
  let profileId: string;

  beforeAll(async () => {
    // Connect to test database
    await db.connect();
    
    // Clean up database
    await db.getClient().clientProfile.deleteMany({});
    await db.getClient().user.deleteMany({});
  });

  afterAll(async () => {
    // Clean up and disconnect
    await db.getClient().clientProfile.deleteMany({});
    await db.getClient().user.deleteMany({});
    await db.disconnect();
  });

  beforeEach(async () => {
    // Create test users
    const clientUser = await db.getClient().user.create({
      data: {
        email: 'client@test.com',
        password: 'hashedPassword',
        role: UserRole.CLIENT,
      },
    });
    clientUserId = clientUser.id;

    const adminUser = await db.getClient().user.create({
      data: {
        email: 'admin@test.com',
        password: 'hashedPassword',
        role: UserRole.ADMIN,
      },
    });
    adminUserId = adminUser.id;

    const managerUser = await db.getClient().user.create({
      data: {
        email: 'manager@test.com',
        password: 'hashedPassword',
        role: UserRole.PROJECT_MANAGER,
      },
    });

    // Generate tokens
    clientToken = AuthService.generateAccessToken(clientUser);
    adminToken = AuthService.generateAccessToken(adminUser);
    managerToken = AuthService.generateAccessToken(managerUser);
  });

  afterEach(async () => {
    // Clean up after each test
    await db.getClient().clientProfile.deleteMany({});
    await db.getClient().user.deleteMany({});
  });

  describe('GET /api/v1/profiles/me', () => {
    it('should return 404 when profile does not exist', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/me')
        .set('Authorization', `Bearer ${clientToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Profile not found');
    });

    it('should return user profile when it exists', async () => {
      // Create a profile
      const profile = await db.getClient().clientProfile.create({
        data: {
          userId: clientUserId,
          basicInfo: {
            name: 'Test Client',
            phone: '+1234567890',
            email: 'client@test.com',
            birthYear: 1980,
            location: 'Seoul',
          },
          expertise: {
            industry: ['Finance', 'IT'],
            skills: ['Project Management', 'Data Analysis'],
            experience: 15,
            certifications: ['PMP', 'CBAP'],
          },
          businessIntent: {
            targetMarket: 'Small businesses',
            budget: { min: 50000, max: 100000 },
            timeline: '3-6 months',
            goals: ['Automation', 'Digital transformation'],
          },
          status: ClientStatus.INITIAL,
        },
      });

      const response = await request(app)
        .get('/api/v1/profiles/me')
        .set('Authorization', `Bearer ${clientToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(profile.id);
      expect(response.body.data.basicInfo.name).toBe('Test Client');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/me');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/v1/profiles/me', () => {
    it('should create a new profile', async () => {
      const profileData = {
        basicInfo: {
          name: 'New Client',
          phone: '+1234567890',
          email: 'newclient@test.com',
          birthYear: 1975,
          location: 'Seoul',
        },
        expertise: {
          industry: ['Healthcare'],
          skills: ['Medical Practice'],
          experience: 20,
          certifications: ['MD'],
        },
      };

      const response = await request(app)
        .put('/api/v1/profiles/me')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(profileData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile created successfully');
      expect(response.body.data.basicInfo.name).toBe('New Client');
    });

    it('should update existing profile', async () => {
      // Create initial profile
      await db.getClient().clientProfile.create({
        data: {
          userId: clientUserId,
          basicInfo: { name: 'Old Name' },
          expertise: {},
          businessIntent: {},
          status: ClientStatus.INITIAL,
        },
      });

      const updateData = {
        basicInfo: {
          name: 'Updated Name',
          location: 'Busan',
        },
      };

      const response = await request(app)
        .put('/api/v1/profiles/me')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.data.basicInfo.name).toBe('Updated Name');
    });

    it('should validate input data', async () => {
      const invalidData = {
        basicInfo: {
          email: 'invalid-email',
          birthYear: 1900, // Too old
        },
      };

      const response = await request(app)
        .put('/api/v1/profiles/me')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/profiles/me/completeness', () => {
    it('should return profile completeness', async () => {
      // Create a profile with partial data
      await db.getClient().clientProfile.create({
        data: {
          userId: clientUserId,
          basicInfo: {
            name: 'Test Client',
            phone: '+1234567890',
          },
          expertise: {
            industry: ['Finance'],
          },
          businessIntent: {},
          status: ClientStatus.INITIAL,
        },
      });

      const response = await request(app)
        .get('/api/v1/profiles/me/completeness')
        .set('Authorization', `Bearer ${clientToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('overall');
      expect(response.body.data).toHaveProperty('sections');
      expect(response.body.data.sections).toHaveProperty('basicInfo');
      expect(response.body.data.sections).toHaveProperty('expertise');
      expect(response.body.data.sections).toHaveProperty('businessIntent');
    });
  });

  describe('GET /api/v1/profiles/match', () => {
    beforeEach(async () => {
      // Create multiple test profiles
      const user1 = await db.getClient().user.create({
        data: {
          email: 'user1@test.com',
          password: 'hashedPassword',
          role: UserRole.CLIENT,
        },
      });

      const user2 = await db.getClient().user.create({
        data: {
          email: 'user2@test.com',
          password: 'hashedPassword',
          role: UserRole.CLIENT,
        },
      });

      await db.getClient().clientProfile.create({
        data: {
          userId: user1.id,
          basicInfo: { name: 'User 1' },
          expertise: {
            industry: ['Finance', 'Banking'],
            skills: ['Risk Management'],
            experience: 10,
          },
          businessIntent: {
            targetMarket: 'Enterprise',
            budget: { max: 100000 },
          },
          status: ClientStatus.ANALYZED,
        },
      });

      await db.getClient().clientProfile.create({
        data: {
          userId: user2.id,
          basicInfo: { name: 'User 2' },
          expertise: {
            industry: ['Healthcare'],
            skills: ['Medical Practice'],
            experience: 20,
          },
          businessIntent: {
            targetMarket: 'SMB',
            budget: { max: 50000 },
          },
          status: ClientStatus.ANALYZED,
        },
      });
    });

    it('should require PROJECT_MANAGER or ADMIN role', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/match')
        .set('Authorization', `Bearer ${clientToken}`);

      expect(response.status).toBe(403);
    });

    it('should return matching profiles for managers', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/match')
        .query({
          industry: ['Finance'],
          minExperience: 5,
        })
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should filter by multiple criteria', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/match')
        .query({
          targetMarket: 'Enterprise',
          maxBudget: 150000,
        })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/v1/profiles/search', () => {
    it('should search profiles with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/search')
        .query({
          query: 'Finance',
          page: 1,
          limit: 10,
        })
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('profiles');
      expect(response.body.data).toHaveProperty('pagination');
      expect(response.body.data.pagination).toHaveProperty('page');
      expect(response.body.data.pagination).toHaveProperty('total');
    });
  });

  describe('GET /api/v1/profiles/statistics', () => {
    it('should require ADMIN role', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/statistics')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(403);
    });

    it('should return profile statistics for admin', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/statistics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('byStatus');
    });
  });

  describe('Admin operations', () => {
    let testProfileId: string;

    beforeEach(async () => {
      const testUser = await db.getClient().user.create({
        data: {
          email: 'testprofile@test.com',
          password: 'hashedPassword',
          role: UserRole.CLIENT,
        },
      });

      const profile = await db.getClient().clientProfile.create({
        data: {
          userId: testUser.id,
          basicInfo: { name: 'Test Profile' },
          expertise: {},
          businessIntent: {},
          status: ClientStatus.INITIAL,
        },
      });
      testProfileId = profile.id;
    });

    describe('GET /api/v1/profiles/:id', () => {
      it('should get specific profile for admin', async () => {
        const response = await request(app)
          .get(`/api/v1/profiles/${testProfileId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(testProfileId);
      });

      it('should return 404 for non-existent profile', async () => {
        const fakeId = '550e8400-e29b-41d4-a716-446655440000';
        const response = await request(app)
          .get(`/api/v1/profiles/${fakeId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
      });
    });

    describe('PUT /api/v1/profiles/:id', () => {
      it('should update specific profile for admin', async () => {
        const updateData = {
          basicInfo: {
            name: 'Admin Updated',
          },
        };

        const response = await request(app)
          .put(`/api/v1/profiles/${testProfileId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.basicInfo.name).toBe('Admin Updated');
      });
    });

    describe('DELETE /api/v1/profiles/:id', () => {
      it('should delete specific profile for admin', async () => {
        const response = await request(app)
          .delete(`/api/v1/profiles/${testProfileId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // Verify deletion
        const profile = await db.getClient().clientProfile.findUnique({
          where: { id: testProfileId },
        });
        expect(profile).toBeNull();
      });
    });
  });

  describe('POST /api/v1/profiles/bulk', () => {
    it('should export profiles', async () => {
      const response = await request(app)
        .post('/api/v1/profiles/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          action: 'export',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should import profiles', async () => {
      const importData = [
        {
          userId: clientUserId,
          basicInfo: { name: 'Imported Profile 1' },
          expertise: {},
          businessIntent: {},
        },
      ];

      const response = await request(app)
        .post('/api/v1/profiles/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          action: 'import',
          data: importData,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.imported).toBeGreaterThan(0);
    });

    it('should bulk delete profiles', async () => {
      // Create profiles to delete
      const profile1 = await db.getClient().clientProfile.create({
        data: {
          userId: clientUserId,
          basicInfo: { name: 'To Delete 1' },
          expertise: {},
          businessIntent: {},
          status: ClientStatus.INITIAL,
        },
      });

      const response = await request(app)
        .post('/api/v1/profiles/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          action: 'delete',
          profileIds: [profile1.id],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.deleted).toBe(1);
    });
  });
});