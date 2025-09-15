import { Page, expect } from '@playwright/test';
import { TEST_DATA } from './test-data';

/**
 * Helper functions for authentication flows
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserSession {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export class AuthHelpers {
  /**
   * Perform login with specified credentials
   */
  static async login(
    page: Page,
    credentials: LoginCredentials,
    expectSuccess = true
  ): Promise<void> {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill login form
    await page.getByLabel(/email/i).fill(credentials.email);
    await page.getByLabel(/password/i).fill(credentials.password);
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    if (expectSuccess) {
      // Wait for successful login redirect
      await page.waitForURL(/dashboard/);
      await expect(page).toHaveURL(/dashboard/);
    }
  }

  /**
   * Login as specific role
   */
  static async loginAsRole(page: Page, role: 'ADMIN' | 'MANAGER' | 'TEACHER'): Promise<void> {
    let credentials: LoginCredentials;
    
    switch (role) {
      case 'ADMIN':
        credentials = {
          email: TEST_DATA.USERS.ADMIN.email,
          password: TEST_DATA.USERS.ADMIN.password
        };
        break;
      case 'MANAGER':
        credentials = {
          email: TEST_DATA.USERS.MANAGER.email,
          password: TEST_DATA.USERS.MANAGER.password
        };
        break;
      case 'TEACHER':
        credentials = {
          email: TEST_DATA.USERS.TEACHERS.JOHN_SMITH.email,
          password: TEST_DATA.USERS.TEACHERS.JOHN_SMITH.password
        };
        break;
    }
    
    await this.login(page, credentials);
  }

  /**
   * Perform logout
   */
  static async logout(page: Page): Promise<void> {
    // Click logout button
    await page.getByRole('button', { name: /logout/i }).click();
    
    // Wait for redirect to login page
    await page.waitForURL(/login/);
    await expect(page).toHaveURL(/login/);
  }

  /**
   * Check if user is logged in by verifying dashboard access
   */
  static async isLoggedIn(page: Page): Promise<boolean> {
    try {
      await page.goto('/dashboard');
      await page.waitForTimeout(1000); // Brief wait for redirects
      
      const currentUrl = page.url();
      return !currentUrl.includes('/login');
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user role from local storage or page context
   */
  static async getCurrentUserRole(page: Page): Promise<string | null> {
    try {
      // Try to get role from local storage
      const userData = await page.evaluate(() => {
        return localStorage.getItem('user');
      });
      
      if (userData) {
        const user = JSON.parse(userData);
        return user.role || null;
      }
      
      // Alternative: check for role-specific elements on page
      const adminElements = await page.getByText(/admin/i).count();
      const managerElements = await page.getByText(/manager/i).count();
      const teacherElements = await page.getByText(/teacher/i).count();
      
      if (adminElements > 0) return 'ADMIN';
      if (managerElements > 0) return 'MANAGER';
      if (teacherElements > 0) return 'TEACHER';
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify user has access to specific route based on role
   */
  static async verifyRoleAccess(
    page: Page,
    route: string,
    expectedAccess: boolean
  ): Promise<void> {
    await page.goto(route);
    
    if (expectedAccess) {
      // Should be able to access the route
      await expect(page).not.toHaveURL(/login/);
      await expect(page).not.toHaveURL(/unauthorized/);
    } else {
      // Should be redirected to login or unauthorized
      const currentUrl = page.url();
      expect(currentUrl.includes('/login') || currentUrl.includes('/unauthorized')).toBeTruthy();
    }
  }

  /**
   * Clear authentication state (local storage, cookies)
   */
  static async clearAuthState(page: Page): Promise<void> {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Setup authentication state for tests
   */
  static async setupAuth(
    page: Page,
    credentials?: LoginCredentials
  ): Promise<void> {
    await this.clearAuthState(page);
    
    if (credentials) {
      await this.login(page, credentials);
    }
  }
}

// Re-export for convenience
export const login = AuthHelpers.login;
export const loginAsRole = AuthHelpers.loginAsRole;
export const logout = AuthHelpers.logout;
export const isLoggedIn = AuthHelpers.isLoggedIn;
export const getCurrentUserRole = AuthHelpers.getCurrentUserRole;
export const verifyRoleAccess = AuthHelpers.verifyRoleAccess;
export const clearAuthState = AuthHelpers.clearAuthState;
export const setupAuth = AuthHelpers.setupAuth;