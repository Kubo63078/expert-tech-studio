/**
 * Health Check Routes
 * System health and status monitoring
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import { config } from '@/config/environment';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Redis client - lazy initialization
let redis: ReturnType<typeof createClient> | null = null;
const getRedisClient = () => {
  if (!redis) {
    redis = createClient({ url: config.redis.url });
  }
  return redis;
};

/**
 * System Health Check Interface
 */
interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  environment: string;
  version: string;
  uptime: number;
  services: {
    database: ServiceStatus;
    redis: ServiceStatus;
    external?: {
      openai?: ServiceStatus;
      stripe?: ServiceStatus;
      aws?: ServiceStatus;
    };
  };
  system: {
    memory: MemoryUsage;
    cpu: number;
  };
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  message?: string;
  lastChecked: string;
}

interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
}

/**
 * Check Database Health
 */
const checkDatabase = async (): Promise<ServiceStatus> => {
  const startTime = Date.now();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    
    return {
      status: responseTime < 1000 ? 'healthy' : 'degraded',
      responseTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database connection failed',
      lastChecked: new Date().toISOString(),
    };
  }
};

/**
 * Check Redis Health
 */
const checkRedis = async (): Promise<ServiceStatus> => {
  // In development, Redis is optional - skip the actual check
  if (config.app.nodeEnv === 'development') {
    return {
      status: 'degraded',
      message: 'Redis not available (development mode - using in-memory sessions)',
      lastChecked: new Date().toISOString(),
    };
  }

  const startTime = Date.now();
  
  try {
    const client = getRedisClient();
    
    // Connect if not already connected
    if (!client.isOpen) {
      await client.connect();
    }
    
    await client.ping();
    const responseTime = Date.now() - startTime;
    
    return {
      status: responseTime < 100 ? 'healthy' : 'degraded',
      responseTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Redis connection failed',
      lastChecked: new Date().toISOString(),
    };
  }
};

/**
 * Get System Memory Usage
 */
const getMemoryUsage = (): MemoryUsage => {
  const usage = process.memoryUsage();
  const total = usage.heapTotal;
  const used = usage.heapUsed;
  
  return {
    used: Math.round(used / 1024 / 1024 * 100) / 100, // MB
    total: Math.round(total / 1024 / 1024 * 100) / 100, // MB
    percentage: Math.round((used / total) * 100 * 100) / 100,
  };
};

/**
 * Get CPU Usage (simplified)
 */
const getCpuUsage = (): number => {
  const usage = process.cpuUsage();
  return Math.round((usage.user + usage.system) / 1000000); // Convert to percentage (simplified)
};

/**
 * Determine Overall Health Status
 */
const getOverallStatus = (services: HealthCheck['services']): HealthCheck['status'] => {
  // Database is critical - must be healthy
  if (services.database.status === 'unhealthy') {
    return 'unhealthy';
  }
  
  // In development, Redis is optional - don't fail if it's down
  if (config.app.nodeEnv !== 'development' && services.redis.status === 'unhealthy') {
    return 'unhealthy';
  }
  
  // If any service is degraded, overall is degraded
  const statuses = [services.database.status, services.redis.status];
  if (statuses.includes('degraded')) {
    return 'degraded';
  }
  
  return 'healthy';
};

/**
 * Basic Health Check Endpoint
 * GET /health
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const database = await checkDatabase();
  const redisStatus = await checkRedis();
  const memory = getMemoryUsage();
  const cpu = getCpuUsage();

  const services = {
    database,
    redis: redisStatus,
  };

  const healthCheck: HealthCheck = {
    status: getOverallStatus(services),
    timestamp: new Date().toISOString(),
    environment: config.app.nodeEnv,
    version: '1.0.0', // TODO: Get from package.json
    uptime: Math.floor(process.uptime()),
    services,
    system: {
      memory,
      cpu,
    },
  };

  // Set appropriate status code
  const statusCode = healthCheck.status === 'healthy' ? 200 : 
                    healthCheck.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json(healthCheck);
}));

/**
 * Readiness Check Endpoint
 * GET /health/ready
 */
router.get('/ready', asyncHandler(async (req: Request, res: Response) => {
  const database = await checkDatabase();
  const redisStatus = await checkRedis();

  const isReady = database.status !== 'unhealthy' && 
                  redisStatus.status !== 'unhealthy';

  if (isReady) {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: {
        database: database.status,
        redis: redisStatus.status,
      },
    });
  } else {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      services: {
        database,
        redis: redisStatus,
      },
    });
  }
}));

/**
 * Liveness Check Endpoint
 * GET /health/live
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

/**
 * Detailed System Information (Development Only)
 * GET /health/info
 */
router.get('/info', asyncHandler(async (req: Request, res: Response) => {
  if (!config.server.isDevelopment) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint not available in production',
      },
    });
  }

  const systemInfo = {
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    environment: process.env,
    config: {
      ...config,
      // Remove sensitive information
      jwt: { ...config.jwt, secret: '[REDACTED]', refreshSecret: '[REDACTED]' },
      database: { ...config.database, password: '[REDACTED]' },
      external: {
        ...config.external,
        openai: { apiKey: config.external.openai.apiKey ? '[REDACTED]' : undefined },
        stripe: { 
          secretKey: config.external.stripe.secretKey ? '[REDACTED]' : undefined,
          webhookSecret: config.external.stripe.webhookSecret ? '[REDACTED]' : undefined,
        },
        aws: {
          ...config.external.aws,
          accessKeyId: config.external.aws.accessKeyId ? '[REDACTED]' : undefined,
          secretAccessKey: config.external.aws.secretAccessKey ? '[REDACTED]' : undefined,
        },
        email: {
          ...config.external.email,
          smtp: {
            ...config.external.email.smtp,
            pass: config.external.email.smtp.pass ? '[REDACTED]' : undefined,
          },
        },
      },
    },
  };

  res.json(systemInfo);
}));

export { router as healthRouter };