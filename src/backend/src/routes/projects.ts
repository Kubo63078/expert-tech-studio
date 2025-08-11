import express, { Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth';
import { UserRole, ProjectStatus, TaskStatus } from '../types';
import ProjectService from '../services/projectService';
import { asyncHandler } from '../utils/asyncHandler';
import { createApiResponse } from '../utils/apiResponse';
import logger from '../utils/logger';

const router = express.Router();

// Validation middleware
const validateProject = [
  body('title').isString().isLength({ min: 1, max: 200 }).trim(),
  body('description').isString().isLength({ min: 1, max: 2000 }).trim(),
  body('clientId').isUUID(),
  body('managerId').optional().isUUID(),
  body('recommendationId').optional().isUUID(),
  body('businessTemplate').optional().isObject(),
  body('budget').optional().isObject(),
  body('timeline').optional().isObject(),
  body('requirements').optional().isObject(),
  body('deliverables').optional().isArray(),
  body('technologies').optional().isArray(),
  body('team').optional().isObject(),
  body('milestones').optional().isArray(),
  body('risks').optional().isArray(),
  body('status').optional().isIn(['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED', 'ON_HOLD']),
];

const validateTask = [
  body('title').isString().isLength({ min: 1, max: 200 }).trim(),
  body('description').optional().isString(),
  body('assigneeId').optional().isUUID(),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED']),
  body('dueDate').optional().isISO8601(),
  body('estimatedHours').optional().isNumeric(),
  body('tags').optional().isArray(),
  body('dependencies').optional().isArray(),
];

const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(createApiResponse(false, null, 'Validation error', errors.array()));
  }
  next();
};

// Get all projects with filtering and pagination
router.get(
  '/',
  authenticateToken,
  [
    query('status').optional().isArray(),
    query('managerId').optional().isUUID(),
    query('clientId').optional().isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('minBudget').optional().isNumeric(),
    query('maxBudget').optional().isNumeric(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    const filters: any = {};

    // Apply role-based filtering
    if (userRole === UserRole.CLIENT) {
      filters.clientId = userId;
    } else if (userRole === UserRole.PROJECT_MANAGER) {
      filters.managerId = userId;
    }

    // Apply query filters
    if (req.query.status) {
      filters.status = req.query.status as ProjectStatus[];
    }
    if (req.query.managerId && (userRole === UserRole.ADMIN)) {
      filters.managerId = req.query.managerId as string;
    }
    if (req.query.clientId && [UserRole.ADMIN, UserRole.PROJECT_MANAGER].includes(userRole)) {
      filters.clientId = req.query.clientId as string;
    }
    if (req.query.startDate && req.query.endDate) {
      filters.dateRange = {
        start: new Date(req.query.startDate as string),
        end: new Date(req.query.endDate as string),
      };
    }
    if (req.query.minBudget && req.query.maxBudget) {
      filters.budgetRange = {
        min: parseFloat(req.query.minBudget as string),
        max: parseFloat(req.query.maxBudget as string),
      };
    }

    const pagination = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await ProjectService.getProjects(filters, pagination);

    res.json(createApiResponse(true, {
      projects: result.projects,
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

// Get specific project by ID
router.get(
  '/:id',
  authenticateToken,
  [
    param('id').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const project = await ProjectService.getProjectById(projectId);

    if (!project) {
      return res.status(404).json(
        createApiResponse(false, null, 'Project not found')
      );
    }

    // Check access permissions
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.CLIENT && project.clientId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this project')
      );
    }

    if (userRole === UserRole.PROJECT_MANAGER && project.managerId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this project')
      );
    }

    res.json(createApiResponse(true, project));
  })
);

// Create new project (PROJECT_MANAGER and ADMIN)
router.post(
  '/',
  authenticateToken,
  requireRole([UserRole.PROJECT_MANAGER, UserRole.ADMIN]),
  validateProject,
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const projectData = {
      ...req.body,
      managerId: req.body.managerId || req.user!.userId, // Default to current user
    };

    const project = await ProjectService.createProject(projectData);

    logger.info(`Project created by user ${req.user!.userId}: ${project.id}`);
    res.status(201).json(createApiResponse(true, project, 'Project created successfully'));
  })
);

