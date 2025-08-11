/**
 * Environment Configuration
 * Centralized configuration management with validation
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

/**
 * Environment Schema Validation
 */
const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  API_VERSION: z.string().default('v1'),

  // Database Configuration
  DATABASE_URL: z.string(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('5432'),
  DB_NAME: z.string().default('experttech_studio'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().optional(),

  // Redis Configuration
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),

  // JWT Configuration
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // External Services
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // AWS Configuration
  AWS_REGION: z.string().default('ap-northeast-2'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),

  // Email Configuration
  EMAIL_FROM: z.string().email().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Security & Rate Limiting
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3001'),

  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'), // 10MB
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/gif,application/pdf'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE_PATH: z.string().default('logs/app.log'),
});

/**
 * Parse and validate environment variables
 */
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Environment validation failed:');
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

const env = parseEnv();

/**
 * Structured Configuration Object
 */
export const config = {
  app: {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    host: '0.0.0.0',
    apiVersion: env.API_VERSION,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
  },

  database: {
    url: env.DATABASE_URL,
    host: env.DB_HOST,
    port: env.DB_PORT,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },

  redis: {
    url: env.REDIS_URL,
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },

  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtAccessExpiresIn: env.JWT_EXPIRES_IN,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  security: {
    bcryptRounds: env.BCRYPT_ROUNDS,
    rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
    rateLimitMax: env.RATE_LIMIT_MAX,
  },

  cors: {
    origin: env.CORS_ORIGIN.split(',').map(origin => origin.trim()),
  },

  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
    allowedFileTypes: env.ALLOWED_FILE_TYPES.split(',').map(type => type.trim()),
  },

  external: {
    openai: {
      apiKey: env.OPENAI_API_KEY,
    },
    stripe: {
      secretKey: env.STRIPE_SECRET_KEY,
      webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    },
    aws: {
      region: env.AWS_REGION,
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      s3Bucket: env.AWS_S3_BUCKET,
    },
    email: {
      from: env.EMAIL_FROM,
      smtp: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    },
  },

  logging: {
    level: env.LOG_LEVEL,
    filePath: env.LOG_FILE_PATH,
  },
} as const;

/**
 * Configuration Validation
 */
export const validateConfig = () => {
  const requiredInProduction = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'DATABASE_URL',
  ];

  if (config.app.isProduction) {
    const missing = requiredInProduction.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables in production: ${missing.join(', ')}`);
    }
  }

  console.log('✅ Configuration validated successfully');
};

// Validate configuration on import
validateConfig();