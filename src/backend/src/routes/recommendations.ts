import express, { Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth';
import { UserRole, RecommendationStatus } from '../types';
import AIRecommendationService from '../services/aiRecommendationService';
import { asyncHandler } from '../utils/asyncHandler';
import { createApiResponse } from '../utils/apiResponse';
import logger from '../utils/logger';

const router = express.Router();

// Validation middleware
const validateRecommendationInput = [
  body('profileId').isUUID().withMessage('Valid profile ID is required'),
  body('requestType').optional().isIn(['initial', 'refined', 'alternative']),
  body('preferences').optional().isObject(),
  body('preferences.industries').optional().isArray(),
  body('preferences.businessModels').optional().isArray(),
  body('preferences.budgetRange').optional().isObject(),
  body('preferences.timeline').optional().isString(),
];

const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(createApiResponse(false, null, 'Validation error', errors.array()));
  }
  next();
};

// Generate new recommendations for a profile
router.post(
  '/generate',
  authenticateToken,
  requireRole([UserRole.CLIENT, UserRole.PROJECT_MANAGER, UserRole.ADMIN]),
  validateRecommendationInput,
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { profileId, requestType, preferences } = req.body;

    // Verify user has access to this profile
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.CLIENT) {
      // Client can only generate recommendations for their own profile
      const profile = await req.db.clientProfile.findUnique({
        where: { id: profileId },
        select: { userId: true },
      });

      if (!profile || profile.userId !== userId) {
        return res.status(403).json(
          createApiResponse(false, null, 'Access denied to this profile')
        );
      }
    }

    const recommendations = await AIRecommendationService.generateRecommendations({
      profileId,
      requestType: requestType || 'initial',
      preferences,
    });

    logger.info(`Recommendations generated for profile ${profileId} by user ${userId}`);
    res.status(201).json(createApiResponse(
      true, 
      recommendations, 
      `Generated ${recommendations.length} recommendations successfully`
    ));
  })
);

// Get recommendations for a profile
router.get(
  '/profile/:profileId',
  authenticateToken,
  [
    param('profileId').isUUID(),
    query('status').optional().isIn(['DRAFT', 'PRESENTED', 'ACCEPTED', 'REJECTED', 'IN_DEVELOPMENT']),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const profileId = req.params.profileId;
    const status = req.query.status as RecommendationStatus | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    // Check access permissions
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.CLIENT) {
      const profile = await req.db.clientProfile.findUnique({
        where: { id: profileId },
        select: { userId: true },
      });

      if (!profile || profile.userId !== userId) {
        return res.status(403).json(
          createApiResponse(false, null, 'Access denied to this profile')
        );
      }
    }

    const recommendations = await AIRecommendationService.getRecommendations(profileId, status);
    const limitedRecommendations = recommendations.slice(0, limit);

    res.json(createApiResponse(true, limitedRecommendations));
  })
);

// Get specific recommendation by ID
router.get(
  '/:id',
  authenticateToken,
  [
    param('id').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const recommendationId = req.params.id;
    
    const recommendation = await req.db.recommendation.findUnique({
      where: { id: recommendationId },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!recommendation) {
      return res.status(404).json(
        createApiResponse(false, null, 'Recommendation not found')
      );
    }

    // Check access permissions
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.CLIENT && recommendation.profile.userId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this recommendation')
      );
    }

    res.json(createApiResponse(true, recommendation));
  })
);

