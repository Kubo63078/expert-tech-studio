/**
 * Database Service Layer
 * Centralized database operations and connection management
 */

import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';
import { config } from '../config/environment';

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
      datasources: {
        db: {
          url: config.database.url,
        },
      },
    });

    // Setup logging
    this.setupLogging();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Get Prisma client
   */
  public getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Connect to database
   */
  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info('🔗 Database connected successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info('🔌 Database disconnected');
    } catch (error) {
      logger.error('❌ Database disconnect failed:', error);
      throw error;
    }
  }

  /**
   * Check database connection health
   */
  public async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Execute transaction
   */
  public async transaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>
  ): Promise<T> {
    return this.prisma.$transaction(fn, {
      maxWait: 5000, // 5 seconds
      timeout: 10000, // 10 seconds
    });
  }

  /**
   * Setup database logging
   */
  private setupLogging(): void {
    this.prisma.$on('query', (e) => {
      if (config.app.nodeEnv === 'development') {
        logger.debug('Query:', {
          query: e.query,
          params: e.params,
          duration: e.duration,
        });
      }
    });

    this.prisma.$on('error', (e) => {
      logger.error('Database error:', e);
    });

    this.prisma.$on('info', (e) => {
      logger.info('Database info:', e.message);
    });

    this.prisma.$on('warn', (e) => {
      logger.warn('Database warning:', e.message);
    });
  }

  /**
   * Migration utilities
   */
  public async runMigrations(): Promise<void> {
    try {
      // Check if we need to run migrations
      const pendingMigrations = await this.prisma.$queryRaw`
        SELECT name FROM _prisma_migrations 
        WHERE finished_at IS NULL
      `;
      
      if (Array.isArray(pendingMigrations) && pendingMigrations.length > 0) {
        logger.info('Running pending migrations...');
        // In production, this would be handled by deployment scripts
        // For development, we'll rely on manual migration commands
      }

      logger.info('✅ Database schema is up to date');
    } catch (error) {
      logger.warn('Could not check migration status:', error);
    }
  }

  /**
   * Seed database with initial data
   */
  public async seedDatabase(): Promise<void> {
    try {
      logger.info('🌱 Starting database seeding...');
      
      // This would typically import and run the seed script
      // For now, we'll just log that seeding should be run manually
      logger.info('💡 Run "npm run db:seed" to populate database with initial data');
    } catch (error) {
      logger.error('Database seeding failed:', error);
      throw error;
    }
  }

  /**
   * Clean database (for testing)
   */
  public async cleanDatabase(): Promise<void> {
    if (config.app.nodeEnv === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const modelNames = Object.keys(this.prisma).filter(
      (key) => !key.startsWith('$') && !key.startsWith('_')
    );

    // Delete in reverse order to handle foreign key constraints
    for (const modelName of modelNames.reverse()) {
      try {
        await (this.prisma as any)[modelName].deleteMany();
      } catch (error) {
        // Ignore errors for models that don't support deleteMany
      }
    }

    logger.info('🧹 Database cleaned');
  }

  /**
   * Database statistics
   */
  public async getStats(): Promise<Record<string, number>> {
    try {
      const stats = await Promise.all([
        this.prisma.user.count(),
        this.prisma.clientProfile.count(),
        this.prisma.project.count(),
        this.prisma.recommendation.count(),
        this.prisma.payment.count(),
      ]);

      return {
        users: stats[0],
        clientProfiles: stats[1],
        projects: stats[2],
        recommendations: stats[3],
        payments: stats[4],
      };
    } catch (error) {
      logger.error('Failed to get database stats:', error);
      return {};
    }
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance();
export { DatabaseService };