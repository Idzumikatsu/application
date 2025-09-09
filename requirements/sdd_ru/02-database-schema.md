# Проектирование схемы базы данных

## Основные сущности

### 1. Пользователи
```sql
users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    telegram_username VARCHAR(100),
    telegram_chat_id BIGINT,
    role VARCHAR(20) NOT NULL, -- ADMIN, MANAGER, TEACHER
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 2. Студенты
```sql
students (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    telegram_username VARCHAR(100),
    telegram_chat_id BIGINT,
    date_of_birth DATE,
    assigned_teacher_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 3. Слоты доступности преподавателей
```sql
availability_slots (
    id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT NOT NULL REFERENCES users(id),
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL, -- Время начала (1-часовые слоты)
    is_booked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 4. Пакеты уроков
```sql
lesson_packages (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    total_lessons INTEGER NOT NULL,
    remaining_lessons INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 5. Уроки
```sql
lessons (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    teacher_id BIGINT NOT NULL REFERENCES users(id),
    slot_id BIGINT REFERENCES availability_slots(id),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(20) NOT NULL, -- SCHEDULED, COMPLETED, CANCELLED, MISSED
    cancellation_reason TEXT,
    cancelled_by VARCHAR(20), -- STUDENT, TEACHER, MANAGER
    notes TEXT,
    confirmed_by_teacher BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 6. Заметки преподавателя
```sql
teacher_notes (
    id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT NOT NULL REFERENCES users(id),
    student_id BIGINT NOT NULL REFERENCES students(id),
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 7. Логи электронной почты
```sql
email_logs (
    id BIGSERIAL PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(20) NOT NULL, -- STUDENT, TEACHER, MANAGER
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'SENT' -- SENT, FAILED
)
```

### 8. Логи уведомлений
```sql
notification_logs (
    id BIGSERIAL PRIMARY KEY,
    recipient_type VARCHAR(20) NOT NULL, -- STUDENT, TEACHER
    recipient_id BIGINT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- LESSON_SCHEDULED, LESSON_CANCELLED, etc.
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'SENT' -- SENT, FAILED
)
```

## Ключевые связи
1. Пользователи (ADMIN/MANAGER/TEACHER) ↔ Студенты (через assigned_teacher_id)
2. Пользователи (TEACHER) ↔ Слоты доступности (через teacher_id)
3. Студенты ↔ Пакеты уроков (через student_id)
4. Студенты ↔ Уроки (через student_id)
5. Пользователи (TEACHER) ↔ Уроки (через teacher_id)
6. Слоты доступности ↔ Уроки (через slot_id)
7. Пользователи (TEACHER) ↔ Студенты ↔ Заметки преподавателя (многие ко многим через teacher_notes)