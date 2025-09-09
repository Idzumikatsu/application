# QWEN.md - Project Context for CRM System

## Project Overview

This is a CRM system for an online English school that replaces existing Excel-based processes with a modern web application. The system is built using Java Spring Boot with PostgreSQL database and provides functionality for user management, teacher availability scheduling, lesson planning, and student package management.

## Technology Stack

### Backend
- **Framework**: Spring Boot (Java)
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Build Tool**: Maven

### Frontend
- **Framework**: React.js with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Build Tool**: npm/yarn

### Infrastructure
- **Reverse Proxy**: Nginx
- **Process Manager**: PM2 (for Node.js Telegram bot)
- **Service Management**: systemd (for Spring Boot applications)

## Project Structure

```
/opt/application/
├── crm-system/                # Main Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/crm/system/
│   │   │   │   ├── controller/     # REST API controllers
│   │   │   │   ├── service/        # Business logic services
│   │   │   │   ├── repository/     # Data access repositories
│   │   │   │   ├── model/          # JPA entities
│   │   │   │   ├── dto/            # Data transfer objects
│   │   │   │   ├── security/       # Authentication and authorization
│   │   │   │   └── telegram/       # Telegram bot integration
│   │   │   └── resources/
│   │   └── test/                  # Unit and integration tests
│   └── pom.xml                    # Maven configuration
└── requirements/                 # Documentation (SDD in Russian)
    └── sdd_ru/
```

## Core Functionality

### User Roles
1. **Administrator**: Full system access, manages managers
2. **Manager**: Operational level access, manages students, teachers, and lessons
3. **Teacher**: Access to own schedule and assigned students
4. **Student**: Minimal access through Telegram bot only

### Key Features

#### Teacher Availability Management
- Teachers can create/delete their availability slots (1-hour time slots)
- Slots have three statuses: AVAILABLE, BOOKED, BLOCKED
- Teachers can only modify free slots without booked lessons

#### Lesson Management
- Managers schedule lessons for students in teacher availability slots
- Four lesson statuses: SCHEDULED, COMPLETED, CANCELLED, MISSED
- Cancellation rules:
  - >8 hours before lesson: Free cancellation, slot becomes available
  - <8 hours before lesson: Lesson marked as MISSED, student loses lesson, teacher gets paid
- Teachers can confirm lesson completion through Telegram bot

#### Student Package Management
- Students have lesson packages with total and remaining lessons
- Lessons deducted when marked COMPLETED or MISSED
- System notifies managers when student has ≤3 lessons remaining

#### Calendar System
- Calendar view for teachers showing availability slots and lessons
- Calendar view for students showing their scheduled lessons
- Color-coded slots based on status (available/booked/blocked)

#### Notification System
- **Telegram Bot**: Primary notification channel for students and teachers
- **Email**: Used for initial account setup and Telegram bot connection
- **In-app notifications**: System notifications for web interface users
- Automated notifications for:
  - Lesson scheduling/reminders (24 hours and 1 hour before)
  - Lesson cancellations
  - Package ending soon (≤3 lessons remaining)
  - Lesson completion confirmation

## API Endpoints (Key Routes)

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration (admin only)

### Teacher Availability
- `GET /api/teachers/{teacherId}/availability` - Get teacher availability slots
- `POST /api/teachers/availability` - Create availability slot
- `DELETE /api/availability-slots/{id}` - Delete availability slot

### Lesson Management
- `GET /api/teachers/{teacherId}/lessons` - Get teacher's lessons
- `GET /api/students/{studentId}/lessons` - Get student's lessons
- `POST /api/lessons` - Create lesson
- `POST /api/lessons/{id}/complete` - Mark lesson as completed
- `POST /api/lessons/{id}/cancel` - Cancel lesson
- `POST /api/lessons/{id}/mark-as-missed` - Mark lesson as missed

### Student Management
- `GET /api/managers/students` - Get all students (manager)
- `POST /api/managers/students` - Create student (manager)
- `POST /api/managers/students/{id}/lesson-packages` - Add lesson package to student

### Calendar Views
- `GET /api/teachers/{teacherId}/calendar` - Get teacher calendar
- `GET /api/students/{studentId}/calendar` - Get student calendar

