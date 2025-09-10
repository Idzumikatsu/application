# Настройка автоматического деплоя в GitHub Actions

## Требуемые секреты

Для работы автоматического деплоя необходимо настроить следующие секреты в GitHub:

### 1. SSH ключи для доступа к серверу

```bash
# Генерация SSH ключа (на сервере)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Добавление публичного ключа на сервер
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys

# Настройка прав
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/github_actions_deploy
```

### 2. GitHub Secrets

Добавьте следующие секреты в настройках репозитория GitHub (`Settings` → `Secrets and variables` → `Actions`):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `PRODUCTION_HOST` | IP адрес или домен продакшн сервера | `192.168.1.100` или `crm-synergy.ru` |
| `PRODUCTION_USER` | Пользователь для SSH подключения | `deploy-user` |
| `SSH_PRIVATE_KEY` | Приватный SSH ключ (содержимое файла) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SLACK_WEBHOOK` | (Опционально) Webhook для уведомлений в Slack | `https://hooks.slack.com/services/...` |

### 3. Настройка сервера

Убедитесь, что на сервере:

1. Установлены все зависимости:
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk postgresql nginx git maven nodejs npm
```

2. Настроена база данных PostgreSQL
3. Создан пользователь и директории для приложения:
```bash
sudo useradd -r -s /bin/false crmuser
sudo mkdir -p /opt/crm-synergy /var/www/crm-synergy /var/log/crm-synergy
sudo chown -R crmuser:crmuser /opt/crm-synergy /var/www/crm-synergy /var/log/crm-synergy
```

### 4. Первоначальная настройка

Для первого деплоя выполните на сервере:

```bash
cd /opt/crm-synergy
git clone <your-repository> .
sudo bash scripts/full-deployment.sh
```

### 5. Проверка работы

После настройки секретов:
1. Сделайте push в ветку `main`
2. Дождитесь завершения CI/CD workflow
3. Проверьте, что запустился деплой workflow
4. Проверьте статус приложения на сервере

### Устранение проблем

**Если деплой не запускается:**
- Проверьте, что основной CI/CD workflow завершился успешно
- Убедитесь, что секреты настроены правильно
- Проверьте SSH доступ с локальной машины

**Если деплой падает:**
- Проверьте логи на сервере: `journalctl -u crm-synergy-backend`
- Убедитесь, что все зависимости установлены
- Проверьте конфигурацию базы данных

### Мониторинг

Деплой workflow будет автоматически запускаться после успешного завершения основного CI/CD pipeline при пуше в ветку `main`.