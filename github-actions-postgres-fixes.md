
# Исправленный GitHub Actions Workflow для PostgreSQL

## Полный исправленный YAML код

```yaml
name: CRM System CI/CD - Fixed PostgreSQL Configuration

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

    - name: Upload test results
      uses: actions/upload-artifact@v4.3.5
      if: always()
      with:
        name: backend-test-results
        path: crm-system/target/surefire-reports/

    - name: Upload coverage report
      uses: actions/upload-artifact@v4.3.5
      if: always()
      with:
        name: backend-coverage-report
        path: crm-system/target/site/jacoco/

  frontend-tests:
    name: Frontend Tests
    runs-on: ubuntu-latest
    needs: backend-tests

    steps:
    - name: Checkout code
      uses: actions/checkout@v4.2.0

    - name: Set up Node.js ${{ env.NODE_VERSION }}
      uses: actions/setup-node@v4.1.0
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: crm-system/frontend/package-lock.json

    - name: Install dependencies
      run: |
        cd crm-system/frontend
        npm ci

    - name: Run unit tests
      run: |
        cd crm-system/frontend
        npm test -- --coverage --watchAll=false

    - name: Upload test results
      uses: actions/upload-artifact@v4.3.5
      if: always()
      with:
        name: frontend-test-results
        path: crm-system/frontend/coverage/

    - name: Build frontend
      run: |
        cd crm-system/frontend
        npm run build

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

    - name: Set up JDK ${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4.5.0
      with:
        java-version: ${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        cache: 'maven'

    - name: Set up Node.js ${{ env.NODE_VERSION }}
      uses: actions/setup-node@v4.1.0
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: crm-system/frontend/package-lock.json

    - name: Install npm dependencies
      run: |
        cd crm-system/frontend
        npm ci

    - name: Install Playwright browsers
      run: |
        cd crm-system/frontend
        npx playwright install --with-deps

    - name: Start backend server
      env:
        DATABASE_URL: jdbc:postgresql://${{ env.POSTGRES_HOST }}:${{ env.POSTGRES_PORT }}/${{ env.POSTGRES_DB }}
        DATABASE_USERNAME: ${{ env.POSTGRES_USER }}
        DATABASE_PASSWORD: ${{ env.POSTGRES_PASSWORD }}
      run: |
        cd crm-system
        mvn spring-boot:run -Dspring.profiles.active=test &
        BACKEND_PID=$!
        echo "BACKEND_PID=$BACKEND_PID" >> $GITHUB_ENV

    - name: Wait for backend to be ready
      run: |
        echo "Waiting for backend server to be ready..."
        for i in {1..30}; do
          if curl -f http://localhost:8081/api-test/actuator/health > /dev/null 2>&1; then
            echo "Backend server is ready!"
            exit 0
          fi
          echo "Waiting for backend server... ($i/30)"
          sleep 2
        done
        echo "Backend server did not become ready in time"
        exit 1

    - name: Start frontend server
      run: |
        cd crm-system/frontend
        npm start &
        FRONTEND_PID=$!
        echo "FRONTEND_PID=$FRONTEND_PID" >> $GITHUB_ENV

    - name: Wait for frontend to be ready
      run: |
        echo "Waiting for frontend server to be ready..."
        for i in {1..30}; do
          if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "Frontend server is ready!"
            exit 0
          fi
          echo "Waiting for frontend server... ($i/30)"
          sleep 2
        done
        echo "Frontend server did not become ready in time"
        exit 1

    - name: Run E2E tests
      run: |
        cd crm-system/frontend
        npx playwright test

    - name: Upload E2E test results
      uses: actions/upload-artifact@v4.3.5
      if: always()
      with:
        name: e2e-test-results
        path: crm-system/frontend/playwright-report/

    - name: Cleanup servers
      if: always()
      run: |
        if [ -n "$BACKEND_PID" ]; then
          kill $BACKEND_PID 2>/dev/null || true
        fi
        if [ -n "$FRONTEND_PID" ]; then
          kill $FRONTEND_PID 2>/dev/null || true
        fi

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: []  # Может выполняться параллельно с другими задачами

    steps:
    - name: Checkout code
      uses: actions/checkout@v4.2.0

    - name: Set up JDK ${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4.5.0
      with:
        java-version: ${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        cache: 'maven'

    - name: Run OWASP Dependency Check
      run: |
        cd crm-system
        mvn org.owasp:dependency-check-maven:check -DskipTests

  build-artifacts:
    name: Build Artifacts
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests, e2e-tests, security-scan]
    if: github.ref == 'refs/heads/master'

    steps:
    - name: Checkout code
      uses: actions/checkout@v4.2.0

    - name: Set up JDK ${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4.5.0
      with:
        java-version: ${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        cache: 'maven'

    - name: Set up Node.js ${{ env.NODE_VERSION }}
      uses: actions/setup-node@v4.1.0
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: crm-system/frontend/package-lock.json

    - name: Build backend JAR
      run: |
        cd crm-system
        ./mvnw clean package -DskipTests
        cp target/*.jar ../crm-system.jar

    - name: Build frontend
      run: |
        cd crm-system/frontend
        npm ci --only=production
        npm run build

    - name: Upload deployment artifacts
      uses: actions/upload-artifact@v4.3.5
      with:
        name: deployment-artifacts
        path: |
          crm-system.jar
          crm-system/frontend/build/
          scripts/
        retention-days: 7
```

## Пояснения изменений

### 1. **Исправление DNS resolution проблемы**
- **Было**: Использование `nc -z postgres 5432` - могло не работать из-за отсутствия netcat
- **Стало**: Использование `pg_isready -h postgres -p 5432 -U test -d testdb`
- **Преимущество**: `pg_isready` - нативная утилита PostgreSQL, которая точно проверяет готовность базы данных

### 2. **Установка PostgreSQL клиента**
- Добавлен шаг `Install PostgreSQL client` для гарантированной установки необходимых утилит
- Команда: `sudo apt-get install -y postgresql-client`

### 3. **Централизованная конфигурация через переменные окружения**
- Все параметры подключения вынесены в секцию `env` на уровне workflow
- Использование переменных: `${{ env.POSTGRES_HOST }}`, `${{ env.POSTGRES_USER }}` и т.д.
- Упрощает управление конфигурацией и предотвращает ошибки

### 4. **Правильные credentials**
- **Было**: Попытки подключения с пользователем `root` (не существует в PostgreSQL)
- **Стало**: Использование корректных учетных данных `test/test`
- Конфигурация сервиса: `POSTGRES_USER: test`, `POSTGRES_PASSWORD: test`

### 5. **Надежная проверка готовности**
- Использование `pg_isready` вместо `nc -z`
- Проверка не только доступности порта, но и готовности PostgreSQL принимать подключения
- Включает проверку аутентификации и доступности базы данных

### 6. **Рекомендации по сетевому взаимодействию**
1. **Использование service containers**: Контейнеры PostgreSQL доступны по имени сервиса (`postgres`)
2. **Health checks**: Встроенные проверки здоровья контейнера через `--health-cmd pg_isready`
3. **Переменные окружения**: Единая точка конфигурации для всех job'ов
4. **Retry логика**: 30 попыток с задержкой 2 секунды между попытками

### 7. **Совместимость с текущей конфигурацией**
- Сохранены все существующие шаги и функциональность
- Улучшена только работа с PostgreSQL
- Обратная совместимость с текущей код