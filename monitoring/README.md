# Мониторинг и деплой админ-панели CRM системы

## Обзор

Эта директория содержит конфигурацию и скрипты для мониторинга и деплоя админ-панели CRM системы.

## Структура директории

```
monitoring/
├── prometheus.yml              # Конфигурация Prometheus
├── admin-panel-rules.yml       # Правила оповещения
├── admin-panel-dashboard.json  # Дашборд Grafana
├── loki.yml                    # Конфигурация Loki
├── promtail.yml                # Конфигурация Promtail
├── grafana-datasources.yml     # Источники данных Grafana
├── grafana-dashboards.yml      # Конфигурация дашбордов Grafana
├── backend-logs/               # Директория для логов бэкенда
├── frontend-logs/              # Директория для логов фронтенда
├── postgres-logs/              # Директория для логов PostgreSQL
└── traefik-logs/               # Директория для логов Traefik
```

## Компоненты

### Prometheus
Система сбора метрик. Собирает метрики с бэкенда, фронтенда, базы данных и Traefik.

### Grafana
Система визуализации метрик. Предоставляет дашборды для мониторинга производительности админ-панели.

### Loki
Система сбора и хранения логов. Централизованно собирает логи всех компонентов системы.

### Promtail
Агент сбора логов. Собирает логи из файлов и отправляет их в Loki.

## Документация

Подробная документация доступна в директории `/opt/application/docs/monitoring/`:

- [Настройка мониторинга](../docs/monitoring/monitoring-setup.md)
- [Руководство по деплою](../docs/monitoring/deployment-guide.md)

## Скрипты

Скрипты для управления системой находятся в директории `/opt/application/scripts/`:

- `admin-panel-backup.sh` - Создание резервной копии
- `admin-panel-restore.sh` - Восстановление из резервной копии

## Cron jobs

Регулярные задачи настроены в файле `/opt/application/scripts/cron/admin-panel-backup-cron`:

- Ежедневные бэкапы
- Еженедельные полные бэкапы

## Доступ к системам мониторинга

После развертывания системы мониторинга доступны следующие интерфейсы:

- **Grafana**: https://grafana.crm-synergy.ru
- **Prometheus**: https://prometheus.crm-synergy.ru
- **Loki**: https://loki.crm-synergy.ru

## Обслуживание

### Добавление новых метрик

1. Добавьте необходимые зависимости в бэкенд
2. Обновите конфигурацию Prometheus
3. Обновите дашборд Grafana

### Настройка дополнительных алертов

1. Добавьте правила в `admin-panel-rules.yml`
2. Перезапустите Prometheus

### Изменение периодичности сбора метрик

Обновите параметр `scrape_interval` в `prometheus.yml`.