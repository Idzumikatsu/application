#!/bin/bash

# Admin Panel Backup Script
# This script creates backups of the admin panel data including:
# - Database backup
# - Configuration files
# - Log files

set -e

# Configuration
BACKUP_DIR="/opt/application/backups"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create timestamped backup directory
BACKUP_PATH="$BACKUP_DIR/backup_$DATE"
mkdir -p "$BACKUP_PATH"

# Database backup
log_info "Creating database backup..."
if docker compose exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > "$BACKUP_PATH/database_backup.sql"; then
    log_success "Database backup created successfully"
else
    log_error "Failed to create database backup"
    exit 1
fi

# Configuration backup
log_info "Creating configuration backup..."
mkdir -p "$BACKUP_PATH/config"
cp -r /opt/application/.env "$BACKUP_PATH/config/" 2>/dev/null || log_warning "No .env file found"
cp -r /opt/application/docker-compose.yml "$BACKUP_PATH/config/" 2>/dev/null || log_warning "No docker-compose.yml file found"
cp -r /opt/application/traefik "$BACKUP_PATH/config/" 2>/dev/null || log_warning "No traefik config found"
cp -r /opt/application/monitoring "$BACKUP_PATH/config/" 2>/dev/null || log_warning "No monitoring config found"

# Compress backup
log_info "Compressing backup..."
if tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_DIR" "backup_$DATE"; then
    log_success "Backup compressed successfully"
    # Remove uncompressed backup directory
    rm -rf "$BACKUP_PATH"
else
    log_error "Failed to compress backup"
    exit 1
fi

# Clean up old backups
log_info "Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

log_success "Backup process completed successfully!"
echo "Backup created: $BACKUP_DIR/backup_$DATE.tar.gz"