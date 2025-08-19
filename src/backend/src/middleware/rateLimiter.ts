/**
 * Rate Limiter Middleware
 * Protects API endpoints from abuse
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';

/**
 * Rate Limit Handler
 */
const rateLimitHandler = (req: Request, res: Response): void => {
  const ip = req.ip;
  const userAgent = req.get('User-Agent');
  
  // Log rate limit violation
  logger.warn('Rate limit exceeded', {
    ip,
    userAgent,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
      retryAfter: 900, // 15 minutes in seconds
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  });
};

/**
 * Skip Rate Limiting for Certain Conditions
 */
const skipRateLimit = (req: Request): boolean => {
  // Skip rate limiting for health checks
  if (req.path === '/health') {
    return true;
  }

  // Skip completely in development mode
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  return false;
};

/**
 * Generate Rate Limit Key
 * Can be customized to rate limit by user ID instead of IP
 */
const keyGenerator = (req: Request): string => {
  // Use user ID if authenticated, otherwise use IP
  const user = (req as any).user;
  return user?.id || req.ip;
};

/**
 * Default Rate Limiter
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: rateLimitHandler,
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  skip: skipRateLimit,
  keyGenerator,
});

/**
 * Strict Rate Limiter for Sensitive Endpoints
 */
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
});

/**
 * Auth Rate Limiter for Login/Register
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  message: (req: Request, res: Response) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
    });

    res.status(429).json({
      success: false,
      error: {
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
        retryAfter: 900, // 15 minutes in seconds
      },
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
});

/**
 * File Upload Rate Limiter
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 uploads per minute
  message: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
});