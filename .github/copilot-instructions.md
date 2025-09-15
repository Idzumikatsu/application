# Copilot Instructions for CRM Synergy System

## Architecture Overview
This is a microservices-based CRM for an online English school, replacing Excel processes. Key components:

- **Backend** (`crm-system/`): Spring Boot Java 17 app handling core business logic, API endpoints, user management, scheduling. Uses JPA/Hibernate for PostgreSQL persistence. See `src/main/java/com/crm/system/` for controllers/services/entities.
- **Frontend** (`frontend/`): React + TypeScript SPA consuming backend API via HTTP (likely Axios/Fetch). Built with Vite/Next.js patterns; static assets served by Nginx in Docker. Key patterns in `src/components/` and `src/pages/`.
- **Email Service** (`email-service/`): Standalone Spring Boot microservice for sending notifications using Spring Mail + Thymeleaf templates. Integrates via internal API calls from backend.
- **Telegram Service** (`telegram-service/`): Spring Boot service using TelegramBots library for bot interactions (e.g., scheduling alerts). Communicates with backend via shared DB or events.
- **Infrastructure**: Dockerized with `docker-compose.yml` orchestrating Traefik (reverse proxy/SSL), PostgreSQL 15 (with Flyway migrations in `crm-system/src/main/resources/db/migration/`), and all services on `crm-network`. Data flows: User actions (frontend) → API (backend) → DB; notifications trigger email/telegram services asynchronously.

External integrations: JWT auth (jjwt in pom.xml), PostgreSQL (flyway-core), no Redis/RabbitMQ by default but extensible via .env.

## Developer Workflows
- **Local Development**: Run `docker-compose up -d postgres traefik` for DB/proxy, then `mvn spring-boot:run` in `crm-system/` and `npm start` in `frontend/`. Use TestContainers in integration tests (`*IT.java`) for isolated Postgres spins.
- **Build**: Backend: `mvn clean package -DskipTests` produces `target/crm-system-0.0.1-SNAPSHOT.jar`. Frontend: `npm run build` outputs to `dist/` for Nginx serving. Multi-module Maven in pom.xml excludes Lombok at packaging.
- **Deployment**: Production uses `scripts/deploy-and-restart.sh --jar <new.jar> --frontend <build/dir>` on Ubuntu VPS. Handles backups, systemd service restarts (`crm-synergy-backend.service`), Nginx reload. Full stack via `docker-compose up -d --build`. Env vars in `.env` (e.g., `POSTGRES_PASSWORD`, `JWT_SECRET`); Traefik routes by host (e.g., `api.crm-synergy.ru` → backend:8080).
- **Testing**: Backend: `mvn test` (JUnit + Mockito; JaCoCo coverage >80% lines/branches enforced in pom.xml). Integration: Failsafe plugin for `*IT.java`. Frontend: `npm test` (Jest/RTL), `npm run test:e2e` (Playwright in `e2e/` specs; requires running services). CI via `.github/workflows/ci-cd.yml` (assumed from structure). Generate reports: Backend `mvn jacoco:report` → `target/site/jacoco/`, Frontend `npm test -- --coverage`.
- **Debugging**: Health checks via Actuator (`/actuator/health` on each Spring service). Logs: `docker-compose logs -f <service>`. DB access: `docker-compose exec postgres psql -U ${POSTGRES_USER} -d crm_system`. Common fixes in `POSTGRES_CI_FIXES.md` for GitHub Actions Postgres issues.

## Project Conventions & Patterns
- **Naming/Style**: Java: PascalCase classes, camelCase methods/vars (Lombok @Data/@Builder common, e.g., User entity). TS/JS: camelCase vars, PascalCase components (e.g., `UserProfile.tsx`). No snake_case; follow Spring/React idioms.
- **Security**: JWT-based auth in backend (`spring-boot-starter-security`); validate tokens in controllers. No CORS exposed publicly—internal network only. Secrets in .env, never hardcoded (e.g., `TELEGRAM_BOT_TOKEN`).
- **Error Handling**: Custom exceptions in backend (e.g., `UserNotFoundException` → `@ControllerAdvice` global handler). Frontend: Try-catch with toast notifications (assume React-Toastify pattern).
- **Migrations/Seed**: Flyway V__ scripts in `crm-system/src/main/resources/db/migration/` (e.g., V1__initial_schema.sql). Run via `mvn flyway:migrate` or auto on startup (`spring.jpa.hibernate.ddl-auto=validate`).
- **Cross-Service Comm**: Backend orchestrates via DB polling or direct HTTP to email/telegram (ports 8081/8082). No message queue; simple REST for notifications (see `notification-fixes-summary.md` for past issues).
- **Configs**: Spring profiles (`prod` in .env); override via `application-prod.yml`. Frontend env via `VITE_` prefix in builds.
- **AI-Specific from AGENT.md**: Prioritize Docker Compose v2; root access on Ubuntu VPS for diagnostics. Use camelCase in TS/Prisma if extended. Focus on quality, complete subtasks.

Reference: `requirements/sdd_ru/` for detailed specs (Russian); `DEPLOYMENT_GUIDE.md`/`TESTING_GUIDE.md` for ops.