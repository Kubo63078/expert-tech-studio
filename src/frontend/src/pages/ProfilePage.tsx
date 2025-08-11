import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  UserIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { ClientProfile } from '../types/api';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const { clientProfileService } = await import('../services/clientProfileService');
      const data = await clientProfileService.getMyProfile();
      
      setProfile(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: ClientProfile['status']) => {
    switch (status) {
      case 'INITIAL':
        return {
          label: '프로필 작성 완료',
          description: 'AI 분석을 위한 기본 정보가 입력되었습니다.',
          color: 'blue',
          icon: InformationCircleIcon,
        };
      case 'ANALYZED':
        return {
          label: '분석 완료',
          description: 'AI가 당신의 전문성을 분석하여 비즈니스 아이디어를 제안했습니다.',
          color: 'green',
          icon: CheckCircleIcon,
        };
      case 'IN_DEVELOPMENT':
        return {
          label: '개발 진행 중',
          description: '선택한 비즈니스 아이디어의 개발이 진행되고 있습니다.',
          color: 'yellow',
          icon: ExclamationCircleIcon,
        };
      case 'LAUNCHED':
        return {
          label: '서비스 런칭',
          description: '비즈니스가 성공적으로 런칭되었습니다.',
          color: 'green',
          icon: CheckCircleIcon,
        };
      case 'CANCELLED':
        return {
          label: '프로젝트 중단',
          description: '프로젝트가 중단되었습니다.',
          color: 'red',
          icon: ExclamationCircleIcon,
        };
      default:
        return {
          label: '상태 불명',
          description: '',
          color: 'gray',
          icon: InformationCircleIcon,
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-senior-lg text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              프로필이 없습니다
            </h2>
            <p className="text-senior-lg text-gray-600 mb-8">
              AI 추천을 받기 위해 먼저 전문가 프로필을 작성해주세요.
            </p>
            <a
              href="/onboarding"
              className="btn-primary inline-flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              프로필 작성하기
            </a>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(profile.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                전문가 프로필
              </h1>
              <p className="text-senior-lg text-gray-600">
                {user?.email}님의 전문성 정보입니다.
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              프로필 수정
            </button>
          </div>
        </div>

        {/* 알림 메시지 */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-senior-base text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-senior-base text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* 프로필 상태 */}
        <div className={`card p-6 mb-8 border-l-4 ${
          statusInfo.color === 'green' ? 'border-green-400 bg-green-50' :
          statusInfo.color === 'blue' ? 'border-blue-400 bg-blue-50' :
          statusInfo.color === 'yellow' ? 'border-yellow-400 bg-yellow-50' :
          'border-red-400 bg-red-50'
        }`}>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              statusInfo.color === 'green' ? 'bg-green-100' :
              statusInfo.color === 'blue' ? 'bg-blue-100' :
              statusInfo.color === 'yellow' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <statusInfo.icon className={`h-6 w-6 ${
                statusInfo.color === 'green' ? 'text-green-600' :
                statusInfo.color === 'blue' ? 'text-blue-600' :
                statusInfo.color === 'yellow' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
            </div>
            <div className="ml-4">
              <h3 className="text-senior-lg font-semibold text-gray-900">
                {statusInfo.label}
              </h3>
              <p className="text-senior-base text-gray-600 mt-1">
                {statusInfo.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 기본 정보 */}
          <div className="card p-6">
            <h2 className="text-senior-xl font-semibold text-gray-900 mb-6 flex items-center">
              <UserIcon className="h-6 w-6 mr-2 text-primary-600" />
              기본 정보
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">성명</p>
                  <p className="text-senior-lg text-gray-900">{profile.basicInfo.name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">나이</p>
                  <p className="text-senior-lg text-gray-900">{profile.basicInfo.age}세</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <BriefcaseIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">직업</p>
                  <p className="text-senior-lg text-gray-900">{profile.basicInfo.occupation}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <StarIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">경력</p>
                  <p className="text-senior-lg text-gray-900">{profile.basicInfo.experience}년</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPinIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">활동 지역</p>
                  <p className="text-senior-lg text-gray-900">{profile.basicInfo.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 전문성 정보 */}
          <div className="card p-6">
            <h2 className="text-senior-xl font-semibold text-gray-900 mb-6 flex items-center">
              <AcademicCapIcon className="h-6 w-6 mr-2 text-primary-600" />
              전문성 정보
            </h2>

            {profile.expertise ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">주요 산업</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {profile.expertise.industry}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-3">보유 기술</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {profile.expertise.achievements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-3">주요 성과</p>
                    <ul className="space-y-2">
                      {profile.expertise.achievements.map((achievement, index) => (
                        <li key={index} className="text-senior-base text-gray-700 flex items-start">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {profile.expertise.network.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-3">네트워크</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.expertise.network.map((network, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        >
                          {network}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-senior-base text-gray-500">전문성 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 사업 의도 */}
        {profile.businessIntent && (
          <div className="card p-6 mt-8">
            <h2 className="text-senior-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BuildingOfficeIcon className="h-6 w-6 mr-2 text-primary-600" />
              사업 의도
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">사업 목표</p>
                <div className="space-y-2">
                  {profile.businessIntent.goals.map((goal, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-senior-base text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">목표 시장</p>
                  <p className="text-senior-base text-gray-900">{profile.businessIntent.targetMarket}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">예상 투자 예산</p>
                  <p className="text-senior-base text-gray-900">
                    {new Intl.NumberFormat('ko-KR', {
                      style: 'currency',
                      currency: 'KRW',
                      minimumFractionDigits: 0,
                    }).format(profile.businessIntent.budget)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">희망 런칭 시기</p>
                  <p className="text-senior-base text-gray-900">{profile.businessIntent.timeline}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 추가 정보 */}
        {profile.notes && (
          <div className="card p-6 mt-8">
            <h2 className="text-senior-xl font-semibold text-gray-900 mb-4">
              추가 정보
            </h2>
            <p className="text-senior-base text-gray-700 whitespace-pre-wrap">
              {profile.notes}
            </p>
          </div>
        )}

        {/* 프로필 메타 정보 */}
        <div className="card p-6 mt-8 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>프로필 ID: {profile.id}</span>
            <div className="flex items-center space-x-4">
              <span>생성일: {formatDate(profile.createdAt)}</span>
              <span>최종 수정: {formatDate(profile.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;