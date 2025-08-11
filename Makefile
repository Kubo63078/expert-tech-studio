# ExpertTech Studio Development Makefile
# Windows/WSL/Linux/macOS 호환

.PHONY: help dev build test lint clean install up down logs shell db-migrate db-seed db-reset

# 기본 설정
COMPOSE_FILE=docker-compose.dev.yml
BACKEND_DIR=./src/backend
FRONTEND_DIR=./src/frontend

# 도움말
help:
	@echo "ExpertTech Studio Development Commands"
	@echo "======================================"
	@echo ""
	@echo "Setup Commands:"
	@echo "  install       - Install all dependencies"
	@echo "  setup         - Initial setup (install + env + db)"
	@echo ""
	@echo "Development Commands:"
	@echo "  dev           - Start development environment"
	@echo "  up            - Start all services"
	@echo "  down          - Stop all services"
	@echo "  restart       - Restart all services"
	@echo ""
	@echo "Database Commands:"
	@echo "  db-migrate    - Run database migrations"
	@echo "  db-seed       - Seed database with initial data"
	@echo "  db-reset      - Reset database (migrate + seed)"
	@echo "  db-studio     - Open Prisma Studio"
	@echo ""
	@echo "Development Tools:"
	@echo "  logs          - View logs from all services"
	@echo "  logs-backend  - View backend logs only"
	@echo "  shell-backend - Shell into backend container"
	@echo "  shell-db      - Shell into database"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint          - Run linting"
	@echo "  test          - Run tests"
	@echo "  build         - Build for production"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean         - Clean up containers and volumes"
	@echo "  clean-all     - Complete cleanup (containers, volumes, images)"

# 초기 설정
install:
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && npm install
	@echo "Backend dependencies installed!"

setup: install
	@echo "Setting up ExpertTech Studio development environment..."
	@if [ ! -f "$(BACKEND_DIR)/.env" ]; then \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
		echo "Created .env file from .env.example"; \
		echo "⚠️  Please update .env file with your configuration"; \
	fi
	@echo "Setup complete! Run 'make dev' to start development."

# 개발 환경 시작
dev: up db-migrate
	@echo "🚀 ExpertTech Studio is running!"
	@echo ""
	@echo "Services:"
	@echo "  Backend API: http://localhost:3000"
	@echo "  Frontend:    http://localhost:3001"
	@echo "  PgAdmin:     http://localhost:5050 (admin@experttech.com / admin123)"
	@echo ""
	@echo "Use 'make logs' to view logs, 'make down' to stop."

up:
	@echo "Starting all services..."
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "Services started! Use 'make logs' to view output."

down:
	@echo "Stopping all services..."
	docker-compose -f $(COMPOSE_FILE) down

restart: down up

# 로그 및 디버깅
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

logs-backend:
	docker-compose -f $(COMPOSE_FILE) logs -f backend

logs-postgres:
	docker-compose -f $(COMPOSE_FILE) logs -f postgres

logs-redis:
	docker-compose -f $(COMPOSE_FILE) logs -f redis

shell-backend:
	docker-compose -f $(COMPOSE_FILE) exec backend sh

shell-db:
	docker-compose -f $(COMPOSE_FILE) exec postgres psql -U postgres -d experttech_studio

# 데이터베이스 관리
db-migrate:
	@echo "Running database migrations..."
	docker-compose -f $(COMPOSE_FILE) exec backend npm run db:migrate

db-generate:
	@echo "Generating Prisma client..."
	docker-compose -f $(COMPOSE_FILE) exec backend npm run db:generate

db-seed:
	@echo "Seeding database..."
	docker-compose -f $(COMPOSE_FILE) exec backend npm run db:seed

db-reset: db-migrate db-seed
	@echo "Database reset complete!"

db-studio:
	@echo "Opening Prisma Studio..."
	cd $(BACKEND_DIR) && npm run db:studio

# 코드 품질
lint:
	@echo "Running linter..."
	cd $(BACKEND_DIR) && npm run lint

lint-fix:
	@echo "Fixing linting issues..."
	cd $(BACKEND_DIR) && npm run lint:fix

test:
	@echo "Running tests..."
	cd $(BACKEND_DIR) && npm test

test-watch:
	@echo "Running tests in watch mode..."
	cd $(BACKEND_DIR) && npm run test:watch

# 빌드
build:
	@echo "Building for production..."
	cd $(BACKEND_DIR) && npm run build

build-docker:
	@echo "Building Docker images..."
	docker-compose -f $(COMPOSE_FILE) build

# 정리
clean:
	@echo "Cleaning up containers and volumes..."
	docker-compose -f $(COMPOSE_FILE) down -v
	docker system prune -f

clean-all:
	@echo "Complete cleanup (containers, volumes, images)..."
	docker-compose -f $(COMPOSE_FILE) down -v --rmi all
	docker system prune -a -f
	docker volume prune -f

# 상태 확인
status:
	@echo "Service Status:"
	docker-compose -f $(COMPOSE_FILE) ps

health:
	@echo "Health Check:"
	@echo "Backend API:"
	@curl -s http://localhost:3000/health || echo "❌ Backend not responding"
	@echo ""
	@echo "Database:"
	@docker-compose -f $(COMPOSE_FILE) exec -T postgres pg_isready -U postgres -d experttech_studio || echo "❌ Database not ready"
	@echo ""
	@echo "Redis:"
	@docker-compose -f $(COMPOSE_FILE) exec -T redis redis-cli ping || echo "❌ Redis not responding"

# Windows 호환성을 위한 별칭
install-windows: install
dev-windows: dev
up-windows: up
down-windows: down