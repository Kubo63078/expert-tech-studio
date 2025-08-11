import React, { useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components (즉시 로딩 - 모든 페이지에서 필요)
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components - 코드 분할로 지연 로딩
const HomePage = lazy(() => import('./pages/HomePage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// Common Components
import ErrorBoundary from './components/common/ErrorBoundary';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import NetworkStatus from './components/common/NetworkStatus';
import UpdateNotification from './components/common/UpdateNotification';
import LazyPageWrapper from './components/common/LazyPageWrapper';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Hooks
import { registerServiceWorker } from './hooks/usePWA';
import { usePerformance } from './hooks/usePerformance';

function App() {
  const { measurePageLoad } = usePerformance();

  useEffect(() => {
    // Service Worker 등록
    registerServiceWorker();

    // 페이지 로드 성능 측정
    measurePageLoad();

    // PWA 메타 태그 동적 추가
    const addPWAMetaTags = () => {
      // Viewport meta tag
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
        document.head.appendChild(meta);
      }

      // Theme color
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = '#2563eb';
        document.head.appendChild(meta);
      }

      // Mobile web app capable (modern PWA standard)
      const mobileWebAppMeta = document.querySelector('meta[name="mobile-web-app-capable"]');
      if (!mobileWebAppMeta) {
        const meta = document.createElement('meta');
        meta.name = 'mobile-web-app-capable';
        meta.content = 'yes';
        document.head.appendChild(meta);
      }

      // Apple mobile web app capable (iOS Safari only)
      const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOSSafari) {
        const appleMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
        if (!appleMeta) {
          const meta = document.createElement('meta');
          meta.name = 'apple-mobile-web-app-capable';
          meta.content = 'yes';
          document.head.appendChild(meta);
        }
      }

      // Apple status bar style (iOS Safari only)
      if (isIOSSafari) {
        const appleStatusMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!appleStatusMeta) {
          const meta = document.createElement('meta');
          meta.name = 'apple-mobile-web-app-status-bar-style';
          meta.content = 'default';
          document.head.appendChild(meta);
        }
      }

      // Apple touch icon
      const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (!appleTouchIcon) {
        const link = document.createElement('link');
        link.rel = 'apple-touch-icon';
        link.href = '/icons/icon-192x192.png';
        document.head.appendChild(link);
      }
    };

    addPWAMetaTags();

    // 페이지 가시성 변경 감지 (성능 최적화)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 페이지가 숨겨졌을 때 불필요한 작업 중단
        console.log('Page hidden - pausing background tasks');
      } else {
        // 페이지가 다시 보일 때 필요한 작업 재개
        console.log('Page visible - resuming background tasks');
        measurePageLoad();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [measurePageLoad]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 네트워크 상태 표시 */}
            <NetworkStatus />
            
            {/* 앱 업데이트 알림 */}
            <UpdateNotification />
            
            <Header />
            
            <main className="flex-1" role="main">
              <LazyPageWrapper>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/recommendations" element={<RecommendationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </LazyPageWrapper>
            </main>
            
            <Footer />
            
            {/* PWA 설치 프롬프트 */}
            <PWAInstallPrompt />
            
            {/* Toast Notifications - 40-50대 친화적 스타일 */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000, // 더 긴 표시 시간
                style: {
                  fontSize: '1.125rem', // 18px
                  padding: '16px 20px',
                  minHeight: '60px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                  style: {
                    background: '#f0fdf4',
                    color: '#065f46',
                    border: '1px solid #bbf7d0',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                  style: {
                    background: '#fef2f2',
                    color: '#991b1b',
                    border: '1px solid #fecaca',
                  },
                },
                loading: {
                  iconTheme: {
                    primary: '#2563eb',
                    secondary: '#ffffff',
                  },
                  style: {
                    background: '#eff6ff',
                    color: '#1e40af',
                    border: '1px solid #bfdbfe',
                  },
                },
              }}
              containerStyle={{
                top: 80, // 헤더 아래 위치
                right: 16,
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;