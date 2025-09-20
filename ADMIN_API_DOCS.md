# Admin API Documentation

## Base URL
All endpoints under `/api/admin`

## Authentication
JWT token with ADMIN role required.

## Dashboard Endpoints

### GET /api/admin/dashboard/stats
Returns comprehensive system statistics.

### GET /api/admin/dashboard/students-ending-soon
Lists students with expiring packages.

## User Management

### Managers
- GET /api/admin/managers - List managers
- POST /api/admin/managers - Create manager
- PUT /api/admin/managers/{id} - Update manager
- DELETE /api/admin/managers/{id} - Delete manager
- POST /api/admin/managers/{id}/reset-password - Reset password

### Teachers
- GET /api/admin/teachers - List teachers
- POST /api/admin/teachers - Create teacher
- PUT /api/admin/teachers/{id} - Update teacher
- DELETE /api/admin/teachers/{id} - Delete teacher
- POST /api/admin/teachers/{id}/reset-password - Reset password

### Students
- GET /api/admin/students - List students (with pagination/search)
- POST /api/admin/students - Create student
- PUT /api/admin/students/{id} - Update student
- DELETE /api/admin/students/{id} - Delete student
- POST /api/admin/students/{id}/reset-password - Reset password
- POST /api/admin/students/{studentId}/assign-teacher/{teacherId} - Assign teacher
- DELETE /api/admin/students/{studentId}/unassign-teacher - Unassign teacher
- GET /api/admin/students/{id}/lesson-packages - View packages

## Lesson Management

- GET /api/admin/lessons - List lessons
- POST /api/admin/lessons - Create lesson
- PUT /api/admin/lessons/{id} - Update lesson
- DELETE /api/admin/lessons/{id} - Delete lesson
- GET /api/admin/lessons/{id} - Get lesson details

## Reports

- GET /api/admin/reports/students - Export students
- GET /api/admin/reports/teachers - Export teachers
- GET /api/admin/reports/lessons - Export lessons

Returns Excel files.

## System Settings

- GET /api/admin/system-settings - List settings
- POST /api/admin/system-settings - Create setting
- PUT /api/admin/system-settings/{id} - Update setting
- DELETE /api/admin/system-settings/{id} - Delete setting

## Notifications

- POST /api/admin/broadcast-notifications - Send broadcast
- POST /api/admin/bulk-emails - Send bulk emails

## Security and Validation
All endpoints secured with role-based access. Input validation with @Valid.

## Error Handling
Standard HTTP status codes with JSON error messages.