import { test, expect } from '@playwright/test';

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@englishschool.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /войти/i }).click();
    await expect(page).toHaveURL(/admin/);
    
    // Navigate to users page
    await page.getByText(/пользователи/i).click();
    await expect(page).toHaveURL(/admin\/users/);
  });

  test('should display user management interface', async ({ page }) => {
    // Check page heading
    await expect(page.getByRole('heading', { name: /управление пользователями/i })).toBeVisible();
    
    // Check tabs
    await expect(page.getByText(/менеджеры/i)).toBeVisible();
    await expect(page.getByText(/преподаватели/i)).toBeVisible();
    await expect(page.getByText(/студенты/i)).toBeVisible();
    
    // Check search functionality
    await expect(page.getByPlaceholder(/поиск пользователей/i)).toBeVisible();
    
    // Check add user button
    await expect(page.getByText(/добавить пользователя/i)).toBeVisible();
  });

  test('should be able to add a new user', async ({ page }) => {
    // Click add user button
    await page.getByText(/добавить пользователя/i).click();
    
    // Check if dialog opens
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/добавить пользователя/i)).toBeVisible();
    
    // Check form elements
    await expect(page.getByLabel(/тип пользователя/i)).toBeVisible();
    await expect(page.getByLabel(/имя/i)).toBeVisible();
    await expect(page.getByLabel(/фамилия/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/телефон/i)).toBeVisible();
    
    // Close dialog
    await page.getByText(/отмена/i).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should display users in table', async ({ page }) => {
    // Check that users are displayed in table
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check table headers
    await expect(page.getByText(/имя/i)).toBeVisible();
    await expect(page.getByText(/email/i)).toBeVisible();
    await expect(page.getByText(/роль/i)).toBeVisible();
    await expect(page.getByText(/статус/i)).toBeVisible();
    await expect(page.getByText(/действия/i)).toBeVisible();
    
    // Check that at least one user is displayed
    // Note: In a real test, we would check for specific users from seed data
    await expect(page.getByRole('row')).toHaveCount(3); // Header + 2 sample users
  });

  test('should be able to switch between user types', async ({ page }) => {
    // Check initial tab (managers)
    await expect(page.getByText(/менеджеры/i)).toHaveAttribute('aria-selected', 'true');
    
    // Switch to teachers tab
    await page.getByText(/преподаватели/i).click();
    await expect(page.getByText(/преподаватели/i)).toHaveAttribute('aria-selected', 'true');
    
    // Switch to students tab
    await page.getByText(/студенты/i).click();
    await expect(page.getByText(/студенты/i)).toHaveAttribute('aria-selected', 'true');
  });
});