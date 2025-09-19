-- Change role column from enum to varchar to match JPA @Enumerated(EnumType.STRING)
ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50) USING role::TEXT;