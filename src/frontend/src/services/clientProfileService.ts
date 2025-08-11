import axios from 'axios';
import { ClientProfile } from '../types/api';
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

export const clientProfileService = {
  // 내 프로필 조회
  async getMyProfile(): Promise<ClientProfile | null> {
    try {
      const response = await api.get<ApiResponse<ClientProfile>>('/client-profiles/me');
      return response.data.success ? response.data.data! : null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // 프로필이 없는 경우
      }
      throw new Error(error.response?.data?.message || '프로필을 불러올 수 없습니다.');
    }
  },

  // 프로필 생성
  async createProfile(profileData: {
    basicInfo: ClientProfile['basicInfo'];
    expertise?: ClientProfile['expertise'];
    businessIntent?: ClientProfile['businessIntent'];
    notes?: string;
  }): Promise<ClientProfile> {
    const response = await api.post<ApiResponse<ClientProfile>>('/client-profiles', profileData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || '프로필 생성에 실패했습니다.');
    }

    return response.data.data!;
  },

  // 프로필 업데이트
  async updateProfile(profileData: {
    basicInfo?: Partial<ClientProfile['basicInfo']>;
    expertise?: Partial<ClientProfile['expertise']>;
    businessIntent?: Partial<ClientProfile['businessIntent']>;
    notes?: string;
  }): Promise<ClientProfile> {
    const response = await api.put<ApiResponse<ClientProfile>>('/client-profiles/me', profileData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || '프로필 업데이트에 실패했습니다.');
    }

    return response.data.data!;
  },

  // 프로필 삭제
  async deleteProfile(): Promise<void> {
    const response = await api.delete<ApiResponse<void>>('/client-profiles/me');
    
    if (!response.data.success) {
      throw new Error(response.data.message || '프로필 삭제에 실패했습니다.');
    }
  },

  // 프로필 상태 업데이트
  async updateStatus(status: ClientProfile['status']): Promise<ClientProfile> {
    const response = await api.patch<ApiResponse<ClientProfile>>('/client-profiles/me/status', {
      status,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || '상태 업데이트에 실패했습니다.');
    }

    return response.data.data!;
  },
};