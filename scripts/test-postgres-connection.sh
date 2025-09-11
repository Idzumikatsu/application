#!/bin/bash

# Test script to verify PostgreSQL connection in CI/CD environment
# Usage: ./scripts/test-postgres-connection.sh

set -e

echo "Testing PostgreSQL connection configuration..."

# Check if PostgreSQL is available
if command -v psql &> /dev/null; then
    echo "✓ psql command is available"
else
    echo "✗ psql command not found. Please install PostgreSQL client tools."
    exit 1
fi

# Test connection with different parameters
echo "Testing connection parameters:"

# Test 1: Default localhost connection
echo "1. Testing localhost:5432..."
if PGPASSWORD=test psql -h localhost -p 5432 -U test -d testdb -c "SELECT 1;" &> /dev/null; then
    echo "   ✓ Localhost connection successful"
else
    echo "   ✗ Localhost connection failed"
fi

# Test 2: Service name connection (for GitHub Actions)
echo "2. Testing postgres:5432..."
if PGPASSWORD=test psql -h postgres -p 5432 -U test -d testdb -c "SELECT 1;" &> /dev/null; then
    echo "   ✓ Service name connection successful"
else
    echo "   ✗ Service name connection failed (expected in local environment)"
fi

# Test 3: Check if PostgreSQL container is running
echo "3. Checking PostgreSQL container status..."
if docker ps | grep postgres &> /dev/null; then
    echo "   ✓ PostgreSQL container is running"
    
    # Get container IP
    CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -q --filter "name=postgres") 2>/dev/null || echo "")
    if [ -n "$CONTAINER_IP" ]; then
        echo "4. Testing container IP: $CONTAINER_IP..."
        if PGPASSWORD=test psql -h $CONTAINER_IP -p 5432 -U test -d testdb -c "SELECT 1;" &> /dev/null; then
            echo "   ✓ Container IP connection successful"
        else
            echo "   ✗ Container IP connection failed"
        fi
    fi
else
    echo "   ✗ PostgreSQL container not found"
fi

echo ""
echo "Summary:"
echo "For GitHub Actions CI/CD, use: jdbc:postgresql://postgres:5432/testdb"
echo "For local development, use: jdbc:postgresql://localhost:5432/testdb"
echo ""
echo "Environment variables should be set:"
echo "DATABASE_URL=jdbc:postgresql://postgres:5432/testdb"
echo "DATABASE_USERNAME=test"
echo "DATABASE_PASSWORD=test"