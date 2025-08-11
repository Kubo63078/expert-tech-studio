#!/usr/bin/env node

/**
 * ExpertTech Studio 프론트엔드 구현 검증 스크립트
 * 40-50대 사용자 타겟 최적화 및 PWA 기능 검증
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('\n🔍 ExpertTech Studio 프론트엔드 구현 검증');
console.log('================================================\n');

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    results.passed++;
    results.details.push(`✅ ${description}`);
    return true;
  } else {
    results.failed++;
    results.details.push(`❌ ${description} - 파일 없음: ${filePath}`);
    return false;
  }
}

function checkFileContent(filePath, searchPattern, description) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchPattern) || (searchPattern instanceof RegExp && searchPattern.test(content))) {
      results.passed++;
      results.details.push(`✅ ${description}`);
      return true;
    } else {
      results.failed++;
      results.details.push(`❌ ${description} - 패턴 없음: ${searchPattern}`);
      return false;
    }
  } else {
    results.failed++;
    results.details.push(`❌ ${description} - 파일 없음: ${filePath}`);
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    results.passed++;
    results.details.push(`✅ ${description}`);
    return true;
  } else {
    results.failed++;
    results.details.push(`❌ ${description} - 디렉토리 없음: ${dirPath}`);
    return false;
  }
}

function warning(message) {
  results.warnings++;
  results.details.push(`⚠️  ${message}`);
}

console.log('1️⃣ 기본 파일 구조 검증');
console.log('----------------------------');

// 기본 구조 검증
checkFile('package.json', 'package.json 존재');
checkFile('src/App.tsx', 'App.tsx 존재');
checkFile('public/manifest.json', 'PWA manifest.json 존재');
checkFile('public/sw.js', 'Service Worker 파일 존재');
checkFile('public/offline.html', '오프라인 페이지 존재');

console.log('\n2️⃣ 컴포넌트 구조 검증');
console.log('----------------------------');

// Layout 컴포넌트
checkFile('src/components/layout/Header.tsx', 'Header 컴포넌트');
checkFile('src/components/layout/Footer.tsx', 'Footer 컴포넌트');

// Page 컴포넌트
checkFile('src/pages/HomePage.tsx', 'HomePage 컴포넌트');
checkFile('src/pages/OnboardingPage.tsx', 'OnboardingPage 컴포넌트');
checkFile('src/pages/DashboardPage.tsx', 'DashboardPage 컴포넌트');
checkFile('src/pages/RecommendationsPage.tsx', 'RecommendationsPage 컴포넌트');
checkFile('src/pages/ProfilePage.tsx', 'ProfilePage 컴포넌트');
checkFile('src/pages/LoginPage.tsx', 'LoginPage 컴포넌트');
checkFile('src/pages/RegisterPage.tsx', 'RegisterPage 컴포넌트');

// UI 컴포넌트
checkFile('src/components/ui/LoadingSpinner.tsx', 'LoadingSpinner 컴포넌트');
checkFile('src/components/ui/LazyImage.tsx', 'LazyImage 컴포넌트 (성능 최적화)');

console.log('\n3️⃣ PWA 기능 검증');
console.log('----------------------------');

// PWA 관련 파일
checkFile('src/components/common/PWAInstallPrompt.tsx', 'PWA 설치 프롬프트');
checkFile('src/components/common/NetworkStatus.tsx', '네트워크 상태 표시');
checkFile('src/components/common/UpdateNotification.tsx', '앱 업데이트 알림');
checkFile('src/hooks/usePWA.ts', 'PWA 훅');

// 아이콘 관련
checkDirectory('public/icons', 'PWA 아이콘 디렉토리');
checkFile('public/icons/icon.svg', 'SVG 아이콘');
checkFile('public/icons/README.md', '아이콘 생성 가이드');
checkFile('public/icons/generate-icons.js', '아이콘 생성 스크립트');

console.log('\n4️⃣ 성능 최적화 기능 검증');
console.log('----------------------------');

// 성능 관련 훅
checkFile('src/hooks/usePerformance.ts', '성능 측정 훅');
checkFile('src/hooks/useCache.ts', '캐싱 전략 훅');
checkFile('src/hooks/useAnalytics.ts', '성능 분석 훅');

// 성능 최적화 컴포넌트
checkFile('src/components/common/LazyPageWrapper.tsx', '지연 로딩 래퍼');
checkFile('src/components/common/ErrorBoundary.tsx', '에러 경계');

console.log('\n5️⃣ 40-50대 친화적 UI 검증');
console.log('----------------------------');

// CSS 파일에서 40-50대 친화적 스타일 확인
if (fs.existsSync('src/index.css')) {
  const cssContent = fs.readFileSync('src/index.css', 'utf8');
  
  checkFileContent('src/index.css', 'text-senior', '40-50대 전용 텍스트 크기 클래스');
  checkFileContent('src/index.css', 'btn-senior', '40-50대 전용 버튼 스타일');
  
  if (cssContent.includes('font-size: 1.125rem') || cssContent.includes('18px')) {
    results.passed++;
    results.details.push('✅ 큰 폰트 크기 (18px 이상) 적용');
  } else {
    warning('큰 폰트 크기 확인 필요 - 40-50대 사용자를 위해 18px 이상 권장');
  }
  
  if (cssContent.includes('line-height: 1.6') || cssContent.includes('line-height: 1.5')) {
    results.passed++;
    results.details.push('✅ 충분한 줄 간격 적용');
  } else {
    warning('줄 간격 확인 필요 - 1.5 이상 권장');
  }
} else {
  warning('CSS 파일을 찾을 수 없음');
}

console.log('\n6️⃣ 코드 품질 및 구조 검증');
console.log('----------------------------');

// TypeScript 설정
checkFile('tsconfig.json', 'TypeScript 설정');

// App.tsx에서 lazy loading 확인
checkFileContent('src/App.tsx', 'lazy', '코드 분할 (lazy loading) 구현');
checkFileContent('src/components/common/LazyPageWrapper.tsx', 'Suspense', 'Suspense 래퍼 구현');
checkFileContent('src/App.tsx', 'ErrorBoundary', 'ErrorBoundary 적용');

// Service Worker 기능 확인
checkFileContent('public/sw.js', 'CACHE_NAME', 'Service Worker 캐싱 전략');
checkFileContent('public/sw.js', 'fetch', 'Service Worker fetch 이벤트');
checkFileContent('public/sw.js', 'install', 'Service Worker 설치 이벤트');

console.log('\n7️⃣ 접근성 기능 검증');
console.log('----------------------------');

// 접근성 관련 검사
const accessibilityFiles = [
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/pages/HomePage.tsx'
];

let accessibilityFeatures = 0;
accessibilityFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('aria-label') || content.includes('role=')) {
      accessibilityFeatures++;
    }
    
    if (content.includes('alt=')) {
      accessibilityFeatures++;
    }
    
    if (content.includes('tabIndex') || content.includes('onKeyDown')) {
      accessibilityFeatures++;
    }
  }
});

if (accessibilityFeatures > 3) {
  results.passed++;
  results.details.push('✅ 접근성 기능 (ARIA, 키보드 네비게이션) 구현');
} else {
  warning('접근성 기능 확인 필요 - ARIA 라벨, 키보드 네비게이션 등');
}

console.log('\n8️⃣ 테스트 파일 검증');
console.log('----------------------------');

checkFile('src/tests/integration/AppIntegration.test.tsx', '통합 테스트');
checkDirectory('src/tests', '테스트 디렉토리');

console.log('\n9️⃣ 프로덕션 준비도 검증');
console.log('----------------------------');

// 환경 설정
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.build) {
    results.passed++;
    results.details.push('✅ 빌드 스크립트 존재');
  } else {
    results.failed++;
    results.details.push('❌ 빌드 스크립트 없음');
  }
  
  if (packageJson.scripts && packageJson.scripts.test) {
    results.passed++;
    results.details.push('✅ 테스트 스크립트 존재');
  } else {
    warning('테스트 스크립트 확인 필요');
  }
  
  // PWA 관련 의존성 확인
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (dependencies['react-hot-toast']) {
    results.passed++;
    results.details.push('✅ Toast 알림 라이브러리');
  }
  
  if (dependencies['@heroicons/react']) {
    results.passed++;
    results.details.push('✅ 아이콘 라이브러리');
  }
}

console.log('\n🎯 최종 검증 결과');
console.log('================================================');

// 결과 출력
results.details.forEach(detail => {
  console.log(detail);
});

console.log('\n📊 통계');
console.log(`✅ 통과: ${results.passed}`);
console.log(`❌ 실패: ${results.failed}`);
console.log(`⚠️  경고: ${results.warnings}`);

const successRate = Math.round((results.passed / (results.passed + results.failed)) * 100);
console.log(`\n성공률: ${successRate}%`);

console.log('\n🚀 다음 단계 권장사항');
console.log('================================================');

if (results.failed > 0) {
  console.log('❌ 실패한 항목들을 우선 해결하세요.');
}

if (results.warnings > 0) {
  console.log('⚠️  경고 항목들을 검토하고 필요시 개선하세요.');
}

console.log('\n📋 운영 전 체크리스트');
console.log('1. 실제 PWA 아이콘 파일 생성 (node public/icons/generate-icons.js)');
console.log('2. 브라우저에서 PWA 설치 테스트');
console.log('3. 오프라인 모드 테스트');
console.log('4. 다양한 디바이스에서 반응형 테스트');
console.log('5. 40-50대 사용자와 실제 사용성 테스트');
console.log('6. 성능 측정 도구로 Core Web Vitals 확인');
console.log('7. 접근성 검사 도구 실행');
console.log('8. 프로덕션 빌드 테스트');

if (successRate >= 90) {
  console.log('\n🎉 구현이 거의 완료되었습니다! 운영 배포 준비가 되었습니다.');
} else if (successRate >= 70) {
  console.log('\n👍 구현이 잘 진행되고 있습니다. 몇 가지 항목만 더 완성하면 됩니다.');
} else {
  console.log('\n💪 구현을 계속 진행하세요. 핵심 기능들부터 완성해나가세요.');
}

console.log('');