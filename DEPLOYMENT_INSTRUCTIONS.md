# Инструкции по настройке CI/CD Pipeline после исправлений

## Проблемы, которые были исправлены:

1. **Отсутствующие переменные окружения в docker-compose.yml**
   - ✅ Добавлен `env_file: - .env` для postgres сервиса
   - Теперь все сервисы используют единый файл переменных окружения

2. **Отсутствующие переменные в CI/CD workflow**
   - ✅ Добавлены переменные окружения в job `deploy-production`
   - ✅ Добавлен секрет `POSTGRES_PASSWORD` для безопасного хранения пароля

## Что нужно сделать в GitHub:

### 1. Настроить секреты репозитория
Перейдите в Settings → Secrets and variables → Actions и добавьте:

- `POSTGRES_PASSWORD`: `SecurePass123!@#` (или ваш реальный пароль PostgreSQL)

### 2. Проверить существующие секреты
Убедитесь, что следующие секреты уже настроены:

- `DEPLOY_HOST`: IP-адрес или домен сервера продакшена
- `DEPLOY_USER`: Пользователь для SSH подключения
- `DEPLOY_SSH_KEY`: SSH приватный ключ для подключения к серверу
- `GITHUB_TOKEN`: Автоматически создается GitHub

### 3. Настройка сервера продакшена

Убедитесь, что на сервере `/opt/crm-synergy` есть:
- Файл `.env` с корректными переменными окружения
- Доступ к Docker registry (ghcr.io)
- SSH ключ настроен для подключения

## Тестирование исправлений:

1. **Локально**: `docker-compose up -d`
2. **CI/CD**: Сделайте push в ветку `master`
3. **Продакшен**: Проверьте логи deployment в GitHub Actions

## Переменные окружения для проверки:

```bash
# PostgreSQL
POSTGRES_DB=crm_system
POSTGRES_USER=crm_user
POSTGRES_PASSWORD=SecurePass123!@#

# JWT
JWT_SECRET=supersecretjwtkeythatisverylongandsecureforproductionuse1234567890abcdef

# Database URL
DATABASE_URL=postgresql://crm_user:SecurePass123!@#@postgres:5432/crm_system
```

## Команды для диагностики:

```bash
# Проверить статус контейнеров
docker compose ps

# Проверить логи PostgreSQL
docker compose logs postgres

# Проверить переменные окружения в контейнере
docker compose exec postgres env | grep POSTGRES

# Проверить подключение к базе данных
docker compose exec postgres pg_isready -U crm_user -d crm_system