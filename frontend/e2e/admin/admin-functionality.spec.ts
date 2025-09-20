import { test, expect } from '@playwright/test';

test.describe('Admin Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@englishschool.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /войти/i }).click();
    await expect(page).toHaveURL(/admin/);
  });

  test('should display admin dashboard with statistics', async ({ page }) => {
    // Check dashboard elements
    await expect(page.getByRole('heading', { name: /панель администратора/i })).toBeVisible();
    await expect(page.getByText(/добро пожаловать/i)).toBeVisible();
    
    // Check statistics cards
    await expect(page.getByText(/всего студентов/i)).toBeVisible();
    await expect(page.getByText(/всего преподавателей/i)).toBeVisible();
    await expect(page.getByText(/всего менеджеров/i)).toBeVisible();
    await expect(page.getByText(/уроков сегодня/i)).toBeVisible();
    
    // Check students ending soon section
    await expect(page.getByText(/студенты с заканчивающимися пакетами/i)).toBeVisible();
  });

  test('should navigate to user management pages', async ({ page }) => {
    // Test navigation to Users page
    await page.getByText(/пользователи/i).click();
    await expect(page).toHaveURL(/admin\/users/);
    await expect(page.getByRole('heading', { name: /управление пользователями/i })).toBeVisible();
    
    // Test navigation to Managers page
    await page.getByText(/менеджеры/i).click();
    await expect(page).toHaveURL(/admin\/managers/);
    
    // Test navigation to Teachers page
    await page.getByText(/преподаватели/i).click();
    await expect(page).toHaveURL(/admin\/teachers/);
    
    // Test navigation to Students page
    await page.getByText(/студенты/i).click();
    await expect(page).toHaveURL(/admin\/students/);
  });

  test('should navigate to lessons management page', async ({ page }) => {
    // Test navigation to Lessons page
    await page.getByText(/уроки/i).click();
    await expect(page).toHaveURL(/admin\/lessons/);
    await expect(page.getByRole('heading', { name: /управление уроками/i })).toBeVisible();
    
    // Check lesson management elements
    await expect(page.getByText(/планирование и управление/i)).toBeVisible();
    await expect(page.getByText(/преподаватель/i)).toBeVisible();
    await expect(page.getByText(/студент/i)).toBeVisible();
  });

  test('should navigate to reports page', async ({ page }) => {
    // Test navigation to Reports page
    await page.getByText(/отчеты/i).click();
    await expect(page).toHaveURL(/admin\/reports/);
    await expect(page.getByRole('heading', { name: /отчеты и экспорт данных/i })).toBeVisible();
    
    // Check report options
    await expect(page.getByText(/доступные отчеты/i)).toBeVisible();
    await expect(page.getByText(/студенты/i)).toBeVisible();
    await expect(page.getByText(/преподаватели/i)).toBeVisible();
    await expect(page.getByText(/уроки/i)).toBeVisible();
    await expect(page.getByText(/финансы/i)).toBeVisible();
  });

  test('should navigate to notifications page', async ({ page }) => {
    // Test navigation to Notifications page
    await page.getByText(/уведомления/i).click();
    await expect(page).toHaveURL(/admin\/notifications/);
  });

  test('should navigate to profile page', async ({ page }) => {
    // Test navigation to Profile page
    await page.getByText(/профиль/i).click();
    await expect(page).toHaveURL(/admin\/profile/);
  });

  test('should navigate to settings page', async ({ page }) => {
    // Test navigation to Settings page
    await page.getByText(/настройки/i).click();
    await expect(page).toHaveURL(/admin\/settings/);
  });
});