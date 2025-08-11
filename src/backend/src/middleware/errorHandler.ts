/**
 * Global Error Handler Middleware
 * Centralized error handling with proper logging and response formatting
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { logger } from '@/utils/logger';
import { config } from '@/config/environment';

/**
 * Custom Application Error Class
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'APP_ERROR';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error Response Interface
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
  meta?: {
    timestamp: string;
    path: string;
    method: string;
    requestId?: string;
  };
}

/**
 * Handle Prisma Database Errors
 */
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const target = error.meta?.target as string[] | undefined;
      const field = target ? target[0] : 'field';
      return new AppError(`${field} already exists`, 409, 'DUPLICATE_ENTRY');

    case 'P2025':
      // Record not found
      return new AppError('Resource not found', 404, 'NOT_FOUND');

    case 'P2003':
      // Foreign key constraint violation
      return new AppError('Invalid reference to related resource', 400, 'INVALID_REFERENCE');

    case 'P2011':
      // Null constraint violation
      const nullField = error.meta?.column_name as string | undefined;
      return new AppError(`${nullField || 'Field'} is required`, 400, 'MISSING_REQUIRED_FIELD');

    default:
      logger.error('Unhandled Prisma Error', { code: error.code, meta: error.meta });
      return new AppError('Database operation failed', 500, 'DATABASE_ERROR');
  }
};

/**
 * Handle JWT Errors
 */
const handleJWTError = (error: JsonWebTokenError | TokenExpiredError): AppError => {
  if (error instanceof TokenExpiredError) {
    return new AppError('Token has expired', 401, 'TOKEN_EXPIRED');
  }
  
  return new AppError('Invalid token', 401, 'INVALID_TOKEN');
};

/**
 * Handle Zod Validation Errors
 */
const handleZodError = (error: ZodError): AppError => {
  const details = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    value: err.input,
  }));

  return new AppError('Validation failed', 400, 'VALIDATION_ERROR');
};

/**
 * Send Error Response
 */
const sendErrorResponse = (err: AppError, req: Request, res: Response): void => {
  const response: ErrorResponse = {
    success: false,
    error: {
      code: err.code,
      message: err.message,
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      requestId: req.headers['x-request-id'] as string,
    },
  };

  // Include stack trace in development
  if (config.server.isDevelopment && err.stack) {
    response.error.stack = err.stack;
  }

  // Include validation details for validation errors
  if (err.code === 'VALIDATION_ERROR' && err instanceof ZodError) {
    response.error.details = err.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message,
      value: error.input,
    }));
  }

  res.status(err.statusCode).json(response);
};

/**
 * Log Error Details
 */
const logError = (err: Error, req: Request): void => {
  const logData = {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    headers: req.headers,
    body: req.body,
    params: req.params,
    query: req.query,
    user: (req as any).user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  };

  if (err instanceof AppError && err.isOperational) {
    // Operational errors (expected)
    logger.warn('Operational Error', logData);
  } else {
    // Programming errors (unexpected)
    logger.error('Unexpected Error', logData);
  }
};

/**
 * Main Error Handler Middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error: AppError;

  // Convert known errors to AppError
  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    error = handleJWTError(err);
  } else if (err instanceof ZodError) {
    error = handleZodError(err);
  } else {
    // Unknown errors
    error = new AppError(
      config.app.isProduction ? 'Internal server error' : err.message,
      500,
      'INTERNAL_SERVER_ERROR'
    );
  }

  // Log the error
  logError(err, req);

  // Send error response
  sendErrorResponse(error, req, res);
};

/**
 * Async Error Wrapper
 * Wraps async route handlers to catch and forward errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    'NOT_FOUND'
  );
  
  sendErrorResponse(error, req, res);
};