#!/bin/bash

# CRM Synergy Production Deployment Script
# Domains: crm-synergy.ru, www.crm-synergy.ru

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="crm-synergy"
APP_DIR="/opt/$APP_NAME"
BACKEND_DIR="$APP_DIR/crm-system"
FRONTEND_DIR="$APP_DIR/crm-system/frontend"
LOG_DIR="/var/log/$APP_NAME"
NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
SERVICE_NAME="$APP_NAME-backend"

echo -e "${GREEN}Starting CRM Synergy production deployment...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Create directories if they don't exist
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p $APP_DIR $LOG_DIR
chown -R www-data:www-data $APP_DIR $LOG_DIR
chmod 755 $APP_DIR $LOG_DIR

# Stop services
echo -e "${YELLOW}Stopping services...${NC}"
systemctl stop $SERVICE_NAME || true
systemctl stop nginx || true

# Backup current version
echo -e "${YELLOW}Creating backup...${NC}"
BACKUP_DIR="/opt/${APP_NAME}_backup_$(date +%Y%m%d_%H%M%S)"
if [ -d "$APP_DIR" ]; then
    cp -r $APP_DIR $BACKUP_DIR
    echo -e "${GREEN}Backup created: $BACKUP_DIR${NC}"
fi

# Deploy backend from pre-built artifact
echo -e "${YELLOW}Deploying backend...${NC}"
if [ -f "$APP_DIR/crm-system.jar" ]; then
    cp $APP_DIR/crm-system.jar $APP_DIR/crm-system.jar.backup
fi

# Create systemd service
cat > /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=CRM Synergy Backend Service
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/java -jar $APP_DIR/crm-system.jar --spring.profiles.active=prod
SuccessExitStatus=143
Restart=always
RestartSec=10
EnvironmentFile=$APP_DIR/.env

[Install]
WantedBy=multi-user.target
EOF

# Deploy frontend from pre-built artifact
echo -e "${YELLOW}Deploying frontend...${NC}"
if [ -d "$APP_DIR/build" ]; then
    # Copy build to nginx serving directory
    rm -rf /var/www/$APP_NAME/*
    cp -r $APP_DIR/build/* /var/www/$APP_NAME/
    chown -R www-data:www-data /var/www/$APP_NAME
    chmod -R 755 /var/www/$APP_NAME
else
    echo -e "${RED}Frontend build not found!${NC}"
    exit 1
fi

# Configure nginx
echo -e "${YELLOW}Configuring nginx...${NC}"
cat > $NGINX_CONF_DIR/$APP_NAME << EOF
server {
    listen 80;
    listen [::]:80;
    server_name crm-synergy.ru www.crm-synergy.ru;

    # Frontend static files
    root /var/www/$APP_NAME;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log $LOG_DIR/nginx-access.log;
    error_log $LOG_DIR/nginx-error.log;
}
EOF

# Enable nginx site
ln -sf $NGINX_CONF_DIR/$APP_NAME $NGINX_ENABLED_DIR/

# Test nginx configuration
nginx -t

# Start services
echo -e "${YELLOW}Starting services...${NC}"
systemctl daemon-reload
systemctl enable $SERVICE_NAME
systemctl start $SERVICE_NAME
systemctl start nginx

# Check services status
echo -e "${YELLOW}Checking services status...${NC}"
systemctl status $SERVICE_NAME --no-pager -l
systemctl status nginx --no-pager -l

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Application will be available at:${NC}"
echo -e "${GREEN}  - https://crm-synergy.ru${NC}"
echo -e "${GREEN}  - https://www.crm-synergy.ru${NC}"

# Health check
echo -e "${YELLOW}Performing health check...${NC}"
sleep 5
curl -f http://localhost:8080/api/health || echo -e "${RED}Health check failed${NC}"

exit 0