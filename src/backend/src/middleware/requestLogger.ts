/**
 * Request Logger Middleware
 * Logs HTTP requests with timing and metadata
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logHttpRequest } from '@/utils/logger';

/**
 * Extend Request interface to include timing
 */
declare global {
  namespace Express {
    interface Request {
      startTime: number;
      requestId: string;
    }
  }
}

/**
 * Request Logger Middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Generate unique request ID
  req.requestId = uuidv4();
  req.startTime = Date.now();

  // Add request ID to response headers (useful for debugging)
  res.setHeader('X-Request-ID', req.requestId);

  // Override res.end to capture response timing
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any): Response {
    const duration = Date.now() - req.startTime;
    
    // Log the request
    logHttpRequest(req, res, duration);
    
    // Call original end method
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};