# CRM Система для Онлайн Школы Английского Языка

## Обзор проекта и архитектуры

CRM система представляет собой современное веб-приложение, предназначенное для замены Excel-процессов в онлайн школе английского языка. Система построена на микросервисной архитектуре с использованием Docker контейнеризации.

### Архитектура

Проект состоит из следующих компонентов:

- **Traefik**: Реверс-прокси и балансировщик нагрузки с автоматическим SSL
- **PostgreSQL**: Основная база данных
- **Backend**: Основной API-сервис (Spring Boot)
- **Frontend**: Веб-интерфейс (React + TypeScript)
- **Email Service**: Сервис отправки email уведомлений
- **Telegram Service**: Сервис Telegram бота для интеграции

### Технологический стек

- **Backend**: Java 17, Spring Boot, Spring Security, JWT
- **Frontend**: React, TypeScript, Node.js 18
- **Database**: PostgreSQL 15, Flyway (миграции)
- **Infrastructure**: Docker, Docker Compose, Traefik
- **Build Tools**: Maven, npm
- **Testing**: JUnit, Jest, Playwright (E2E)

### Основные возможности

- Управление пользователями (Администраторы, Менеджеры, Преподаватели, Студенты)
- Управление пакетами уроков и расписанием
- Бронирование слотов занятий
- Система уведомлений (Email, Telegram)
- Групповые занятия
- Интеграция с Telegram ботом

## Предварительные требования

Для запуска проекта необходимо установить:

- **Docker** (версия 20.10+)
- **Docker Compose** (версия 2.0+)
- Минимум 4GB RAM
- Минимум 10GB свободного места на диске

### Установка Docker

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

**CentOS/RHEL:**
```bash
sudo yum install docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

**macOS:**
```bash
brew install docker docker-compose
```

**Windows:**
Скачайте и установите Docker Desktop с официального сайта.

## Быстрый запуск

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd crm-system-docker
```

2. **Настройте переменные окружения:**
```bash
cp .env.example .env
# Отредактируйте .env файл с вашими настройками
```

3. **Запустите все сервисы:**
```bash
docker-compose up -d
```

4. **Проверьте статус:**
```bash
docker-compose ps
```

5. **Откройте приложение:**
- Frontend: http://crm.localhost
- API: http://api.crm.localhost
- Traefik Dashboard: http://traefik.crm.localhost

## Детальная настройка переменных окружения

Создайте файл `.env` в корне проекта со следующими переменными:

### PostgreSQL настройки
```bash
POSTGRES_DB=crm_system
POSTGRES_USER=crm_user
POSTGRES_PASSWORD=SecurePass123!@#
```

### JWT конфигурация
```bash
JWT_SECRET=supersecretjwtkeythatisverylongandsecureforproductionuse1234567890abcdef
```

### Email сервис
```bash
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
```

### Telegram бот
```bash
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
TELEGRAM_BOT_USERNAME=@your_bot_username
```

### Spring Boot настройки
```bash
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/crm_system
SPRING_DATASOURCE_USERNAME=crm_user
SPRING_DATASOURCE_PASSWORD=SecurePass123!@#
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
```

### Дополнительные сервисы (опционально)
```bash
REDIS_URL=redis://redis:6379
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
```

## Доступ к сервисам через Traefik

Traefik автоматически маршрутизирует трафик на основе доменных имен:

| Сервис | URL | Описание |
|--------|-----|----------|
| Frontend | `http://crm.localhost` | Основной веб-интерфейс |
| Backend API | `http://api.crm.localhost` | REST API endpoints |
| Email Service | `http://email.crm.localhost` | Email сервис API |
| Telegram Service | `http://telegram.crm.localhost` | Telegram бот API |
| Traefik Dashboard | `http://traefik.crm.localhost` | Панель управления Traefik |

### SSL сертификаты

Для production окружения Traefik автоматически получает SSL сертификаты от Let's Encrypt:

- Добавьте DNS записи для доменов
- Измените email в `traefik/traefik.yml`
- Переключите на production ACME сервер (уберите `caServer` для production)

## Мониторинг и логи

### Просмотр логов

**Все сервисы:**
```bash
docker-compose logs -f
```

**Конкретный сервис:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Health Checks

Каждый сервис имеет встроенные health checks:

- **Backend**: `http://localhost:8080/actuator/health`
- **Frontend**: `http://localhost:80`
- **Email Service**: `http://localhost:8081/actuator/health`
- **Telegram Service**: `http://localhost:8082/actuator/health`
- **PostgreSQL**: `pg_isready -U crm_user`

### Мониторинг через Traefik

- Traefik Dashboard: `http://traefik.crm.localhost`
- Метрики доступны по endpoint `/metrics`

## Разработка и отладка

### Локальная разработка

1. **Запуск только базы данных:**
```bash
docker-compose up -d postgres traefik
```

2. **Запуск backend локально:**
```bash
cd crm-system
mvn spring-boot:run
```

