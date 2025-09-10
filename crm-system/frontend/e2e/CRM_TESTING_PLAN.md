# Комплексный план тестирования CRM системы с Playwright

## 📋 Обзор

Этот документ описывает комплексный план end-to-end тестирования CRM системы с использованием Playwright и реальных seed данных из базы данных.

## 🎯 Цели тестирования

- Проверить функциональность системы для всех ролей пользователей
- Обеспечить покрытие ключевых бизнес-процессов
- Использовать реальные данные из seed-файла V2__seed_data.sql
- Генерировать детальные отчеты о тестировании

## 👥 Роли пользователей и тестовые данные

### Доступные пользователи из seed данных:

**Администратор:**
- Email: `admin@englishschool.com`
- Пароль: `admin123`
- Роль: `ADMIN`

**Менеджер:**
- Email: `manager@englishschool.com`
- Пароль: `manager123`
- Роль: `MANAGER`

**Преподаватели:**
- John Smith: `john.smith@englishschool.com` / `teacher123`
- Sarah Johnson: `sarah.johnson@englishschool.com` / `teacher123`

**Студенты:**
- Alice Brown (прикреплена к John Smith)
- Bob Wilson (прикреплен к Sarah Johnson)
- Carol Davis (прикреплена к John Smith)

## 🗂️ Структура тестовых сценариев

### 1. Тесты аутентификации и авторизации (`auth/`)
- [`login.spec.ts`](auth/login.spec.ts) - базовые тесты логина
- [`role-based-access.spec.ts`](auth/role-based-access.spec.ts) - проверка прав доступа по ролям
- [`logout.spec.ts`](auth/logout.spec.ts) - тесты выхода из системы

### 2. Тесты для роли Менеджера (`manager/`)
- [`dashboard.spec.ts`](manager/dashboard.spec.ts) - тесты дашборда менеджера
- [`students-management.spec.ts`](manager/students-management.spec.ts) - управление студентами
- [`teachers-management.spec.ts`](manager/teachers-management.spec.ts) - управление преподавателями
- [`scheduling.spec.ts`](manager/scheduling.spec.ts) - планирование уроков
- [`packages-management.spec.ts`](manager/packages-management.spec.ts) - управление пакетами уроков
- [`reports.spec.ts`](manager/reports.spec.ts) - генерация отчетов

### 3. Тесты для роли Преподавателя (`teacher/`)
- [`teacher-dashboard.spec.ts`](teacher/teacher-dashboard.spec.ts) - дашборд преподавателя
- [`availability.spec.ts`](teacher/availability.spec.ts) - управление доступностью
- [`lessons-management.spec.ts`](teacher/lessons-management.spec.ts) - управление уроками
- [`student-notes.spec.ts`](teacher/student-notes.spec.ts) - заметки о студентах

### 4. Тесты для роли Администратора (`admin/`)
- [`admin-dashboard.spec.ts`](admin/admin-dashboard.spec.ts) - админ панель
- [`user-management.spec.ts`](admin/user-management.spec.ts) - управление пользователями
- [`system-settings.spec.ts`](admin/system-settings.spec.ts) - системные настройки

### 5. Интеграционные тесты (`integration/`)
- [`notifications.spec.ts`](integration/notifications.spec.ts) - тесты уведомлений
- [`calendar-integration.spec.ts`](integration/calendar-integration.spec.ts) - интеграция с календарем
- [`telegram-integration.spec.ts`](integration/telegram-integration.spec.ts) - интеграция с Telegram

## 🧪 Покрытие функциональностей

### Аутентификация и авторизация
- [ ] Логин/логаут для всех ролей
- [ ] Валидация форм аутентификации
- [ ] Проверка прав доступа по ролям
- [ ] Редиректы для неавторизованных пользователей

### Управление студентами
- [ ] Создание/редактирование/удаление студентов
- [ ] Просмотр списка студентов
- [ ] Поиск и фильтрация студентов
- [ ] Назначение преподавателей
- [ ] Просмотр истории уроков

