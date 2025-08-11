/**
 * Project Service
 * Manages project lifecycle from recommendation approval to delivery
 */

import { PrismaClient, Project, ProjectStatus, TaskStatus } from '@prisma/client';
import { db } from './database';
import logger from '../utils/logger';
import { 
  ProjectType, 
  CreateProjectInput, 
  UpdateProjectInput,
  ProjectTaskType,
  CreateTaskInput,
  UpdateTaskInput,
  ProjectTimelineType,
  ProjectBudgetType,
} from '../types';

interface ProjectFilters {
  status?: ProjectStatus[];
  managerId?: string;
  clientId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  budgetRange?: {
    min: number;
    max: number;
  };
}

interface ProjectStats {
  total: number;
  byStatus: Record<ProjectStatus, number>;
  totalBudget: number;
  avgProjectDuration: number;
  completionRate: number;
}

export default class ProjectService {
  /**
   * Create a new project
   */
  public static async createProject(
    projectData: CreateProjectInput
  ): Promise<ProjectType> {
    try {
      const project = await db.getClient().project.create({
        data: {
          title: projectData.title,
          description: projectData.description,
          clientId: projectData.clientId,
          managerId: projectData.managerId,
          recommendationId: projectData.recommendationId,
          businessTemplate: projectData.businessTemplate || {},
          budget: projectData.budget || {},
          timeline: projectData.timeline || {},
          requirements: projectData.requirements || {},
          deliverables: projectData.deliverables || [],
          technologies: projectData.technologies || [],
          team: projectData.team || {},
          milestones: projectData.milestones || [],
          risks: projectData.risks || [],
          status: projectData.status || ProjectStatus.PLANNING,
        },
        include: {
          client: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          manager: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          recommendation: true,
          tasks: true,
        },
      });

      logger.info(`✅ Project created: ${project.id}`);
      return project as ProjectType;
    } catch (error) {
      logger.error('Failed to create project:', error);
      throw error;
    }
  }

  /**
   * Get project by ID
   */
  public static async getProjectById(id: string): Promise<ProjectType | null> {
    try {
      const project = await db.getClient().project.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          manager: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          recommendation: true,
          tasks: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return project as ProjectType | null;
    } catch (error) {
      logger.error('Failed to get project by ID:', error);
      throw error;
    }
  }