### Notifications
- `GET /api/notifications/recipients/{recipientId}/{recipientType}` - Get user notifications
- `POST /api/notifications/{id}/mark-as-read` - Mark notification as read

## Database Schema (Key Entities)

### Users
- Stores administrators, managers, and teachers
- Fields: id, email, password_hash, first_name, last_name, phone, telegram_username, telegram_chat_id, role, is_active

### Students
- Stores student information
- Fields: id, first_name, last_name, email, phone, telegram_username, telegram_chat_id, date_of_birth, assigned_teacher_id

### Availability Slots
- Teacher availability time slots
- Fields: id, teacher_id, slot_date, slot_time, duration_minutes, is_booked, status

### Lessons
- Scheduled lessons between students and teachers
- Fields: id, student_id, teacher_id, slot_id, scheduled_date, scheduled_time, duration_minutes, status, cancellation_reason, cancelled_by, notes, confirmed_by_teacher

### Lesson Packages
- Student lesson packages
- Fields: id, student_id, total_lessons, remaining_lessons

### Notifications
- System notifications for users
- Fields: id, recipient_id, recipient_type, notification_type, title, message, status, sent_at, read_at, related_entity_id, priority

## Development Guidelines

### Code Structure
1. **Controllers**: Handle HTTP requests, validate input, call services
2. **Services**: Implement business logic, transaction management
3. **Repositories**: Data access layer using Spring Data JPA
4. **DTOs**: Data transfer objects for API requests/responses
5. **Models**: JPA entities representing database tables

### Security
- JWT-based authentication with role-based access control
- All endpoints secured with @PreAuthorize annotations
- Password hashing with BCrypt
- Method-level security for fine-grained access control

### Testing
- Unit tests for services using JUnit 5 and Mockito
- Integration tests for API endpoints
- Repository tests with real database connections

### Error Handling
- Global exception handler for consistent error responses
- Custom exceptions for business logic errors
- Proper HTTP status codes for different error scenarios

## Deployment Architecture

### Production Environment
- **Load Balancer**: Nginx reverse proxy
- **Application Server**: Multiple Spring Boot instances
- **Database**: PostgreSQL with replication
- **Cache**: Redis for session storage
- **Bot Server**: Node.js application for Telegram bot
- **File Storage**: Local storage for exported reports

### DevOps
- **CI/CD**: GitHub Actions for automated builds
- **Configuration Management**: Ansible scripts
- **Monitoring**: Basic logging with log rotation
- **Backup**: Automated daily database backups

## Future Development Plans

1. **Student Dashboard**: Web interface for students (currently Telegram only)
2. **Group Lessons**: Functionality for group classes
3. **Advanced Reporting**: Enhanced analytics and reporting features
4. **Feedback System**: Lesson evaluation and feedback mechanism

## Common Development Tasks

### Adding a New API Endpoint
1. Create/update DTO for request/response data
2. Add method to appropriate repository if needed
3. Implement business logic in service class
4. Create controller endpoint with proper security annotations
5. Add unit tests for service methods
6. Add integration tests for API endpoint

### Adding a New Database Entity
1. Create JPA entity class in model package
2. Create repository interface extending JpaRepository
3. Create/update service class to handle business logic
4. Create/update DTOs for data transfer
5. Create/update controller endpoints
6. Update database schema documentation

### Adding a New Notification Type
1. Add new enum value to NotificationType in Notification model
2. Add new notification sending method in NotificationService
3. Add new notification template in TelegramNotificationService
4. Update notification processing in NotificationBroadcastService
5. Add new notification handling in Telegram bot (separate Node.js service)

## Useful Commands

### Backend Development
- `mvn spring-boot:run` - Run Spring Boot application
- `mvn test` - Run all tests
- `mvn clean install` - Build project

### Frontend Development
- `npm start` - Run development server
- `npm test` - Run tests
- `npm run build` - Build production version

### Database Management
- Database connection: PostgreSQL on localhost:5432
- Default database name: crm_system
- Default credentials: postgres/postgres

### Telegram Bot
- Separate Node.js service
- Managed with PM2 in production
- Communicates with main application via REST API