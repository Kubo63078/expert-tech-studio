/**
 * Logger Utility
 * Winston-based logging with structured output
 */

import winston from 'winston';
import { config } from '@/config/environment';

/**
 * Custom Log Levels
 */
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

/**
 * Log Colors for Console Output
 */
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(logColors);

/**
 * Custom Log Format
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

/**
 * Console Format (Development)
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    let log = `${timestamp} ${level}: ${message}`;
    if (stack && config.app.isDevelopment) {
      log += `\n${stack}`;
    }
    return log;
  })
);

/**
 * Winston Logger Configuration
 */
const logger = winston.createLogger({
  levels: logLevels,
  level: config.logging.level,
  format: logFormat,
  defaultMeta: {
    service: 'experttech-backend',
    environment: config.app.nodeEnv,
  },
  transports: [
    // Error log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Combined log file
    new winston.transports.File({
      filename: config.logging.filePath,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * Development Console Logging
 */
if (config.app.isDevelopment) {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

/**
 * Production Logging Enhancements
 */
if (config.app.isProduction) {
  // Add additional transports for production
  // e.g., CloudWatch, Datadog, etc.
}

/**
 * Helper Functions
 */
const createLoggerWithContext = (context: string) => {
  return {
    error: (message: string, meta?: any) => logger.error(message, { context, ...meta }),
    warn: (message: string, meta?: any) => logger.warn(message, { context, ...meta }),
    info: (message: string, meta?: any) => logger.info(message, { context, ...meta }),
    debug: (message: string, meta?: any) => logger.debug(message, { context, ...meta }),
  };
};

/**
 * HTTP Request Logger Helper
 */
const logHttpRequest = (req: any, res: any, duration: number) => {
  const { method, originalUrl, ip } = req;
  const { statusCode } = res;
  
  const logLevel = statusCode >= 400 ? 'warn' : 'info';
  
  logger[logLevel]('HTTP Request', {
    method,
    url: originalUrl,
    statusCode,
    duration,
    ip,
    userAgent: req.get('User-Agent'),
    ...(req.user && { userId: req.user.id }),
  });
};

/**
 * Database Query Logger
 */
const logDatabaseQuery = (query: string, duration: number, params?: any[]) => {
  if (config.app.isDevelopment) {
    logger.debug('Database Query', {
      query: query.replace(/\s+/g, ' ').trim(),
      duration,
      params,
    });
  }
};

/**
 * Security Event Logger
 */
const logSecurityEvent = (event: string, details: any) => {
  logger.warn('Security Event', {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Performance Logger
 */
const logPerformance = (operation: string, duration: number, metadata?: any) => {
  const logLevel = duration > 1000 ? 'warn' : 'info'; // Warn if operation takes > 1 second
  
  logger[logLevel]('Performance', {
    operation,
    duration,
    ...metadata,
  });
};

export {
  logger,
  createLoggerWithContext,
  logHttpRequest,
  logDatabaseQuery,
  logSecurityEvent,
  logPerformance,
};