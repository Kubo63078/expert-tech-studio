import axios from 'axios';
import { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  RegisterResponse,
  User 
} from '../types/auth';
import { ApiResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - Authorization 헤더 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 시 토큰 갱신 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || '로그인에 실패했습니다.');
    }

    return response.data.data!;
  },

  async register(email: string, password: string, role = 'CLIENT'): Promise<RegisterResponse> {
    const response = await api.post<ApiResponse<RegisterResponse>>('/auth/register', {
      email,
      password,
      role,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || '회원가입에 실패했습니다.');
    }

    return response.data.data!;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');

    if (!response.data.success) {
      throw new Error(response.data.message || '사용자 정보를 가져올 수 없습니다.');
    }

    return response.data.data!;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // 로그아웃 요청이 실패해도 로컬 토큰은 제거
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', {
      refreshToken,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || '토큰 갱신에 실패했습니다.');
    }

    return response.data.data!;
  },
};