import { test, expect } from '@playwright/test';

test.describe('Admin Login and Access', () => {
  test('should successfully login as admin and access admin dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in admin credentials
    await page.getByLabel(/email/i).fill('admin@englishschool.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /войти/i }).click();
    
    // Check if redirected to admin dashboard
    await expect(page).toHaveURL(/admin/);
    await expect(page.getByRole('heading', { name: /панель администратора/i })).toBeVisible();
    
    // Check if admin sidebar is visible
    await expect(page.getByText(/администрирование/i)).toBeVisible();
    
    // Check if admin menu items are visible
    await expect(page.getByText(/пользователи/i)).toBeVisible();
    await expect(page.getByText(/менеджеры/i)).toBeVisible();
    await expect(page.getByText(/преподаватели/i)).toBeVisible();
    await expect(page.getByText(/студенты/i)).toBeVisible();
    await expect(page.getByText(/уроки/i)).toBeVisible();
    await expect(page.getByText(/отчеты/i)).toBeVisible();
    await expect(page.getByText(/уведомления/i)).toBeVisible();
    await expect(page.getByText(/профиль/i)).toBeVisible();
    await expect(page.getByText(/настройки/i)).toBeVisible();
  });
});