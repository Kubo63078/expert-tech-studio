/**
 * User Service Layer
 * Business logic for user management and authentication
 */

import bcrypt from 'bcryptjs';
import { User, UserRole } from '@prisma/client';
import { db } from './database';
import { logger } from '../config/logger';
import { config } from '../config/environment';
import { 
  CreateUserInput, 
  UpdateUserInput, 
  User as UserType, 
  ApiResponse,
  PaginationInfo
} from '../types';

export class UserService {
  /**
   * Create new user
   */
  public static async createUser(userData: CreateUserInput): Promise<UserType> {
    try {
      // Check if user already exists
      const existingUser = await db.getClient().user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
        userData.password, 
        config.security.bcryptRounds
      );

      // Create user
      const user = await db.getClient().user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          role: userData.role || UserRole.CLIENT,
        },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      logger.info(`✅ User created: ${user.email} (${user.role})`);
      return user as UserType;
    } catch (error) {
      logger.error('Failed to create user:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  public static async getUserById(userId: string): Promise<UserType | null> {
    try {
      const user = await db.getClient().user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          clientProfile: {
            select: {
              id: true,
              status: true,
              basicInfo: true,
              expertise: true,
              businessIntent: true,
              aiAnalysis: true,
            },
          },
        },
      });

      return user as UserType | null;
    } catch (error) {
      logger.error('Failed to get user by ID:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  public static async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await db.getClient().user.findUnique({
        where: { email },
      });
    } catch (error) {
      logger.error('Failed to get user by email:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  public static async updateUser(
    userId: string, 
    updateData: UpdateUserInput
  ): Promise<UserType> {
    try {
      // If updating password, hash it
      if (updateData.password) {
        updateData.password = await bcrypt.hash(
          updateData.password, 
          config.security.bcryptRounds
        );
      }

      const user = await db.getClient().user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      logger.info(`✅ User updated: ${user.email}`);
      return user as UserType;
    } catch (error) {
      logger.error('Failed to update user:', error);
      throw error;
    }
  }

  /**
   * Delete user (soft delete by setting isActive = false)
   */
  public static async deleteUser(userId: string): Promise<void> {
    try {
      await db.getClient().user.update({
        where: { id: userId },
        data: { isActive: false },
      });

      logger.info(`✅ User deactivated: ${userId}`);
    } catch (error) {
      logger.error('Failed to delete user:', error);
      throw error;
    }
  }

  /**
   * Get users with pagination
   */
  public static async getUsers(
    page: number = 1,
    limit: number = 10,
    role?: UserRole
  ): Promise<ApiResponse<{ users: UserType[]; pagination: PaginationInfo }>> {
    try {
      const skip = (page - 1) * limit;
      const where = {
        isActive: true,
        ...(role && { role }),
      };

      const [users, total] = await Promise.all([
        db.getClient().user.findMany({
          where,
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        db.getClient().user.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          users: users as UserType[],
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
      logger.error('Failed to get users:', error);
      throw error;
    }
  }

  /**
   * Verify user password
   */
  public static async verifyPassword(
    email: string, 
    password: string
  ): Promise<User | null> {
    try {
      const user = await db.getClient().user.findUnique({
        where: { email },
      });

      if (!user || !user.isActive) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return null;
      }

      return user;
    } catch (error) {
      logger.error('Failed to verify password:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  public static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await db.getClient().user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify old password
      const isValid = await bcrypt.compare(oldPassword, user.password);
      if (!isValid) {
        throw new Error('Invalid current password');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(
        newPassword, 
        config.security.bcryptRounds
      );

      // Update password
      await db.getClient().user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      logger.info(`✅ Password changed for user: ${user.email}`);
    } catch (error) {
      logger.error('Failed to change password:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  public static async getUserStats(): Promise<Record<string, number>> {
    try {
      const [total, clients, pms, developers, admins, active] = await Promise.all([
        db.getClient().user.count(),
        db.getClient().user.count({ where: { role: UserRole.CLIENT } }),
        db.getClient().user.count({ where: { role: UserRole.PROJECT_MANAGER } }),
        db.getClient().user.count({ where: { role: UserRole.DEVELOPER } }),
        db.getClient().user.count({ where: { role: UserRole.ADMIN } }),
        db.getClient().user.count({ where: { isActive: true } }),
      ]);

      return {
        total,
        clients,
        projectManagers: pms,
        developers,
        admins,
        active,
        inactive: total - active,
      };
    } catch (error) {
      logger.error('Failed to get user stats:', error);
      throw error;
    }
  }

  /**
   * Search users
   */
  public static async searchUsers(
    query: string,
    role?: UserRole,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{ users: UserType[]; pagination: PaginationInfo }>> {
    try {
      const skip = (page - 1) * limit;
      const where = {
        isActive: true,
        email: {
          contains: query,
          mode: 'insensitive' as const,
        },
        ...(role && { role }),
      };

      const [users, total] = await Promise.all([
        db.getClient().user.findMany({
          where,
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        db.getClient().user.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          users: users as UserType[],
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
      logger.error('Failed to search users:', error);
      throw error;
    }
  }

  /**
   * Bulk operations
   */
  public static async bulkUpdateUserStatus(
    userIds: string[], 
    isActive: boolean
  ): Promise<void> {
    try {
      await db.getClient().user.updateMany({
        where: {
          id: { in: userIds },
        },
        data: { isActive },
      });

      logger.info(`✅ Bulk updated ${userIds.length} users status to: ${isActive}`);
    } catch (error) {
      logger.error('Failed to bulk update users:', error);
      throw error;
    }
  }
}