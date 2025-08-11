import axios from 'axios';
import { BusinessRecommendation } from '../types/api';
import { ApiResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000, // 추천 생성은 시간이 걸릴 수 있음
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

export const recommendationService = {
  // 내 추천 목록 조회
  async getMyRecommendations(): Promise<BusinessRecommendation[]> {
    try {
      const response = await api.get<ApiResponse<BusinessRecommendation[]>>('/recommendations');
      return response.data.success ? (response.data.data || []) : [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '추천 목록을 불러올 수 없습니다.');
    }
  },

  // 특정 추천 조회
  async getRecommendation(id: string): Promise<BusinessRecommendation> {
    const response = await api.get<ApiResponse<BusinessRecommendation>>(`/recommendations/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || '추천을 불러올 수 없습니다.');
    }

    return response.data.data!;
  },

  // 새로운 추천 생성
  async generateRecommendations(): Promise<BusinessRecommendation[]> {
    try {
      const response = await api.post<ApiResponse<BusinessRecommendation[]>>('/recommendations/generate');
      
      if (!response.data.success) {
        throw new Error(response.data.message || '추천 생성에 실패했습니다.');
      }

      return response.data.data || [];
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('추천 생성이 시간 초과되었습니다. 잠시 후 다시 시도해주세요.');
      }
      throw new Error(error.response?.data?.message || '추천 생성 중 오류가 발생했습니다.');
    }
  },

  // 추천 수락
  async acceptRecommendation(id: string): Promise<BusinessRecommendation> {
    const response = await api.post<ApiResponse<BusinessRecommendation>>(`/recommendations/${id}/accept`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || '추천 수락에 실패했습니다.');
    }

    return response.data.data!;
  },

  // 추천 거절
  async rejectRecommendation(id: string, reason?: string): Promise<BusinessRecommendation> {
    const response = await api.post<ApiResponse<BusinessRecommendation>>(`/recommendations/${id}/reject`, {
      reason,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || '추천 거절에 실패했습니다.');
    }

    return response.data.data!;
  },

  // 추천 상태 업데이트
  async updateRecommendationStatus(
    id: string, 
    status: BusinessRecommendation['status']
  ): Promise<BusinessRecommendation> {
    const response = await api.patch<ApiResponse<BusinessRecommendation>>(`/recommendations/${id}/status`, {
      status,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || '상태 업데이트에 실패했습니다.');
    }

    return response.data.data!;
  },

  // 추천에 대한 피드백 제출
  async submitFeedback(id: string, feedback: {
    rating: number;
    comment?: string;
    helpful: boolean;
  }): Promise<void> {
    const response = await api.post<ApiResponse<void>>(`/recommendations/${id}/feedback`, feedback);
    
    if (!response.data.success) {
      throw new Error(response.data.message || '피드백 제출에 실패했습니다.');
    }
  },

  // 추천 삭제
  async deleteRecommendation(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/recommendations/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || '추천 삭제에 실패했습니다.');
    }
  },
};