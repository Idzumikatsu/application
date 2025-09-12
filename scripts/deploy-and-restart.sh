#!/bin/bash
set -e

# Script for automatic deployment and restart of CRM Synergy application
# This script is designed to be executed on the production server

DEPLOY_PATH="/opt/crm-synergy"
SERVICE_NAME="crm-synergy-backend.service"
BACKUP_DIR="/opt/crm-synergy/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to create backup
create_backup() {
    log_info "Creating backup of current deployment..."
    local timestamp=$(date +%Y%m%d_%H%M%S)
    tar -czf "$BACKUP_DIR/backup_$timestamp.tar.gz" \
        "$DEPLOY_PATH/crm-system-0.0.1-SNAPSHOT.jar" \
        "$DEPLOY_PATH/frontend-dist" \
        2>/dev/null || true
    log_info "Backup created: $BACKUP_DIR/backup_$timestamp.tar.gz"
}

# Function to stop service
stop_service() {
    log_info "Stopping $SERVICE_NAME..."
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        systemctl stop "$SERVICE_NAME"
        sleep 5
        log_info "Service stopped successfully"
    else
        log_warn "Service was not running"
    fi
}

# Function to start service
start_service() {
    log_info "Starting $SERVICE_NAME..."
    systemctl start "$SERVICE_NAME"
    sleep 10
    
    # Check if service started successfully
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        log_info "Service started successfully"
        return 0
    else
        log_error "Failed to start service"
        systemctl status "$SERVICE_NAME" --no-pager -l
        return 1
    fi
}

# Function to deploy new backend
deploy_backend() {
    local jar_file="$1"
    
    if [ ! -f "$jar_file" ]; then
        log_error "JAR file not found: $jar_file"
        return 1
    fi
    
    log_info "Deploying new backend version..."
    
    # Backup current version
    if [ -f "$DEPLOY_PATH/crm-system-0.0.1-SNAPSHOT.jar" ]; then
        cp "$DEPLOY_PATH/crm-system-0.0.1-SNAPSHOT.jar" \
           "$DEPLOY_PATH/crm-system-0.0.1-SNAPSHOT.jar.backup"
    fi
    
    # Deploy new version
    cp "$jar_file" "$DEPLOY_PATH/crm-system-0.0.1-SNAPSHOT.jar"
    chown www-data:www-data "$DEPLOY_PATH/crm-system-0.0.1-SNAPSHOT.jar"
    chmod 644 "$DEPLOY_PATH/crm-system-0.0.1-SNAPSHOT.jar"
    
    log_info "Backend deployed successfully"
}

# Function to deploy new frontend
deploy_frontend() {
    local frontend_dir="$1"
    
    if [ ! -d "$frontend_dir" ]; then
        log_error "Frontend directory not found: $frontend_dir"
        return 1
    fi
    
    log_info "Deploying new frontend version..."
    
    # Backup current version
    if [ -d "$DEPLOY_PATH/frontend-dist" ]; then
        mv "$DEPLOY_PATH/frontend-dist" "$DEPLOY_PATH/frontend-dist.backup"
    fi
    
    # Deploy new version
    mv "$frontend_dir" "$DEPLOY_PATH/frontend-dist"
    chown -R www-data:www-data "$DEPLOY_PATH/frontend-dist"
    chmod -R 755 "$DEPLOY_PATH/frontend-dist"
    
    log_info "Frontend deployed successfully"
}

# Function to reload nginx if needed
reload_nginx() {
    if systemctl is-active --quiet nginx; then
        log_info "Reloading nginx configuration..."
        systemctl reload nginx
        log_info "Nginx reloaded successfully"
    fi
}

# Function to verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Check backend health
    local health_check
    health_check=$(curl -s -f https://crm-synergy.ru/api/actuator/health || echo "unhealthy")
    
    if echo "$health_check" | grep -q '"status":"UP"'; then
        log_info "Backend health check: ✅ UP"
    else
        log_warn "Backend health check: ❌ DOWN or unreachable"
        echo "Health response: $health_check"
    fi
    
    # Check frontend files
    if [ -d "$DEPLOY_PATH/frontend-dist" ]; then
        log_info "Frontend files: ✅ Present ($(ls -la "$DEPLOY_PATH/frontend-dist" | wc -l) files)"
    else
        log_error "Frontend files: ❌ Missing"
    fi
    
    # Check service status
    systemctl status "$SERVICE_NAME" --no-pager -l | head -10
}

# Main deployment function
main_deployment() {
    local jar_file="$1"
    local frontend_dir="$2"
    
    log_info "Starting deployment process..."
    
    # Create backup
    create_backup
    
    # Stop service
    stop_service
    
    # Deploy backend
    deploy_backend "$jar_file"
    
    # Deploy frontend if provided
    if [ -n "$frontend_dir" ]; then
        deploy_frontend "$frontend_dir"
    fi
    
    # Start service
    if start_service; then
        # Reload nginx if frontend was deployed
        if [ -n "$frontend_dir" ]; then
            reload_nginx
        fi
        
        # Verify deployment
        verify_deployment
        
        log_info "🎉 Deployment completed successfully!"
        return 0
    else
        log_error "Deployment failed! Attempting rollback..."
        
        # Rollback from backup
        if [ -f "$DEPLOY_PATH/crm-system-0.0.1-SNAPSHOT.jar.backup" ]; then
            mv "$DEPLOY_PATH/crm-system-0.0.1-SNAPSHOT.jar.backup" \
               "$DEPLOY_PATH/crm-system-0.0.1-SNAPSHOT.jar"
        fi
        
        if [ -d "$DEPLOY_PATH/frontend-dist.backup" ]; then
            rm -rf "$DEPLOY_PATH/frontend-dist"
            mv "$DEPLOY_PATH/frontend-dist.backup" "$DEPLOY_PATH/frontend-dist"
        fi
        
        # Try to start service with old version
        if start_service; then
            log_info "Rollback completed successfully"
        else
            log_error "Rollback also failed! Manual intervention required."
        fi
        
        return 1
    fi
}

# Show usage
show_usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --jar FILE          Path to new backend JAR file"
    echo "  --frontend DIR      Path to new frontend build directory"
    echo "  --help              Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 --jar /tmp/new-backend.jar --frontend /tmp/frontend-build"
}

# Parse command line arguments
JAR_FILE=""
FRONTEND_DIR=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --jar)
            JAR_FILE="$2"
            shift 2
            ;;
        --frontend)
            FRONTEND_DIR="$2"
            shift 2
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate arguments
if [ -z "$JAR_FILE" ] && [ -z "$FRONTEND_DIR" ]; then
    log_error "Either --jar or --frontend must be specified"
    show_usage
    exit 1
fi

# Execute main deployment
if main_deployment "$JAR_FILE" "$FRONTEND_DIR"; then
    exit 0
else
    exit 1
fi