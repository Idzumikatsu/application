# CRM System for Online English School

This is a CRM system for an online English school that replaces existing Excel-based processes with a modern web application.

## Features Implemented

### User Management and Authentication
- User roles: Administrator, Manager, Teacher
- JWT-based authentication
- Role-based authorization
- REST API for user management

### Technical Stack
- Spring Boot (Java)
- PostgreSQL database
- JWT for authentication
- Maven for build management

## Project Structure

```
crm-system/
├── src/
│   ├── main/
│   │   ├── java/com/crm/system/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── model/
│   │   │   ├── security/
│   │   │   ├── dto/
│   │   │   └── CrmSystemApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/crm/system/
└── pom.xml
```

## Documentation

The project includes full SDD (Software Design Document) documentation in Russian:
- Technical architecture
- Database schema
- User roles and permissions
- API endpoints specification
- UI/UX wireframes
- Deployment and DevOps setup
- Testing strategy
- Development roadmap
- Notification integration
- Security and data protection

## Next Steps

The next phase of development will include:
1. Student management functionality
2. Lesson packages and scheduling
3. Teacher availability management
4. Telegram bot integration