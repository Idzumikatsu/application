#!/bin/bash

# Test script to verify deployment works after fixes
# This script will check if all containers are running correctly

echo "Testing deployment after fixes..."

# Check if all services are defined in docker-compose
echo "1. Checking docker-compose services..."
SERVICES=$(docker compose config --services)
if [ -z "$SERVICES" ]; then
    echo "❌ No services found in docker-compose.yml"
    exit 1
fi
echo "✅ Services found: $SERVICES"

# Try to pull images (this will fail if images don't exist, but that's expected in test)
echo "2. Attempting to pull images..."
docker compose pull

# Start services
echo "3. Starting services..."
docker compose up -d

# Wait a bit for services to start
sleep 30

# Check if containers are running
echo "4. Checking container status..."
CONTAINERS_RUNNING=$(docker compose ps --filter "status=running" --format "table {{.Names}}\t{{.Status}}")
if [ -z "$CONTAINERS_RUNNING" ]; then
    echo "❌ No containers are running"
    docker compose ps
    docker compose logs --tail=20
    exit 1
fi

echo "✅ Running containers:"
echo "$CONTAINERS_RUNNING"

# Check PostgreSQL specifically
echo "5. Checking PostgreSQL..."
POSTGRES_STATUS=$(docker compose ps --filter "service=postgres" --format "{{.Status}}")
if [[ $POSTGRES_STATUS == *"Up"* ]]; then
    echo "✅ PostgreSQL is running"
else
    echo "❌ PostgreSQL is not running"
    docker compose logs postgres --tail=20
    exit 1
fi

# Check if we can connect to PostgreSQL
echo "6. Testing PostgreSQL connection..."
# Give PostgreSQL a moment to fully start
sleep 10

# Try to connect using the credentials from .env
if [ -f .env ]; then
    source .env
    # Test connection
    timeout 10 docker compose exec postgres pg_isready -U $POSTGRES_USER -d $POSTGRES_DB
    if [ $? -eq 0 ]; then
        echo "✅ PostgreSQL connection successful"
    else
        echo "❌ PostgreSQL connection failed"
        docker compose logs postgres --tail=30
        exit 1
    fi
else
    echo "⚠️  .env file not found, skipping connection test"
fi

echo "🎉 Deployment test completed successfully!"
echo "Note: Some services might still be starting up. Check 'docker compose logs' for more details."