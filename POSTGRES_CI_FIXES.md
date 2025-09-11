# Исправления проблем аутентификации PostgreSQL в CI/CD

## Проблема

В логах CI/CD workflow наблюдались ошибки:
1. "role 'root' does not exist" - попытка подключения с пользователем 'root'
2. "password authentication failed for user 'postgres'" - попытка подключения с пользователем 'postgres'
3. Backend сервер не запускался и не становился доступным

## Причина

В GitHub Actions сервисы доступны по имени сервиса, а не по localhost. Контейнер PostgreSQL с именем 'postgres' должен быть доступен по адресу `postgres:5432`, но приложение пыталось подключиться к `localhost:5432`.

## Внесенные изменения

### 1. Обновление application-test.properties

Файл [`crm-system/src/main/resources/application-test.properties`](crm-system/src/main/resources/application-test.properties) изменен для использования переменных окружения:

```properties
# Было:
spring.datasource.url=jdbc:postgresql://localhost:5432/testdb
spring.datasource.username=test
spring.datasource.password=test

# Стало:
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://localhost:5432/testdb}
spring.datasource.username=${DATABASE_USERNAME:test}
spring.datasource.password=${DATABASE_PASSWORD:test}
```

### 2. Обновление CI/CD workflow

Файл [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) обновлен:

1. **Добавлены переменные окружения** для шагов backend тестов и запуска сервера:
   ```yaml
   env:
     DATABASE_URL: jdbc:postgresql://postgres:5432/testdb
     DATABASE_USERNAME: test
     DATABASE_PASSWORD: test
   ```

2. **Исправлена проверка доступности PostgreSQL** в E2E тестах:
   ```yaml
   # Было: nc -z localhost 5432
   # Стало: nc -z postgres 5432
   ```

## Тестирование изменений

### Локальное тестирование

1. Запустите PostgreSQL контейнер:
```bash
docker run --name postgres-test -e POSTGRES_DB=testdb -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -p 5432:5432 -d postgres:14-alpine
```

2. Запустите тестовый скрипт:
```bash
./scripts/test-postgres-connection.sh
```

3. Запустите backend с тестовым профилем:
```bash
cd crm-system
DATABASE_URL=jdbc:postgresql://localhost:5432/testdb \
DATABASE_USERNAME=test \
DATABASE_PASSWORD=test \
mvn spring-boot:run -Dspring.profiles.active=test
```

### Тестирование в CI/CD

Изменения будут автоматически протестированы при следующем push в master или создании pull request.

## Проверка работоспособности

После применения изменений убедитесь, что:

1. ✅ Backend тесты проходят успешно
2. ✅ E2E тесты запускаются и проходят
3. ✅ Backend сервер становится доступным по http://localhost:8081/api-test/actuator/health
4. ✅ Нет ошибок аутентификации PostgreSQL в логах

## Резервная копия

Старая конфигурация Testcontainers сохранена в [`crm-system/src/test_backup/resources/application-test.properties`](crm-system/src/test_backup/resources/application-test.properties) на случай необходимости возврата к использованию Testcontainers.