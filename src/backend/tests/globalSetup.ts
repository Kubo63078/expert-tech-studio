/**
 * Jest Global Setup
 * Initialize test environment before running tests
 */

import { db } from '../src/services/database';
import { logger } from '../src/config/logger';

export default async (): Promise<void> => {
  try {
    logger.info('🧪 Setting up test environment...');

    // Connect to test database
    await db.connect();
    
    // Clean database before tests
    await db.cleanDatabase();
    
    logger.info('✅ Test environment ready');
  } catch (error) {
    logger.error('❌ Test setup failed:', error);
    throw error;
  }
};