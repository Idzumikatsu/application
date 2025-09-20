#!/bin/bash

# Скрипт автоматического деплоя CRM Synergy
# Версия: 1.1
# Описание: Скрипт для автоматического обновления и перезапуска всех сервисов
# Включает настройку мониторинга, логирования и регулярных бэкапов

set -e  # Завершить выполнение при любой ошибке

echo "🚀 Начинаем процесс деплоя CRM Synergy..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений с цветом
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

# Проверка, что мы в правильной директории
if [ ! -f "docker-compose.yml" ]; then
    log_error "Файл docker-compose.yml не найден. Убедитесь, что вы находитесь в корневой директории проекта."
    exit 1
fi

log_info "Проверка текущей директории: $(pwd)"

# Остановка всех контейнеров
log_info "Останавливаем все контейнеры..."
docker compose down
log_success "Все контейнеры остановлены"

# Получение последних изменений из репозитория
log_info "Получаем последние изменения из репозитория..."
git pull origin master
if [ $? -eq 0 ]; then
    log_success "Последние изменения успешно получены"
else
    log_error "Ошибка при получении изменений из репозитория"
    exit 1
fi

# Проверка наличия обновлений
if git diff --quiet HEAD~1 docker-compose.yml; then
    log_info "Файл docker-compose.yml не изменился"
else
    log_warning "Файл docker-compose.yml был изменен, будет выполнена полная пересборка"
fi

# Создание директорий для логов
log_info "Создаем директории для логов..."
mkdir -p /opt/application/monitoring/backend-logs
mkdir -p /opt/application/monitoring/frontend-logs
mkdir -p /opt/application/monitoring/postgres-logs
mkdir -p /opt/application/monitoring/traefik-logs
mkdir -p /opt/application/backups
log_success "Директории для логов созданы"

# Настройка cron job для бэкапов
log_info "Настройка cron job для регулярных бэкапов..."
sudo cp /opt/application/scripts/cron/admin-panel-backup-cron /etc/cron.d/admin-panel-backup
sudo chmod 0644 /etc/cron.d/admin-panel-backup
sudo crontab /etc/cron.d/admin-panel-backup
log_success "Cron job для бэкапов настроен"

# Принудительная пересборка всех образов
log_info "Начинаем пересборку всех образов..."
docker compose build --no-cache
if [ $? -eq 0 ]; then
    log_success "Все образы успешно пересобраны"
else
    log_error "Ошибка при пересборке образов"
    exit 1
fi

# Запуск всех сервисов
log_info "Запускаем все сервисы..."
docker compose up -d
if [ $? -eq 0 ]; then
    log_success "Все сервисы успешно запущены"
else
    log_error "Ошибка при запуске сервисов"
    exit 1
fi

# Ожидание запуска контейнеров
log_info "Ожидаем запуск контейнеров (60 секунд)..."
sleep 60

# Проверка статуса контейнеров
log_info "Проверяем статус контейнеров..."
docker compose ps

# Проверка работоспособности основных сервисов
log_info "Проверяем работоспособность сервисов..."

# Проверка фронтенда
if docker compose exec frontend curl -f http://localhost:80 >/dev/null 2>&1; then
    log_success "Фронтенд работает корректно"
else
    log_warning "Фронтенд может еще запускаться или есть проблемы"
fi

# Проверка бэкенда
if docker compose exec backend curl -f http://localhost:8084/actuator/health >/dev/null 2>&1; then
    log_success "Бэкенд работает корректно"
else
    log_warning "Бэкенд может еще запускаться или есть проблемы"
fi

# Проверка мониторинга
if docker compose exec prometheus curl -f http://localhost:9090/-/healthy >/dev/null 2>&1; then
    log_success "Prometheus работает корректно"
else
    log_warning "Prometheus может еще запускаться или есть проблемы"
fi

if docker compose exec grafana curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    log_success "Grafana работает корректно"
else
    log_warning "Grafana может еще запускаться или есть проблемы"
fi

# Проверка базы данных
if docker compose exec postgres pg_isready >/dev/null 2>&1; then
    log_success "База данных работает корректно"
else
    log_warning "База данных может еще запускаться или есть проблемы"
fi

# Вывод последних логов
log_info "Выводим последние логи контейнеров..."
docker compose logs --tail=20

log_success "Деплой завершен успешно! 🎉"
echo ""
log_info "Проверьте работу приложения по адресу: https://app.crm-synergy.ru/"
log_info "Мониторинг доступен по адресу: https://grafana.crm-synergy.ru/"
log_info "Prometheus доступен по адресу: https://prometheus.crm-synergy.ru/"
log_info "Если изменения не отображаются, очистите кэш браузера или откройте в режиме инкогнито"