### Управление пакетами уроков
- [ ] Создание пакетов уроков
- [ ] Просмотр остатка уроков
- [ ] Обновление пакетов
- [ ] История транзакций пакетов

### Расписание и календарь
- [ ] Планирование индивидуальных уроков
- [ ] Планирование групповых занятий
- [ ] Просмотр расписания
- [ ] Перенос и отмена уроков
- [ ] Интеграция с календарем

### Статусы уроков
- [ ] Изменение статусов уроков
- [ ] Подтверждение завершения уроков
- [ ] Автоматические статусы (пропущено, завершено)
- [ ] Уведомления о статусах

### Уведомления
- [ ] Системные уведомления
- [ ] Уведомления о уроках
- [ ] Email уведомления
- [ ] Telegram уведомления
- [ ] Настройки уведомлений

### Отчетность
- [ ] Финансовые отчеты
- [ ] Отчеты по преподавателям
- [ ] Отчеты по студентам
- [ ] Статистика занятости
- [ ] Экспорт отчетов

## ⚙️ Конфигурация тестовых данных

### Environment переменные
```bash
# Базовая конфигурация
BASE_URL=http://localhost:3000
API_URL=http://localhost:8080/api

# Тестовые пользователи
TEST_ADMIN_EMAIL=admin@englishschool.com
TEST_ADMIN_PASSWORD=admin123
TEST_MANAGER_EMAIL=manager@englishschool.com
TEST_MANAGER_PASSWORD=manager123
TEST_TEACHER_EMAIL=john.smith@englishschool.com
TEST_TEACHER_PASSWORD=teacher123

# Настройки тестирования
HEADLESS=true
SLOW_MO=100
TIMEOUT=30000
```

### Фикстуры тестовых данных
Использование реальных данных из `V2__seed_data.sql`:
- Студенты: Alice Brown, Bob Wilson, Carol Davis
- Пакеты уроков: с разным количеством оставшихся уроков
- Запланированные уроки: на разные даты и время
- Слоты доступности преподавателей

## 📊 План генерации отчетов

### Типы отчетов:
1. **HTML отчет** - основной визуальный отчет Playwright
2. **JUnit XML** - для интеграции с CI/CD системами
3. **JSON отчет** - для автоматической обработки
4. **Кастомный отчет** - сводка по покрытию функциональностей

### Конфигурация репортеров в `playwright.config.ts`:
```typescript
reporter: [
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['junit', { outputFile: 'test-results/results.xml' }],
  ['json', { outputFile: 'test-results/results.json' }],
  ['./custom-reporter.ts', { outputFile: 'test-results/coverage.md' }]
],
```

### Метрики качества:
- **Покрытие функциональностей**: % покрытых требований
- **Успешность тестов**: % passed tests
- **Время выполнения**: общее время тестовой сессии
- **Стабильность**: количество flaky tests

## 🚀 Запуск тестов

### Локальный запуск:
```bash
# Все тесты
npm run test:e2e

# Тесты конкретной роли
npm run test:e2e -- --grep "manager"

# Тесты с UI
npm run test:e2e:ui

# Специфичный браузер
npm run test:e2e -- --project=chromium
```

### CI/CD запуск:
```bash
# Установка зависимостей
npm ci

# Запуск тестов в headless режиме
npm run test:e2e -- --headed=false

# Генерация отчетов
npx playwright show-report playwright-report
```

## 📈 Мониторинг и поддержка

### Регулярные проверки:
- Ежедневный прогон smoke-тестов
- Еженедельный полный прогон всех тестов
- Мониторинг стабильности тестов
- Обновление тестов при изменении функциональности

### Поддержка актуальности:
- Обновление тестовых данных при изменении seed данных
- Рефакторинг тестов при изменении UI/UX
- Добавление новых тестов для новой функциональности