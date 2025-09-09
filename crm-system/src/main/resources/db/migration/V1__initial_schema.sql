-- Initial database schema for CRM System
-- Created by Flyway migration

-- Create enum types first
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'TEACHER', 'STUDENT');
CREATE TYPE lesson_status AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'MISSED');
CREATE TYPE cancelled_by AS ENUM ('STUDENT', 'TEACHER', 'MANAGER');
CREATE TYPE slot_status AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED');
CREATE TYPE recipient_type AS ENUM ('STUDENT', 'TEACHER', 'MANAGER', 'ADMIN');
CREATE TYPE notification_type AS ENUM (
    'LESSON_SCHEDULED',
    'LESSON_CANCELLED',
    'LESSON_REMINDER',
    'LESSON_COMPLETED',
    'GROUP_LESSON_SCHEDULED',
    'GROUP_LESSON_CANCELLED',
    'GROUP_LESSON_REMINDER',
    'PACKAGE_ENDING_SOON',
    'PAYMENT_DUE',
    'SYSTEM_MESSAGE',
    'FEEDBACK_REQUEST'
);
CREATE TYPE notification_status AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');
CREATE TYPE group_lesson_status AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');
CREATE TYPE registration_status AS ENUM ('REGISTERED', 'ATTENDED', 'MISSED', 'CANCELLED');
CREATE TYPE message_type AS ENUM (
    'TEXT',
    'LESSON_SCHEDULED',
    'LESSON_REMINDER',
    'LESSON_CANCELLED',
    'LESSON_CONFIRMATION',
    'GROUP_LESSON_SCHEDULED',
    'GROUP_LESSON_REMINDER',
    'GROUP_LESSON_CANCELLED',
    'SYSTEM_NOTIFICATION',
    'FEEDBACK_REQUEST'
);
CREATE TYPE delivery_status AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- Table: users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    telegram_username VARCHAR(100),
    telegram_chat_id BIGINT,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: students
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    telegram_username VARCHAR(100),
    telegram_chat_id BIGINT,
    date_of_birth DATE,
    assigned_teacher_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assigned_teacher FOREIGN KEY (assigned_teacher_id) REFERENCES users(id)
);

-- Table: availability_slots
CREATE TABLE availability_slots (
    id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    is_booked BOOLEAN DEFAULT FALSE,
    status slot_status DEFAULT 'AVAILABLE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_teacher FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Table: lessons
CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    slot_id BIGINT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status lesson_status DEFAULT 'SCHEDULED',
    cancellation_reason TEXT,
    cancelled_by cancelled_by,
    notes TEXT,
    confirmed_by_teacher BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_teacher FOREIGN KEY (teacher_id) REFERENCES users(id),
    CONSTRAINT fk_slot FOREIGN KEY (slot_id) REFERENCES availability_slots(id)
);

-- Table: lesson_packages
CREATE TABLE lesson_packages (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    total_lessons INTEGER NOT NULL,
    remaining_lessons INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT chk_total_lessons CHECK (total_lessons >= 0),
    CONSTRAINT chk_remaining_lessons CHECK (remaining_lessons >= 0 AND remaining_lessons <= total_lessons)
);

-- Table: group_lessons
CREATE TABLE group_lessons (
    id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    lesson_topic VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    max_students INTEGER,
    current_students INTEGER DEFAULT 0,
    status group_lesson_status DEFAULT 'SCHEDULED',
    description TEXT,
    meeting_link TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_teacher FOREIGN KEY (teacher_id) REFERENCES users(id),
    CONSTRAINT chk_current_students CHECK (current_students >= 0),
    CONSTRAINT chk_max_students CHECK (max_students IS NULL OR max_students >= 0)
);

-- Table: group_lesson_registrations
CREATE TABLE group_lesson_registrations (
    id BIGSERIAL PRIMARY KEY,
    group_lesson_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    registration_status registration_status DEFAULT 'REGISTERED',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN DEFAULT FALSE,
    attendance_confirmed_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_group_lesson FOREIGN KEY (group_lesson_id) REFERENCES group_lessons(id),
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Table: notifications
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    recipient_type recipient_type NOT NULL,
    notification_type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status notification_status DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    related_entity_id BIGINT,
    related_entity_type VARCHAR(100),
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: telegram_bots
CREATE TABLE telegram_bots (
    id BIGSERIAL PRIMARY KEY,
    bot_token VARCHAR(255) NOT NULL,
    bot_username VARCHAR(255) NOT NULL,
    bot_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: telegram_messages
CREATE TABLE telegram_messages (
    id BIGSERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    message_id BIGINT,
    recipient_id BIGINT NOT NULL,
    recipient_type recipient_type NOT NULL,
    message_text TEXT NOT NULL,
    message_type message_type DEFAULT 'TEXT',
    delivery_status delivery_status DEFAULT 'PENDING',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    related_entity_id BIGINT,
    related_entity_type VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_assigned_teacher ON students(assigned_teacher_id);
CREATE INDEX idx_availability_slots_teacher ON availability_slots(teacher_id);
CREATE INDEX idx_availability_slots_date_time ON availability_slots(slot_date, slot_time);
CREATE INDEX idx_lessons_student ON lessons(student_id);
CREATE INDEX idx_lessons_teacher ON lessons(teacher_id);
CREATE INDEX idx_lessons_scheduled_date ON lessons(scheduled_date);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_lesson_packages_student ON lesson_packages(student_id);
CREATE INDEX idx_group_lessons_teacher ON group_lessons(teacher_id);
CREATE INDEX idx_group_lessons_scheduled_date ON group_lessons(scheduled_date);
CREATE INDEX idx_group_lessons_status ON group_lessons(status);
CREATE INDEX idx_group_lesson_registrations_lesson ON group_lesson_registrations(group_lesson_id);
CREATE INDEX idx_group_lesson_registrations_student ON group_lesson_registrations(student_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, recipient_type);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_telegram_messages_recipient ON telegram_messages(recipient_id, recipient_type);
CREATE INDEX idx_telegram_messages_status ON telegram_messages(delivery_status);
CREATE INDEX idx_telegram_messages_chat_id ON telegram_messages(chat_id);

-- Add comments for better documentation
COMMENT ON TABLE users IS 'System users including administrators, managers, and teachers';
COMMENT ON TABLE students IS 'Students of the English school';
COMMENT ON TABLE availability_slots IS 'Availability slots for teachers';
COMMENT ON TABLE lessons IS 'Individual lessons between students and teachers';
COMMENT ON TABLE lesson_packages IS 'Lesson packages purchased by students';
COMMENT ON TABLE group_lessons IS 'Group lessons organized by teachers';
COMMENT ON TABLE group_lesson_registrations IS 'Registrations of students for group lessons';
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE telegram_bots IS 'Telegram bot configurations';
COMMENT ON TABLE telegram_messages IS 'Telegram messages sent to users';