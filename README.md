# ExpertTech Studio

**AI가 제안하고, 전문가가 구현하는 맞춤형 IT 솔루션**

40-50대 중장년층의 전문 경력을 활용하여 개인 맞춤형 IT 비즈니스를 창업할 수 있도록 돕는 AI 기반 개발 에이전시 플랫폼입니다.

## 🚀 빠른 시작

### 필요 요구사항
- Docker & Docker Compose
- Node.js 18+ (로컬 개발 시)
- Git

### 1. 프로젝트 클론 및 설정
```bash
# 프로젝트 클론
git clone <repository-url>
cd expert-tech-studio

# 초기 설정 (의존성 설치 + 환경 설정)
make setup
```

### 2. 환경 변수 설정
```bash
# .env 파일 수정 (자동으로 .env.example에서 복사됨)
cd src/backend
# .env 파일의 필요한 값들을 업데이트하세요
```

### 3. 개발 환경 시작
```bash
# 모든 서비스 시작 (DB, Redis, Backend, Frontend)
make dev
```

### 4. 접속 확인
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:3001  
- **PgAdmin**: http://localhost:5050 (admin@experttech.com / admin123)
- **API Documentation**: http://localhost:3000/api/docs

## 🛠️ 개발 명령어

### 기본 명령어
```bash
make help          # 모든 명령어 보기
make dev            # 개발 환경 시작
make down           # 모든 서비스 중지
make logs           # 모든 로그 보기
make logs-backend   # 백엔드 로그만 보기
```

### 데이터베이스 관리
```bash
make db-migrate     # 마이그레이션 실행
make db-seed        # 시드 데이터 입력
make db-reset       # DB 리셋 (migrate + seed)
make db-studio      # Prisma Studio 열기
```

### 코드 품질
```bash
make lint           # 린팅 실행
make test           # 테스트 실행
make build          # 프로덕션 빌드
```

### 디버깅
```bash
make shell-backend  # 백엔드 컨테이너 셸 접속
make shell-db       # 데이터베이스 셸 접속
make status         # 서비스 상태 확인
make health         # 헬스 체크
```

## 📁 프로젝트 구조

```
expert-tech-studio/
├── docs/                           # 문서
│   ├── business/                   # 비즈니스 문서
│   ├── system/                     # 시스템 설계 문서
│   └── operations/                 # 운영 프로세스
├── src/
│   ├── backend/                    # Node.js + TypeScript API
│   │   ├── src/
│   │   │   ├── controllers/        # API 컨트롤러
│   │   │   ├── services/           # 비즈니스 로직
│   │   │   ├── middleware/         # Express 미들웨어
│   │   │   ├── routes/             # API 라우트
│   │   │   ├── types/              # TypeScript 타입 정의
│   │   │   ├── utils/              # 유틸리티 함수
│   │   │   └── config/             # 설정 파일
│   │   ├── prisma/                 # 데이터베이스 스키마
│   │   ├── tests/                  # 테스트 파일
│   │   └── Dockerfile.dev          # 개발용 Docker 파일
│   └── frontend/                   # Next.js React 애플리케이션 (추후 개발)
├── docker-compose.dev.yml          # 개발 환경 Docker Compose
├── Makefile                        # 개발 명령어 모음
└── README.md                       # 이 파일
```

## 🏗️ 시스템 아키텍처

### 기술 스택
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL 15 + Redis 7
- **Frontend**: Next.js 14, React 18, TypeScript
- **Container**: Docker + Docker Compose
- **AI**: OpenAI API + 자체 학습 모델

### 핵심 모듈
1. **인증/권한 시스템**: JWT 기반 사용자 인증 및 권한 관리
2. **고객 관리**: 고객 정보 수집 및 전문성 분석
3. **AI 추천 엔진**: 고객별 맞춤 비즈니스 아이디어 생성
4. **프로젝트 관리**: 개발 프로젝트 라이프사이클 관리
5. **템플릿 엔진**: 업종별 비즈니스 템플릿 관리
6. **결제 시스템**: Stripe 연동 결제 처리
7. **파일 관리**: AWS S3 연동 파일 업로드/관리
8. **알림 시스템**: 이메일/SMS 알림 서비스

## 🔧 개발 환경 설정

### 로컬 개발 (Docker 없이)
```bash
cd src/backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 수정 필요

# PostgreSQL, Redis 로컬 설치 필요
# 또는 Docker로 DB만 실행:
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres123 postgres:15-alpine
docker run -d -p 6379:6379 redis:7-alpine

# 데이터베이스 마이그레이션
npm run db:migrate

# 개발 서버 시작
npm run dev
```

### IDE 설정
- **VS Code 권장 확장**:
  - TypeScript and JavaScript Language Features
  - Prettier - Code formatter
  - ESLint
  - Prisma
  - Docker
  - Thunder Client (API 테스트용)

### 디버깅
```bash
# 백엔드 디버그 모드 시작
cd src/backend
npm run dev:debug

# 또는 VS Code에서 F5로 디버깅 시작
```

## 🧪 테스트

```bash
# 단위 테스트 실행
make test

# 테스트 커버리지 확인
cd src/backend
npm run test:coverage

# 통합 테스트 (Docker 환경 필요)
npm run test:integration
```

## 📦 배포

### 스테이징 환경
```bash
# 스테이징 환경 빌드
docker-compose -f docker-compose.staging.yml build

# 스테이징 환경 배포
docker-compose -f docker-compose.staging.yml up -d
```

### 프로덕션 환경
```bash
# 프로덕션 빌드
make build

# 프로덕션 배포 (AWS ECS/Fargate)
# CI/CD 파이프라인을 통한 자동 배포
```

## 🔍 트러블슈팅

### 일반적인 문제들

**1. Docker 서비스가 시작되지 않는 경우**
```bash
# Docker 데몬 상태 확인
docker info

# 포트 충돌 확인
netstat -tulpn | grep :3000
netstat -tulpn | grep :5432

# 컨테이너 로그 확인
make logs
```

**2. 데이터베이스 연결 실패**
```bash
# DB 상태 확인
make shell-db

# 마이그레이션 재실행
make db-reset
```

**3. 의존성 문제**
```bash
# node_modules 재설치
cd src/backend
rm -rf node_modules package-lock.json
npm install
```

### 성능 모니터링
```bash
# 시스템 리소스 사용량 확인
docker stats

# 애플리케이션 성능 확인
curl http://localhost:3000/health
curl http://localhost:3000/metrics
```

## 🤝 기여하기

1. **브랜치 생성**: `git checkout -b feature/your-feature`
2. **개발**: 코드 작성 및 테스트
3. **린팅**: `make lint`
4. **테스트**: `make test`
5. **커밋**: `git commit -m "feat: your feature description"`
6. **푸시**: `git push origin feature/your-feature`
7. **Pull Request 생성**

### 코딩 규칙
- TypeScript 엄격 모드 사용
- ESLint + Prettier 규칙 준수
- 모든 API에 대한 단위 테스트 작성
- RESTful API 설계 원칙 준수
- Git 커밋 메시지 컨벤션: `type: description`

## 📞 지원

- **문서**: [./docs/](./docs/) 폴더 참조
- **API 문서**: http://localhost:3000/api/docs (개발 서버 실행 시)
- **이슈 리포트**: GitHub Issues 사용
- **팀 커뮤니케이션**: Slack/Discord

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

**ExpertTech Studio Team**  
Version: 1.0.0  
Last Updated: 2025-01-09