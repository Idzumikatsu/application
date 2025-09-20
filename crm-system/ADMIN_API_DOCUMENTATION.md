# Admin API Endpoints Documentation

## Base URL
`/api/admin`

## Authentication
All endpoints require a valid JWT token with ADMIN role.

## Dashboard Endpoints

### Get Admin Dashboard Statistics
```
GET /api/admin/dashboard/stats
```
**Response:**
```json
{
  "totalStudents": 150,
  "totalTeachers": 12,
  "totalManagers": 5,
  "totalAdmins": 3,
  "activeStudents": 142,
  "activeTeachers": 10,
  "activeManagers": 5,
  "activeAdmins": 3,
  "lessonsToday": 25,
  "lessonsThisWeek": 120,
  "lessonsThisMonth": 480,
  "totalCompletedLessons": 1250,
  "totalCancelledLessons": 45,
  "totalMissedLessons": 23,
  "totalScheduledLessons": 520,
  "totalLessonPackages": 180,
  "activeLessonPackages": 165,
  "expiredLessonPackages": 15,
  "lessonCompletionRate": 85.2,
  "lessonCancellationRate": 3.1,
  "studentsWithoutTeacher": 8,
  "pendingNotifications": 12,
  "failedNotifications": 2,
  "studentsEndingSoon": [
    {
      "studentId": 101,
      "studentName": "John Doe",
      "teacherName": "Jane Smith",
      "remainingLessons": 2,
      "totalLessons": 20,
      "packageEndDate": "2025-10-15"
    }
  ],
  "lastUpdated": "2025-09-19T14:30:00"
}
```

### Get Students with Ending Packages
```
GET /api/admin/dashboard/students-ending-soon
```
**Response:**
```json
[
  {
    "studentId": 101,
    "studentName": "John Doe",
    "teacherName": "Jane Smith",
    "remainingLessons": 2,
    "totalLessons": 20,
    "packageEndDate": "2025-10-15"
  }
]
```

## Manager Management Endpoints

### Get All Managers
```
GET /api/admin/managers
```

### Create Manager
```
POST /api/admin/managers
```
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Manager",
  "email": "john.manager@example.com",
  "phone": "+1234567890",
  "telegramUsername": "johnmanager"
}
```

### Update Manager
```
PUT /api/admin/managers/{id}
```
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Manager",
  "email": "john.manager@example.com",
  "phone": "+1234567890",
  "telegramUsername": "johnmanager",
  "isActive": true
}
```

### Delete Manager
```
DELETE /api/admin/managers/{id}
```

### Reset Manager Password
```
POST /api/admin/managers/{id}/reset-password
```

## Teacher Management Endpoints

### Get All Teachers
```
GET /api/admin/teachers
```

### Create Teacher
```
POST /api/admin/teachers
```
**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Teacher",
  "email": "jane.teacher@example.com",
  "phone": "+1234567890",
  "telegramUsername": "janeteacher"
}
```

### Update Teacher
```
PUT /api/admin/teachers/{id}
```
**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Teacher",
  "email": "jane.teacher@example.com",
  "phone": "+1234567890",
  "telegramUsername": "janeteacher",
  "isActive": true
}
```

### Delete Teacher
```
DELETE /api/admin/teachers/{id}
```

### Reset Teacher Password
```
POST /api/admin/teachers/{id}/reset-password
```

## Student Management Endpoints

### Get All Students
```
GET /api/admin/students?page=0&size=10&search=John
```

### Get Student by ID
```
GET /api/admin/students/{id}
```

### Create Student
```
POST /api/admin/students
```
**Request Body:**
```json
{
  "firstName": "Alice",
  "lastName": "Student",
  "email": "alice.student@example.com",
  "phone": "+1234567890",
  "telegramUsername": "alicestudent",
  "dateOfBirth": "2000-01-15"
}
```

### Update Student
```
PUT /api/admin/students/{id}
```
**Request Body:**
```json
{
  "firstName": "Alice",
  "lastName": "Student",
  "email": "alice.student@example.com",
  "phone": "+1234567890",
  "telegramUsername": "alicestudent",
  "dateOfBirth": "2000-01-15"
}
```

### Delete Student
```
DELETE /api/admin/students/{id}
```

### Reset Student Password
```
POST /api/admin/students/{id}/reset-password
```

### Assign Teacher to Student
```
POST /api/admin/students/{studentId}/assign-teacher/{teacherId}
```

### Unassign Teacher from Student
```
DELETE /api/admin/students/{studentId}/unassign-teacher
```

## Lesson Management Endpoints

### Get All Lessons
```
GET /api/admin/lessons?page=0&size=10&search=John
```

### Get Lesson by ID
```
GET /api/admin/lessons/{id}
```

### Create Lesson
```
POST /api/admin/lessons
```
**Request Body:**
```json
{
  "studentId": 101,
  "teacherId": 201,
  "scheduledDate": "2025-09-25",
  "scheduledTime": "10:00:00",
  "durationMinutes": 60,
  "notes": "Lesson notes"
}
```

### Update Lesson
```
PUT /api/admin/lessons/{id}
```
**Request Body:**
```json
{
  "studentId": 101,
  "teacherId": 201,
  "scheduledDate": "2025-09-25",
  "scheduledTime": "10:00:00",
  "durationMinutes": 60,
  "status": "SCHEDULED",
  "notes": "Lesson notes",
  "confirmedByTeacher": true
}
```

### Delete Lesson
```
DELETE /api/admin/lessons/{id}
```

## Report Endpoints

### Export Students Report
```
GET /api/admin/reports/students?startDate=2025-09-01T00:00:00&endDate=2025-09-30T23:59:59
```

### Export Teachers Report
```
GET /api/admin/reports/teachers?startDate=2025-09-01T00:00:00&endDate=2025-09-30T23:59:59
```

### Export Lessons Report
```
GET /api/admin/reports/lessons?startDate=2025-09-01T00:00:00&endDate=2025-09-30T23:59:59
```

All report endpoints return Excel files as downloads.