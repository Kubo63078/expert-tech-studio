/**
 * Jest Test Setup
 * Global test configuration and utilities
 */

import { PrismaClient } from '@prisma/client';

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUUID(): R;
      toMatchApiResponse(): R;
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeValidUUID(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid UUID`,
      pass,
    };
  },
  
  toMatchApiResponse(received: any) {
    const hasRequiredFields = 
      typeof received === 'object' &&
      received !== null &&
      typeof received.success === 'boolean';
    
    const pass = hasRequiredFields;
    
    return {
      message: () => `expected ${JSON.stringify(received)} ${pass ? 'not ' : ''}to match API response format`,
      pass,
    };
  },
});

// Test database instance
let testDb: PrismaClient;

beforeAll(async () => {
  // Setup test database connection
  testDb = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/experttech_studio_test',
      },
    },
  });
  
  await testDb.$connect();
});

afterAll(async () => {
  // Cleanup
  await testDb.$disconnect();
});

// Export test utilities
export { testDb };