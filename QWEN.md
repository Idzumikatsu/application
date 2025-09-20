# CRM Synergy System - Comprehensive Overview

## Project Summary

CRM Synergy is a comprehensive Customer Relationship Management system designed for an online English school. The system provides role-based access for administrators, managers, teachers, and students with specialized dashboards and functionalities for each user type.

## System Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Material-UI (MUI) for UI components
- Redux Toolkit for state management
- React Router for navigation
- Axios for HTTP requests
- Vite as build tool

**Backend:**
- Spring Boot 3.3.0 (Java 17)
- PostgreSQL database
- Spring Security with JWT authentication
- Spring Data JPA for database operations
- Maven for dependency management

**Infrastructure:**
- Docker & Docker Compose for containerization
- Traefik as reverse proxy
- Nginx for serving frontend assets
- Microservices architecture with separate services for email and Telegram

### Container Structure

1. **Traefik** - Reverse proxy and SSL termination
2. **PostgreSQL** - Main database
3. **Backend** - Main Spring Boot application
4. **Frontend** - React application with Nginx
5. **Email Service** - Dedicated email microservice
6. **Telegram Service** - Telegram bot integration service

## Key Features

### Administrative Functions
- Full user management (students, teachers, managers)
- System monitoring and dashboard statistics
- Advanced reporting capabilities
- System settings configuration
- Notification broadcasting system
- Lesson scheduling and management

### Manager Functions
- Teacher and student management
- Lesson package administration
- Scheduling coordination
- Performance monitoring

### Teacher Functions
- Personal dashboard with schedule
- Student progress tracking
- Lesson management
- Availability settings
- Group lesson coordination

### Student Functions
- Personal dashboard
- Schedule viewing
- Package tracking
- Group lesson participation
- Notification system

## Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Java 17 (for backend development)
- Maven (for backend builds)

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd application
```

2. **Environment Setup:**
Create a `.env` file with required environment variables:
```
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
```

3. **Development Deployment:**
```bash
# Quick deployment for development
./quick-deploy.sh

# Full deployment with checks
./deploy.sh
```

4. **Access the Application:**
- Frontend: https://app.crm-synergy.ru/
- Traefik Dashboard: https://traefik.crm-synergy.ru/

### Manual Deployment Steps

1. **Build Services:**
```bash
# Build frontend
cd frontend
npm install
npm run build

# Build backend
cd ../crm-system
mvn clean package
```

2. **Start Containers:**
```bash
cd ..
docker compose up -d
```

3. **Monitor Services:**
```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f
```

## Project Structure

### Root Directory
```
/opt/application/
├── crm-system/          # Spring Boot backend
├── frontend/             # React frontend
├── email-service/        # Email microservice
├── telegram-service/     # Telegram bot service
├── traefik/              # Traefik configuration
├── scripts/              # Deployment scripts
├── docs/                 # Documentation
├── requirements/         # System requirements
├── tests/                # Test files
├── docker-compose.yml    # Main orchestration file
├── nginx.conf            # Nginx configuration
└── .env                  # Environment variables
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/            # Page components for each role
│   ├── routes/           # Route definitions
│   ├── services/         # API service clients
│   ├── store/            # Redux store slices
│   ├── theme/            # MUI theme configuration
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Utility functions
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

### Backend Structure
```
crm-system/
├── src/main/java/com/crm/system/
│   ├── controller/       # REST API controllers
│   ├── service/          # Business logic services
│   ├── repository/       # Database repositories
│   ├── model/            # Entity models
│   ├── dto/              # Data Transfer Objects
│   ├── security/          # Authentication and authorization
│   ├── config/           # Configuration classes
│   └── exception/        # Custom exceptions
├── src/main/resources/   # Configuration files
├── pom.xml               # Maven configuration
└── Dockerfile            # Container build instructions
```

## Development Guidelines

### Frontend Development
1. Use TypeScript for type safety
2. Follow Material-UI design principles
3. Implement responsive design for mobile compatibility
4. Use Redux Toolkit for state management
5. Write unit tests with Vitest
6. Use ESLint for code quality

### Backend Development
1. Follow REST API best practices
2. Use Spring Boot annotations for dependency injection
3. Implement proper exception handling
4. Use DTOs for API contracts
5. Write JUnit tests for services
6. Follow Java naming conventions

### Testing
- Unit tests: Vitest/JUnit
- Integration tests: React Testing Library/SpringBootTest
- E2E tests: Playwright
- Coverage reports: Istanbul/Vitest coverage

## Deployment Process

### Continuous Integration
1. Code changes pushed to repository
2. Automated tests run on CI server
3. Docker images built and pushed to registry
4. Deployment triggered via webhook

### Production Deployment
1. Pull latest changes from repository
2. Run full system tests
3. Build Docker images
4. Deploy containers with zero downtime
5. Health checks and monitoring

### Monitoring and Maintenance
- Container health checks
- Log aggregation and analysis
- Performance monitoring
- Automated backups
- Security updates

## Key Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

### Deployment
- `./deploy.sh` - Full deployment with checks
- `./quick-deploy.sh` - Fast deployment for development
- `docker compose up -d` - Start all services
- `docker compose down` - Stop all services

### Database Migration
- Use Flyway for schema migrations
- Liquibase for complex data migrations
- Backup scripts for disaster recovery

## Security Measures

### Authentication
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- Secure password storage with bcrypt
- Two-factor authentication support

### Authorization
- Method-level security with @PreAuthorize
- URL-level access control
- Session management
- Audit trails for sensitive operations

### Data Protection
- HTTPS encryption for all communications
- Database encryption for sensitive data
- Input validation and sanitization
- CORS protection
- CSRF protection

## Troubleshooting

### Common Issues

1. **Frontend Styles Not Loading:**
   - Clear browser cache
   - Check nginx configuration
   - Verify static file permissions

2. **Backend Connection Issues:**
   - Check database connectivity
   - Verify environment variables
   - Review Docker network configuration

3. **Authentication Failures:**
   - Validate JWT secret consistency
   - Check user credentials
   - Review security configuration

### Diagnostic Tools

1. **Container Logs:**
   ```bash
   docker compose logs <service-name>
   ```

2. **Health Checks:**
   ```bash
   docker compose ps
   curl -f http://localhost:8084/actuator/health
   ```

3. **Database Access:**
   ```bash
   docker compose exec postgres psql -U <username> -d <database>
   ```

## Future Enhancements

1. **Advanced Analytics:**
   - Machine learning for student performance prediction
   - Advanced reporting dashboards
   - Real-time metrics visualization

2. **Integration Capabilities:**
   - Payment gateway integration
   - Calendar synchronization (Google/Outlook)
   - Third-party LMS integration

3. **Mobile Applications:**
   - Native mobile apps for iOS/Android
   - Progressive Web App (PWA) support
   - Offline functionality

4. **AI Features:**
   - Automated lesson content generation
   - Intelligent student-teacher matching
   - Chatbot for student support

## Support and Documentation

For detailed documentation on specific modules, refer to:
- Technical documentation in `/docs` directory
- API documentation via Swagger UI
- Code comments in source files
- README files in each service directory