  /**
   * Get projects with filtering and pagination
   */
  public static async getProjects(
    filters?: ProjectFilters,
    pagination?: { page: number; limit: number }
  ): Promise<{ projects: ProjectType[]; total: number }> {
    try {
      const where: any = {};

      if (filters?.status && filters.status.length > 0) {
        where.status = { in: filters.status };
      }

      if (filters?.managerId) {
        where.managerId = filters.managerId;
      }

      if (filters?.clientId) {
        where.clientId = filters.clientId;
      }

      if (filters?.dateRange) {
        where.createdAt = {
          gte: filters.dateRange.start,
          lte: filters.dateRange.end,
        };
      }

      if (filters?.budgetRange) {
        // This would need a more complex query for JSON budget field
        // For now, we'll skip this filter implementation
      }

      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const skip = (page - 1) * limit;

      const [projects, total] = await Promise.all([
        db.getClient().project.findMany({
          where,
          include: {
            client: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
            manager: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
            recommendation: {
              select: {
                id: true,
                businessIdea: true,
              },
            },
            _count: {
              select: {
                tasks: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        db.getClient().project.count({ where }),
      ]);

      return {
        projects: projects as ProjectType[],
        total,
      };
    } catch (error) {
      logger.error('Failed to get projects:', error);
      throw error;
    }
  }

  /**
   * Update project
   */
  public static async updateProject(
    id: string,
    updateData: UpdateProjectInput
  ): Promise<ProjectType> {
    try {
      const project = await db.getClient().project.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        include: {
          client: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          manager: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          recommendation: true,
          tasks: true,
        },
      });

      logger.info(`✅ Project updated: ${id}`);
      return project as ProjectType;
    } catch (error) {
      logger.error('Failed to update project:', error);
      throw error;
    }
  }

  /**
   * Update project status
   */
  public static async updateProjectStatus(
    id: string,
    status: ProjectStatus,
    statusNote?: string
  ): Promise<ProjectType> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (statusNote) {
        updateData.statusHistory = {
          push: {
            status,
            note: statusNote,
            timestamp: new Date(),
          },
        };
      }

      // Set completion date if project is completed
      if (status === ProjectStatus.COMPLETED) {
        updateData.completedAt = new Date();
      }

      const project = await db.getClient().project.update({
        where: { id },
        data: updateData,
        include: {
          client: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          manager: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          tasks: true,
        },
      });

      logger.info(`✅ Project status updated: ${id} -> ${status}`);
      return project as ProjectType;
    } catch (error) {
      logger.error('Failed to update project status:', error);
      throw error;
    }
  }

  /**
   * Delete project
   */
  public static async deleteProject(id: string): Promise<void> {
    try {
      // Delete related tasks first
      await db.getClient().projectTask.deleteMany({
        where: { projectId: id },
      });

      // Delete the project
      await db.getClient().project.delete({
        where: { id },
      });

      logger.info(`✅ Project deleted: ${id}`);
    } catch (error) {
      logger.error('Failed to delete project:', error);
      throw error;
    }
  }

  /**
   * Create project task
   */
  public static async createTask(
    projectId: string,
    taskData: CreateTaskInput
  ): Promise<ProjectTaskType> {
    try {
      const task = await db.getClient().projectTask.create({
        data: {
          projectId,
          title: taskData.title,
          description: taskData.description,
          assigneeId: taskData.assigneeId,
          priority: taskData.priority || 'MEDIUM',
          status: taskData.status || TaskStatus.TODO,
          dueDate: taskData.dueDate,
          estimatedHours: taskData.estimatedHours,
          tags: taskData.tags || [],
          dependencies: taskData.dependencies || [],
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
          assignee: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      logger.info(`✅ Task created: ${task.id} for project ${projectId}`);
      return task as ProjectTaskType;
    } catch (error) {
      logger.error('Failed to create task:', error);
      throw error;
    }
  }

  /**
   * Update task
   */
  public static async updateTask(
    taskId: string,
    updateData: UpdateTaskInput
  ): Promise<ProjectTaskType> {
    try {
      const task = await db.getClient().projectTask.update({
        where: { id: taskId },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
          assignee: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      logger.info(`✅ Task updated: ${taskId}`);
      return task as ProjectTaskType;
    } catch (error) {
      logger.error('Failed to update task:', error);
      throw error;
    }
  }

  /**
   * Update task status
   */
  public static async updateTaskStatus(
    taskId: string,
    status: TaskStatus
  ): Promise<ProjectTaskType> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      // Set completion date if task is completed
      if (status === TaskStatus.DONE) {
        updateData.completedAt = new Date();
      }

      const task = await db.getClient().projectTask.update({
        where: { id: taskId },
        data: updateData,
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
          assignee: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      logger.info(`✅ Task status updated: ${taskId} -> ${status}`);
      return task as ProjectTaskType;
    } catch (error) {
      logger.error('Failed to update task status:', error);
      throw error;
    }
  }

  /**
   * Get project tasks
   */
  public static async getProjectTasks(
    projectId: string,
    filters?: {
      status?: TaskStatus[];
      assigneeId?: string;
      priority?: string[];
    }
  ): Promise<ProjectTaskType[]> {
    try {
      const where: any = { projectId };

      if (filters?.status && filters.status.length > 0) {
        where.status = { in: filters.status };
      }

      if (filters?.assigneeId) {
        where.assigneeId = filters.assigneeId;
      }

      if (filters?.priority && filters.priority.length > 0) {
        where.priority = { in: filters.priority };
      }

      const tasks = await db.getClient().projectTask.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
          assignee: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: [
          { priority: 'asc' },
          { dueDate: 'asc' },
          { createdAt: 'asc' },
        ],
      });

      return tasks as ProjectTaskType[];
    } catch (error) {
      logger.error('Failed to get project tasks:', error);
      throw error;
    }
  }

  /**
   * Delete task
   */
  public static async deleteTask(taskId: string): Promise<void> {
    try {
      await db.getClient().projectTask.delete({
        where: { id: taskId },
      });

      logger.info(`✅ Task deleted: ${taskId}`);
    } catch (error) {
      logger.error('Failed to delete task:', error);
      throw error;
    }
  }

  /**
   * Get projects by client
   */
  public static async getProjectsByClient(clientId: string): Promise<ProjectType[]> {
    try {
      const projects = await db.getClient().project.findMany({
        where: { clientId },
        include: {
          client: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          manager: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          recommendation: {
            select: {
              id: true,
              businessIdea: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return projects as ProjectType[];
    } catch (error) {
      logger.error('Failed to get projects by client:', error);
      throw error;
    }
  }

  /**
   * Get projects by manager
   */
  public static async getProjectsByManager(managerId: string): Promise<ProjectType[]> {
    try {
      const projects = await db.getClient().project.findMany({
        where: { managerId },
        include: {
          client: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          manager: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          recommendation: {
            select: {
              id: true,
              businessIdea: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return projects as ProjectType[];
    } catch (error) {
      logger.error('Failed to get projects by manager:', error);
      throw error;
    }
  }

  /**
   * Get project statistics
   */
  public static async getProjectStatistics(): Promise<ProjectStats> {
    try {
      const [
        totalProjects,
        statusCounts,
        budgetSum,
        avgDuration,
        completedProjects,
      ] = await Promise.all([
        db.getClient().project.count(),
        
        db.getClient().project.groupBy({
          by: ['status'],
          _count: { _all: true },
        }),

        // This would need a more complex query for JSON budget sum
        // For now, we'll return 0
        Promise.resolve(0),

        // Calculate average project duration
        db.getClient().$queryRaw`
          SELECT AVG(EXTRACT(DAY FROM (completed_at - created_at))) as avg_duration
          FROM projects 
          WHERE completed_at IS NOT NULL
        `,

        db.getClient().project.count({
          where: { status: ProjectStatus.COMPLETED },
        }),
      ]);

      const byStatus: Record<ProjectStatus, number> = {
        [ProjectStatus.PLANNING]: 0,
        [ProjectStatus.IN_PROGRESS]: 0,
        [ProjectStatus.REVIEW]: 0,
        [ProjectStatus.COMPLETED]: 0,
        [ProjectStatus.CANCELLED]: 0,
        [ProjectStatus.ON_HOLD]: 0,
      };

      statusCounts.forEach(item => {
        byStatus[item.status as ProjectStatus] = item._count._all;
      });

      const avgProjectDuration = Array.isArray(avgDuration) && avgDuration.length > 0
        ? Number(avgDuration[0].avg_duration) || 0
        : 0;

      return {
        total: totalProjects,
        byStatus,
        totalBudget: budgetSum,
        avgProjectDuration,
        completionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0,
      };
    } catch (error) {
      logger.error('Failed to get project statistics:', error);
      throw error;
    }
  }

  /**
   * Get project timeline
   */
  public static async getProjectTimeline(projectId: string): Promise<ProjectTimelineType> {
    try {
      const project = await db.getClient().project.findUnique({
        where: { id: projectId },
        include: {
          tasks: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!project) {
        throw new Error('Project not found');
      }

      const timeline = project.timeline as any || {};
      const tasks = project.tasks || [];

      return {
        projectId: project.id,
        startDate: project.createdAt,
        expectedEndDate: timeline.endDate ? new Date(timeline.endDate) : null,
        actualEndDate: project.completedAt,
        phases: timeline.phases || [],
        milestones: project.milestones || [],
        tasks: tasks.map(task => ({
          id: task.id,
          title: task.title,
          status: task.status as TaskStatus,
          startDate: task.createdAt,
          dueDate: task.dueDate,
          completedDate: task.completedAt,
          estimatedHours: task.estimatedHours,
        })),
        overallProgress: this.calculateProjectProgress(tasks),
      };
    } catch (error) {
      logger.error('Failed to get project timeline:', error);
      throw error;
    }
  }

  /**
   * Calculate project progress based on tasks
   */
  private static calculateProjectProgress(tasks: any[]): number {
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE);
    return Math.round((completedTasks.length / tasks.length) * 100);
  }

  /**
   * Get project budget summary
   */
  public static async getProjectBudget(projectId: string): Promise<ProjectBudgetType> {
    try {
      const project = await db.getClient().project.findUnique({
        where: { id: projectId },
        include: {
          tasks: true,
        },
      });

      if (!project) {
        throw new Error('Project not found');
      }

      const budget = project.budget as any || {};
      const tasks = project.tasks || [];

      const estimatedTotal = budget.total || 0;
      const spentAmount = budget.spent || 0;
      const remainingAmount = estimatedTotal - spentAmount;

      // Calculate task hours
      const totalEstimatedHours = tasks.reduce(
        (sum, task) => sum + (task.estimatedHours || 0), 0
      );

      const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE);
      const completedHours = completedTasks.reduce(
        (sum, task) => sum + (task.estimatedHours || 0), 0
      );

      return {
        projectId: project.id,
        estimatedTotal,
        spentAmount,
        remainingAmount,
        utilization: estimatedTotal > 0 ? (spentAmount / estimatedTotal) * 100 : 0,
        breakdown: budget.breakdown || {},
        totalEstimatedHours,
        completedHours,
        remainingHours: totalEstimatedHours - completedHours,
      };
    } catch (error) {
      logger.error('Failed to get project budget:', error);
      throw error;
    }
  }

  /**
   * Search projects
   */
  public static async searchProjects(
    query: string,
    filters?: ProjectFilters
  ): Promise<ProjectType[]> {
    try {
      const where: any = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      };

      // Apply additional filters
      if (filters?.status && filters.status.length > 0) {
        where.status = { in: filters.status };
      }

      if (filters?.managerId) {
        where.managerId = filters.managerId;
      }

      if (filters?.clientId) {
        where.clientId = filters.clientId;
      }

      const projects = await db.getClient().project.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          manager: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          recommendation: {
            select: {
              id: true,
              businessIdea: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      return projects as ProjectType[];
    } catch (error) {
      logger.error('Failed to search projects:', error);
      throw error;
    }
  }
}