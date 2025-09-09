#!/bin/bash

# CRM Synergy Database Migration Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting database migration...${NC}"

# Load environment variables
if [ -f "/opt/crm-synergy/.env" ]; then
    export $(cat /opt/crm-synergy/.env | grep -v '^#' | xargs)
fi

# Database configuration
DB_HOST="${DATABASE_URL:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_NAME="${DATABASE_NAME:-crm_system_prod}"
DB_USER="${DATABASE_USERNAME:-postgres}"
DB_PASS="${DATABASE_PASSWORD}"

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL client (psql) is not installed${NC}"
    exit 1
fi

# Check database connection
echo -e "${YELLOW}Testing database connection...${NC}"
if ! PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${RED}Database connection failed${NC}"
    exit 1
fi

echo -e "${GREEN}Database connection successful${NC}"

# Create database if not exists
echo -e "${YELLOW}Checking database existence...${NC}"
if ! PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -l | grep -q "$DB_NAME"; then
    echo -e "${YELLOW}Creating database $DB_NAME...${NC}"
    PGPASSWORD="$DB_PASS" createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    echo -e "${GREEN}Database created successfully${NC}"
fi

# Run Flyway migrations
echo -e "${YELLOW}Running database migrations...${NC}"
cd /opt/crm-synergy/crm-system

# Use Flyway if available, otherwise use manual SQL execution
if command -v flyway &> /dev/null; then
    flyway -url="jdbc:postgresql://$DB_HOST:$DB_PORT/$DB_NAME" \
           -user="$DB_USER" \
           -password="$DB_PASS" \
           -locations="filesystem:src/main/resources/db/migration" \
           migrate
else
    # Manual migration execution
    MIGRATION_DIR="src/main/resources/db/migration"
    MIGRATION_FILES=$(ls $MIGRATION_DIR/*.sql | sort)
    
    for migration_file in $MIGRATION_FILES; do
        echo -e "${YELLOW}Applying migration: $(basename $migration_file)${NC}"
        PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration_file"
    done
fi

# Create migration tracking table if not exists
echo -e "${YELLOW}Setting up migration tracking...${NC}"
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_migrations (version, description)
VALUES 
    ('V1', 'Initial schema migration'),
    ('V2', 'Seed data migration')
ON CONFLICT (version) DO NOTHING;
EOF

# Verify migrations
echo -e "${YELLOW}Verifying migrations...${NC}"
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
EOF

echo -e "${GREEN}Database migration completed successfully!${NC}"
echo -e "${GREEN}Database: $DB_NAME${NC}"
echo -e "${GREEN}Host: $DB_HOST:$DB_PORT${NC}"

exit 0