// Update project
router.put(
  '/:id',
  authenticateToken,
  [
    param('id').isUUID(),
    ...validateProject,
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;
    
    // Check if project exists and user has access
    const existingProject = await ProjectService.getProjectById(projectId);
    if (!existingProject) {
      return res.status(404).json(
        createApiResponse(false, null, 'Project not found')
      );
    }

    // Check permissions
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.PROJECT_MANAGER && existingProject.managerId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to modify this project')
      );
    }

    const project = await ProjectService.updateProject(projectId, req.body);

    logger.info(`Project updated by user ${userId}: ${projectId}`);
    res.json(createApiResponse(true, project, 'Project updated successfully'));
  })
);

// Update project status
router.patch(
  '/:id/status',
  authenticateToken,
  [
    param('id').isUUID(),
    body('status').isIn(['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED', 'ON_HOLD']),
    body('statusNote').optional().isString(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const { status, statusNote } = req.body;

    // Check access permissions
    const existingProject = await ProjectService.getProjectById(projectId);
    if (!existingProject) {
      return res.status(404).json(
        createApiResponse(false, null, 'Project not found')
      );
    }

    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.PROJECT_MANAGER && existingProject.managerId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to modify this project')
      );
    }

    const project = await ProjectService.updateProjectStatus(projectId, status, statusNote);

    logger.info(`Project status updated by user ${userId}: ${projectId} -> ${status}`);
    res.json(createApiResponse(true, project, 'Project status updated successfully'));
  })
);

// Delete project (ADMIN only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  [
    param('id').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;

    await ProjectService.deleteProject(projectId);

    logger.info(`Project deleted by admin ${req.user!.userId}: ${projectId}`);
    res.json(createApiResponse(true, null, 'Project deleted successfully'));
  })
);

// Get my projects (for current user)
router.get(
  '/my/projects',
  authenticateToken,
  [
    query('status').optional().isArray(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    let projects;
    if (userRole === UserRole.CLIENT) {
      projects = await ProjectService.getProjectsByClient(userId);
    } else if (userRole === UserRole.PROJECT_MANAGER) {
      projects = await ProjectService.getProjectsByManager(userId);
    } else {
      // ADMIN can see all projects
      const result = await ProjectService.getProjects({}, { page: 1, limit: 100 });
      projects = result.projects;
    }

    // Apply status filtering if provided
    if (req.query.status) {
      const statusFilter = req.query.status as ProjectStatus[];
      projects = projects.filter(project => statusFilter.includes(project.status as ProjectStatus));
    }

    // Apply pagination
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const skip = (page - 1) * limit;
    const paginatedProjects = projects.slice(skip, skip + limit);

    res.json(createApiResponse(true, {
      projects: paginatedProjects,
      pagination: {
        page,
        limit,
        total: projects.length,
        totalPages: Math.ceil(projects.length / limit),
        hasNext: page < Math.ceil(projects.length / limit),
        hasPrev: page > 1,
      },
    }));
  })
);

// Search projects
router.get(
  '/search/query',
  authenticateToken,
  [
    query('q').isString().isLength({ min: 1, max: 200 }),
    query('status').optional().isArray(),
    query('managerId').optional().isUUID(),
    query('clientId').optional().isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    const filters: any = {};

    // Apply role-based filtering
    if (userRole === UserRole.CLIENT) {
      filters.clientId = userId;
    } else if (userRole === UserRole.PROJECT_MANAGER) {
      filters.managerId = userId;
    }

    // Apply additional filters for authorized users
    if (req.query.status) {
      filters.status = req.query.status as ProjectStatus[];
    }
    if (req.query.managerId && userRole === UserRole.ADMIN) {
      filters.managerId = req.query.managerId as string;
    }
    if (req.query.clientId && [UserRole.ADMIN, UserRole.PROJECT_MANAGER].includes(userRole)) {
      filters.clientId = req.query.clientId as string;
    }

    const projects = await ProjectService.searchProjects(query, filters);

    res.json(createApiResponse(true, projects));
  })
);

// Get project statistics (ADMIN and PROJECT_MANAGER)
router.get(
  '/admin/statistics',
  authenticateToken,
  requireRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await ProjectService.getProjectStatistics();

    res.json(createApiResponse(true, stats));
  })
);

