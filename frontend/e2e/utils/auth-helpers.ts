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
    options: { expectSuccess?: boolean; debug?: boolean } = { expectSuccess: true, debug: false }
  ): Promise<void> {
    const { expectSuccess = true, debug = false } = options;
    
    // Navigate to login page
    await page.goto('/login');
    
    if (debug) {
      console.log(`\n=== DEBUG: Navigating to login page ===`);
      console.log(`Current URL: ${page.url()}`);
    }
    
    // Fill login form
    await page.getByLabel(/email/i).fill(credentials.email);
    await page.getByLabel(/password/i).fill(credentials.password);
    
    if (debug) {
      console.log(`\n=== DEBUG: Form filled ===`);
      console.log(`Email: ${credentials.email}`);
      console.log(`Password: ${credentials.password.replace(/./g, '*')}`);
    }
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    if (debug) {
      await this.logNetworkActivity(page);
      await this.logConsoleErrors(page);
    }
    
    // Wait and check result
    try {
      if (expectSuccess) {
        // Wait for successful login redirect
        await page.waitForURL(/dashboard/, { timeout: 10000 });
        await expect(page).toHaveURL(/dashboard/);
        console.log(`\n=== SUCCESS: Redirected to dashboard ===`);
        console.log(`Final URL: ${page.url()}`);
      } else {
        // Wait for potential error or stay on login
        await page.waitForTimeout(5000);
        console.log(`\n=== DEBUG: Login attempt completed (expecting failure) ===`);
        console.log(`Final URL: ${page.url()}`);
        await this.logDebugInfo(page);
      }
    } catch (error) {
      console.log(`\n=== ERROR: ${error.message} ===`);
      if (debug) {
        await this.logDebugInfo(page);
      }
      throw error;
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
      await this.login(page, credentials, { debug: true });
    }
  }

  /**
   * Log network activity (requests and responses)
   */
  static async logNetworkActivity(page: Page): Promise<void> {
    console.log(`\n=== NETWORK ACTIVITY ===`);
    
    // Log all requests
    page.on('request', request => {
      console.log(`REQUEST: ${request.method()} ${request.url()}`);
    });
    
    // Log all responses
    page.on('response', response => {
      console.log(`RESPONSE: ${response.status()} ${response.url()}`);
      if (response.status() >= 400) {
        console.log(`ERROR RESPONSE: ${response.status()} ${response.url()}`);
      }
    });
  }

  /**
   * Log console errors
   */
  static async logConsoleErrors(page: Page): Promise<void> {
    console.log(`\n=== CONSOLE ERRORS ===`);
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`CONSOLE ERROR: ${msg.text()}`);
      }
    });
  }

  /**
   * Log debug information: cookies, localStorage, current URL
   */
  static async logDebugInfo(page: Page): Promise<void> {
    console.log(`\n=== DEBUG INFO ===`);
    console.log(`Current URL: ${page.url()}`);
    
    // Cookies
    const cookies = await page.context().cookies();
    console.log(`Cookies (${cookies.length}):`);
    cookies.forEach(cookie => {
      console.log(`  - ${cookie.name}: ${cookie.value}`);
    });
    
    // LocalStorage
    const localStorage = await page.evaluate(() => {
      return Object.entries(localStorage).map(([key, value]) => ({ key, value: JSON.stringify(value) }));
    });
    console.log(`LocalStorage (${localStorage.length} items):`);
    localStorage.forEach(item => {
      console.log(`  - ${item.key}: ${item.value}`);
    });
    
    // SessionStorage
    const sessionStorage = await page.evaluate(() => {
      return Object.entries(sessionStorage).map(([key, value]) => ({ key, value: JSON.stringify(value) }));
    });
    console.log(`SessionStorage (${sessionStorage.length} items):`);
    sessionStorage.forEach(item => {
      console.log(`  - ${item.key}: ${item.value}`);
    });
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