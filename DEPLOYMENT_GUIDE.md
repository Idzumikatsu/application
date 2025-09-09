# Руководство по развертыванию CRM Synergy
## Домены: crm-synergy.ru, www.crm-synergy.ru

## 📋 Предварительные требования

### Системные требования
- Ubuntu 20.04+ или Debian 11+
- 2+ ядра CPU
- 4+ GB RAM
- 20+ GB дискового пространства
- Статические IP адрес или доменное имя

### Установленные пакеты
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка основных пакетов
sudo apt install -y \
    openjdk-17-jdk \
    postgresql \
    nginx \
    certbot \
    python3-certbot-nginx \
    git \
    maven \
    nodejs \
    npm
```

## 🚀 Быстрое развертывание

### 1. Автоматическое развертывание (рекомендуется)
```bash
# Скачать скрипты развертывания
git clone <your-repository> /opt/crm-synergy
cd /opt/crm-synergy

# Запустить полное развертывание
sudo bash scripts/full-deployment.sh
```

### 2. Пошаговое развертывание
```bash
# Шаг 1: Настройка системы
sudo bash scripts/deploy-production.sh --setup-system

# Шаг 2: Настройка базы данных
sudo bash scripts/database-migrate.sh

# Шаг 3: Развертывание приложения
sudo bash scripts/deploy-production.sh

# Шаг 4: Настройка SSL
sudo bash scripts/setup-ssl.sh
```

## ⚙️ Конфигурация окружения

### Файл окружения (/opt/crm-synergy/.env)
```bash
# Обязательные настройки
DATABASE_URL=jdbc:postgresql://localhost:5432/crm_system_prod
DATABASE_USERNAME=crm_user
DATABASE_PASSWORD=secure_password_here
JWT_SECRET=super_secure_jwt_secret_32_chars_minimum

# Доменные настройки
APP_DOMAIN=https://crm-synergy.ru
APP_FRONTEND_URL=https://crm-synergy.ru

# Telegram бот
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Email настройки (Yandex пример)
MAIL_HOST=smtp.yandex.ru
MAIL_PORT=465
MAIL_USERNAME=your_email@yandex.ru
MAIL_PASSWORD=your_email_password
```

### Генерация секретов
```bash
# Генерация JWT секрета
openssl rand -base64 32

# Генерация пароля БД
openssl rand -base64 16
```

## 🌐 Настройка домена и DNS

### 1. Регистрация домена
- Зарегистрировать домен `crm-synergy.ru`
- Настроить DNS записи:
  - A запись: `@` → IP сервера
  - A запись: `www` → IP сервера
  - CNAME запись: `www` → `crm-synergy.ru`

### 2. Настройка Nginx
Конфигурация автоматически создается в:
- `/etc/nginx/sites-available/crm-synergy`
- `/etc/nginx/sites-enabled/crm-synergy`

### 3. SSL сертификаты
Автоматическая настройка через Certbot:
- Сертификаты: `/etc/letsencrypt/live/crm-synergy.ru/`
- Автообновление: настроено в cron

## 🗄️ Настройка базы данных

### Создание пользователя и БД
```sql
CREATE USER crm_user WITH PASSWORD 'secure_password';
CREATE DATABASE crm_system_prod;
GRANT ALL PRIVILEGES ON DATABASE crm_system_prod TO crm_user;
```

### Миграции
Миграции выполняются автоматически из:
- `src/main/resources/db/migration/V1__initial_schema.sql`
- `src/main/resources/db/migration/V2__seed_data.sql`

## 🔧 Ручная настройка

### 1. Настройка системы
```bash
# Создание пользователя приложения
sudo useradd -r -s /bin/false crmuser

# Создание директорий
sudo mkdir -p /opt/crm-synergy /var/www/crm-synergy /var/log/crm-synergy
sudo chown -R crmuser:crmuser /opt/crm-synergy /var/www/crm-synergy /var/log/crm-synergy
```

### 2. Настройка PostgreSQL
```bash
# Редактирование конфигурации
sudo nano /etc/postgresql/*/main/postgresql.conf

# Настройка аутентификации
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

### 3. Настройка systemd сервиса
Файл: `/etc/systemd/system/crm-synergy-backend.service`

## 📊 Мониторинг и логи

### Логи приложения
- Backend: `/var/log/crm-synergy/app.log`
- Nginx: `/var/log/nginx/crm-synergy-*.log`
- Systemd: `journalctl -u crm-synergy-backend`

### Мониторинг
```bash
# Статус сервисов
systemctl status crm-synergy-backend
systemctl status nginx
systemctl status postgresql

# Проверка диска
df -h

# Проверка памяти
free -h

# Мониторинг процессов
htop
```

## 🔒 Безопасность

### Настройка firewall
```bash
# Установка UFW
sudo apt install ufw

# Настройка правил
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### SSL безопасность
- TLS 1.2/1.3 только
- Современные шифры
- HSTS включено
- OCSP stapling

### Безопасность приложения
- CORS настроен для доменов
- CSRF защита
- Rate limiting
- Валидация входных данных

## 🚨 Аварийное восстановление

### Бэкапы
```bash
# Бэкап базы данных
pg_dump -U crm_user -d crm_system_prod > backup_$(date +%Y%m%d).sql

# Бэкап конфигураций
tar -czf config_backup_$(date +%Y%m%d).tar.gz \
    /opt/crm-synergy/.env \
    /etc/nginx/sites-available/crm-synergy \
    /etc/systemd/system/crm-synergy-backend.service
```

### Восстановление
```bash
# Восстановление БД
psql -U crm_user -d crm_system_prod < backup_file.sql

# Восстановление конфигураций
tar -xzf config_backup.tar.gz -C /
```

## 🔄 Обновление приложения

### Автоматическое обновление
```bash
sudo bash scripts/deploy-production.sh
```

### Ручное обновление
```bash
# Остановка сервиса
sudo systemctl stop crm-synergy-backend

# Обновление кода
cd /opt/crm-synergy
git pull origin main

# Пересборка
./mvnw clean package -DskipTests
npm ci --only=production
npm run build

# Запуск сервиса
sudo systemctl start crm-synergy-backend
```

## 📞 Поддержка

### Полезные команды
```bash
# Перезапуск сервисов
sudo systemctl restart crm-synergy-backend
sudo systemctl restart nginx

# Просмотр логов
sudo journalctl -u crm-synergy-backend -f
sudo tail -f /var/log/nginx/crm-synergy-access.log

# Проверка SSL
sudo certbot certificates
```

### Диагностика проблем
1. Проверить логи: `journalctl -u crm-synergy-backend`
2. Проверить БД: `psql -U crm_user -d crm_system_prod`
3. Проверить сеть: `curl -I https://crm-synergy.ru`

## 📝 Чеклист развертывания

- [ ] Домен зарегистрирован и настроен
- [ ] Сервер подготовлен (Ubuntu/Debian)
- [ ] Пакеты установлены
- [ ] База данных настроена
- [ ] Переменные окружения настроены
- [ ] Приложение развернуто
- [ ] SSL сертификаты получены
- [ ] Firewall настроен
- [ ] Бэкапы настроены
- [ ] Мониторинг настроен

---

*Последнее обновление: $(date +%Y-%m-%d)*