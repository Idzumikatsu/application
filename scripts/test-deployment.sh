#!/bin/bash
set -e

echo "=== Тестирование конфигурации деплоя CRM System ==="

# Проверяем наличие необходимых файлов
echo "1. Проверка наличия конфигурационных файлов..."
required_files=(
  "docker-compose.yml"
  ".env"
  ".env.production" 
  "traefik/traefik.yml"
  "traefik/dynamic/dynamic.yml"
)

for file in "${required_files[@]}"; do
  if [ -f "$file" ] || [ -d "$file" ]; then
    echo "✅ $file существует"
  else
    echo "❌ $file отсутствует"
    exit 1
  fi
done

# Проверяем синтаксис Docker Compose (игнорируем предупреждение о версии)
echo "2. Проверка синтаксиса Docker Compose..."
if docker compose config -q 2>&1 | grep -v "version.*obsolete" | grep -q "error"; then
  echo "❌ Ошибка в Docker Compose файле"
  exit 1
else
  echo "✅ Docker Compose синтаксис корректен"
fi

# Проверяем переменные окружения
echo "3. Проверка переменных окружения..."
if [ -f ".env" ]; then
  echo "✅ .env файл существует"
  echo "   Первые 5 строк:"
  head -5 .env
else
  echo "❌ .env файл отсутствует"
  exit 1
fi

if [ -f ".env.production" ]; then
  echo "✅ .env.production файл существует"
  echo "   Первые 5 строк:"
  head -5 .env.production
else
  echo "❌ .env.production файл отсутствует"
  exit 1
fi

# Проверяем traefik конфигурацию
echo "4. Проверка Traefik конфигурации..."
if [ -f "traefik/traefik.yml" ]; then
  echo "✅ traefik.yml существует"
else
  echo "❌ traefik.yml отсутствует"
  exit 1
fi

if [ -f "traefik/dynamic/dynamic.yml" ]; then
  echo "✅ dynamic.yml существует"
else
  echo "❌ dynamic.yml отсутствует"
  exit 1
fi

# Проверяем, что все сервисы используют image вместо build
echo "5. Проверка использования образов вместо сборки..."
if grep -q "build:" docker-compose.yml; then
  echo "❌ Найдены сервисы с build: - нужно заменить на image:"
  grep -n "build:" docker-compose.yml
  exit 1
else
  echo "✅ Все сервисы используют image: (правильно)"
fi

# Проверяем наличие переменных REGISTRY и IMAGE_NAME
echo "6. Проверка переменных registry..."
if grep -q "\${REGISTRY}" docker-compose.yml && grep -q "\${IMAGE_NAME}" docker-compose.yml; then
  echo "✅ Переменные REGISTRY и IMAGE_NAME используются правильно"
else
  echo "❌ Проблема с переменными registry/имени образа"
  exit 1
fi

echo ""
echo "=== Тестирование завершено успешно! ==="
echo "Конфигурация готова для деплоя через GitHub Actions"
echo ""
echo "Следующие шаги:"
echo "1. Убедитесь, что все образы собраны и запушены в registry"
echo "2. Запустите деплой через GitHub Actions"
echo "3. Проверьте логи деплоя на сервере"