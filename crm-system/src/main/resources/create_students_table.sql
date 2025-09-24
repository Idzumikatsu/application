-- Table: students

-- DROP TABLE IF EXISTS students;

CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    address TEXT,
    parent_name VARCHAR(100),
    parent_phone VARCHAR(20),
    parent_email VARCHAR(100),
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    version INTEGER DEFAULT 0,

    CONSTRAINT fk_students_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_students_updated_by FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_enrollment_date ON students(enrollment_date);
CREATE INDEX IF NOT EXISTS idx_students_last_name ON students(last_name);
CREATE INDEX IF NOT EXISTS idx_students_parent_phone ON students(parent_phone);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE students IS 'Таблица студентов для CRM системы английской школы';
COMMENT ON COLUMN students.first_name IS 'Имя студента';
COMMENT ON COLUMN students.last_name IS 'Фамилия студента';
COMMENT ON COLUMN students.email IS 'Email студента (должен быть уникальным)';
COMMENT ON COLUMN students.phone IS 'Телефон студента';
COMMENT ON COLUMN students.birth_date IS 'Дата рождения студента';
COMMENT ON COLUMN students.parent_name IS 'Имя родителя';
COMMENT ON COLUMN students.parent_phone IS 'Телефон родителя';
COMMENT ON COLUMN students.parent_email IS 'Email родителя';
COMMENT ON COLUMN students.enrollment_date IS 'Дата зачисления';
COMMENT ON COLUMN students.status IS 'Статус студента (ACTIVE, INACTIVE, GRADUATED, TRANSFERRED)';
COMMENT ON COLUMN students.notes IS 'Дополнительные заметки';