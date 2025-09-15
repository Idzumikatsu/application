# Database Migrations with Flyway

## Overview

This document describes the database migration system implemented using Flyway for the CRM System. Migrations provide version control for database schema changes and ensure consistent database structure across different environments.

## Migration Files Structure

Migrations are located in `src/main/resources/db/migration/` and follow Flyway's naming convention:

- `V1__initial_schema.sql` - Creates the initial database schema
- `V2__seed_data.sql` - Inserts initial seed data including admin user

## Available Migrations

### V1__initial_schema.sql
Creates the complete database schema including:

- **Tables**: users, students, availability_slots, lessons, lesson_packages, group_lessons, group_lesson_registrations, notifications, telegram_bots, telegram_messages
- **Enum Types**: user_role, lesson_status, cancelled_by, slot_status, recipient_type, notification_type, notification_status, group_lesson_status, registration_status, message_type, delivery_status
- **Indexes**: Performance optimization indexes on frequently queried columns
- **Foreign Keys**: Proper relationship constraints between tables
- **Comments**: Table and column documentation

### V2__seed_data.sql
Inserts initial data including:

- **Admin User**: admin@englishschool.com (password: admin123)
- **Manager User**: manager@englishschool.com (password: manager123)
- **Teacher Users**: John Smith and Sarah Johnson (password: teacher123)
- **Sample Students**: Alice Brown, Bob Wilson, Carol Davis
- **Lesson Packages**: Sample packages for each student
- **Availability Slots**: Sample available time slots for teachers
- **Scheduled Lessons**: Sample booked lessons
- **Group Lessons**: Sample group lesson offerings
- **Notifications**: Sample system notifications
- **Telegram Bot**: Placeholder bot configuration

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@englishschool.com | admin123 |
| Manager | manager@englishschool.com | manager123 |
| Teacher | john.smith@englishschool.com | teacher123 |
| Teacher | sarah.johnson@englishschool.com | teacher123 |

**Note**: All passwords are hashed using bcrypt with strength 10.

## Flyway Configuration

Flyway is configured in `pom.xml` as a dependency:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

Hibernate auto-DDL generation has been disabled in `application.properties`:

```properties
spring.jpa.hibernate.ddl-auto=none
```

## Running Migrations

### Automatic Execution
Flyway migrations run automatically when the Spring Boot application starts. Flyway checks the database schema version and applies any pending migrations.

### Manual Execution
You can also run Flyway manually using Maven:

```bash
mvn flyway:migrate
```

### Checking Migration Status
To check the current migration status:

```bash
mvn flyway:info
```

### Repairing Migrations
If migrations get corrupted, you can repair them:

```bash
mvn flyway:repair
```

## Creating New Migrations

### Naming Convention
New migration files should follow the pattern: `V<version>__<description>.sql`

Example: `V3__add_new_feature.sql`

### Version Numbers
- Use sequential version numbers (V1, V2, V3, etc.)
- Each migration should be idempotent (can be run multiple times without issues)
- Include both schema changes and data migrations as needed

### Best Practices
1. **Test migrations** in a development environment before deploying to production
2. **Backup database** before running migrations in production
3. **Use transactions** for data migrations when possible
4. **Document changes** in migration files with comments
5. **Keep migrations small** and focused on single changes

## Database Schema Overview

The CRM System database consists of the following main tables:

1. **users** - System users (admins, managers, teachers)
2. **students** - Student information and profiles
3. **availability_slots** - Teacher availability time slots
4. **lessons** - Individual lesson bookings
5. **lesson_packages** - Student lesson packages/purchases
6. **group_lessons** - Group lesson offerings
7. **group_lesson_registrations** - Student registrations for group lessons
8. **notifications** - System notifications
9. **telegram_bots** - Telegram bot configurations
10. **telegram_messages** - Telegram message history

## Troubleshooting

### Common Issues

1. **Migration failures**: Check Flyway logs for specific SQL errors
2. **Version conflicts**: Use `flyway:repair` to fix migration history
3. **Database permissions**: Ensure database user has necessary privileges
4. **Connection issues**: Verify database connection settings in application.properties

### Rollback Strategy

Flyway doesn't support automatic rollbacks. For problematic migrations:

1. Create a new migration to fix the issue
2. Manually revert changes if necessary
3. Use database backups for critical recovery

## Environment-Specific Considerations

### Development
- Migrations run automatically on application startup
- Use H2 or local PostgreSQL for testing

### Production
- Always backup database before migrations
- Test migrations in staging environment first
- Monitor migration execution carefully

## Additional Resources

- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Spring Boot Flyway Integration](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto.data-initialization.migration-tool.flyway)
- [Database Migration Best Practices](https://flywaydb.org/documentation/concepts/migrations#best-practices)