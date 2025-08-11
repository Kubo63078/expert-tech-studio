/**
 * Authentication Middleware
 * JWT token validation and user authentication
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';
import { logger } from '../config/logger';
import { AuthenticatedRequest, UserRole } from '../types';
import { createApiResponse } from '../utils/response';

/**
 * JWT Authentication Middleware
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json(
        createApiResponse(false, null, {
          code: 'NO_TOKEN',
          message: 'Access token is required',
        })
      );
      return;
    }

    // Verify token
    const payload = AuthService.verifyAccessToken(token);
    if (!payload) {
      res.status(401).json(
        createApiResponse(false, null, {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired access token',
        })
      );
      return;
    }

    // Get user from database
    const user = await UserService.getUserById(payload.userId);
    if (!user || !user.isActive) {
      res.status(401).json(
        createApiResponse(false, null, {
          code: 'USER_NOT_FOUND',
          message: 'User not found or inactive',
        })
      );
      return;
    }

    // Add user to request object
    (req as AuthenticatedRequest).user = user;
    (req as AuthenticatedRequest).token = token;

    next();
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    res.status(500).json(
      createApiResponse(false, null, {
        code: 'AUTH_ERROR',
        message: 'Authentication error',
      })
    );
  }
};

/**
 * Optional Authentication Middleware
 * Continues without error if no token provided
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const payload = AuthService.verifyAccessToken(token);
    if (payload) {
      const user = await UserService.getUserById(payload.userId);
      if (user && user.isActive) {
        (req as AuthenticatedRequest).user = user;
        (req as AuthenticatedRequest).token = token;
      }
    }

    next();
  } catch (error) {
    logger.debug('Optional auth error (continuing):', error);
    next();
  }
};

/**
 * Role-based Authorization Middleware Factory
 */
export const requireRole = (allowedRoles: UserRole | UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      res.status(401).json(
        createApiResponse(false, null, {
          code: 'NOT_AUTHENTICATED',
          message: 'Authentication required',
        })
      );
      return;
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!roles.includes(authReq.user.role as UserRole)) {
      res.status(403).json(
        createApiResponse(false, null, {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Insufficient permissions for this action',
        })
      );
      return;
    }

    next();
  };
};

/**
 * Admin Only Middleware
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Staff Only Middleware (PM, Developer, Admin)
 */
export const requireStaff = requireRole([
  UserRole.PROJECT_MANAGER,
  UserRole.DEVELOPER,
  UserRole.ADMIN,
]);

/**
 * Client or Staff Middleware
 */
export const requireClientOrStaff = requireRole([
  UserRole.CLIENT,
  UserRole.PROJECT_MANAGER,
  UserRole.DEVELOPER,
  UserRole.ADMIN,
]);

/**
 * Owner or Staff Authorization Middleware
 * Allows access if user is the owner of the resource or has staff role
 */
export const requireOwnerOrStaff = (getOwnerId: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      res.status(401).json(
        createApiResponse(false, null, {
          code: 'NOT_AUTHENTICATED',
          message: 'Authentication required',
        })
      );
      return;
    }

    const ownerId = getOwnerId(req);
    const userRole = authReq.user.role as UserRole;
    const isOwner = authReq.user.id === ownerId;
    const isStaff = [
      UserRole.PROJECT_MANAGER,
      UserRole.DEVELOPER,
      UserRole.ADMIN,
    ].includes(userRole);

    if (!isOwner && !isStaff) {
      res.status(403).json(
        createApiResponse(false, null, {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Can only access your own resources or require staff permissions',
        })
      );
      return;
    }

    next();
  };
};

/**
 * Rate Limiting by User
 */
export const rateLimitByUser = () => {
  const userRequests = new Map<string, { count: number; resetTime: number }>();
  const maxRequests = 1000; // per hour
  const windowMs = 60 * 60 * 1000; // 1 hour

  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      next();
      return;
    }

    const userId = authReq.user.id;
    const now = Date.now();
    const userLimit = userRequests.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      // Reset or create new limit
      userRequests.set(userId, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    if (userLimit.count >= maxRequests) {
      res.status(429).json(
        createApiResponse(false, null, {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
        })
      );
      return;
    }

    userLimit.count++;
    next();
  };
};

/**
 * API Key Validation Middleware (for external integrations)
 */
export const validateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    res.status(401).json(
      createApiResponse(false, null, {
        code: 'API_KEY_REQUIRED',
        message: 'API key is required',
      })
    );
    return;
  }

  // In production, validate against stored API keys
  // For now, just check if it exists
  if (apiKey.length < 32) {
    res.status(401).json(
      createApiResponse(false, null, {
        code: 'INVALID_API_KEY',
        message: 'Invalid API key format',
      })
    );
    return;
  }

  next();
};

/**
 * Account Status Check Middleware
 */
export const requireActiveAccount = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthenticatedRequest;
  
  if (!authReq.user) {
    res.status(401).json(
      createApiResponse(false, null, {
        code: 'NOT_AUTHENTICATED',
        message: 'Authentication required',
      })
    );
    return;
  }

  if (!authReq.user.isActive) {
    res.status(403).json(
      createApiResponse(false, null, {
        code: 'ACCOUNT_INACTIVE',
        message: 'Account is inactive. Please contact support.',
      })
    );
    return;
  }

  next();
};

/**
 * CORS Middleware for Authentication
 */
export const authCors = (req: Request, res: Response, next: NextFunction): void => {
  // Allow specific headers for authentication
  res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key'
  );
  
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.status(200).json({});
    return;
  }
  
  next();
};