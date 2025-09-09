#!/bin/bash

# CRM Synergy Full Deployment Master Script
# Complete setup for production deployment on crm-synergy.ru

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="crm-synergy"
APP_DIR="/opt/$APP_NAME"
DOMAIN="crm-synergy.ru"

print_header() {
    echo -e "${BLUE}"
    echo "=========================================="
    echo "   $1"
    echo "=========================================="
    echo -e "${NC}"
}

print_step() {
    echo -e "${YELLOW}➜ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "Please run as root"
        exit 1
    fi
}

check_dependencies() {
    print_step "Checking system dependencies..."
    
    local missing_deps=()
    
    # Check required commands
    for cmd in java npm nginx psql git; do
        if ! command -v $cmd &> /dev/null; then
            missing_deps+=($cmd)
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        echo "Please install missing packages and run again."
        exit 1
    fi
    
    print_success "All dependencies available"
}

setup_system() {
    print_header "System Setup"
    
    print_step "Creating directories..."
    mkdir -p $APP_DIR /var/www/$APP_NAME /var/log/$APP_NAME
    chown -R www-data:www-data $APP_DIR /var/www/$APP_NAME /var/log/$APP_NAME
    chmod 755 $APP_DIR /var/www/$APP_NAME /var/log/$APP_NAME
    
    print_step "Installing system packages..."
    apt update
    apt install -y openjdk-17-jdk postgresql nginx certbot python3-certbot-nginx
    
    print_success "System setup completed"
}

setup_database() {
    print_header "Database Setup"
    
    print_step "Setting up PostgreSQL..."
    
    # Create database user
    sudo -u postgres psql -c "CREATE USER crm_user WITH PASSWORD 'your_secure_password_here';" || true
    sudo -u postgres psql -c "ALTER USER crm_user CREATEDB;" || true
    
    # Create database
    sudo -u postgres createdb crm_system_prod || true
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE crm_system_prod TO crm_user;" || true
    
    print_step "Running database migrations..."
    bash scripts/database-migrate.sh
    
    print_success "Database setup completed"
}

deploy_application() {
    print_header "Application Deployment"
    
    print_step "Deploying backend and frontend..."
    bash scripts/deploy-production.sh
    
    print_success "Application deployment completed"
}

setup_ssl() {
    print_header "SSL Setup"
    
    print_step "Setting up SSL certificates..."
    bash scripts/setup-ssl.sh
    
    print_success "SSL setup completed"
}

configure_environment() {
    print_header "Environment Configuration"
    
    print_step "Setting up environment variables..."
    
    # Generate secure secrets
    local jwt_secret=$(openssl rand -base64 32)
    local db_password=$(openssl rand -base64 16)
    
    # Create environment file
    cat > $APP_DIR/.env << EOF
# CRM Synergy Production Environment
DATABASE_URL=jdbc:postgresql://localhost:5432/crm_system_prod
DATABASE_USERNAME=crm_user
DATABASE_PASSWORD=$db_password
JWT_SECRET=$jwt_secret
APP_DOMAIN=https://$DOMAIN
APP_FRONTEND_URL=https://$DOMAIN
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
MAIL_USERNAME=your_email@yandex.ru
MAIL_PASSWORD=your_email_password
EOF
    
    chmod 600 $APP_DIR/.env
    chown www-data:www-data $APP_DIR/.env
    
    print_success "Environment configuration completed"
}

test_deployment() {
    print_header "Testing Deployment"
    
    print_step "Testing backend service..."
    if systemctl is-active --quiet $APP_NAME-backend; then
        print_success "Backend service is running"
    else
        print_error "Backend service is not running"
    fi
    
    print_step "Testing nginx service..."
    if systemctl is-active --quiet nginx; then
        print_success "Nginx service is running"
    else
        print_error "Nginx service is not running"
    fi
    
    print_step "Testing database connection..."
    if PGPASSWORD="$db_password" psql -h localhost -U crm_user -d crm_system_prod -c "SELECT 1" > /dev/null 2>&1; then
        print_success "Database connection successful"
    else
        print_error "Database connection failed"
    fi
    
    print_success "Deployment testing completed"
}

show_summary() {
    print_header "Deployment Summary"
    
    echo -e "${GREEN}CRM Synergy has been successfully deployed!${NC}"
    echo ""
    echo -e "${BLUE}Access URLs:${NC}"
    echo -e "  • Main application: https://$DOMAIN"
    echo -e "  • API endpoint: https://$DOMAIN/api"
    echo ""
    echo -e "${BLUE}Services status:${NC}"
    systemctl status $APP_NAME-backend --no-pager -l | head -3
    systemctl status nginx --no-pager -l | head -3
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Update .env file with actual values:"
    echo -e "     - Telegram bot token"
    echo -e "     - Email credentials"
    echo -e "  2. Configure DNS for $DOMAIN"
    echo -e "  3. Set up monitoring and backups"
    echo -e "  4. Test the complete application flow"
    echo ""
    echo -e "${GREEN}Deployment completed at: $(date)${NC}"
}

# Main execution flow
main() {
    print_header "CRM Synergy Full Deployment"
    echo -e "${BLUE}Domain: $DOMAIN${NC}"
    echo -e "${BLUE}App Directory: $APP_DIR${NC}"
    echo ""
    
    check_root
    check_dependencies
    
    setup_system
    setup_database
    configure_environment
    deploy_application
    setup_ssl
    test_deployment
    show_summary
    
    print_success "Full deployment completed successfully!"
}

# Run main function
main "$@"

exit 0