/**
 * Jest Global Teardown
 * Clean up test environment after all tests complete
 */

import { db } from '../src/services/database';
import { logger } from '../src/config/logger';

export default async (): Promise<void> => {
  try {
    logger.info('🧹 Cleaning up test environment...');

    // Clean database after tests
    await db.cleanDatabase();
    
    // Disconnect from test database
    await db.disconnect();
    
    logger.info('✅ Test cleanup complete');
  } catch (error) {
    logger.error('❌ Test cleanup failed:', error);
    throw error;
  }
};