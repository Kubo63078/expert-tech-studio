import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 즉시 스크롤 (CSS smooth behavior 무시)
    const scrollToTop = () => {
      try {
        // 방법 1: 최신 브라우저용 - behavior: 'instant'로 즉시 스크롤
        window.scrollTo({ 
          top: 0, 
          left: 0, 
          behavior: 'instant' 
        });
      } catch (error) {
        // 방법 2: 구형 브라우저 fallback
        window.scrollTo(0, 0);
      }
      
      // 방법 3: document.documentElement 사용 (추가 보장)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      // 방법 4: document.body 사용 (추가 보장)
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // DOM 업데이트 완료 후 스크롤 (타이밍 문제 해결)
    const timer = setTimeout(scrollToTop, 0);
    
    // 즉시 한 번 더 실행 (이중 보장)
    scrollToTop();

    // 디버깅용 로그 (나중에 제거)
    console.log('ScrollToTop: Route changed to', pathname);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;