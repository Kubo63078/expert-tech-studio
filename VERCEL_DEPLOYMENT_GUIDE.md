# Vercel 배포 가이드

## 준비 완료된 항목 ✅
- ✅ Supabase 마이그레이션 완료
- ✅ 프론트엔드 빌드 성공 (`npm run build`)
- ✅ Vercel CLI 설치 완료
- ✅ Vercel 설정 파일(`vercel.json`) 생성

## 수동 배포 단계

### 1. Vercel 로그인
```bash
cd "D:\claude-win\expert-tech-studio\src\frontend"
vercel login
```
- GitHub, Google, 또는 Email 중 선택하여 로그인

### 2. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수들을 설정해야 합니다:

```
VITE_SUPABASE_URL=https://asxcaplxnbfrhyzpyreo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeGNhcGx4bmJmcmh5enB5cmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1OTQzNTYsImV4cCI6MjA3MTE3MDM1Nn0.AMhezsKrbIcmIhPtug1s9O4FbXNsHWgD9d_rDI1OmiM
```

### 3. 배포 실행
```bash
vercel deploy --prod
```

### 4. 대체 방법 (Vercel Web Interface)
1. [vercel.com](https://vercel.com)에서 로그인
2. "Import Project" 클릭
3. GitHub 리포지토리 연결 (또는 ZIP 파일 업로드)
4. 프로젝트 설정:
   - Framework Preset: `Vite`
   - Root Directory: `src/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Environment Variables에 위의 환경 변수들 추가
6. Deploy 클릭

## 테스트 페이지
배포 완료 후 다음 페이지들로 테스트:
- `/` - 메인 페이지
- `/simple-auth-test` - Supabase 연결 테스트 페이지
- `/consultation` - 상담 페이지

## 예상 결과
- Supabase 연결 테스트가 성공해야 함
- 회원가입/로그인 기능이 정상 작동해야 함
- 모든 페이지 라우팅이 정상 작동해야 함

## 문제 해결
만약 배포 후 환경 변수 관련 오류가 발생하면:
1. Vercel 대시보드 → Project → Settings → Environment Variables 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. Redeploy 실행