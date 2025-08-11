/**
 * User Management Routes
 * Admin and user management operations
 */

import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { UserService } from '../services/userService';
import { logger } from '../config/logger';
import { 
  authenticateToken, 
  requireAdmin, 
  requireStaff, 
  requireOwnerOrStaff 
} from '../middleware/auth';
import { createApiResponse } from '../utils/response';
import { AuthenticatedRequest, UserRole } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users with pagination and filtering
 * @access  Admin/Staff Only
 */
router.get(
  '/',
  requireStaff,
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('role')
      .optional()
      .isIn(['CLIENT', 'PROJECT_MANAGER', 'DEVELOPER', 'ADMIN'])
      .withMessage('Invalid role filter'),
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as UserRole | undefined;

    const result = await UserService.getUsers(page, limit, role);

    res.json(result);
  })
);

/**
 * @route   GET /api/v1/users/search
 * @desc    Search users by email
 * @access  Admin/Staff Only
 */
router.get(
  '/search',
  requireStaff,
  [
    query('q')
      .notEmpty()
      .withMessage('Search query is required')
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters'),
    query('role')
      .optional()
      .isIn(['CLIENT', 'PROJECT_MANAGER', 'DEVELOPER', 'ADMIN'])
      .withMessage('Invalid role filter'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
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

    const query = req.query.q as string;
    const role = req.query.role as UserRole | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await UserService.searchUsers(query, role, page, limit);

    res.json(result);
  })
);

/**
 * @route   GET /api/v1/users/stats
 * @desc    Get user statistics
 * @access  Admin/Staff Only
 */
router.get(
  '/stats',
  requireStaff,
  asyncHandler(async (req, res) => {
    const stats = await UserService.getUserStats();

    res.json(
      createApiResponse(true, { stats })
    );
  })
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Owner or Staff
 */
router.get(
  '/:id',
  requireOwnerOrStaff((req) => req.params.id),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await UserService.getUserById(id);
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
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Owner or Admin
 */
router.put(
  '/:id',
  requireOwnerOrStaff((req) => req.params.id),
  [
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('role')
      .optional()
      .isIn(['CLIENT', 'PROJECT_MANAGER', 'DEVELOPER', 'ADMIN'])
      .withMessage('Invalid role'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
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

    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    const updateData = req.body;

    // Only admins can change roles and active status
    if ((updateData.role || updateData.isActive !== undefined) && 
        authReq.user.role !== UserRole.ADMIN) {
      return res.status(403).json(
        createApiResponse(false, null, {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Only admins can change user role or status',
        })
      );
    }

    try {
      const user = await UserService.updateUser(id, updateData);

      logger.info(`User updated: ${user.email} by ${authReq.user.email}`);

      res.json(createApiResponse(true, { user }));
    } catch (error: any) {
      logger.error('Update user error:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json(
          createApiResponse(false, null, {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          })
        );
      }

      if (error.message.includes('email')) {
        return res.status(409).json(
          createApiResponse(false, null, {
            code: 'EMAIL_EXISTS',
            message: 'Email already in use',
          })
        );
      }

      res.status(400).json(
        createApiResponse(false, null, {
          code: 'UPDATE_ERROR',
          message: 'Failed to update user',
        })
      );
    }
  })
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Deactivate user (soft delete)
 * @access  Admin Only
 */
router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;

    // Prevent self-deletion
    if (id === authReq.user.id) {
      return res.status(400).json(
        createApiResponse(false, null, {
          code: 'SELF_DELETE_ERROR',
          message: 'Cannot delete your own account',
        })
      );
    }

    try {
      await UserService.deleteUser(id);

      logger.info(`User deactivated: ${id} by ${authReq.user.email}`);

      res.json(
        createApiResponse(true, { message: 'User deactivated successfully' })
      );
    } catch (error: any) {
      logger.error('Delete user error:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json(
          createApiResponse(false, null, {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          })
        );
      }

      res.status(400).json(
        createApiResponse(false, null, {
          code: 'DELETE_ERROR',
          message: 'Failed to deactivate user',
        })
      );
    }
  })
);

/**
 * @route   POST /api/v1/users
 * @desc    Create new user (Admin only)
 * @access  Admin Only
 */
router.post(
  '/',
  requireAdmin,
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
      .isIn(['CLIENT', 'PROJECT_MANAGER', 'DEVELOPER', 'ADMIN'])
      .withMessage('Invalid role'),
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

    const { email, password, role } = req.body;
    const authReq = req as AuthenticatedRequest;

    try {
      const user = await UserService.createUser({
        email,
        password,
        role: role as UserRole,
      });

      logger.info(`User created: ${user.email} by ${authReq.user.email}`);

      res.status(201).json(createApiResponse(true, { user }));
    } catch (error: any) {
      logger.error('Create user error:', error);
      
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
          code: 'CREATE_ERROR',
          message: 'Failed to create user',
        })
      );
    }
  })
);

/**
 * @route   PUT /api/v1/users/bulk/status
 * @desc    Bulk update user status
 * @access  Admin Only
 */
router.put(
  '/bulk/status',
  requireAdmin,
  [
    body('userIds')
      .isArray({ min: 1 })
      .withMessage('User IDs array is required'),
    body('userIds.*')
      .isUUID()
      .withMessage('Each user ID must be a valid UUID'),
    body('isActive')
      .isBoolean()
      .withMessage('isActive must be a boolean'),
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

    const { userIds, isActive } = req.body;
    const authReq = req as AuthenticatedRequest;

    // Prevent bulk update including current user if deactivating
    if (!isActive && userIds.includes(authReq.user.id)) {
      return res.status(400).json(
        createApiResponse(false, null, {
          code: 'SELF_DEACTIVATE_ERROR',
          message: 'Cannot deactivate your own account in bulk operation',
        })
      );
    }

    try {
      await UserService.bulkUpdateUserStatus(userIds, isActive);

      logger.info(`Bulk user status update: ${userIds.length} users set to ${isActive} by ${authReq.user.email}`);

      res.json(
        createApiResponse(true, {
          message: `Successfully updated ${userIds.length} users`,
          updatedCount: userIds.length,
        })
      );
    } catch (error: any) {
      logger.error('Bulk update error:', error);
      
      res.status(400).json(
        createApiResponse(false, null, {
          code: 'BULK_UPDATE_ERROR',
          message: 'Failed to bulk update users',
        })
      );
    }
  })
);

export default router;