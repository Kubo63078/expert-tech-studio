export interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}