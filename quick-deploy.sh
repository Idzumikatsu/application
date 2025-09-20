#!/bin/bash

# Простой скрипт быстрого деплоя
# Обновляет код и перезапускает контейнеры с пересборкой
# Включает настройку мониторинга и логирования

echo "🚀 Быстрый деплой CRM Synergy"

# Получаем последние изменения
echo "📥 Получаем последние изменения..."
git pull origin master

# Создание директорий для логов
echo "📂 Создаем директории для логов..."
mkdir -p /opt/application/monitoring/backend-logs
mkdir -p /opt/application/monitoring/frontend-logs
mkdir -p /opt/application/monitoring/postgres-logs
mkdir -p /opt/application/monitoring/traefik-logs
mkdir -p /opt/application/backups

# Пересобираем и перезапускаем контейнеры
echo "🏗️  Пересобираем и перезапускаем контейнеры..."
docker compose down
docker compose up -d --build

# Настройка cron job для бэкапов
echo "⏰ Настройка cron job для регулярных бэкапов..."
sudo cp /opt/application/scripts/cron/admin-panel-backup-cron /etc/cron.d/admin-panel-backup
sudo chmod 0644 /etc/cron.d/admin-panel-backup
sudo crontab /etc/cron.d/admin-panel-backup

echo "✅ Деплой завершен!"
echo "Проверьте работу приложения по адресу: https://app.crm-synergy.ru/"
echo "Мониторинг доступен по адресу: https://grafana.crm-synergy.ru/"