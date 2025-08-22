/**
 * ExpertTech Studio Backend Server
 * Main application entry point
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config/environment';
import logger from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import userRoutes from './routes/users';
import clientProfileRoutes from './routes/clientProfiles';
import businessTemplateRoutes from './routes/businessTemplates';
import recommendationRoutes from './routes/recommendations';
import projectRoutes from './routes/projects';
import { aiAnalysisRouter } from './routes/aiAnalysis';
import { db } from './services/database';

const app = express();

/**
 * Security Middleware
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

/**
 * CORS Configuration
 */
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * General Middleware
 */
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logging
 */
app.use(requestLogger);

/**
 * Database Middleware
 */
app.use((req, _res, next) => {
  (req as any).db = db.getClient();
  next();
});

/**
 * Rate Limiting
 */
app.use('/api', rateLimiter);

/**
 * Database Connection
 */
const initializeDatabase = async () => {
  try {
    await db.connect();
    await db.runMigrations();
    logger.info('✅ Database initialized successfully');
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

/**
 * Routes
 */
app.use('/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profiles', clientProfileRoutes);
app.use('/api/v1/templates', businessTemplateRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/ai', aiAnalysisRouter);

/**
 * API Documentation
 */
app.get('/api/docs', (_req, res) => {
  res.json({
    message: 'ExpertTech Studio API Documentation',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      profiles: '/api/v1/profiles',
      templates: '/api/v1/templates',
      recommendations: '/api/v1/recommendations',
      projects: '/api/v1/projects',
      ai_analysis: '/api/ai',
    },
    documentation: 'https://docs.experttech-studio.com',
  });
});

/**
 * 404 Handler
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
});

/**
 * Global Error Handler - Temporarily disabled for debugging
 */
// app.use(errorHandler);

/**
 * Server Startup
 */
const startServer = async () => {
  try {
    // Initialize database first
    await initializeDatabase();

    // Start the server
    const server = app.listen(config.app.port, config.app.host, () => {
      logger.info(`🚀 ExpertTech Studio Backend Server started`);
      logger.info(`📍 Server running on http://${config.app.host}:${config.app.port}`);
      logger.info(`🌍 Environment: ${config.app.nodeEnv}`);
      
      if (config.app.nodeEnv === 'development') {
        logger.info(`📚 API Docs: http://localhost:${config.app.port}/api/docs`);
        logger.info(`❤️  Health Check: http://localhost:${config.app.port}/health`);
      }
    });

    /**
     * Graceful Shutdown
     */
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed.');
        
        try {
          await db.disconnect();
          logger.info('Database disconnected.');
        } catch (error) {
          logger.error('Error disconnecting from database:', error);
        }
        
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
