/**
 * Business Template Service
 * Manages business templates for different industries and business models
 */

import { PrismaClient, BusinessTemplate, TemplateStatus } from '@prisma/client';
import { db } from './database';
import logger from '../utils/logger';
import { BusinessTemplateType, CreateBusinessTemplateInput, UpdateBusinessTemplateInput } from '../types';

interface TemplateSearchCriteria {
  industry?: string[];
  businessModel?: string[];
  targetMarket?: string;
  budgetRange?: { min: number; max: number };
  complexity?: 'simple' | 'moderate' | 'complex';
}

interface TemplateMatchingResult {
  template: BusinessTemplateType;
  matchScore: number;
  matchReasons: string[];
}

export default class BusinessTemplateService {
  /**
   * Create a new business template
   */
  public static async createTemplate(
    templateData: CreateBusinessTemplateInput
  ): Promise<BusinessTemplateType> {
    try {
      const template = await db.getClient().businessTemplate.create({
        data: {
          title: templateData.title,
          description: templateData.description,
          industry: templateData.industry,
          targetMarket: templateData.targetMarket,
          businessModel: templateData.businessModel,
          requirements: templateData.requirements || {},
          features: templateData.features || [],
          techStack: templateData.techStack || {},
          estimatedCost: templateData.estimatedCost || {},
          timeline: templateData.timeline || {},
          successMetrics: templateData.successMetrics || [],
          risks: templateData.risks || [],
          marketAnalysis: templateData.marketAnalysis || {},
          competitorAnalysis: templateData.competitorAnalysis || [],
          revenueProjection: templateData.revenueProjection || {},
          implementationSteps: templateData.implementationSteps || [],
          supportingResources: templateData.supportingResources || {},
          tags: templateData.tags || [],
          complexity: templateData.complexity || 'moderate',
          status: templateData.status || TemplateStatus.ACTIVE,
        },
      });

      logger.info(`✅ Business template created: ${template.id}`);
      return template as BusinessTemplateType;
    } catch (error) {
      logger.error('Failed to create business template:', error);
      throw error;
    }
  }

  /**
   * Get template by ID
   */
  public static async getTemplateById(id: string): Promise<BusinessTemplateType | null> {
    try {
      const template = await db.getClient().businessTemplate.findUnique({
        where: { id },
      });

      return template as BusinessTemplateType | null;
    } catch (error) {
      logger.error('Failed to get template by ID:', error);
      throw error;
    }
  }

  /**
   * Get all templates with filtering
   */
  public static async getTemplates(
    filters?: {
      industry?: string[];
      businessModel?: string[];
      status?: TemplateStatus;
      complexity?: string[];
    },
    pagination?: { page: number; limit: number }
  ): Promise<{ templates: BusinessTemplateType[]; total: number }> {
    try {
      const where: any = {};

      if (filters?.industry && filters.industry.length > 0) {
        where.industry = { in: filters.industry };
      }

      if (filters?.businessModel && filters.businessModel.length > 0) {
        where.businessModel = { hasSome: filters.businessModel };
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.complexity && filters.complexity.length > 0) {
        where.complexity = { in: filters.complexity };
      }

      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const skip = (page - 1) * limit;

      const [templates, total] = await Promise.all([
        db.getClient().businessTemplate.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        db.getClient().businessTemplate.count({ where }),
      ]);

      return {
        templates: templates as BusinessTemplateType[],
        total,
      };
    } catch (error) {
      logger.error('Failed to get templates:', error);
      throw error;
    }
  }

  /**
   * Update template
   */
  public static async updateTemplate(
    id: string,
    updateData: UpdateBusinessTemplateInput
  ): Promise<BusinessTemplateType> {
    try {
      const template = await db.getClient().businessTemplate.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });

      logger.info(`✅ Business template updated: ${id}`);
      return template as BusinessTemplateType;
    } catch (error) {
      logger.error('Failed to update template:', error);
      throw error;
    }
  }

  /**
   * Delete template
   */
  public static async deleteTemplate(id: string): Promise<void> {
    try {
      await db.getClient().businessTemplate.delete({
        where: { id },
      });

      logger.info(`✅ Business template deleted: ${id}`);
    } catch (error) {
      logger.error('Failed to delete template:', error);
      throw error;
    }
  }

  /**
   * Find matching templates based on criteria
   */
  public static async findMatchingTemplates(
    criteria: TemplateSearchCriteria
  ): Promise<TemplateMatchingResult[]> {
    try {
      // Get all active templates
      const templates = await db.getClient().businessTemplate.findMany({
        where: { status: TemplateStatus.ACTIVE },
      });

      const results: TemplateMatchingResult[] = [];

      for (const template of templates) {
        const matchResult = this.calculateTemplateMatch(template as BusinessTemplateType, criteria);
        if (matchResult.matchScore > 0.3) { // Only include templates with decent match
          results.push(matchResult);
        }
      }

      // Sort by match score
      results.sort((a, b) => b.matchScore - a.matchScore);

      return results.slice(0, 10); // Return top 10 matches
    } catch (error) {
      logger.error('Failed to find matching templates:', error);
      throw error;
    }
  }

  /**
   * Calculate how well a template matches the criteria
   */
  private static calculateTemplateMatch(
    template: BusinessTemplateType,
    criteria: TemplateSearchCriteria
  ): TemplateMatchingResult {
    let score = 0;
    const reasons: string[] = [];
    const maxScore = 100;

    // Industry match (30 points)
    if (criteria.industry && criteria.industry.length > 0) {
      if (criteria.industry.includes(template.industry)) {
        score += 30;
        reasons.push(`Industry match: ${template.industry}`);
      }
    }

    // Business model match (25 points)
    if (criteria.businessModel && criteria.businessModel.length > 0) {
      const businessModels = Array.isArray(template.businessModel) 
        ? template.businessModel 
        : [template.businessModel];
      
      const matchingModels = businessModels.filter(model => 
        criteria.businessModel!.includes(model)
      );
      
      if (matchingModels.length > 0) {
        score += 25 * (matchingModels.length / businessModels.length);
        reasons.push(`Business model match: ${matchingModels.join(', ')}`);
      }
    }

    // Target market match (20 points)
    if (criteria.targetMarket && template.targetMarket) {
      if (template.targetMarket.toLowerCase().includes(criteria.targetMarket.toLowerCase()) ||
          criteria.targetMarket.toLowerCase().includes(template.targetMarket.toLowerCase())) {
        score += 20;
        reasons.push(`Target market match: ${template.targetMarket}`);
      }
    }

    // Budget range match (15 points)
    if (criteria.budgetRange && template.estimatedCost) {
      const templateCost = template.estimatedCost as any;
      if (templateCost.initial || templateCost.total) {
        const cost = templateCost.initial || templateCost.total;
        if (cost >= criteria.budgetRange.min && cost <= criteria.budgetRange.max) {
          score += 15;
          reasons.push('Budget range compatible');
        }
      }
    }

    // Complexity match (10 points)
    if (criteria.complexity && template.complexity) {
      if (template.complexity === criteria.complexity) {
        score += 10;
        reasons.push(`Complexity match: ${template.complexity}`);
      }
    }

    return {
      template,
      matchScore: score / maxScore, // Normalize to 0-1
      matchReasons: reasons,
    };
  }

  /**
   * Get templates by industry
   */
  public static async getTemplatesByIndustry(industry: string): Promise<BusinessTemplateType[]> {
    try {
      const templates = await db.getClient().businessTemplate.findMany({
        where: {
          industry,
          status: TemplateStatus.ACTIVE,
        },
        orderBy: { createdAt: 'desc' },
      });

      return templates as BusinessTemplateType[];
    } catch (error) {
      logger.error('Failed to get templates by industry:', error);
      throw error;
    }
  }

  /**
   * Search templates by text
   */
  public static async searchTemplates(
    query: string,
    filters?: {
      industry?: string[];
      businessModel?: string[];
    }
  ): Promise<BusinessTemplateType[]> {
    try {
      const where: any = {
        status: TemplateStatus.ACTIVE,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { industry: { contains: query, mode: 'insensitive' } },
          { targetMarket: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (filters?.industry && filters.industry.length > 0) {
        where.industry = { in: filters.industry };
      }

      if (filters?.businessModel && filters.businessModel.length > 0) {
        where.businessModel = { hasSome: filters.businessModel };
      }

      const templates = await db.getClient().businessTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      return templates as BusinessTemplateType[];
    } catch (error) {
      logger.error('Failed to search templates:', error);
      throw error;
    }
  }

  /**
   * Get template statistics
   */
  public static async getTemplateStatistics(): Promise<any> {
    try {
      const [
        totalTemplates,
        activeTemplates,
        draftTemplates,
        archivedTemplates,
        templatesByIndustry,
        templatesByComplexity,
      ] = await Promise.all([
        db.getClient().businessTemplate.count(),
        db.getClient().businessTemplate.count({ where: { status: TemplateStatus.ACTIVE } }),
        db.getClient().businessTemplate.count({ where: { status: TemplateStatus.DRAFT } }),
        db.getClient().businessTemplate.count({ where: { status: TemplateStatus.ARCHIVED } }),
        
        db.getClient().businessTemplate.groupBy({
          by: ['industry'],
          _count: { _all: true },
          orderBy: { _count: { _all: 'desc' } },
          take: 10,
        }),
        
        db.getClient().businessTemplate.groupBy({
          by: ['complexity'],
          _count: { _all: true },
        }),
      ]);

      return {
        total: totalTemplates,
        byStatus: {
          active: activeTemplates,
          draft: draftTemplates,
          archived: archivedTemplates,
        },
        byIndustry: templatesByIndustry.map(item => ({
          industry: item.industry,
          count: item._count._all,
        })),
        byComplexity: templatesByComplexity.map(item => ({
          complexity: item.complexity,
          count: item._count._all,
        })),
        createdThisMonth: await db.getClient().businessTemplate.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
      };
    } catch (error) {
      logger.error('Failed to get template statistics:', error);
      throw error;
    }
  }

  /**
   * Clone template
   */
  public static async cloneTemplate(
    id: string,
    newTitle: string,
    modifications?: Partial<CreateBusinessTemplateInput>
  ): Promise<BusinessTemplateType> {
    try {
      const originalTemplate = await this.getTemplateById(id);
      
      if (!originalTemplate) {
        throw new Error('Template not found');
      }

      const clonedData: CreateBusinessTemplateInput = {
        title: newTitle,
        description: originalTemplate.description,
        industry: originalTemplate.industry,
        targetMarket: originalTemplate.targetMarket,
        businessModel: originalTemplate.businessModel,
        requirements: originalTemplate.requirements,
        features: originalTemplate.features,
        techStack: originalTemplate.techStack,
        estimatedCost: originalTemplate.estimatedCost,
        timeline: originalTemplate.timeline,
        successMetrics: originalTemplate.successMetrics,
        risks: originalTemplate.risks,
        marketAnalysis: originalTemplate.marketAnalysis,
        competitorAnalysis: originalTemplate.competitorAnalysis,
        revenueProjection: originalTemplate.revenueProjection,
        implementationSteps: originalTemplate.implementationSteps,
        supportingResources: originalTemplate.supportingResources,
        tags: originalTemplate.tags,
        complexity: originalTemplate.complexity,
        status: TemplateStatus.DRAFT, // New template starts as draft
        ...modifications, // Apply any modifications
      };

      const clonedTemplate = await this.createTemplate(clonedData);

      logger.info(`✅ Template cloned: ${id} -> ${clonedTemplate.id}`);
      return clonedTemplate;
    } catch (error) {
      logger.error('Failed to clone template:', error);
      throw error;
    }
  }

  /**
   * Bulk operations for templates
   */
  public static async bulkUpdateStatus(
    templateIds: string[],
    status: TemplateStatus
  ): Promise<{ updated: number }> {
    try {
      const result = await db.getClient().businessTemplate.updateMany({
        where: {
          id: { in: templateIds },
        },
        data: {
          status,
          updatedAt: new Date(),
        },
      });

      logger.info(`✅ Bulk status update: ${result.count} templates updated to ${status}`);
      return { updated: result.count };
    } catch (error) {
      logger.error('Failed to bulk update template status:', error);
      throw error;
    }
  }

  /**
   * Get popular templates (most used in recommendations)
   */
  public static async getPopularTemplates(limit: number = 10): Promise<BusinessTemplateType[]> {
    try {
      // This would require tracking template usage in recommendations
      // For now, return most recently created active templates
      const templates = await db.getClient().businessTemplate.findMany({
        where: { status: TemplateStatus.ACTIVE },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return templates as BusinessTemplateType[];
    } catch (error) {
      logger.error('Failed to get popular templates:', error);
      throw error;
    }
  }

  /**
   * Export templates
   */
  public static async exportTemplates(templateIds?: string[]): Promise<BusinessTemplateType[]> {
    try {
      const where: any = {};
      if (templateIds && templateIds.length > 0) {
        where.id = { in: templateIds };
      }

      const templates = await db.getClient().businessTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return templates as BusinessTemplateType[];
    } catch (error) {
      logger.error('Failed to export templates:', error);
      throw error;
    }
  }

  /**
   * Import templates
   */
  public static async importTemplates(
    templates: CreateBusinessTemplateInput[]
  ): Promise<{ imported: number; failed: number; errors: any[] }> {
    try {
      const results = {
        imported: 0,
        failed: 0,
        errors: [] as any[],
      };

      for (const templateData of templates) {
        try {
          await this.createTemplate(templateData);
          results.imported++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({
            template: templateData.title,
            error: error.message,
          });
        }
      }

      logger.info(`✅ Template import completed: ${results.imported} imported, ${results.failed} failed`);
      return results;
    } catch (error) {
      logger.error('Failed to import templates:', error);
      throw error;
    }
  }
}