// Update recommendation status
router.patch(
  '/:id/status',
  authenticateToken,
  [
    param('id').isUUID(),
    body('status').isIn(['DRAFT', 'PRESENTED', 'ACCEPTED', 'REJECTED', 'IN_DEVELOPMENT']),
    body('feedback').optional().isObject(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const recommendationId = req.params.id;
    const { status, feedback } = req.body;

    // Check if recommendation exists and user has access
    const existingRecommendation = await req.db.recommendation.findUnique({
      where: { id: recommendationId },
      include: {
        profile: {
          select: { userId: true },
        },
      },
    });

    if (!existingRecommendation) {
      return res.status(404).json(
        createApiResponse(false, null, 'Recommendation not found')
      );
    }

    // Check access permissions
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.CLIENT && existingRecommendation.profile.userId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this recommendation')
      );
    }

    const updatedRecommendation = await AIRecommendationService.updateRecommendationStatus(
      recommendationId,
      status as RecommendationStatus,
      feedback
    );

    logger.info(`Recommendation ${recommendationId} status updated to ${status} by user ${userId}`);
    res.json(createApiResponse(
      true, 
      updatedRecommendation, 
      'Recommendation status updated successfully'
    ));
  })
);

// Delete recommendation (ADMIN only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  [
    param('id').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const recommendationId = req.params.id;

    await AIRecommendationService.deleteRecommendation(recommendationId);

    logger.info(`Recommendation ${recommendationId} deleted by admin ${req.user!.userId}`);
    res.json(createApiResponse(true, null, 'Recommendation deleted successfully'));
  })
);

