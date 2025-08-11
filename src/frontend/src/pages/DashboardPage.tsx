import React from 'react';
import { Link } from 'react-router-dom';
import {
  LightBulbIcon,
  ChartBarIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  recommendationsCount: number;
  activeProjectsCount: number;
  completedProjectsCount: number;
}

interface Activity {
  id: string;
  type: 'recommendation' | 'project' | 'profile';
  title: string;
  description: string;
  timestamp: Date;
}

const DashboardPage: React.FC = () => {
  // Mock data - 실제로는 API에서 가져옴
  const stats: DashboardStats = {
    recommendationsCount: 5,
    activeProjectsCount: 2,
    completedProjectsCount: 1
  };

  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'recommendation',
      title: 'AI 기반 부동산 상담 플랫폼 추천',
      description: '부동산 전문성을 활용한 맞춤형 서비스',
      timestamp: new Date('2024-01-15')
    },
    {
      id: '2',
      type: 'profile',
      title: '프로필 업데이트',
      description: '전문 분야 정보가 업데이트되었습니다',
      timestamp: new Date('2024-01-14')
    }
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <LightBulbIcon className="h-5 w-5 text-primary-600" />;
      case 'project':
        return <ChartBarIcon className="h-5 w-5 text-blue-600" />;
      case 'profile':
        return <DocumentTextIcon className="h-5 w-5 text-green-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto container-padding">
        {/* 페이지 헤더 */}
        <section className="mb-6 sm:mb-8" aria-labelledby="dashboard-title">
          <h1 id="dashboard-title" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            대시보드
          </h1>
          <p className="text-senior-base text-gray-600">
            안녕하세요! 오늘도 새로운 비즈니스 기회를 탐색해보세요.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* 좌측: 통계 카드들 */}
          <section className="lg:col-span-2" aria-labelledby="statistics-heading">
            <h2 id="statistics-heading" className="sr-only">통계 대시보드</h2>
            <div className="grid-responsive gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* 추천 결과 */}
              <article className="card touch-spacing" role="region" aria-labelledby="recommendations-card-title">
                <div className="flex items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <LightBulbIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                  </div>
                  <div className="ml-4 sm:ml-6">
                    <p id="recommendations-card-title" className="text-sm sm:text-senior-base font-medium text-gray-500">AI 추천 아이디어</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900" aria-label={`총 ${stats.recommendationsCount}개의 추천 아이디어`}>{stats.recommendationsCount}</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6">
                  <Link 
                    to="/recommendations" 
                    className="text-primary-600 hover:text-primary-500 text-sm sm:text-senior-base font-medium inline-flex items-center focus-visible-ring rounded-md p-1"
                    aria-label="AI 추천 결과 페이지로 이동"
                  >
                    추천 결과 보기
                    <ArrowRightIcon className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>

              {/* 진행 중인 프로젝트 */}
              <article className="card touch-spacing" role="region" aria-labelledby="active-projects-card-title">
                <div className="flex items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                  <div className="ml-4 sm:ml-6">
                    <p id="active-projects-card-title" className="text-sm sm:text-senior-base font-medium text-gray-500">진행 중인 프로젝트</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900" aria-label={`총 ${stats.activeProjectsCount}개의 진행 중인 프로젝트`}>{stats.activeProjectsCount}</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6">
                  <Link 
                    to="/projects?status=active" 
                    className="text-blue-600 hover:text-blue-500 text-sm sm:text-senior-base font-medium inline-flex items-center focus-visible-ring rounded-md p-1"
                    aria-label="진행 중인 프로젝트 페이지로 이동"
                  >
                    프로젝트 보기
                    <ArrowRightIcon className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>

              {/* 완료된 프로젝트 */}
              <article className="card touch-spacing" role="region" aria-labelledby="completed-projects-card-title">
                <div className="flex items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <CheckCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                  <div className="ml-4 sm:ml-6">
                    <p id="completed-projects-card-title" className="text-sm sm:text-senior-base font-medium text-gray-500">완료된 프로젝트</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900" aria-label={`총 ${stats.completedProjectsCount}개의 완료된 프로젝트`}>{stats.completedProjectsCount}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/projects?status=completed" className="text-green-600 hover:text-green-500 text-sm font-medium">
                    완료 프로젝트 보기 →
                  </Link>
                </div>
              </article>
            </div>

            {/* 빠른 작업 */}
            <div className="card p-6">
              <h3 className="text-senior-xl font-semibold text-gray-900 mb-4">
                빠른 작업
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/onboarding"
                  className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                >
                  <PlusIcon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 mr-3" />
                  <span className="text-senior-base font-medium text-gray-700 group-hover:text-primary-600">
                    새 프로필 작성
                  </span>
                </Link>
                <Link
                  to="/recommendations"
                  className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                >
                  <LightBulbIcon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 mr-3" />
                  <span className="text-senior-base font-medium text-gray-700 group-hover:text-primary-600">
                    AI 추천 받기
                  </span>
                </Link>
              </div>
            </div>
          </section>

          {/* 우측: 최근 활동 */}
          <aside className="lg:col-span-1" aria-labelledby="recent-activity-heading">
            <div className="card touch-spacing">
              <h3 id="recent-activity-heading" className="text-senior-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                최근 활동
              </h3>
              
              {recentActivities.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start" role="listitem">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-senior-base font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-senior-base text-gray-500">
                    아직 활동 내역이 없습니다.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    프로필을 작성하고 첫 번째 활동을 시작해보세요!
                  </p>
                </div>
              )}
              
              {recentActivities.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link
                    to="/activity"
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    전체 활동 보기 →
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;