3. **Запуск frontend локально:**
```bash
cd crm-system/frontend
npm install
npm start
```

### Отладка

**Подключение к базе данных:**
```bash
docker-compose exec postgres psql -U crm_user -d crm_system
```

**Просмотр переменных окружения сервиса:**
```bash
docker-compose exec backend env
```

**Анализ сетевых соединений:**
```bash
docker-compose exec backend netstat -tlnp
```

### Тестирование

**Запуск unit тестов backend:**
```bash
docker-compose exec backend mvn test
```

**Запуск E2E тестов frontend:**
```bash
cd crm-system/frontend
npm run test:e2e
```

## Troubleshooting

### Общие проблемы

**1. Сервисы не запускаются**
```bash
# Проверьте логи
docker-compose logs

# Проверьте ресурсы системы
docker system df

# Перезапустите с очисткой
docker-compose down -v
docker-compose up --build
```

**2. Ошибки подключения к базе данных**
```bash
# Проверьте статус PostgreSQL
docker-compose ps postgres

# Проверьте логи базы данных
docker-compose logs postgres

# Проверьте переменные окружения
docker-compose exec postgres env | grep POSTGRES
```

**3. Проблемы с SSL сертификатами**
```bash
# Проверьте логи Traefik
docker-compose logs traefik

# Очистите ACME сертификаты
docker-compose exec traefik rm -f /etc/traefik/acme.json
docker-compose restart traefik
```

**4. Ошибки сборки образов**
```bash
# Очистите cache Docker
docker system prune -a

# Пересоберите без cache
docker-compose build --no-cache
```

### Полезные команды диагностики

```bash
# Статус всех контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Логи конкретного сервиса за последний час
docker-compose logs --since 1h backend

# Проверка сети
docker-compose exec backend ping db

# Проверка открытых портов
docker-compose exec backend netstat -tlnp
```

## Структура проекта

```
crm-system-docker/
├── .env                    # Переменные окружения
├── docker-compose.yml      # Конфигурация Docker Compose
├── README.md              # Документация
├── traefik/               # Конфигурация Traefik
│   ├── traefik.yml
│   └── dynamic/
│       └── crm.yml
├── crm-system/            # Основной backend сервис
│   ├── Dockerfile
│   ├── pom.xml
│   ├── src/
│   └── frontend/          # Frontend приложение
│       ├── Dockerfile
│       ├── nginx.conf
│       └── src/
├── crm-system/email-service/    # Email сервис
│   ├── Dockerfile
│   └── src/
└── crm-system/telegram-service/ # Telegram сервис
    ├── Dockerfile
    └── src/
```

## Команды управления

### Запуск и остановка

```bash
# Запуск всех сервисов в фоне
docker-compose up -d

# Запуск с просмотром логов
docker-compose up

# Остановка всех сервисов
docker-compose down

# Остановка с удалением volumes
docker-compose down -v
```

### Пересборка

```bash
# Пересборка всех образов
docker-compose build

# Пересборка без cache
docker-compose build --no-cache

# Пересборка конкретного сервиса
docker-compose build backend

# Перезапуск сервиса после пересборки
docker-compose up -d --build backend
```

### Очистка

```bash
# Остановка и удаление контейнеров, сетей
docker-compose down

# Удаление volumes (данные БД!)
docker-compose down -v

# Удаление образов
docker-compose down --rmi all

# Полная очистка (внимание: удалит все данные!)
docker-compose down -v --rmi all
docker system prune -a --volumes
```

### Управление сервисами

```bash
# Просмотр статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend

# Перезапуск сервиса
docker-compose restart backend

# Масштабирование сервиса
docker-compose up -d --scale backend=3

# Выполнение команды в контейнере
docker-compose exec backend bash
```

### Резервное копирование

```bash
# Создание дампа базы данных
docker-compose exec postgres pg_dump -U crm_user crm_system > backup.sql

# Восстановление из дампа
docker-compose exec -T postgres psql -U crm_user -d crm_system < backup.sql
```

## Документация

- [Техническая архитектура](requirements/sdd_ru/01-technical-architecture.md)
- [Схема базы данных](requirements/sdd_ru/02-database-schema.md)
- [Роли и разрешения пользователей](requirements/sdd_ru/03-user-roles-permissions.md)
- [API эндпоинты](requirements/sdd_ru/04-api-endpoints.md)
- [UI/UX макеты](requirements/sdd_ru/05-ui-ux-wireframes.md)
- [Деплоймент и DevOps](requirements/sdd_ru/06-deployment-devops.md)
- [Стратегия тестирования](requirements/sdd_ru/07-testing-strategy.md)
- [Дорожная карта разработки](requirements/sdd_ru/08-development-roadmap.md)
- [Интеграция уведомлений](requirements/sdd_ru/09-notification-integration.md)
- [Безопасность и защита данных](requirements/sdd_ru/10-security-data-protection.md)