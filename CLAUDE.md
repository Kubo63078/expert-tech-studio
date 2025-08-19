# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ExpertTech Studio is a dual-architecture application for IT business consultation targeting 40-50s professionals. It combines a React frontend with TypeScript and a Node.js backend with Prisma ORM, deployed to Vercel with Supabase as the database.

## Architecture

### Frontend (`src/frontend/`)
- **Framework**: React 19 + TypeScript + Vite
- **UI**: TailwindCSS + Heroicons
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

### Backend (`src/backend/`)
- **Framework**: Express.js + TypeScript
- **Database**: Prisma ORM (SQLite for dev, PostgreSQL for production)
- **Authentication**: JWT with refresh tokens
- **Deployment**: Docker containers

### Key Services

#### LLM Analysis System (`src/frontend/src/services/`)
- **Primary**: Premium GPT-4o analysis engine with intelligent fallback chain
- **Fallback Chain**: GPT-4o → GPT-4o-mini → Hugging Face → Mock
- **Cost Monitoring**: Real-time usage tracking with budget alerts
- **Configuration**: Environment variable driven model selection

#### Interview System (`src/frontend/src/data/interviewQuestions.ts`)
- Dynamic questionnaire flow based on user responses
- Four categories: Basic, Expertise, Business, Goals
- Follow-up logic for personalized interviews

## Development Commands

### Frontend Development
```bash
cd src/frontend
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Development
```bash
cd src/backend
npm run dev          # Start with nodemon and ts-node
npm run build        # Compile TypeScript
npm run start        # Start production server
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

### Database Management
```bash
# In backend directory
npm run db:migrate   # Run Prisma migrations
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
npm run seed:templates # Seed business templates
```

### Docker Environment (Recommended)
```bash
make help           # Show all available commands
make setup          # Initial setup with dependencies
make dev            # Start full development environment
make down           # Stop all services
make db-reset       # Reset database (migrate + seed)
make logs           # View all service logs
```

## Environment Configuration

### Required Environment Variables

**Frontend (.env in src/frontend/)**:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# LLM Configuration (Premium Quality Strategy)
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_HUGGINGFACE_API_KEY=optional_huggingface_key
VITE_PRIMARY_MODEL=gpt-4o  # or gpt-4o-mini, claude-3.5-sonnet
```

**Backend (.env in src/backend/)**:
```env
DATABASE_URL="file:./dev.db"  # SQLite for development
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## LLM System Architecture

### Model Selection Strategy
The application uses a premium quality strategy with intelligent fallback:

1. **GPT-4o** (Primary): Maximum quality for analysis
2. **GPT-4o-mini** (Fallback): Cost-effective high quality
3. **Hugging Face** (Anonymous): Free tier fallback
4. **Mock Data** (Final): Development and emergency fallback

### Cost Monitoring
- Real-time token usage tracking
- Daily/monthly budget management
- Automatic alerts at 70% and 90% of budget
- Estimated costs: ~$0.02 per analysis (GPT-4o)

## Database Schema Key Points

### Core Models
- **Users**: Authentication with role-based access
- **ClientProfile**: Customer data and interview responses
- **Recommendation**: AI-generated business recommendations
- **Project**: Development project management
- **BusinessTemplate**: Reusable business model templates

### Schema Switching
- Development: SQLite (`schema.prisma`)
- Production: PostgreSQL (`schema_postgresql_backup.prisma`)

## Testing Strategy

### Backend Tests
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm test -- --testNamePattern="auth"  # Run specific test
```

### Test Database
- Automatic test database setup/teardown
- Isolated test environment
- Integration tests for API endpoints

## Deployment

### Vercel (Frontend)
- Configured with `vercel.json`
- Automatic deployments from Git
- Environment variables configured in Vercel dashboard

### Docker (Backend)
- Multi-stage builds for production
- Development compose file: `docker-compose.dev.yml`
- Health checks and logging configured

## Code Quality

### Linting and Formatting
- ESLint configured for both frontend and backend
- TypeScript strict mode enabled
- Prettier integration (backend)

### File Structure Conventions
- Services in `services/` directory
- Types in `types/` directory
- Utilities in `utils/` directory
- Tests co-located with source files

## Key Integrations

### Supabase
- PostgreSQL database hosting
- Row Level Security (RLS) enabled
- Real-time subscriptions available

### Cost-Effective LLM Strategy
- Multiple API fallbacks prevent service disruption
- Cost monitoring prevents budget overruns
- Model flexibility allows easy switching between providers

## Development Workflow

1. **Setup**: Run `make setup` for initial environment
2. **Development**: Use `make dev` for full stack development
3. **Database Changes**: Modify `schema.prisma` then `npm run db:migrate`
4. **Testing**: Run `npm test` before committing
5. **Deployment**: Frontend auto-deploys via Vercel, backend via Docker

## Common Patterns

### Error Handling
- Async wrapper functions for consistent error handling
- Structured error responses with status codes
- Logging integrated throughout application

### Authentication Flow
- JWT access tokens (15 min expiry)
- Refresh tokens (7 day expiry)
- Middleware-based route protection

### Data Flow
- Interview responses → LLM analysis → Structured recommendations
- Client profile management → Project creation → Development tracking