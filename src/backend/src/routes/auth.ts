/**
 * Authentication Routes
 * User registration, login, token refresh, and session management
 */

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';
import { logger } from '../config/logger';
import { authenticateToken, requireActiveAccount } from '../middleware/auth';
import { createApiResponse } from '../utils/response';
import { AuthenticatedRequest, UserRole } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to auth routes
router.use(authRateLimiter);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one lowercase letter, uppercase letter, number, and special character'),
    body('role')
      .optional()
      .isIn(['CLIENT', 'PROJECT_MANAGER', 'DEVELOPER', 'ADMIN'])
      .withMessage('Invalid role'),
  ],
  asyncHandler(async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createApiResponse(false, null, {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array(),
        })
      );
    }

    const { email, password, role = UserRole.CLIENT } = req.body;

    try {
      const result = await AuthService.register(email, password, role as UserRole);

      logger.info(`User registered: ${email}`);

      res.status(201).json(
        createApiResponse(true, {
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
          },
        })
      );
    } catch (error: any) {
      logger.error('Registration error:', error);
      
      if (error.message.includes('already exists')) {
        return res.status(409).json(
          createApiResponse(false, null, {
            code: 'EMAIL_EXISTS',
            message: 'Email already registered',
          })
        );
      }

      res.status(400).json(
        createApiResponse(false, null, {
          code: 'REGISTRATION_ERROR',
          message: error.message || 'Registration failed',
        })
      );
    }
  })
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  asyncHandler(async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createApiResponse(false, null, {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array(),
        })
      );
    }

    const { email, password } = req.body;

    try {
      const result = await AuthService.login(email, password);

      logger.info(`User logged in: ${email}`);

      res.json(
        createApiResponse(true, {
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
          },
        })
      );
    } catch (error: any) {
      logger.error('Login error:', error);
      
      res.status(401).json(
        createApiResponse(false, null, {
          code: 'LOGIN_FAILED',
          message: 'Invalid email or password',
        })
      );
    }
  })
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ],
  asyncHandler(async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createApiResponse(false, null, {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array(),
        })
      );
    }

    const { refreshToken } = req.body;

    try {
      const result = await AuthService.refreshToken(refreshToken);

      res.json(
        createApiResponse(true, {
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
          },
        })
      );
    } catch (error: any) {
      logger.error('Token refresh error:', error);
      
      res.status(401).json(
        createApiResponse(false, null, {
          code: 'REFRESH_FAILED',
          message: 'Invalid or expired refresh token',
        })
      );
    }
  })
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (revoke refresh token)
 * @access  Private
 */
router.post(
  '/logout',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ],
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    try {
      await AuthService.logout(refreshToken);

      res.json(
        createApiResponse(true, { message: 'Logged out successfully' })
      );
    } catch (error: any) {
      logger.error('Logout error:', error);
      
      res.status(400).json(
        createApiResponse(false, null, {
          code: 'LOGOUT_ERROR',
          message: 'Logout failed',
        })
      );
    }
  })
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  authenticateToken,
  requireActiveAccount,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    
    const user = await UserService.getUserById(authReq.user.id);
    if (!user) {
      return res.status(404).json(
        createApiResponse(false, null, {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        })
      );
    }

    res.json(createApiResponse(true, { user }));
  })
);

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  '/change-password',
  authenticateToken,
  requireActiveAccount,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('New password must contain at least one lowercase letter, uppercase letter, number, and special character'),
  ],
  asyncHandler(async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createApiResponse(false, null, {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array(),
        })
      );
    }

    const authReq = req as AuthenticatedRequest;
    const { currentPassword, newPassword } = req.body;

    try {
      await UserService.changePassword(
        authReq.user.id,
        currentPassword,
        newPassword
      );

      // Logout from all devices for security
      await AuthService.logoutAll(authReq.user.id);

      res.json(
        createApiResponse(true, { 
          message: 'Password changed successfully. Please login again.' 
        })
      );
    } catch (error: any) {
      logger.error('Change password error:', error);
      
      if (error.message.includes('Invalid current password')) {
        return res.status(400).json(
          createApiResponse(false, null, {
            code: 'INVALID_PASSWORD',
            message: 'Current password is incorrect',
          })
        );
      }

      res.status(400).json(
        createApiResponse(false, null, {
          code: 'PASSWORD_CHANGE_ERROR',
          message: 'Failed to change password',
        })
      );
    }
  })
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset (placeholder - email service needed)
 * @access  Public
 */
router.post(
  '/forgot-password',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createApiResponse(false, null, {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array(),
        })
      );
    }

    const { email } = req.body;

    // Check if user exists
    const user = await UserService.getUserByEmail(email);
    
    // Always return success for security (don't reveal if email exists)
    res.json(
      createApiResponse(true, {
        message: 'If an account with this email exists, you will receive a password reset link.',
      })
    );

    // TODO: Implement email service to send password reset link
    if (user) {
      logger.info(`Password reset requested for: ${email}`);
      // Generate reset token and send email
    }
  })
);

export { router as authRouter };