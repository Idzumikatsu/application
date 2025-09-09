#!/bin/bash

# Скрипт для генерации отчетов о покрытии тестами

set -e

echo "=== Генерация отчетов о покрытии тестами ==="

# Backend coverage
echo "Backend coverage report..."
cd crm-system
mvn jacoco:report

# Frontend coverage (если настроен)
if [ -d "frontend" ]; then
    echo "Frontend coverage report..."
    cd frontend
    npm test -- --coverage --watchAll=false
    cd ..
fi

echo "=== Отчеты сгенерированы ==="
echo "Backend HTML отчет: crm-system/target/site/jacoco/index.html"
echo "Backend XML отчет:  crm-system/target/site/jacoco/jacoco.xml"

if [ -d "crm-system/frontend" ]; then
    echo "Frontend отчет:   crm-system/frontend/coverage/lcov-report/index.html"
fi

echo ""
echo "Для просмотра отчетов откройте соответствующие HTML файлы в браузере"