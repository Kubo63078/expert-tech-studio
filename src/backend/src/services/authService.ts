/**
 * Authentication Service Layer
 * JWT token management and authentication logic
 */

import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { db } from './database';
import { UserService } from './userService';
import { logger } from '../config/logger';
import { config } from '../config/environment';
import { JWTPayload, UserRole } from '../types';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export class AuthService {
  /**
   * Generate JWT access token
   */
  public static generateAccessToken(user: User): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    return jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.jwtAccessExpiresIn,
      issuer: 'experttech-studio',
      audience: 'experttech-client',
    });
  }

  /**
   * Generate JWT refresh token
   */
  public static generateRefreshToken(user: User): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    return jwt.sign(payload, config.auth.jwtRefreshSecret, {
      expiresIn: config.auth.jwtRefreshExpiresIn,
      issuer: 'experttech-studio',
      audience: 'experttech-refresh',
    });
  }

  /**
   * Verify access token
   */
  public static verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, config.auth.jwtSecret, {
        issuer: 'experttech-studio',
        audience: 'experttech-client',
      }) as JWTPayload;
    } catch (error) {
      logger.debug('Access token verification failed:', error);
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  public static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, config.auth.jwtRefreshSecret, {
        issuer: 'experttech-studio',
        audience: 'experttech-refresh',
      }) as JWTPayload;
    } catch (error) {
      logger.debug('Refresh token verification failed:', error);
      return null;
    }
  }

  /**
   * Login user
   */
  public static async login(
    email: string, 
    password: string
  ): Promise<AuthTokens & { user: Omit<User, 'password'> }> {
    try {
      // Verify user credentials
      const user = await UserService.verifyPassword(email, password);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Store refresh token in database
      await this.storeRefreshToken(user.id, refreshToken);

      logger.info(`✅ User logged in: ${user.email}`);

      return {
        accessToken,
        refreshToken,
        expiresIn: config.auth.jwtAccessExpiresIn,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  public static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = this.verifyRefreshToken(refreshToken);
      if (!payload) {
        throw new Error('Invalid refresh token');
      }

      // Check if refresh token exists in database
      const storedToken = await db.getClient().refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: payload.userId,
          isRevoked: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!storedToken || !storedToken.user.isActive) {
        throw new Error('Invalid or revoked refresh token');
      }

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(storedToken.user);
      const newRefreshToken = this.generateRefreshToken(storedToken.user);

      // Revoke old refresh token and store new one
      await db.getClient().$transaction([
        db.getClient().refreshToken.update({
          where: { id: storedToken.id },
          data: { isRevoked: true },
        }),
        db.getClient().refreshToken.create({
          data: {
            token: newRefreshToken,
            userId: storedToken.userId,
            expiresAt: new Date(
              Date.now() + this.parseExpiration(config.auth.jwtRefreshExpiresIn)
            ),
          },
        }),
      ]);

      logger.info(`✅ Token refreshed for user: ${storedToken.user.email}`);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: config.auth.jwtAccessExpiresIn,
      };
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Logout user (revoke refresh token)
   */
  public static async logout(refreshToken: string): Promise<void> {
    try {
      await db.getClient().refreshToken.updateMany({
        where: {
          token: refreshToken,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });

      logger.info('✅ User logged out successfully');
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Logout from all devices (revoke all refresh tokens for user)
   */
  public static async logoutAll(userId: string): Promise<void> {
    try {
      await db.getClient().refreshToken.updateMany({
        where: {
          userId,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });

      logger.info(`✅ User logged out from all devices: ${userId}`);
    } catch (error) {
      logger.error('Logout all failed:', error);
      throw error;
    }
  }

  /**
   * Store refresh token in database
   */
  private static async storeRefreshToken(
    userId: string, 
    token: string
  ): Promise<void> {
    try {
      await db.getClient().refreshToken.create({
        data: {
          token,
          userId,
          expiresAt: new Date(
            Date.now() + this.parseExpiration(config.auth.jwtRefreshExpiresIn)
          ),
        },
      });
    } catch (error) {
      logger.error('Failed to store refresh token:', error);
      throw error;
    }
  }

  /**
   * Clean up expired refresh tokens
   */
  public static async cleanupExpiredTokens(): Promise<void> {
    try {
      const result = await db.getClient().refreshToken.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { isRevoked: true },
          ],
        },
      });

      logger.info(`🧹 Cleaned up ${result.count} expired refresh tokens`);
    } catch (error) {
      logger.error('Token cleanup failed:', error);
    }
  }

  /**
   * Get active sessions for user
   */
  public static async getUserSessions(userId: string): Promise<Array<{
    id: string;
    createdAt: Date;
    expiresAt: Date;
    isRevoked: boolean;
  }>> {
    try {
      const sessions = await db.getClient().refreshToken.findMany({
        where: {
          userId,
          isRevoked: false,
          expiresAt: { gt: new Date() },
        },
        select: {
          id: true,
          createdAt: true,
          expiresAt: true,
          isRevoked: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return sessions;
    } catch (error) {
      logger.error('Failed to get user sessions:', error);
      throw error;
    }
  }

  /**
   * Revoke specific session
   */
  public static async revokeSession(
    userId: string, 
    sessionId: string
  ): Promise<void> {
    try {
      await db.getClient().refreshToken.updateMany({
        where: {
          id: sessionId,
          userId,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });

      logger.info(`✅ Session revoked: ${sessionId} for user: ${userId}`);
    } catch (error) {
      logger.error('Session revocation failed:', error);
      throw error;
    }
  }

  /**
   * Parse expiration string to milliseconds
   */
  private static parseExpiration(expiration: string): number {
    const units: { [key: string]: number } = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiration format: ${expiration}`);
    }

    const [, amount, unit] = match;
    return parseInt(amount) * units[unit];
  }

  /**
   * Validate password strength
   */
  public static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Register new user
   */
  public static async register(
    email: string,
    password: string,
    role: UserRole = UserRole.CLIENT
  ): Promise<AuthTokens & { user: Omit<User, 'password'> }> {
    try {
      // Validate password
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }

      // Create user
      const user = await UserService.createUser({
        email,
        password,
        role,
      });

      // Get full user data for token generation
      const fullUser = await UserService.getUserByEmail(email);
      if (!fullUser) {
        throw new Error('Failed to retrieve created user');
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(fullUser);
      const refreshToken = this.generateRefreshToken(fullUser);

      // Store refresh token
      await this.storeRefreshToken(fullUser.id, refreshToken);

      logger.info(`✅ User registered: ${user.email}`);

      return {
        accessToken,
        refreshToken,
        expiresIn: config.auth.jwtAccessExpiresIn,
        user,
      };
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error;
    }
  }
}