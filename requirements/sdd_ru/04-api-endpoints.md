# Спецификация конечных точек API

## Конечные точки аутентификации
```
POST /api/auth/login
- Запрос: { email, password }
- Ответ: { token, user: { id, firstName, lastName, role } }

POST /api/auth/logout
- Запрос: { token }
- Ответ: { message: "Выход из системы выполнен успешно" }
```

## Управление пользователями (только администратор)
```
GET /api/admin/managers
- Ответ: [ { id, firstName, lastName, email, isActive } ]

POST /api/admin/managers
- Запрос: { firstName, lastName, email, password }
- Ответ: { id, firstName, lastName, email, isActive }

PUT /api/admin/managers/{id}
- Запрос: { firstName, lastName, email, isActive }
- Ответ: Обновленный объект менеджера

DELETE /api/admin/managers/{id}
- Ответ: { message: "Менеджер успешно удален" }

POST /api/admin/managers/{id}/reset-password
- Ответ: { message: "Письмо для сброса пароля отправлено" }

GET /api/admin/teachers
- Ответ: [ { id, firstName, lastName, email, isActive, specialization } ]

POST /api/admin/teachers
- Запрос: { firstName, lastName, email, password, phone, specialization }
- Ответ: { id, firstName, lastName, email, isActive, specialization }

PUT /api/admin/teachers/{id}
- Запрос: { firstName, lastName, email, isActive, phone, specialization }
- Ответ: Обновленный объект преподавателя

DELETE /api/admin/teachers/{id}
- Ответ: { message: "Преподаватель успешно удален" }

POST /api/admin/teachers/{id}/reset-password
- Ответ: { message: "Письмо для сброса пароля отправлено" }
```

## Управление студентами (менеджер)
```
GET /api/managers/students
- Параметры запроса: page, size, search
- Ответ: { content: [объекты студентов], totalPages, totalElements }

POST /api/managers/students
- Запрос: { firstName, lastName, email, phone, telegramUsername, dateOfBirth }
- Ответ: Созданный объект студента

GET /api/managers/students/{id}
- Ответ: Детализированный объект студента с назначенным преподавателем

PUT /api/managers/students/{id}
- Запрос: { firstName, lastName, email, phone, telegramUsername, dateOfBirth }
- Ответ: Обновленный объект студента

DELETE /api/managers/students/{id}
- Ответ: { message: "Студент успешно удален" }

POST /api/managers/students/{id}/assign-teacher
- Запрос: { teacherId }
- Ответ: { message: "Преподаватель успешно назначен" }

POST /api/managers/students/{id}/lesson-packages
- Запрос: { totalLessons }
- Ответ: Созданный объект пакета уроков

GET /api/managers/students/{id}/lesson-packages
- Ответ: [ объекты пакетов уроков ]
```

## Управление преподавателями (менеджер)
```
GET /api/managers/teachers
- Ответ: [ { id, firstName, lastName, specialization, availability } ]

GET /api/managers/teachers/{id}/calendar
- Параметры запроса: startDate, endDate
- Ответ: { информация о преподавателе, слоты доступности, запланированные уроки }
```

## Управление доступностью (преподаватель)
```
GET /api/teachers/availability
- Параметры запроса: startDate, endDate
- Ответ: [ объекты слотов доступности ]

POST /api/teachers/availability
- Запрос: { date, time }
- Ответ: Созданный слот доступности

DELETE /api/teachers/availability/{id}
- Ответ: { message: "Слот успешно удален" }

GET /api/teachers/scheduled-lessons
- Параметры запроса: startDate, endDate
- Ответ: [ объекты уроков с деталями студентов ]

POST /api/teachers/lessons/{id}/confirm
- Ответ: { message: "Урок подтвержден" }

POST /api/teachers/lessons/{id}/request-reschedule
- Запрос: { reason }
- Ответ: { message: "Запрос на перенос отправлен" }

GET /api/teachers/students
- Ответ: [ объекты студентов с количеством уроков ]

POST /api/teachers/students/{id}/notes
- Запрос: { note }
- Ответ: Созданный объект заметки

GET /api/teachers/students/{id}/notes
- Ответ: [ объекты заметок ]
```

## Управление уроками (менеджер)
```
POST /api/managers/lessons
- Запрос: { studentId, teacherId, date, time }
- Ответ: Созданный объект урока

PUT /api/managers/lessons/{id}
- Запрос: { date, time }
- Ответ: Обновленный объект урока

DELETE /api/managers/lessons/{id}
- Запрос: { cancellationReason, cancelledBy }
- Ответ: { message: "Урок отменен" }

POST /api/managers/lessons/{id}/status
- Запрос: { status, notes }
- Ответ: Обновленный объект урока
```

## Отчетность и информационные панели (менеджер/администратор)
```
GET /api/dashboard/stats
- Ответ: { activeStudents, activeTeachers, lessonsToday, lessonsThisWeek }

GET /api/dashboard/students-ending-soon
- Ответ: [ объекты студентов с оставшимися уроками <= 3 ]

GET /api/reports/students
- Параметры запроса: format (xlsx), startDate, endDate
- Ответ: Файл Excel

GET /api/reports/teachers
- Параметры запроса: format (xlsx), startDate, endDate
- Ответ: Файл Excel

GET /api/reports/lessons
- Параметры запроса: format (xlsx), startDate, endDate
- Ответ: Файл Excel
```