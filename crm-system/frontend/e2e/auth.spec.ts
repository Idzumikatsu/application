import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/login');
  });

  test('should display login page correctly', async ({ page }) => {
    // Check if login page elements are visible
    await expect(page).toHaveTitle(/CRM System/);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    // Fill form with invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for email validation error
    await expect(page.getByText(/enter a valid email address/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Mock API response for invalid credentials
    await page.route('**/api/auth/signin', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    // Fill form with invalid credentials
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Mock API response for successful login
    await page.route('**/api/auth/signin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'TEACHER'
        }),
      });
    });

    // Fill form with valid credentials
    await page.getByLabel(/email/i).fill('john.doe@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check if redirected to dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText(/welcome, john/i)).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    // Click on signup link
    await page.getByRole('link', { name: /sign up/i }).click();

    // Check if navigated to signup page
    await expect(page).toHaveURL(/signup/);
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
  });

  test('should successfully register new user', async ({ page }) => {
    // Navigate to signup page
    await page.getByRole('link', { name: /sign up/i }).click();

    // Mock API response for successful registration
    await page.route('**/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'User registered successfully!' }),
      });
    });

    // Fill registration form
    await page.getByLabel(/first name/i).fill('Jane');
    await page.getByLabel(/last name/i).fill('Smith');
    await page.getByLabel(/email/i).fill('jane.smith@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    await page.getByLabel(/role/i).selectOption('TEACHER');
    await page.getByRole('button', { name: /sign up/i }).click();

    // Check for success message and redirect to login
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText(/registration successful/i)).toBeVisible();
  });

  test('should show password mismatch error', async ({ page }) => {
    // Navigate to signup page
    await page.getByRole('link', { name: /sign up/i }).click();

    // Fill form with mismatched passwords
    await page.getByLabel(/first name/i).fill('Jane');
    await page.getByLabel(/last name/i).fill('Smith');
    await page.getByLabel(/email/i).fill('jane.smith@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('differentpassword');
    await page.getByRole('button', { name: /sign up/i }).click();

    // Check for password mismatch error
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.route('**/api/auth/signin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'TEACHER'
        }),
      });
    });

    await page.getByLabel(/email/i).fill('john.doe@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Mock logout API call
    await page.route('**/api/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Logged out successfully' }),
      });
    });

    // Click logout button
    await page.getByRole('button', { name: /logout/i }).click();

    // Check if redirected to login page
    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });
});