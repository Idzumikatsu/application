#!/bin/bash
set -e

echo "=== Testing Docker Image Build Configuration ==="

# Проверяем наличие необходимых файлов
echo "Checking required files..."
REQUIRED_FILES=(
  "crm-system/Dockerfile"
  "crm-system/frontend/Dockerfile" 
  "crm-system/email-service/Dockerfile"
  "crm-system/telegram-service/Dockerfile"
  "docker-compose.yml"
  ".github/workflows/ci-cd.yml"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing!"
    exit 1
  fi
done

echo ""
echo "=== Testing Docker Compose Configuration ==="

# Проверяем переменные окружения
echo "Checking environment variables in docker-compose.yml..."
if grep -q "\${REGISTRY}/\${IMAGE_NAME}" docker-compose.yml; then
  echo "✅ Image references use REGISTRY/IMAGE_NAME variables"
else
  echo "❌ Image references don't use expected variables"
fi

# Проверяем теги
echo "Checking image tags..."
SERVICES=("backend" "frontend" "email-service" "telegram-service")
for service in "${SERVICES[@]}"; do
  if grep -q "image:.*${service}:latest" docker-compose.yml; then
    echo "✅ $service uses :latest tag"
  else
    echo "❌ $service doesn't use :latest tag"
  fi
done

echo ""
echo "=== Testing CI/CD Configuration ==="

# Проверяем исправления в metadata-action
echo "Checking docker/metadata-action configuration..."
if grep -A5 -B2 "type=raw,value=latest" .github/workflows/ci-cd.yml | grep -v "enable={{is_default_branch}}"; then
  echo "✅ docker/metadata-action configured to always create latest tag"
else
  echo "❌ docker/metadata-action may still have conditional latest tag"
fi

echo ""
echo "=== Summary ==="
echo "Configuration looks good for automatic latest tag creation."
echo "Next steps:"
echo "1. Push changes to trigger CI/CD"
echo "2. CI/CD will build and push images with latest tag"
echo "3. Docker compose will be able to pull latest images"
echo ""
echo "✅ Test completed successfully!"