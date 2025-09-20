# CRM Synergy System - Comprehensive Overview (Updated 2025-09-20)

## Project Summary

CRM Synergy is a full-featured CRM system for an online English school. Multi-role system: admin, manager, teacher, student. Dashboards and functions adapted to roles. Core features implemented, e2e tests in frontend (Playwright), but unit/integration tests missing (tests folder empty - needs implementation).

## System Architecture

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- MUI for UI
- Redux Toolkit (state)
- React Router (navigation)
- Axios (API)
- Vite (build)
- Playwright (e2e tests)

**Backend:**
- Spring Boot 3.3.0 (Java 17)
- PostgreSQL (DB)
- Spring Security + JWT
- Spring Data JPA
- Maven

**Infrastructure:**
- Docker + Compose v2
- Traefik (proxy/SSL)
- Nginx (frontend assets)
- Microservices: email, telegram

### Container Structure
1. Traefik
2. PostgreSQL
3. Backend (crm-system)
4. Frontend (Nginx)
5. Email Service
6. Telegram Service

## Key Features

### Admin
- User management
- Monitoring/stats
- Reporting
- Settings
- Notifications
- Scheduling

### Manager
- Teacher/student mgmt
- Packages
- Coordination
- Performance

### Teacher
- Dashboard/schedule
- Progress tracking
- Lessons
- Availability
- Groups

### Student
- Dashboard
- Schedule/packages
- Groups
- Notifications

## Development Setup

### Prerequisites
- Docker/Compose v2
- Node 18+
- Java 17
- Maven

### Quick Start
1. git clone <url>; cd application
2. .env: POSTGRES_USER/PASSWORD, JWT_SECRET
3. ./quick-deploy.sh (dev) or ./deploy.sh (full)
4. Access: https://app.crm-synergy.ru/ (frontend), https://traefik.crm-synergy.ru/ (dashboard)

## Project Structure

Root: /opt/application/
├── crm-system/ (backend src/pom.xml)
├── frontend/ (src/public/package.json/vite.config.ts/playwright.config.ts)
├── email-service/ (src/pom.xml)
├── telegram-service/ (src/pom.xml)
├── traefik/ (traefik.yml)
├── scripts/ (.sh: deploy-production.sh, database-migrate.sh etc.)
├── docs/ (.md: integration, migrations)
├── tests/ (empty - needs implementation)
├── docker-compose.yml
├── nginx.conf
└── .env

Frontend src: components/pages/routes/services/store/theme/types/utils
Backend src/main/java/com/crm/system/: controller/service/repository/model/dto/security/config/exception

## Development Guidelines

### Frontend
- TS everywhere
- MUI responsive
- Redux Toolkit
- Vitest (unit, not implemented)
- ESLint

### Backend
- REST best practices
- @ annotations DI
- Exceptions/DTOs
- JUnit (not implemented)
- Java conventions

### Testing
- Unit: Vitest/JUnit
- Integration: RTL/SpringBootTest
- E2E: Playwright (config exists)
- Coverage: Istanbul

## Deployment Process

### CI
- Push -> tests -> build images -> deploy webhook

### Production
- Pull -> tests -> build -> zero-downtime -> health checks

### Monitoring
- Health checks
- Logs
- Perf/backup/security

## Key Scripts

Dev:
- npm run dev/build/test/test:e2e

Deploy:
- ./deploy.sh (full)
- ./quick-deploy.sh (dev)
- docker compose up/down -d

DB:
- Flyway/Liquibase
- scripts/database-migrate.sh

## Security

Auth: JWT/refresh, RBAC, bcrypt, 2FA support
Authz: @PreAuthorize, URL/session, audit
Data: HTTPS, DB encrypt, validation, CORS/CSRF

## Troubleshooting

Frontend styles: cache/nginx/permissions
Backend conn: DB/env/Docker net
Auth: JWT/user/security

Tools:
- docker compose logs/ps
- curl actuator/health
- psql exec

## Test Credentials

Admin: admin@englishschool.com / admin123
Manager: manager@englishschool.com / manager123
Teachers: john.smith@englishschool.com / teacher123, sarah.johnson@englishschool.com / teacher123

## Future Enhancements

1. Analytics: ML prediction, dashboards, real-time
2. Integrations: payments, calendars, LMS
3. Mobile: native/PWA/offline
4. AI: content gen, matching, chatbot

## Support
- /docs
- Swagger API
- Code comments
- Service READMEs

## General Notes
I am a software developer (female). Smart, attentive, no loops. Perform tasks qualitatively, test. Communicate only in Russian. Project on VPS Ubuntu 22, Docker v2, root access.