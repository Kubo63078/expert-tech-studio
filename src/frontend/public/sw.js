const CACHE_NAME = 'experttech-studio-v1.0.0';
const API_CACHE_NAME = 'experttech-api-v1.0.0';

// 캐시할 정적 자원들
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/recommendations',
  '/onboarding',
  '/profile',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // CSS, JS 파일들은 빌드 시점에 자동으로 추가됨
];

// API 엔드포인트 캐시 전략
const API_ENDPOINTS = [
  '/api/v1/client-profiles/me',
  '/api/v1/recommendations',
  '/api/v1/business-templates'
];

// 40-50대 사용자를 위한 오프라인 페이지
const OFFLINE_PAGE = '/offline.html';

// Service Worker 설치
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Service Worker 활성화
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // 이전 버전 캐시 삭제
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // 모든 클라이언트에서 새 Service Worker 즉시 적용
      self.clients.claim()
    ])
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 같은 오리진의 요청만 처리
  if (url.origin !== location.origin) {
    return;
  }

  // API 요청 처리
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // 정적 자원 요청 처리
  event.respondWith(handleStaticRequest(request));
});

// API 요청 처리 (네트워크 우선 전략)
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // 네트워크에서 먼저 시도
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 성공적인 응답은 캐시에 저장 (GET 요청만)
      if (request.method === 'GET') {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    
    // 네트워크 실패 시 캐시에서 검색
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // 오프라인 상태임을 헤더에 표시
      const response = cachedResponse.clone();
      response.headers.append('X-Served-By', 'sw-cache');
      return response;
    }
    
    // 캐시에도 없으면 오프라인 응답
    return new Response(
      JSON.stringify({
        success: false,
        message: '오프라인 상태입니다. 네트워크 연결을 확인해주세요.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// 정적 자원 처리 (캐시 우선 전략)
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // 캐시에서 먼저 검색
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 캐시에 없으면 네트워크에서 가져오기
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 정적 자원은 캐시에 저장
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Both cache and network failed:', request.url);
    
    // HTML 페이지 요청이면 오프라인 페이지 반환
    if (request.destination === 'document') {
      const offlineResponse = await cache.match(OFFLINE_PAGE);
      if (offlineResponse) {
        return offlineResponse;
      }
      
      // 오프라인 페이지도 없으면 기본 HTML 반환
      return new Response(
        `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>오프라인 - ExpertTech Studio</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              max-width: 600px; 
              margin: 50px auto; 
              padding: 20px; 
              text-align: center; 
              font-size: 18px;
              color: #374151;
            }
            .icon { font-size: 64px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #1f2937; }
            .message { line-height: 1.6; margin-bottom: 20px; }
            .retry-btn { 
              background: #2563eb; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 8px; 
              font-size: 16px; 
              cursor: pointer; 
              min-height: 48px;
            }
          </style>
        </head>
        <body>
          <div class="icon">📱</div>
          <h1 class="title">인터넷 연결이 필요합니다</h1>
          <p class="message">
            현재 오프라인 상태입니다.<br>
            네트워크 연결을 확인하고 다시 시도해주세요.
          </p>
          <button class="retry-btn" onclick="location.reload()">다시 시도</button>
        </body>
        </html>
        `,
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }
    
    // 기타 자원은 네트워크 오류 응답
    return new Response('Network error', { status: 408 });
  }
}

// 백그라운드 동기화 (선택적)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'profile-update') {
    event.waitUntil(syncProfileData());
  } else if (event.tag === 'recommendations-fetch') {
    event.waitUntil(syncRecommendations());
  }
});

// 푸시 알림 (선택적)
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  if (!event.data) {
    return;
  }
  
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icons/action-close.png'
      }
    ],
    requireInteraction: true,
    tag: 'experttech-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification('ExpertTech Studio', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received.');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// 프로필 데이터 동기화
async function syncProfileData() {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const response = await fetch('/api/v1/client-profiles/me');
    
    if (response.ok) {
      await cache.put('/api/v1/client-profiles/me', response.clone());
      console.log('Profile data synced successfully');
    }
  } catch (error) {
    console.error('Profile sync failed:', error);
  }
}

// 추천 데이터 동기화
async function syncRecommendations() {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const response = await fetch('/api/v1/recommendations');
    
    if (response.ok) {
      await cache.put('/api/v1/recommendations', response.clone());
      console.log('Recommendations synced successfully');
    }
  } catch (error) {
    console.error('Recommendations sync failed:', error);
  }
}