// Get my recommendations (for current user)
router.get(
  '/my/recommendations',
  authenticateToken,
  requireRole([UserRole.CLIENT]),
  [
    query('status').optional().isIn(['DRAFT', 'PRESENTED', 'ACCEPTED', 'REJECTED', 'IN_DEVELOPMENT']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const status = req.query.status as RecommendationStatus | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const skip = (page - 1) * limit;

    // Get user's profile first
    const profile = await req.db.clientProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return res.status(404).json(
        createApiResponse(false, null, 'User profile not found')
      );
    }

    const where: any = { profileId: profile.id };
    if (status) {
      where.status = status;
    }

    const [recommendations, total] = await Promise.all([
      req.db.recommendation.findMany({
        where,
        include: {
          profile: {
            select: {
              id: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      req.db.recommendation.count({ where }),
    ]);

    res.json(createApiResponse(true, {
      recommendations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    }));
  })
);

// Get all recommendations (for ADMIN and PROJECT_MANAGER)
router.get(
  '/all/list',
  authenticateToken,
  requireRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  [
    query('status').optional().isIn(['DRAFT', 'PRESENTED', 'ACCEPTED', 'REJECTED', 'IN_DEVELOPMENT']),
    query('clientId').optional().isUUID(),
    query('industry').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'status']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status as RecommendationStatus | undefined;
    const clientId = req.query.clientId as string | undefined;
    const industry = req.query.industry as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.profile = {
        userId: clientId,
      };
    }

    if (industry) {
      where.businessIdea = {
        path: ['industry'],
        string_contains: industry,
      };
    }

    const [recommendations, total] = await Promise.all([
      req.db.recommendation.findMany({
        where,
        include: {
          profile: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      req.db.recommendation.count({ where }),
    ]);

    res.json(createApiResponse(true, {
      recommendations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    }));
  })
);

// Get recommendation statistics (for ADMIN)
router.get(
  '/admin/statistics',
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await AIRecommendationService.getRecommendationStats();

    res.json(createApiResponse(true, stats));
  })
);

// Bulk operations for recommendations (for ADMIN)
router.post(
  '/bulk',
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  [
    body('action').isIn(['updateStatus', 'delete', 'export']),
    body('recommendationIds').isArray().notEmpty(),
    body('status').optional().isIn(['DRAFT', 'PRESENTED', 'ACCEPTED', 'REJECTED', 'IN_DEVELOPMENT']),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { action, recommendationIds, status } = req.body;

    let result;
    switch (action) {
      case 'updateStatus':
        if (!status) {
          return res.status(400).json(
            createApiResponse(false, null, 'Status is required for updateStatus action')
          );
        }
        
        const updateResult = await req.db.recommendation.updateMany({
          where: {
            id: { in: recommendationIds },
          },
          data: {
            status: status as RecommendationStatus,
            updatedAt: new Date(),
          },
        });
        
        result = { updated: updateResult.count };
        break;

      case 'delete':
        const deleteResult = await req.db.recommendation.deleteMany({
          where: {
            id: { in: recommendationIds },
          },
        });
        
        result = { deleted: deleteResult.count };
        break;

      case 'export':
        const recommendations = await req.db.recommendation.findMany({
          where: {
            id: { in: recommendationIds },
          },
          include: {
            profile: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
          },
        });
        
        result = recommendations;
        break;

      default:
        return res.status(400).json(
          createApiResponse(false, null, 'Invalid action')
        );
    }

    logger.info(`Bulk recommendation operation '${action}' performed by admin ${req.user!.userId}`);
    res.json(createApiResponse(true, result, `Bulk ${action} completed successfully`));
  })
);

// Advanced analytics for recommendations (for ADMIN and PROJECT_MANAGER)
router.get(
  '/analytics/insights',
  authenticateToken,
  requireRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  [
    query('dateRange').optional().isString(),
    query('industry').optional().isString(),
    query('status').optional().isString(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const dateRange = req.query.dateRange as string | undefined;
    const industry = req.query.industry as string | undefined;
    const status = req.query.status as string | undefined;

    const where: any = {};

    // Add date filtering
    if (dateRange) {
      const ranges = {
        '7d': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        '90d': new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        '1y': new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      };
      
      if (ranges[dateRange as keyof typeof ranges]) {
        where.createdAt = { gte: ranges[dateRange as keyof typeof ranges] };
      }
    }

    if (status) {
      where.status = status;
    }

    const [
      totalRecommendations,
      recommendationsByStatus,
      recommendationsByIndustry,
      conversionRate,
      avgFeasibilityScore,
    ] = await Promise.all([
      req.db.recommendation.count({ where }),
      
      req.db.recommendation.groupBy({
        by: ['status'],
        where,
        _count: { _all: true },
      }),

      // This would need a more complex query for JSON field analysis
      req.db.$queryRaw`
        SELECT 
          businessIdea->>'industry' as industry,
          COUNT(*) as count
        FROM recommendations
        WHERE (${Object.keys(where).length === 0} OR status = ${status || 'ANY'})
        GROUP BY businessIdea->>'industry'
        ORDER BY count DESC
        LIMIT 10
      `,

      // Calculate conversion rate (ACCEPTED / PRESENTED)
      Promise.all([
        req.db.recommendation.count({
          where: { ...where, status: RecommendationStatus.ACCEPTED }
        }),
        req.db.recommendation.count({
          where: { ...where, status: RecommendationStatus.PRESENTED }
        }),
      ]).then(([accepted, presented]) => 
        presented > 0 ? (accepted / presented) * 100 : 0
      ),

      // Average feasibility score
      req.db.$queryRaw`
        SELECT AVG((feasibilityScore->>'overall')::float) as avg_score
        FROM recommendations
        WHERE feasibilityScore->>'overall' IS NOT NULL
        ${Object.keys(where).length > 0 ? 'AND status = ' + status : ''}
      `,
    ]);

    const avgScore = Array.isArray(avgFeasibilityScore) && avgFeasibilityScore.length > 0
      ? Number(avgFeasibilityScore[0].avg_score) || 0
      : 0;

    const analytics = {
      overview: {
        total: totalRecommendations,
        conversionRate: Math.round(conversionRate * 100) / 100,
        avgFeasibilityScore: Math.round(avgScore * 100) / 100,
      },
      byStatus: recommendationsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count._all;
        return acc;
      }, {} as Record<string, number>),
      byIndustry: recommendationsByIndustry,
      trends: {
        // This would include time-series data in a real implementation
        message: 'Trend analysis would require time-series queries',
      },
    };

    res.json(createApiResponse(true, analytics));
  })
);

export default router;