# System Setup and Testing Guide

## Database Migrations

Uses Flyway for schema management.

### Migration Files
- V1__initial_schema.sql: Core tables and enums
- V2__seed_data.sql: Initial users and sample data

### Running Migrations
Automatic on startup. Manual: `mvn flyway:migrate`

### Schema Overview
Tables: users, students, lessons, packages, notifications, etc.

## Notification Broadcast Service

### Features
- Dual delivery (system + Telegram)
- Advanced filtering by role, date, status
- Batch processing with throttling
- Error handling and retries

### Usage
```java
BroadcastResult result = service.broadcastToAllStudents("Title", "Message", type, priority);
```

## Telegram Bot Setup

### Configuration
- Token: TELEGRAM_BOT_TOKEN env var
- Enable: telegram.bot.enabled=true

### Steps
1. Create bot via @BotFather
2. Set token in env
3. Enable in properties

### Security
Never commit tokens; use env vars.

## Testing Plan

### E2E Testing with Playwright

#### Structure
- auth/: Login/logout, role access
- manager/: Dashboard, user management, scheduling
- teacher/: Availability, lessons
- admin/: System management
- integration/: Notifications, calendar

#### Test Data
Uses seed data: admin@englishschool.com/admin123, etc.

#### Running Tests
```bash
npm run test:e2e
```

#### Reports
HTML, JUnit XML, JSON, custom coverage.

### Coverage Goals
- Authentication: 100%
- User management: 90%
- Scheduling: 85%
- Notifications: 80%
- Reports: 75%

## Best Practices
- Test with real data
- Use headless mode in CI
- Monitor test stability
- Update tests with UI changes