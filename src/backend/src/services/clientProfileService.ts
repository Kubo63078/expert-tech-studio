/**
 * Client Profile Service Layer
 * Business logic for client profile management and expertise analysis
 */

import { ClientProfile, ClientStatus } from '@prisma/client';
import { db } from './database';
import { logger } from '../config/logger';
import {
  ClientProfile as ClientProfileType,
  CreateClientProfileInput,
  UpdateClientProfileInput,
  BasicInfo,
  ExpertiseInfo,
  BusinessIntentInfo,
  ApiResponse,
  PaginationInfo,
  AIAnalysisResult,
} from '../types';

export class ClientProfileService {
  /**
   * Create client profile
   */
  public static async createProfile(
    userId: string,
    profileData: CreateClientProfileInput
  ): Promise<ClientProfileType> {
    try {
      // Check if profile already exists
      const existingProfile = await db.getClient().clientProfile.findUnique({
        where: { userId },
      });

      if (existingProfile) {
        throw new Error('Client profile already exists for this user');
      }

      const profile = await db.getClient().clientProfile.create({
        data: {
          userId,
          status: ClientStatus.INITIAL,
          basicInfo: profileData.basicInfo,
          expertise: profileData.expertise || null,
          businessIntent: profileData.businessIntent || null,
          notes: profileData.notes || null,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      logger.info(`✅ Client profile created: ${userId}`);
      return profile as ClientProfileType;
    } catch (error) {
      logger.error('Failed to create client profile:', error);
      throw error;
    }
  }

  /**
   * Get client profile by user ID
   */
  public static async getProfileByUserId(userId: string): Promise<ClientProfileType | null> {
    try {
      const profile = await db.getClient().clientProfile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          recommendations: {
            select: {
              id: true,
              title: true,
              status: true,
              isSelected: true,
              estimatedCost: true,
              estimatedTimelineWeeks: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          projects: {
            select: {
              id: true,
              name: true,
              status: true,
              startDate: true,
              endDate: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      });

      return profile as ClientProfileType | null;
    } catch (error) {
      logger.error('Failed to get client profile:', error);
      throw error;
    }
  }

  /**
   * Get client profile by ID
   */
  public static async getProfileById(profileId: string): Promise<ClientProfileType | null> {
    try {
      const profile = await db.getClient().clientProfile.findUnique({
        where: { id: profileId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          recommendations: {
            select: {
              id: true,
              title: true,
              status: true,
              isSelected: true,
              estimatedCost: true,
              estimatedTimelineWeeks: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          projects: {
            select: {
              id: true,
              name: true,
              status: true,
              startDate: true,
              endDate: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return profile as ClientProfileType | null;
    } catch (error) {
      logger.error('Failed to get client profile by ID:', error);
      throw error;
    }
  }

  /**
   * Update client profile
   */
  public static async updateProfile(
    profileId: string,
    updateData: UpdateClientProfileInput
  ): Promise<ClientProfileType> {
    try {
      const profile = await db.getClient().clientProfile.update({
        where: { id: profileId },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      logger.info(`✅ Client profile updated: ${profileId}`);
      return profile as ClientProfileType;
    } catch (error) {
      logger.error('Failed to update client profile:', error);
      throw error;
    }
  }

  /**
   * Update basic information
   */
  public static async updateBasicInfo(
    profileId: string,
    basicInfo: BasicInfo
  ): Promise<ClientProfileType> {
    try {
      const profile = await db.getClient().clientProfile.update({
        where: { id: profileId },
        data: {
          basicInfo,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      logger.info(`✅ Basic info updated: ${profileId}`);
      return profile as ClientProfileType;
    } catch (error) {
      logger.error('Failed to update basic info:', error);
      throw error;
    }
  }

  /**
   * Update expertise information
   */
  public static async updateExpertise(
    profileId: string,
    expertise: ExpertiseInfo
  ): Promise<ClientProfileType> {
    try {
      const profile = await db.getClient().clientProfile.update({
        where: { id: profileId },
        data: {
          expertise,
          status: ClientStatus.ANALYZED, // Progress status
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      logger.info(`✅ Expertise updated: ${profileId}`);
      return profile as ClientProfileType;
    } catch (error) {
      logger.error('Failed to update expertise:', error);
      throw error;
    }
  }

  /**
   * Update business intent
   */
  public static async updateBusinessIntent(
    profileId: string,
    businessIntent: BusinessIntentInfo
  ): Promise<ClientProfileType> {
    try {
      const profile = await db.getClient().clientProfile.update({
        where: { id: profileId },
        data: {
          businessIntent,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      logger.info(`✅ Business intent updated: ${profileId}`);
      return profile as ClientProfileType;
    } catch (error) {
      logger.error('Failed to update business intent:', error);
      throw error;
    }
  }

  /**
   * Update AI analysis results
   */
  public static async updateAIAnalysis(
    profileId: string,
    aiAnalysis: AIAnalysisResult
  ): Promise<ClientProfileType> {
    try {
      const profile = await db.getClient().clientProfile.update({
        where: { id: profileId },
        data: {
          aiAnalysis,
          status: ClientStatus.ANALYZED,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      logger.info(`✅ AI analysis updated: ${profileId}`);
      return profile as ClientProfileType;
    } catch (error) {
      logger.error('Failed to update AI analysis:', error);
      throw error;
    }
  }

  /**
   * Update profile status
   */
  public static async updateStatus(
    profileId: string,
    status: ClientStatus
  ): Promise<ClientProfileType> {
    try {
      const profile = await db.getClient().clientProfile.update({
        where: { id: profileId },
        data: {
          status,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      logger.info(`✅ Profile status updated: ${profileId} -> ${status}`);
      return profile as ClientProfileType;
    } catch (error) {
      logger.error('Failed to update profile status:', error);
      throw error;
    }
  }

  /**
   * Get all client profiles with pagination and filtering
   */
  public static async getProfiles(
    page: number = 1,
    limit: number = 10,
    status?: ClientStatus,
    industry?: string
  ): Promise<ApiResponse<{ profiles: ClientProfileType[]; pagination: PaginationInfo }>> {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (industry) {
        where.expertise = {
          path: ['industry'],
          string_contains: industry,
        };
      }

      const [profiles, total] = await Promise.all([
        db.getClient().clientProfile.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            _count: {
              select: {
                recommendations: true,
                projects: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        db.getClient().clientProfile.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          profiles: profiles as ClientProfileType[],
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      logger.error('Failed to get client profiles:', error);
      throw error;
    }
  }

  /**
   * Search client profiles
   */
  public static async searchProfiles(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{ profiles: ClientProfileType[]; pagination: PaginationInfo }>> {
    try {
      const skip = (page - 1) * limit;

      // Search in basic info name, expertise industry, and user email
      const [profiles, total] = await Promise.all([
        db.getClient().clientProfile.findMany({
          where: {
            OR: [
              {
                basicInfo: {
                  path: ['name'],
                  string_contains: query,
                },
              },
              {
                expertise: {
                  path: ['industry'],
                  string_contains: query,
                },
              },
              {
                user: {
                  email: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            _count: {
              select: {
                recommendations: true,
                projects: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        db.getClient().clientProfile.count({
          where: {
            OR: [
              {
                basicInfo: {
                  path: ['name'],
                  string_contains: query,
                },
              },
              {
                expertise: {
                  path: ['industry'],
                  string_contains: query,
                },
              },
              {
                user: {
                  email: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          profiles: profiles as ClientProfileType[],
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      logger.error('Failed to search client profiles:', error);
      throw error;
    }
  }

  /**
   * Export profiles
   */
  public static async exportProfiles(profileIds: string[]): Promise<any> {
    try {
      const profiles = await db.getClient().clientProfile.findMany({
        where: {
          id: { in: profileIds },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return profiles;
    } catch (error) {
      logger.error('Failed to export profiles:', error);
      throw error;
    }
  }

  /**
   * Export all profiles
   */
  public static async exportAllProfiles(): Promise<any> {
    try {
      const profiles = await db.getClient().clientProfile.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return profiles;
    } catch (error) {
      logger.error('Failed to export all profiles:', error);
      throw error;
    }
  }

  /**
   * Import profiles
   */
  public static async importProfiles(data: any[]): Promise<any> {
    try {
      const results = {
        imported: 0,
        failed: 0,
        errors: [] as any[],
      };

      for (const profile of data) {
        try {
          await db.getClient().clientProfile.create({
            data: {
              userId: profile.userId,
              basicInfo: profile.basicInfo || {},
              expertise: profile.expertise || {},
              businessIntent: profile.businessIntent || {},
              status: profile.status || ClientStatus.INITIAL,
            },
          });
          results.imported++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({
            profile: profile.id || profile.userId,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      logger.error('Failed to import profiles:', error);
      throw error;
    }
  }

  /**
   * Bulk delete profiles
   */
  public static async bulkDeleteProfiles(profileIds: string[]): Promise<any> {
    try {
      const result = await db.getClient().clientProfile.deleteMany({
        where: {
          id: { in: profileIds },
        },
      });

      return {
        deleted: result.count,
        profileIds,
      };
    } catch (error) {
      logger.error('Failed to bulk delete profiles:', error);
      throw error;
    }
  }

  /**
   * Get profile statistics
   */
  public static async getProfileStatistics(): Promise<Record<string, any>> {
    try {
      const [
        totalProfiles,
        initialProfiles,
        analyzedProfiles,
        inDevelopmentProfiles,
        launchedProfiles,
        cancelledProfiles,
        industriesStat,
        ageGroupsStat,
      ] = await Promise.all([
        // Total profiles
        db.getClient().clientProfile.count(),
        
        // By status
        db.getClient().clientProfile.count({ where: { status: ClientStatus.INITIAL } }),
        db.getClient().clientProfile.count({ where: { status: ClientStatus.ANALYZED } }),
        db.getClient().clientProfile.count({ where: { status: ClientStatus.IN_DEVELOPMENT } }),
        db.getClient().clientProfile.count({ where: { status: ClientStatus.LAUNCHED } }),
        db.getClient().clientProfile.count({ where: { status: ClientStatus.CANCELLED } }),

        // Industries distribution (would need raw SQL for better JSON querying)
        db.getClient().$queryRaw`
          SELECT 
            expertise->>'industry' as industry,
            COUNT(*) as count
          FROM client_profiles 
          WHERE expertise IS NOT NULL 
            AND expertise->>'industry' IS NOT NULL
          GROUP BY expertise->>'industry'
          ORDER BY count DESC
          LIMIT 10
        `,

        // Age groups distribution
        db.getClient().$queryRaw`
          SELECT 
            basic_info->>'ageGroup' as age_group,
            COUNT(*) as count
          FROM client_profiles 
          WHERE basic_info IS NOT NULL 
            AND basic_info->>'ageGroup' IS NOT NULL
          GROUP BY basic_info->>'ageGroup'
          ORDER BY count DESC
        `,
      ]);

      return {
        total: totalProfiles,
        byStatus: {
          initial: initialProfiles,
          analyzed: analyzedProfiles,
          inDevelopment: inDevelopmentProfiles,
          launched: launchedProfiles,
          cancelled: cancelledProfiles,
        },
        topIndustries: industriesStat,
        ageGroups: ageGroupsStat,
      };
    } catch (error) {
      logger.error('Failed to get profile stats:', error);
      throw error;
    }
  }

  /**
   * Delete client profile
   */
  public static async deleteProfile(profileId: string): Promise<void> {
    try {
      await db.getClient().clientProfile.delete({
        where: { id: profileId },
      });

      logger.info(`✅ Client profile deleted: ${profileId}`);
    } catch (error) {
      logger.error('Failed to delete client profile:', error);
      throw error;
    }
  }

  /**
   * Analyze profile completeness
   */
  public static analyzeProfileCompleteness(profile: ClientProfileType): {
    completeness: number;
    missingFields: string[];
    recommendations: string[];
  } {
    const missingFields: string[] = [];
    const recommendations: string[] = [];
    let completedSections = 0;
    const totalSections = 4; // basicInfo, expertise, businessIntent, aiAnalysis

    // Check basic info completeness
    const basicInfo = profile.basicInfo as BasicInfo;
    if (basicInfo && basicInfo.name && basicInfo.ageGroup && basicInfo.location && basicInfo.contact) {
      completedSections += 1;
    } else {
      missingFields.push('basicInfo');
      recommendations.push('Complete your basic profile information');
    }

    // Check expertise completeness
    const expertise = profile.expertise as ExpertiseInfo;
    if (expertise && expertise.industry && expertise.experience && expertise.specializations?.length) {
      completedSections += 1;
    } else {
      missingFields.push('expertise');
      recommendations.push('Add your professional expertise and experience details');
    }

    // Check business intent completeness
    const businessIntent = profile.businessIntent as BusinessIntentInfo;
    if (businessIntent && businessIntent.serviceType && businessIntent.revenueGoal) {
      completedSections += 1;
    } else {
      missingFields.push('businessIntent');
      recommendations.push('Define your business goals and target market');
    }

    // Check AI analysis
    if (profile.aiAnalysis) {
      completedSections += 1;
    } else {
      missingFields.push('aiAnalysis');
      recommendations.push('Complete profile analysis to get personalized recommendations');
    }

    const completeness = Math.round((completedSections / totalSections) * 100);

    return {
      completeness,
      missingFields,
      recommendations,
    };
  }

  /**
   * Get profiles by industry
   */
  public static async getProfilesByIndustry(
    industry: string,
    limit: number = 10
  ): Promise<ClientProfileType[]> {
    try {
      const profiles = await db.getClient().clientProfile.findMany({
        where: {
          expertise: {
            path: ['industry'],
            string_contains: industry,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          _count: {
            select: {
              recommendations: true,
              projects: true,
            },
          },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      return profiles as ClientProfileType[];
    } catch (error) {
      logger.error('Failed to get profiles by industry:', error);
      throw error;
    }
  }
}