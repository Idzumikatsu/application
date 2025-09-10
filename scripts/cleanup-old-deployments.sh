#!/bin/bash

# CRM Synergy Cleanup Old Deployments Script
# Removes old backup directories and artifacts

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="crm-synergy"
APP_DIR="/opt/$APP_NAME"
BACKUP_PATTERN="${APP_DIR}_backup_*"
RETENTION_DAYS=7

echo -e "${GREEN}Starting cleanup of old deployments...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Find and remove old backup directories
echo -e "${YELLOW}Removing backup directories older than $RETENTION_DAYS days...${NC}"
find $BACKUP_PATTERN -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \; 2>/dev/null || true

# Remove old JAR backups
echo -e "${YELLOW}Removing old JAR backups...${NC}"
find $APP_DIR -name "*.jar.backup" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

# Cleanup temporary files
echo -e "${YELLOW}Cleaning temporary files...${NC}"
find $APP_DIR -name "*.tmp" -delete 2>/dev/null || true
find $APP_DIR -name "*.log" -mtime +30 -delete 2>/dev/null || true

# Cleanup npm cache if exists
if [ -d "$APP_DIR/crm-system/frontend/node_modules" ]; then
    echo -e "${YELLOW}Cleaning npm cache...${NC}"
    cd $APP_DIR/crm-system/frontend
    npm cache clean --force 2>/dev/null || true
fi

# Cleanup Maven cache if exists
if [ -d "$APP_DIR/crm-system/.m2" ]; then
    echo -e "${YELLOW}Cleaning Maven cache...${NC}"
    cd $APP_DIR/crm-system
    ./mvnw dependency:purge-local-repository -DskipTests 2>/dev/null || true
fi

echo -e "${GREEN}Cleanup completed successfully!${NC}"
echo -e "${GREEN}Freed space:$(du -sh $APP_DIR | cut -f1)${NC}"

exit 0