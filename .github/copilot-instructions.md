# Copilot Instructions for CRM Synergy System

## Architecture Overview
Microservices-based CRM for online English school, replacing Excel processes. Components:
- **Backend** (`crm-system/`): Spring Boot 3.3/Java 17 app for business logic, API (REST/JWT), user/scheduling management. JPA/Hibernate with PostgreSQL 15 (Flyway migrations in `src/main/resources/db/migration/V*.sql`). Controllers/services/entities in `src/main/java/com/crm/system/` (e.g., UserEntity with @Data/@Builder Lombok, roles: ADMIN/TEACHER/STUDENT).
- **Frontend** (`frontend/`): React 18 + TypeScript SPA with Vite build, consuming backend API (Axios, TanStack Query for caching). Static assets served by Nginx in Docker (`nginx.conf` with SPA fallback /index.html). Components in `src/components/` (e.g., Login.tsx with /api/auth/login), pages in `src/pages/` (Dashboard/Users with tables). Proxy /api to backend:8080 in vite.config.ts.
- **Email Service** (`email-service/`): Spring Boot microservice for notifications (Spring Mail + Thymeleaf templates). Internal API calls from backend (port 8081).
- **Telegram Service** (`telegram-service/`): Spring Boot with TelegramBots lib for bot alerts (scheduling). Shared DB or HTTP to backend (port 8082).
- **Infrastructure**: Docker Compose v3.8 orchestrates Traefik (reverse proxy/SSL, routes api.crm-synergy.ru → backend:8080, app.crm-synergy.ru → frontend:80), PostgreSQL (crm_system DB, health pg_isready), services on crm-network. Data flow: Frontend → Backend API → DB; async notifications to email/telegram. No Redis/RabbitMQ (simple REST polling).

External: JWT (jjwt 0.11.5), Flyway, Actuator health (/actuator/health).

## Developer Workflows
- **Local Dev**: `docker-compose up -d postgres traefik` for DB/proxy; `cd crm-system && mvn spring-boot:run` (profile dev, ddl-auto=update); `cd frontend && npm run dev` (port 3000, proxy API). TestContainers in *IT.java for isolated Postgres.
- **Build**: Backend: `mvn clean package -DskipTests` → target/crm-system-0.0.1-SNAPSHOT.jar (excludes Lombok). Frontend: `npm run build` → dist/ (Vite, sourcemaps). Multi-module Maven (pom.xml enforces JaCoCo >80% coverage).
- **Deployment**: Prod on Ubuntu VPS: `scripts/deploy-and-restart.sh --jar new.jar --frontend dist/` (backups, systemd crm-synergy-backend.service, nginx reload). Full stack: `docker-compose up -d --build` with .env (POSTGRES_PASSWORD, JWT_SECRET, TELEGRAM_BOT_TOKEN). Traefik auto-SSL (Let's Encrypt). Scripts (database-migrate.sh for Flyway, full-deployment.sh).
- **Testing**: Backend: `mvn test` (JUnit/Mockito, Failsafe for *IT.java, JaCoCo report target/site/jacoco/). Frontend: `npm test` (Vitest/RTL, coverage), `npm run test:e2e` (Playwright e2e/ specs, requires services up). CI: .github/workflows/ci-cd.yml (backend-tests with postgres service, frontend-tests npm ci/build, build-push to GHCR, deploy SSH). Min coverage: Backend 80% lines/branches.
- **Debugging**: Actuator /actuator/health per service; logs `docker-compose logs -f <service>`; DB `docker-compose exec postgres psql -U crm_user -d crm_system`. Fixes in POSTGRES_CI_FIXES.md (GitHub Actions pg_isready retries).

## Project Conventions & Patterns
- **Naming/Style**: Java: PascalCase classes (UserController), camelCase methods/vars (@Data/@Builder Lombok e.g., UserEntity id: Long, email: String). TS/JS: camelCase vars/functions, PascalCase components (Login.tsx with useState). No snake_case; Spring/React idioms. Russian comments/docs in requirements/sdd_ru/ (SDD specs).
- **Security**: JWT auth (backend spring-boot-starter-security, validate in controllers; frontend localStorage token). No public CORS (internal network). Secrets in .env (never hardcode TELEGRAM_BOT_TOKEN). Custom exceptions (UserNotFoundException → @ControllerAdvice).
- **Error Handling**: Backend: Global @ControllerAdvice for exceptions (e.g., 404 UserNotFound). Frontend: Try-catch with toast.error (react-toastify).
- **Migrations/Seed**: Flyway V__*.sql in backend (e.g., V1__initial_schema.sql for users/lessons tables). Run `mvn flyway:migrate` or auto on startup (ddl-auto=validate in prod).
- **Cross-Service Comm**: Backend orchestrates via DB (JPA) or HTTP (RestTemplate to email:8081/telegram:8082). No MQ; REST for notifications (see notification-fixes-summary.md).
- **Configs**: Spring profiles (dev/prod in application-*.yml, override .env). Frontend: VITE_* env (VITE_API_URL in vite.config.ts). Nginx.conf: SPA try_files $uri /index.html.
- **AI-Specific**: From AGENT.md (Russian): Docker Compose v2 priority, root VPS access for diagnostics, camelCase in TS/Prisma. Quality focus, complete subtasks. Reference SDD_ru/ for specs (Russian: architecture, DB schema, roles, API endpoints).

Examples: Backend UserService.java (findByEmail with @Transactional); Frontend Login.tsx (axios.post('/api/auth/login', {email, password})); Deploy: scripts/deploy-and-restart.sh (backup → cp jar → systemctl restart). Keep changes minimal, validate with mvn test/npm test.