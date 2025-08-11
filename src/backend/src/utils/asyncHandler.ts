/**
 * Async Handler Utility
 * Wraps async route handlers to catch and forward errors
 */

import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wraps an async function to catch and forward any errors to the error middleware
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};