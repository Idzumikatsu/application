-- Seed data for CRM System
-- Default admin user and initial data

-- Insert default admin user (password: admin123 - bcrypt hash)
INSERT INTO users (first_name, last_name, email, password_hash, role, is_active, created_at, updated_at)
VALUES (
    'Admin',
    'User',
    'admin@englishschool.com',
    '$2b$10$ew4OlrgjbXRkKpRyw05K8.3MITbr2YkDKMHY35nSXEoiAKfB3kwLO',
    'ADMIN',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample manager user (password: manager123 - bcrypt hash)
INSERT INTO users (first_name, last_name, email, password_hash, role, is_active, created_at, updated_at)
VALUES (
    'Manager',
    'User',
    'manager@englishschool.com',
    '$2b$10$S9mMm0VBWN1QerhnIPmLxuZUVdsB.SAxHS0qujnJLxRjpdG3W0eMG',
    'MANAGER',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample teacher users (password: teacher123 - bcrypt hash)
INSERT INTO users (first_name, last_name, email, password_hash, role, is_active, created_at, updated_at)
VALUES 
(
    'John',
    'Smith',
    'john.smith@englishschool.com',
    '$2b$10$TQ5Ob2ofIWZE3wLzXjzcrO6IEnrzzSu34VjzEyFtkJEDCGdAPfgVK',
    'TEACHER',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Sarah',
    'Johnson',
    'sarah.johnson@englishschool.com',
    '$2b$10$TQ5Ob2ofIWZE3wLzXjzcrO6IEnrzzSu34VjzEyFtkJEDCGdAPfgVK',
    'TEACHER',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample students
INSERT INTO students (first_name, last_name, email, phone, telegram_username, date_of_birth, assigned_teacher_id, created_at, updated_at)
VALUES 
(
    'Alice',
    'Brown',
    'alice.brown@example.com',
    '+1234567890',
    'alice_brown',
    '1995-05-15',
    (SELECT id FROM users WHERE email = 'john.smith@englishschool.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Bob',
    'Wilson',
    'bob.wilson@example.com',
    '+0987654321',
    'bob_wilson',
    '1998-08-22',
    (SELECT id FROM users WHERE email = 'sarah.johnson@englishschool.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Carol',
    'Davis',
    'carol.davis@example.com',
    '+1122334455',
    'carol_davis',
    '1993-12-01',
    (SELECT id FROM users WHERE email = 'john.smith@englishschool.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample lesson packages
INSERT INTO lesson_packages (student_id, total_lessons, remaining_lessons, created_at, updated_at)
VALUES 
(
    (SELECT id FROM students WHERE email = 'alice.brown@example.com'),
    10,
    8,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM students WHERE email = 'bob.wilson@example.com'),
    5,
    5,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM students WHERE email = 'carol.davis@example.com'),
    20,
    15,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample availability slots for teachers
INSERT INTO availability_slots (teacher_id, slot_date, slot_time, duration_minutes, is_booked, status, created_at, updated_at)
VALUES 
-- Teacher John Smith availability
(
    (SELECT id FROM users WHERE email = 'john.smith@englishschool.com'),
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    60,
    FALSE,
    'AVAILABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM users WHERE email = 'john.smith@englishschool.com'),
    CURRENT_DATE + INTERVAL '1 day',
    '11:00:00',
    60,
    FALSE,
    'AVAILABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM users WHERE email = 'john.smith@englishschool.com'),
    CURRENT_DATE + INTERVAL '2 days',
    '14:00:00',
    60,
    FALSE,
    'AVAILABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Teacher Sarah Johnson availability
(
    (SELECT id FROM users WHERE email = 'sarah.johnson@englishschool.com'),
    CURRENT_DATE + INTERVAL '1 day',
    '09:00:00',
    60,
    FALSE,
    'AVAILABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM users WHERE email = 'sarah.johnson@englishschool.com'),
    CURRENT_DATE + INTERVAL '1 day',
    '15:00:00',
    60,
    FALSE,
    'AVAILABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM users WHERE email = 'sarah.johnson@englishschool.com'),
    CURRENT_DATE + INTERVAL '3 days',
    '16:00:00',
    60,
    FALSE,
    'AVAILABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample lessons
INSERT INTO lessons (student_id, teacher_id, slot_id, scheduled_date, scheduled_time, duration_minutes, status, confirmed_by_teacher, created_at, updated_at)
VALUES 
(
    (SELECT id FROM students WHERE email = 'alice.brown@example.com'),
    (SELECT id FROM users WHERE email = 'john.smith@englishschool.com'),
    (SELECT id FROM availability_slots WHERE teacher_id = (SELECT id FROM users WHERE email = 'john.smith@englishschool.com') AND slot_date = CURRENT_DATE + INTERVAL '1 day' AND slot_time = '10:00:00'),
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    60,
    'SCHEDULED',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM students WHERE email = 'bob.wilson@example.com'),
    (SELECT id FROM users WHERE email = 'sarah.johnson@englishschool.com'),
    (SELECT id FROM availability_slots WHERE teacher_id = (SELECT id FROM users WHERE email = 'sarah.johnson@englishschool.com') AND slot_date = CURRENT_DATE + INTERVAL '1 day' AND slot_time = '09:00:00'),
    CURRENT_DATE + INTERVAL '1 day',
    '09:00:00',
    60,
    'SCHEDULED',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample group lessons
INSERT INTO group_lessons (teacher_id, lesson_topic, scheduled_date, scheduled_time, duration_minutes, max_students, current_students, status, description, created_at, updated_at)
VALUES 
(
    (SELECT id FROM users WHERE email = 'john.smith@englishschool.com'),
    'Business English Conversation',
    CURRENT_DATE + INTERVAL '3 days',
    '18:00:00',
    90,
    10,
    0,
    'SCHEDULED',
    'Group lesson focused on business English conversation practice',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM users WHERE email = 'sarah.johnson@englishschool.com'),
    'Grammar Workshop',
    CURRENT_DATE + INTERVAL '5 days',
    '17:00:00',
    60,
    8,
    0,
    'SCHEDULED',
    'Interactive grammar workshop for intermediate students',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample notifications
INSERT INTO notifications (recipient_id, recipient_type, notification_type, title, message, status, created_at, updated_at)
VALUES 
(
    (SELECT id FROM users WHERE email = 'admin@englishschool.com'),
    'ADMIN',
    'SYSTEM_MESSAGE',
    'System Started',
    'CRM System has been successfully initialized with seed data',
    'SENT',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM students WHERE email = 'alice.brown@example.com'),
    'STUDENT',
    'LESSON_SCHEDULED',
    'Lesson Scheduled',
    'Your lesson with John Smith has been scheduled for tomorrow at 10:00',
    'SENT',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample telegram bot configuration
INSERT INTO telegram_bots (bot_token, bot_username, bot_name, is_active, description, created_at, updated_at)
VALUES 
(
    'YOUR_BOT_TOKEN_HERE',
    'crm_english_school_bot',
    'CRM English School Bot',
    TRUE,
    'Main Telegram bot for student and teacher notifications',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
