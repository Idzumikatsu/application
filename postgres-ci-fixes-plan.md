# План исправлений для GitHub Actions PostgreSQL CI/CD

## Выявленные проблемы

1. **DNS resolution failure**: Использование `nc -z postgres 5432` может не работать из-за отсутствия netcat или проблем с DNS
2. **Ненадежная проверка готовности**: Проверка только доступности порта без проверки готовности PostgreSQL к работе
3. **Отсутствие retry логики**: Нет повторных попыток подключения при временных сбоях

## Предлагаемые исправления

### 1. Правильная проверка готовности PostgreSQL

Заменить `nc -z postgres 5432` на использование `pg_isready` или проверку через `psql`:

```bash
# Вместо:
if nc -z postgres 5432; then

# Использовать:
if pg_isready -h postgres -p 5432 -U test -d testdb; then
```

Или через `psql`:
```bash
if psql "postgresql://test:test@postgres:5432/testdb" -c "SELECT 1;" >/dev/null 2>&1; then
```

### 2. Добавление retry логики с экспоненциальной задержкой

```bash
wait_for_postgres() {
    local max_attempts=30
    local attempt=1
    local delay=2
    
    echo "Waiting for PostgreSQL to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if pg_isready -h postgres -p 5432 -U test -d testdb >/dev/null 2>&1; then
            echo "PostgreSQL is ready!"
            return 0
        fi
        
        echo "Waiting for PostgreSQL... (attempt $attempt/$max_attempts)"
        sleep $delay
        attempt=$((attempt + 1))
        delay=$((delay * 2))  # Экспоненциальная задержка
        if [ $delay -gt 30 ]; then
            delay=30  # Максимальная задержка 30 секунд
        fi
    done
    
    echo "PostgreSQL did not become ready in time"
    return 1
}
```

### 3. Установка необходимых утилит

Добавить шаг для установки PostgreSQL клиента:

```yaml
- name: Install PostgreSQL client
  run: |
    sudo apt-get update
    sudo apt-get install -y postgresql-client
```

## Исправленный YAML код

```yaml
name: CRM System CI/CD

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

env:
  JAVA_VERSION: '17'
  NODE_VERSION: '18'
  POSTGRES_HOST: postgres
  POSTGRES_PORT: 5432
  POSTGRES_DB: testdb
  POSTGRES_USER: test
  POSTGRES_PASSWORD: test

jobs:
  backend-tests:
    name: Backend Tests
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14-alpine
        env:
          POSTGRES_DB: ${{ env.POSTGRES_DB }}
          POSTGRES_USER: ${{ env.POSTGRES_USER }}
          POSTGRES_PASSWORD: ${{ env.POSTGRES_PASSWORD }}
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - name: Checkout code
      uses: actions/checkout@v4.2.0

    - name: Install PostgreSQL client
      run: |
        sudo apt-get update
        sudo apt-get install -y postgresql-client

    - name: Wait for PostgreSQL to be ready
      run: |
        echo "Waiting for PostgreSQL to be ready..."
        for i in {1..30}; do
          if pg_isready -h ${{ env.POSTGRES_HOST }} -p ${{ env.POSTGRES_PORT }} -U ${{ env.POSTGRES_USER }} -d ${{ env.POSTGRES_DB }} >/dev/null 2>&1; then
            echo "PostgreSQL is ready!"
            exit 0
          fi
          echo "Waiting for PostgreSQL... ($i/30)"
          sleep 2
        done
        echo "PostgreSQL did not become ready in time"
        exit 1

    - name: Set up JDK ${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4.5.0
      with:
        java-version: ${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        cache: 'maven'

    - name: Build and test backend
      env:
        DATABASE_URL: jdbc:postgresql://${{ env.POSTGRES_HOST }}:${{ env.POSTGRES_PORT }}/${{ env.POSTGRES_DB }}
        DATABASE_USERNAME: ${{ env.POSTGRES_USER }}
        DATABASE_PASSWORD: ${{ env.POSTGRES_PASSWORD }}
      run: |
        cd crm-system
        mvn clean test -Dspring.profiles.active=test

    # ... остальные шаги остаются без изменений

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]

    services:
      postgres:
        image: postgres:14-alpine
        env:
          POSTGRES_DB: ${{ env.POSTGRES_DB }}
          POSTGRES_USER: ${{ env.POSTGRES_USER }}
          POSTGRES_PASSWORD: ${{ env.POSTGRES_PASSWORD }}
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - name: Checkout code
      uses: actions/checkout@v4.2.0

    - name: Install PostgreSQL client
      run: |
        sudo apt-get update
        sudo apt-get install -y postgresql-client

    - name: Wait for PostgreSQL to be ready
      run: |
        echo "Waiting for PostgreSQL to be ready..."
        for i in {1..30}; do
          if pg_isready -h ${{ env.POSTGRES_HOST }} -p ${{ env.POSTGRES_PORT }} -U ${{ env.POSTGRES_USER }} -d ${{ env.POSTGRES_DB }} >/dev/null 2>&1; then
            echo "PostgreSQL is ready!"
            exit 0
          fi
          echo "Waiting for PostgreSQL... ($i/30)"
          sleep 2
        done
        echo "PostgreSQL did not become ready in time"
        exit 1

    # ... остальные шаги E2E тестов
```

## Рекомендации по сетевому взаимодействию

1. **Использование переменных окружения**: Все параметры подключения должны быть вынесены в переменные окружения для удобства управления
2. **Health checks**: Использование встроенных health checks контейнера PostgreSQL (`pg_isready`)
3. **Retry логика**: Добавление экспоненциальной задержки между попытками подключения
4. **Установка клиента**: Гарантированная установка PostgreSQL client tools для надежной проверки готовности
5. **Единая конфигурация**: Использование одинаковых параметров подключения во всех job'ах