#!/bin/bash

# Admin Panel Restore Script
# This script restores the admin panel from a backup

set -e

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

# Check if backup file is provided
if [ $# -eq 0 ]; then
    log_error "Usage: $0 <backup_file.tar.gz>"
    log_info "Available backups:"
    ls -la /opt/application/backups/backup_*.tar.gz 2>/dev/null || log_warning "No backups found"
    exit 1
fi

BACKUP_FILE=$1

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Confirm restore operation
log_warning "This will restore the admin panel from backup. All current data may be lost!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Restore operation cancelled"
    exit 0
fi

# Stop services
log_info "Stopping services..."
docker compose down

# Extract backup
log_info "Extracting backup..."
TEMP_DIR="/tmp/admin-panel-restore"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# Restore database
log_info "Restoring database..."
BACKUP_DIR=$(find "$TEMP_DIR" -maxdepth 1 -type d -name "backup_*" | head -n 1)
if [ -z "$BACKUP_DIR" ]; then
    log_error "Could not find backup directory in archive"
    exit 1
fi

# Restore database
if [ -f "$BACKUP_DIR/database_backup.sql" ]; then
    # Start database only
    docker compose up -d postgres
    
    # Wait for database to be ready
    log_info "Waiting for database to be ready..."
    sleep 30
    
    # Restore database
    log_info "Restoring database from backup..."
    docker compose exec -T postgres psql -U $POSTGRES_USER $POSTGRES_DB < "$BACKUP_DIR/database_backup.sql"
    log_success "Database restored successfully"
else
    log_warning "No database backup found"
fi

# Restore configuration
if [ -d "$BACKUP_DIR/config" ]; then
    log_info "Restoring configuration files..."
    cp -r "$BACKUP_DIR/config/." /opt/application/
    log_success "Configuration files restored successfully"
else
    log_warning "No configuration backup found"
fi

# Clean up
rm -rf "$TEMP_DIR"

# Restart all services
log_info "Restarting all services..."
docker compose up -d

log_success "Restore process completed successfully!"
log_info "Please verify that all services are running correctly"