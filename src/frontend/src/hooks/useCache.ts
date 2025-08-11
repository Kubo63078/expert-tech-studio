import { useState, useEffect, useCallback } from 'react';

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size
  storage: 'memory' | 'session' | 'local';
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface CacheHook<T> {
  data: T | null;
  isLoading: boolean;
  isStale: boolean;
  set: (key: string, value: T) => void;
  get: (key: string) => T | null;
  clear: (key?: string) => void;
  prefetch: (key: string, fetcher: () => Promise<T>) => Promise<void>;
}

const defaultConfig: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5분
  maxSize: 100,
  storage: 'memory'
};

// 메모리 캐시 저장소
const memoryCache = new Map<string, CacheEntry<any>>();

/**
 * 캐싱 전략을 위한 커스텀 훅
 * 40-50대 사용자의 네트워크 환경을 고려한 최적화
 */
export const useCache = <T>(config: Partial<CacheConfig> = {}): CacheHook<T> => {
  const finalConfig = { ...defaultConfig, ...config };
  const [isLoading, setIsLoading] = useState(false);

  // 캐시에서 데이터 가져오기
  const get = useCallback((key: string): T | null => {
    const fullKey = `experttech_${key}`;
    let entry: CacheEntry<T> | null = null;

    try {
      switch (finalConfig.storage) {
        case 'memory':
          entry = memoryCache.get(fullKey) || null;
          break;
        case 'session':
          const sessionData = sessionStorage.getItem(fullKey);
          entry = sessionData ? JSON.parse(sessionData) : null;
          break;
        case 'local':
          const localData = localStorage.getItem(fullKey);
          entry = localData ? JSON.parse(localData) : null;
          break;
      }

      // 만료 검사
      if (entry && entry.expiry < Date.now()) {
        clear(key);
        return null;
      }

      return entry?.data || null;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }, [finalConfig.storage]);

  // 캐시에 데이터 저장
  const set = useCallback((key: string, value: T): void => {
    const fullKey = `experttech_${key}`;
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      expiry: Date.now() + finalConfig.ttl
    };

    try {
      switch (finalConfig.storage) {
        case 'memory':
          // 메모리 캐시 크기 제한
          if (memoryCache.size >= finalConfig.maxSize) {
            const firstKey = memoryCache.keys().next().value;
            memoryCache.delete(firstKey);
          }
          memoryCache.set(fullKey, entry);
          break;
        case 'session':
          sessionStorage.setItem(fullKey, JSON.stringify(entry));
          break;
        case 'local':
          localStorage.setItem(fullKey, JSON.stringify(entry));
          break;
      }
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }, [finalConfig.storage, finalConfig.ttl, finalConfig.maxSize]);

  // 캐시 삭제
  const clear = useCallback((key?: string): void => {
    try {
      if (key) {
        const fullKey = `experttech_${key}`;
        switch (finalConfig.storage) {
          case 'memory':
            memoryCache.delete(fullKey);
            break;
          case 'session':
            sessionStorage.removeItem(fullKey);
            break;
          case 'local':
            localStorage.removeItem(fullKey);
            break;
        }
      } else {
        // 모든 캐시 삭제
        switch (finalConfig.storage) {
          case 'memory':
            memoryCache.clear();
            break;
          case 'session':
            Object.keys(sessionStorage).forEach(k => {
              if (k.startsWith('experttech_')) {
                sessionStorage.removeItem(k);
              }
            });
            break;
          case 'local':
            Object.keys(localStorage).forEach(k => {
              if (k.startsWith('experttech_')) {
                localStorage.removeItem(k);
              }
            });
            break;
        }
      }
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }, [finalConfig.storage]);

  // 데이터 사전 로딩
  const prefetch = useCallback(async (key: string, fetcher: () => Promise<T>): Promise<void> => {
    const cached = get(key);
    if (cached) return;

    setIsLoading(true);
    try {
      const data = await fetcher();
      set(key, data);
    } catch (error) {
      console.error('Prefetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [get, set]);

  // 캐시 정리 (메모리 누수 방지)
  useEffect(() => {
    const cleanup = () => {
      if (finalConfig.storage === 'memory') {
        // 만료된 항목 정리
        const now = Date.now();
        for (const [key, entry] of memoryCache.entries()) {
          if (entry.expiry < now) {
            memoryCache.delete(key);
          }
        }
      }
    };

    const interval = setInterval(cleanup, 60000); // 1분마다 정리
    return () => clearInterval(interval);
  }, [finalConfig.storage]);

  // 데이터 신선도 확인
  const isStale = useCallback((key: string): boolean => {
    const fullKey = `experttech_${key}`;
    const entry = memoryCache.get(fullKey);
    if (!entry) return true;

    const stalePeriod = finalConfig.ttl * 0.7; // TTL의 70% 경과 시 stale로 간주
    return (Date.now() - entry.timestamp) > stalePeriod;
  }, [finalConfig.ttl]);

  return {
    data: null,
    isLoading,
    isStale: false,
    set,
    get,
    clear,
    prefetch
  };
};

// API 응답 캐싱을 위한 특화된 훅
export const useApiCache = <T>(endpoint: string) => {
  return useCache<T>({
    ttl: 2 * 60 * 1000, // API 응답은 2분 캐시
    storage: 'session',
    maxSize: 50
  });
};

// 정적 자산 캐싱을 위한 특화된 훅
export const useAssetCache = <T>() => {
  return useCache<T>({
    ttl: 60 * 60 * 1000, // 1시간 캐시
    storage: 'local',
    maxSize: 200
  });
};