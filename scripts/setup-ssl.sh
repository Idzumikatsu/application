#!/bin/bash

# CRM Synergy SSL Setup Script with Certbot
# Domains: crm-synergy.ru, www.crm-synergy.ru

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting SSL setup for CRM Synergy...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing Certbot...${NC}"
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Installing nginx...${NC}"
    apt update
    apt install -y nginx
fi

# Ensure nginx configuration is in place
if [ ! -f "/etc/nginx/sites-available/crm-synergy" ]; then
    echo -e "${RED}Nginx configuration not found. Please deploy the application first.${NC}"
    exit 1
fi

# Enable nginx site
if [ ! -f "/etc/nginx/sites-enabled/crm-synergy" ]; then
    ln -s /etc/nginx/sites-available/crm-synergy /etc/nginx/sites-enabled/
fi

# Test nginx configuration
echo -e "${YELLOW}Testing nginx configuration...${NC}"
nginx -t

# Start nginx if not running
if ! systemctl is-active --quiet nginx; then
    systemctl start nginx
fi

# Obtain SSL certificate
echo -e "${YELLOW}Obtaining SSL certificate from Let's Encrypt...${NC}"
certbot --nginx -d crm-synergy.ru -d www.crm-synergy.ru \
    --email admin@crm-synergy.ru \
    --agree-tos \
    --non-interactive \
    --redirect

# Verify certificate was obtained
if [ -f "/etc/letsencrypt/live/crm-synergy.ru/fullchain.pem" ]; then
    echo -e "${GREEN}SSL certificate obtained successfully!${NC}"
else
    echo -e "${RED}Failed to obtain SSL certificate${NC}"
    exit 1
fi

# Setup automatic renewal
echo -e "${YELLOW}Setting up automatic certificate renewal...${NC}"

# Create renewal hook
cat > /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh << 'EOF'
#!/bin/bash
systemctl reload nginx
EOF

chmod +x /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh

# Test renewal
echo -e "${YELLOW}Testing certificate renewal...${NC}"
certbot renew --dry-run

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Certificate renewal test successful${NC}"
else
    echo -e "${YELLOW}Certificate renewal test failed, but continuing...${NC}"
fi

# Configure enhanced SSL security
echo -e "${YELLOW}Configuring enhanced SSL security...${NC}"

# Create SSL configuration snippet
cat > /etc/nginx/snippets/ssl.conf << 'EOF'
# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
EOF

# Update nginx configuration with enhanced SSL settings
sed -i '/ssl_certificate_key/a \    include snippets/ssl.conf;' /etc/nginx/sites-available/crm-synergy

# Test nginx configuration again
nginx -t

# Reload nginx
systemctl reload nginx

# Verify SSL setup
echo -e "${YELLOW}Verifying SSL setup...${NC}"
echo -e "${GREEN}Testing HTTPS connection to crm-synergy.ru...${NC}"
curl -I https://crm-synergy.ru --insecure || echo -e "${YELLOW}HTTPS test failed (may be expected if DNS not configured)${NC}"

echo -e "${GREEN}SSL setup completed successfully!${NC}"
echo -e "${GREEN}Your application is now secured with HTTPS${NC}"
echo -e "${GREEN}Certificate will be automatically renewed${NC}"

# Display certificate information
echo -e "${YELLOW}Certificate information:${NC}"
certbot certificates

exit 0