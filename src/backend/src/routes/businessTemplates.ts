import express, { Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth';
import { UserRole, TemplateStatus } from '../types';
import BusinessTemplateService from '../services/businessTemplateService';
import { asyncHandler } from '../utils/asyncHandler';
import { createApiResponse } from '../utils/apiResponse';
import logger from '../utils/logger';

const router = express.Router();

// Validation middleware
const validateTemplate = [
  body('title').isString().isLength({ min: 1, max: 200 }).trim(),
  body('description').isString().isLength({ min: 1, max: 1000 }).trim(),
  body('industry').isString().isLength({ min: 1, max: 100 }),
  body('targetMarket').optional().isString(),
  body('businessModel').isArray(),
  body('requirements').optional().isObject(),
  body('features').optional().isArray(),
  body('techStack').optional().isObject(),
  body('estimatedCost').optional().isObject(),
  body('timeline').optional().isObject(),
  body('successMetrics').optional().isArray(),
  body('risks').optional().isArray(),
  body('marketAnalysis').optional().isObject(),
  body('competitorAnalysis').optional().isArray(),
  body('revenueProjection').optional().isObject(),
  body('implementationSteps').optional().isArray(),
  body('supportingResources').optional().isObject(),
  body('tags').optional().isArray(),
  body('complexity').optional().isIn(['simple', 'moderate', 'complex']),
  body('status').optional().isIn(['DRAFT', 'ACTIVE', 'ARCHIVED']),
];

const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(createApiResponse(false, null, 'Validation error', errors.array()));
  }
  next();
};

// Get all templates with filtering and pagination
router.get(
  '/',
  authenticateToken,
  [
    query('industry').optional().isArray(),
    query('businessModel').optional().isArray(),
    query('status').optional().isIn(['DRAFT', 'ACTIVE', 'ARCHIVED']),
    query('complexity').optional().isArray(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      industry: req.query.industry as string[] | undefined,
      businessModel: req.query.businessModel as string[] | undefined,
      status: req.query.status as TemplateStatus | undefined,
      complexity: req.query.complexity as string[] | undefined,
    };

    const pagination = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = await BusinessTemplateService.getTemplates(filters, pagination);

    res.json(createApiResponse(true, {
      templates: result.templates,
      pagination: {
        ...pagination,
        total: result.total,
        totalPages: Math.ceil(result.total / pagination.limit),
        hasNext: pagination.page < Math.ceil(result.total / pagination.limit),
        hasPrev: pagination.page > 1,
      },
    }));
  })
);

// Search templates
router.get(
  '/search',
  authenticateToken,
  [
    query('q').isString().isLength({ min: 1, max: 200 }),
    query('industry').optional().isArray(),
    query('businessModel').optional().isArray(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const filters = {
      industry: req.query.industry as string[] | undefined,
      businessModel: req.query.businessModel as string[] | undefined,
    };

    const templates = await BusinessTemplateService.searchTemplates(query, filters);

    res.json(createApiResponse(true, templates));
  })
);

// Find matching templates based on criteria
router.post(
  '/match',
  authenticateToken,
  [
    body('industry').optional().isArray(),
    body('businessModel').optional().isArray(),
    body('targetMarket').optional().isString(),
    body('budgetRange').optional().isObject(),
    body('complexity').optional().isIn(['simple', 'moderate', 'complex']),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const criteria = {
      industry: req.body.industry,
      businessModel: req.body.businessModel,
      targetMarket: req.body.targetMarket,
      budgetRange: req.body.budgetRange,
      complexity: req.body.complexity,
    };

    const matches = await BusinessTemplateService.findMatchingTemplates(criteria);

    res.json(createApiResponse(true, matches));
  })
);

// Get templates by industry
router.get(
  '/industry/:industry',
  authenticateToken,
  [
    param('industry').isString().isLength({ min: 1, max: 100 }),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const industry = req.params.industry;
    const templates = await BusinessTemplateService.getTemplatesByIndustry(industry);

    res.json(createApiResponse(true, templates));
  })
);

// Get popular templates
router.get(
  '/popular',
  authenticateToken,
  [
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const templates = await BusinessTemplateService.getPopularTemplates(limit);

    res.json(createApiResponse(true, templates));
  })
);

// Get template statistics (for ADMIN and PROJECT_MANAGER)
router.get(
  '/statistics',
  authenticateToken,
  requireRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await BusinessTemplateService.getTemplateStatistics();

    res.json(createApiResponse(true, stats));
  })
);

// Get specific template by ID
router.get(
  '/:id',
  authenticateToken,
  [
    param('id').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const template = await BusinessTemplateService.getTemplateById(req.params.id);

    if (!template) {
      return res.status(404).json(
        createApiResponse(false, null, 'Template not found')
      );
    }

    res.json(createApiResponse(true, template));
  })
);

// Create new template (for ADMIN and PROJECT_MANAGER)
router.post(
  '/',
  authenticateToken,
  requireRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  validateTemplate,
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const template = await BusinessTemplateService.createTemplate(req.body);

    logger.info(`Template created by user ${req.user!.userId}: ${template.id}`);
    res.status(201).json(createApiResponse(true, template, 'Template created successfully'));
  })
);

// Update template (for ADMIN and PROJECT_MANAGER)
router.put(
  '/:id',
  authenticateToken,
  requireRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  [
    param('id').isUUID(),
    ...validateTemplate,
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const template = await BusinessTemplateService.updateTemplate(req.params.id, req.body);

    logger.info(`Template updated by user ${req.user!.userId}: ${req.params.id}`);
    res.json(createApiResponse(true, template, 'Template updated successfully'));
  })
);

// Clone template (for ADMIN and PROJECT_MANAGER)
router.post(
  '/:id/clone',
  authenticateToken,
  requireRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  [
    param('id').isUUID(),
    body('title').isString().isLength({ min: 1, max: 200 }).trim(),
    body('modifications').optional().isObject(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { title, modifications } = req.body;
    
    const clonedTemplate = await BusinessTemplateService.cloneTemplate(
      req.params.id,
      title,
      modifications
    );

    logger.info(`Template cloned by user ${req.user!.userId}: ${req.params.id} -> ${clonedTemplate.id}`);
    res.status(201).json(createApiResponse(true, clonedTemplate, 'Template cloned successfully'));
  })
);

// Delete template (for ADMIN only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  [
    param('id').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    await BusinessTemplateService.deleteTemplate(req.params.id);

    logger.info(`Template deleted by admin ${req.user!.userId}: ${req.params.id}`);
    res.json(createApiResponse(true, null, 'Template deleted successfully'));
  })
);

// Bulk operations (for ADMIN only)
router.post(
  '/bulk',
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  [
    body('action').isIn(['updateStatus', 'export', 'import']),
    body('templateIds').optional().isArray(),
    body('status').optional().isIn(['DRAFT', 'ACTIVE', 'ARCHIVED']),
    body('templates').optional().isArray(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { action, templateIds, status, templates } = req.body;

    let result;
    switch (action) {
      case 'updateStatus':
        if (!templateIds || !status) {
          return res.status(400).json(
            createApiResponse(false, null, 'Template IDs and status are required')
          );
        }
        result = await BusinessTemplateService.bulkUpdateStatus(templateIds, status);
        break;

      case 'export':
        result = await BusinessTemplateService.exportTemplates(templateIds);
        break;

      case 'import':
        if (!templates || !Array.isArray(templates)) {
          return res.status(400).json(
            createApiResponse(false, null, 'Templates array is required for import')
          );
        }
        result = await BusinessTemplateService.importTemplates(templates);
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