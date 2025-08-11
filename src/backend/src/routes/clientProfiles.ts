import express, { Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth';
import { UserRole } from '../types';
import ClientProfileService from '../services/clientProfileService';
import { asyncHandler } from '../utils/asyncHandler';
import { createApiResponse } from '../utils/apiResponse';
import logger from '../utils/logger';

const router = express.Router();

// Validation middleware
const validateProfile = [
  body('basicInfo.name').optional().isString().trim(),
  body('basicInfo.phone').optional().isMobilePhone('any'),
  body('basicInfo.email').optional().isEmail().normalizeEmail(),
  body('basicInfo.birthYear').optional().isInt({ min: 1950, max: new Date().getFullYear() - 20 }),
  body('basicInfo.location').optional().isString().trim(),
  body('expertise.industry').optional().isArray(),
  body('expertise.skills').optional().isArray(),
  body('expertise.experience').optional().isInt({ min: 0, max: 50 }),
  body('expertise.certifications').optional().isArray(),
  body('businessIntent.targetMarket').optional().isString(),
  body('businessIntent.budget').optional().isObject(),
  body('businessIntent.timeline').optional().isString(),
  body('businessIntent.goals').optional().isArray(),
];

const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(createApiResponse(false, null, 'Validation error', errors.array()));
  }
  next();
};

// Get current user's profile
router.get(
  '/me',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    
    const profile = await ClientProfileService.getProfileByUserId(userId);
    
    if (!profile) {
      return res.status(404).json(
        createApiResponse(false, null, 'Profile not found')
      );
    }
    
    res.json(createApiResponse(true, profile));
  })
);

// Create or update current user's profile
router.put(
  '/me',
  authenticateToken,
  validateProfile,
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    
    // Check if profile exists
    const existingProfile = await ClientProfileService.getProfileByUserId(userId);
    
    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await ClientProfileService.updateProfile(existingProfile.id, req.body);
      logger.info(`Profile updated for user ${userId}`);
    } else {
      // Create new profile
      profile = await ClientProfileService.createProfile(userId, req.body);
      logger.info(`Profile created for user ${userId}`);
    }
    
    res.json(createApiResponse(true, profile, existingProfile ? 'Profile updated successfully' : 'Profile created successfully'));
  })
);

// Get profile completeness
router.get(
  '/me/completeness',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    
    const profile = await ClientProfileService.getProfileByUserId(userId);
    
    if (!profile) {
      return res.status(404).json(
        createApiResponse(false, null, 'Profile not found')
      );
    }
    
    const completeness = await ClientProfileService.getProfileCompleteness(profile.id);
    
    res.json(createApiResponse(true, completeness));
  })
);

// Get profiles matching criteria (for PROJECT_MANAGER and ADMIN)
router.get(
  '/match',
  authenticateToken,
  requireRole([UserRole.PROJECT_MANAGER, UserRole.ADMIN]),
  [
    query('industry').optional().isArray(),
    query('skills').optional().isArray(),
    query('minExperience').optional().isInt({ min: 0 }),
    query('maxBudget').optional().isNumeric(),
    query('targetMarket').optional().isString(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const criteria = {
      industry: req.query.industry as string[] | undefined,
      skills: req.query.skills as string[] | undefined,
      minExperience: req.query.minExperience ? parseInt(req.query.minExperience as string) : undefined,
      maxBudget: req.query.maxBudget ? parseFloat(req.query.maxBudget as string) : undefined,
      targetMarket: req.query.targetMarket as string | undefined,
    };
    
    const profiles = await ClientProfileService.findMatchingProfiles(criteria);
    
    res.json(createApiResponse(true, profiles));
  })
);

// Search profiles (for PROJECT_MANAGER and ADMIN)
router.get(
  '/search',
  authenticateToken,
  requireRole([UserRole.PROJECT_MANAGER, UserRole.ADMIN]),
  [
    query('query').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'completeness']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const searchParams = {
      query: req.query.query as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
    };
    
    const results = await ClientProfileService.searchProfiles(searchParams);
    
    res.json(createApiResponse(true, results));
  })
);

// Get profile statistics (for ADMIN)
router.get(
  '/statistics',
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await ClientProfileService.getProfileStatistics();
    
    res.json(createApiResponse(true, stats));
  })
);

// Get specific profile by ID (for PROJECT_MANAGER and ADMIN)
router.get(
  '/:id',
  authenticateToken,
  requireRole([UserRole.PROJECT_MANAGER, UserRole.ADMIN]),
  [
    param('id').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await ClientProfileService.getProfileById(req.params.id);
    
    if (!profile) {
      return res.status(404).json(
        createApiResponse(false, null, 'Profile not found')
      );
    }
    
    res.json(createApiResponse(true, profile));
  })
);

// Update specific profile (for ADMIN)
router.put(
  '/:id',
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  [
    param('id').isUUID(),
    ...validateProfile,
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await ClientProfileService.updateProfile(req.params.id, req.body);
    
    if (!profile) {
      return res.status(404).json(
        createApiResponse(false, null, 'Profile not found')
      );
    }
    
    logger.info(`Profile ${req.params.id} updated by admin ${req.user!.userId}`);
    res.json(createApiResponse(true, profile, 'Profile updated successfully'));
  })
);

// Delete specific profile (for ADMIN)
router.delete(
  '/:id',
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  [
    param('id').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    await ClientProfileService.deleteProfile(req.params.id);
    
    logger.info(`Profile ${req.params.id} deleted by admin ${req.user!.userId}`);
    res.json(createApiResponse(true, null, 'Profile deleted successfully'));
  })
);

// Bulk operations for profiles (for ADMIN)
router.post(
  '/bulk',
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  [
    body('action').isIn(['export', 'import', 'delete']),
    body('profileIds').optional().isArray(),
    body('data').optional().isArray(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { action, profileIds, data } = req.body;
    
    let result;
    switch (action) {
      case 'export':
        if (profileIds && profileIds.length > 0) {
          result = await ClientProfileService.exportProfiles(profileIds);
        } else {
          result = await ClientProfileService.exportAllProfiles();
        }
        break;
      
      case 'import':
        if (!data || !Array.isArray(data)) {
          return res.status(400).json(
            createApiResponse(false, null, 'Import data is required')
          );
        }
        result = await ClientProfileService.importProfiles(data);
        break;
      
      case 'delete':
        if (!profileIds || profileIds.length === 0) {
          return res.status(400).json(
            createApiResponse(false, null, 'Profile IDs are required for deletion')
          );
        }
        result = await ClientProfileService.bulkDeleteProfiles(profileIds);
        break;
      
      default:
        return res.status(400).json(
          createApiResponse(false, null, 'Invalid action')
        );
    }
    
    logger.info(`Bulk operation '${action}' performed by admin ${req.user!.userId}`);
    res.json(createApiResponse(true, result, `Bulk ${action} completed successfully`));
  })
);

export default router;