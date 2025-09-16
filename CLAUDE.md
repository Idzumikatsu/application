# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Codebase Overview

This is a CRM system for an online English school built with microservices architecture using Docker containers. The system includes:

- **Backend**: Spring Boot Java application (Java 17)
- **Frontend**: React + TypeScript with Vite
- **Database**: PostgreSQL with Flyway migrations
- **Infrastructure**: Docker Compose with Traefik reverse proxy
- **Additional Services**: Email service and Telegram bot service

## Development Commands

### Backend (Spring Boot)
```bash
# Run locally with Maven
cd crm-system
mvn spring-boot:run

# Run tests
mvn test

# Run integration tests
mvn failsafe:integration-test

# Build native executable
mvn -Pnative native:compile

# Code coverage report
mvn jacoco:report
```

### Frontend (React + TypeScript)
```bash
# Run development server
cd frontend
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Code coverage
npm run test:coverage
```

### Docker Deployment
```bash
# Start all services
docker-compose up -d

# Build and deploy to production
./scripts/deploy-production.sh

# View logs
docker-compose logs -f

# Run database migrations
docker-compose exec backend ./mvnw flyway:migrate
```

## Architecture Key Points

- **Authentication**: JWT-based authentication with Spring Security
- **Database**: PostgreSQL with entity relationships for users, packages, lessons, bookings
- **API Structure**: RESTful endpoints with role-based authorization
- **Frontend State**: Redux Toolkit for state management, React Query for data fetching
- **Notifications**: Email service and Telegram bot integration
- **Monitoring**: Spring Boot Actuator endpoints for health checks

## Common Development Patterns

- Backend uses Lombok to reduce boilerplate code
- Frontend uses Material-UI components with Emotion styling
- Database migrations managed through Flyway
- Testing includes unit tests, integration tests, and E2E Playwright tests
- Docker multi-stage builds for optimized container images

## Important Files & Locations

- `docker-compose.yml` - Main deployment configuration
- `crm-system/pom.xml` - Backend Maven configuration
- `frontend/package.json` - Frontend npm configuration
- `traefik/` - Reverse proxy configuration
- `scripts/` - Deployment and utility scripts
- `requirements/sdd_ru/` - Technical documentation in Russian