// Get project timeline
router.get(
  '/:id/timeline',
  authenticateToken,
  [
    param('id').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;

    // Check access permissions
    const project = await ProjectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json(
        createApiResponse(false, null, 'Project not found')
      );
    }

    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.CLIENT && project.clientId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this project')
      );
    }

    if (userRole === UserRole.PROJECT_MANAGER && project.managerId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this project')
      );
    }

    const timeline = await ProjectService.getProjectTimeline(projectId);

    res.json(createApiResponse(true, timeline));
  })
);

// Get project budget
router.get(
  '/:id/budget',
  authenticateToken,
  [
    param('id').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;

    // Check access permissions
    const project = await ProjectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json(
        createApiResponse(false, null, 'Project not found')
      );
    }

    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.CLIENT && project.clientId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this project')
      );
    }

    if (userRole === UserRole.PROJECT_MANAGER && project.managerId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this project')
      );
    }

    const budget = await ProjectService.getProjectBudget(projectId);

    res.json(createApiResponse(true, budget));
  })
);

// TASK MANAGEMENT ROUTES

// Get project tasks
router.get(
  '/:id/tasks',
  authenticateToken,
  [
    param('id').isUUID(),
    query('status').optional().isArray(),
    query('assigneeId').optional().isUUID(),
    query('priority').optional().isArray(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;

    // Check access permissions
    const project = await ProjectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json(
        createApiResponse(false, null, 'Project not found')
      );
    }

    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.CLIENT && project.clientId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this project')
      );
    }

    if (userRole === UserRole.PROJECT_MANAGER && project.managerId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this project')
      );
    }

    const filters = {
      status: req.query.status as TaskStatus[] | undefined,
      assigneeId: req.query.assigneeId as string | undefined,
      priority: req.query.priority as string[] | undefined,
    };

    const tasks = await ProjectService.getProjectTasks(projectId, filters);

    res.json(createApiResponse(true, tasks));
  })
);

// Create project task
router.post(
  '/:id/tasks',
  authenticateToken,
  requireRole([UserRole.PROJECT_MANAGER, UserRole.ADMIN]),
  [
    param('id').isUUID(),
    ...validateTask,
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;

    // Check if project exists and user has access
    const project = await ProjectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json(
        createApiResponse(false, null, 'Project not found')
      );
    }

    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === UserRole.PROJECT_MANAGER && project.managerId !== userId) {
      return res.status(403).json(
        createApiResponse(false, null, 'Access denied to this project')
      );
    }

    const task = await ProjectService.createTask(projectId, req.body);

    logger.info(`Task created by user ${userId}: ${task.id} for project ${projectId}`);
    res.status(201).json(createApiResponse(true, task, 'Task created successfully'));
  })
);

// Update task
router.put(
  '/tasks/:taskId',
  authenticateToken,
  requireRole([UserRole.PROJECT_MANAGER, UserRole.ADMIN, UserRole.DEVELOPER]),
  [
    param('taskId').isUUID(),
    ...validateTask,
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const taskId = req.params.taskId;

    const task = await ProjectService.updateTask(taskId, req.body);

    logger.info(`Task updated by user ${req.user!.userId}: ${taskId}`);
    res.json(createApiResponse(true, task, 'Task updated successfully'));
  })
);

// Update task status
router.patch(
  '/tasks/:taskId/status',
  authenticateToken,
  [
    param('taskId').isUUID(),
    body('status').isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED']),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const taskId = req.params.taskId;
    const { status } = req.body;

    const task = await ProjectService.updateTaskStatus(taskId, status);

    logger.info(`Task status updated by user ${req.user!.userId}: ${taskId} -> ${status}`);
    res.json(createApiResponse(true, task, 'Task status updated successfully'));
  })
);

// Delete task (PROJECT_MANAGER and ADMIN)
router.delete(
  '/tasks/:taskId',
  authenticateToken,
  requireRole([UserRole.PROJECT_MANAGER, UserRole.ADMIN]),
  [
    param('taskId').isUUID(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const taskId = req.params.taskId;

    await ProjectService.deleteTask(taskId);

    logger.info(`Task deleted by user ${req.user!.userId}: ${taskId}`);
    res.json(createApiResponse(true, null, 'Task deleted successfully'));
  })
);

export default router;