# Руководство по тестированию CRM системы

## Структура тестирования

Проект включает многоуровневую систему тестирования:

### Backend тесты (Java/Spring Boot)
- **Unit тесты**: `src/test/java/com/crm/system/service/*Test.java`
- **Integration тесты**: `src/test/java/com/crm/system/controller/*IT.java`
- **Базовый класс**: `BaseIntegrationTest.java`

### Frontend тесты (React/TypeScript)
- **Unit тесты**: `src/__tests__/*.test.tsx`
- **E2E тесты**: `e2e/*.spec.ts`

### CI/CD конфигурация
- GitHub Actions: `.github/workflows/ci-cd.yml`

## Запуск тестов

### Backend тесты

```bash
# Все тесты
cd crm-system
mvn test

# Только unit тесты
mvn test -Dtest="*Test"

# Только integration тесты  
mvn test -Dtest="*IT"

# С отчетом о покрытии
mvn test jacoco:report
```

### Frontend тесты

```bash
# Unit тесты
cd crm-system/frontend
npm test

# Unit тесты с покрытием
npm test -- --coverage --watchAll=false

# E2E тесты (требует установки Playwright)
npx playwright install
npm run test:e2e

# E2E тесты с UI
npm run test:e2e:ui
```

### Полный цикл CI/CD

```bash
# Локальный запуск (требует Docker)
docker-compose -f docker-compose.test.yml up --build

# Или через Maven wrapper
./mvnw test
```

## Конфигурация тестов

### Backend
- **Профиль**: `test`
- **База данных**: TestContainers (PostgreSQL)
- **Покрытие**: JaCoCo

### Frontend  
- **Фреймворк**: Jest + React Testing Library
- **E2E**: Playwright
- **Mocking**: MSW для API

## Отчеты о покрытии

### Backend
Отчеты генерируются автоматически в:
- `target/site/jacoco/index.html` - HTML отчет
- `target/site/jacoco/jacoco.xml` - XML для CI

### Frontend
Отчеты генерируются в:
- `coverage/lcov-report/index.html` - HTML отчет
- `coverage/lcov.info` - LCOV данные

## Интеграция с IDE

### IntelliJ IDEA
1. Откройте Maven панель
2. Запустите `test` goal
3. Для отладки: правый клик на тест → Debug

### VS Code
1. Установите Java и Spring Boot расширения
2. Используйте встроенный тест раннер

## Troubleshooting

### Common issues

1. **TestContainers не запускается**
   - Убедитесь, что Docker запущен
   - Проверьте доступность порта 5432

2. **E2E тесты падают**
   - Убедитесь, что фронтенд и бэкенд запущены
   - Проверьте версию Node.js (требуется 16+)

3. **Проблемы с зависимостями**
   - Очистите кэш: `mvn clean` или `npm ci`

## Best Practices

### Backend
- Используйте `@MockBean` для мокирования сервисов
- Для интеграционных тестов наследуйтесь от `BaseIntegrationTest`
- Тестируйте все возможные сценарии (успех, ошибки, edge cases)

### Frontend
- Используйте `screen` для queries вместо деструктуризации
- Mock API вызовы с помощью MSW
- Тестируйте accessibility и user interactions

### E2E
- Используйте page objects pattern
- Делайте тесты изолированными
- Добавляйте скриншоты при ошибках

## Мониторинг покрытия

Минимальные требования к покрытию:
- Backend: 80%+ 
- Frontend: 70%+
- Критичные модули: 90%+

Проверка покрытия:
```bash
# Backend
mvn jacoco:check

# Frontend  
npm test -- --coverage --watchAll=false
```

## Безопасность тестов

- Не включайте реальные credentials в тесты
- Используйте test профиль для конфигурации
- Очищайте тестовые данные после выполнения