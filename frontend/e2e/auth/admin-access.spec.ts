import { test, expect } from '@playwright/test';

test.describe('Admin Access Control', () => {
  test('should redirect non-admin users from admin pages', async ({ page }) => {
    // Try to access admin page directly without login
    await page.goto('/admin/dashboard');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/login/);
  });
  
  test('should allow admin user to access admin pages', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@englishschool.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /войти/i }).click();
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/admin/);
    
    // Try to access admin dashboard directly
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/admin\/dashboard/);
    await expect(page.getByRole('heading', { name: /панель администратора/i })).toBeVisible();
  });
  
  test('should prevent manager user from accessing admin pages', async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('manager@englishschool.com');
    await page.getByLabel(/password/i).fill('manager123');
    await page.getByRole('button', { name: /войти/i }).click();
    
    // Should redirect to manager dashboard, not admin
    await expect(page).toHaveURL(/manager/);
    
    // Try to access admin dashboard directly
    await page.goto('/admin/dashboard');
    
    // Should redirect to unauthorized page or dashboard
    await expect(page).not.toHaveURL(/admin\/dashboard/);
  });
});