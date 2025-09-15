import { Page, Locator, expect } from '@playwright/test';

/**
 * Common page interaction helpers for CRM system
 */

export class PageHelpers {
  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for specific element to be visible
   */
  static async waitForElementVisible(
    page: Page,
    selector: string | Locator,
    timeout = 10000
  ): Promise<void> {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await element.waitFor({ state: 'visible', timeout });
  }

  /**
   * Fill form field with validation
   */
  static async fillFormField(
    page: Page,
    fieldLabel: string | RegExp,
    value: string,
    fieldType: 'input' | 'textarea' | 'select' = 'input'
  ): Promise<void> {
    let field: Locator;
    
    switch (fieldType) {
      case 'textarea':
        field = page.getByLabel(fieldLabel);
        break;
      case 'select':
        field = page.getByLabel(fieldLabel);
        await field.selectOption(value);
        return;
      default:
        field = page.getByLabel(fieldLabel);
    }
    
    await field.fill(value);
    await field.blur(); // Trigger validation
  }

  /**
   * Click button with retry logic
   */
  static async clickButton(
    page: Page,
    buttonText: string | RegExp,
    buttonType: 'button' | 'link' = 'button',
    maxRetries = 3
  ): Promise<void> {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const button = buttonType === 'button' 
          ? page.getByRole('button', { name: buttonText })
          : page.getByRole('link', { name: buttonText });
        
        await button.click();
        await page.waitForTimeout(500); // Brief pause after click
        return;
      } catch (error) {
        retries++;
        if (retries >= maxRetries) throw error;
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Verify toast/snackbar message
   */
  static async verifyToastMessage(
    page: Page,
    message: string | RegExp,
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
  ): Promise<void> {
    const toast = page.locator(`[role="alert"], [data-testid="toast"], .MuiSnackbar-root`);
    await toast.waitFor({ state: 'visible' });
    
    const toastMessage = toast.getByText(message);
    await expect(toastMessage).toBeVisible();
    
    // Optional: verify toast type by class or attribute
    if (type !== 'success') {
      const toastClass = await toast.getAttribute('class');
      expect(toastClass).toContain(type);
    }
  }

  /**
   * Handle dialog/modals
   */
  static async handleDialog(
    page: Page,
    action: 'confirm' | 'cancel',
    dialogTitle?: string | RegExp
  ): Promise<void> {
    let dialog: Locator;
    
    if (dialogTitle) {
      dialog = page.getByRole('dialog').filter({ has: page.getByText(dialogTitle) });
    } else {
      dialog = page.getByRole('dialog').first();
    }
    
    await dialog.waitFor({ state: 'visible' });
    
    const buttonText = action === 'confirm' ? /confirm|yes|ok|submit/i : /cancel|no|close/i;
    const button = dialog.getByRole('button', { name: buttonText });
    
    await button.click();
    await dialog.waitFor({ state: 'hidden' });
  }

  /**
   * Verify table contains specific data
   */
  static async verifyTableContains(
    page: Page,
    tableSelector: string | Locator,
    expectedData: string[],
    columnIndex?: number
  ): Promise<void> {
    const table = typeof tableSelector === 'string' ? page.locator(tableSelector) : tableSelector;
    await table.waitFor({ state: 'visible' });
    
    for (const data of expectedData) {
      let cell: Locator;
      
      if (columnIndex !== undefined) {
        cell = table.locator(`tbody tr td:nth-child(${columnIndex + 1})`).getByText(data);
      } else {
        cell = table.locator(`tbody tr`).getByText(data);
      }
      
      await expect(cell).toBeVisible();
    }
  }

  /**
   * Search in data table
   */
  static async searchInTable(
    page: Page,
    searchTerm: string,
    searchInputSelector = 'input[placeholder*="Search"]'
  ): Promise<void> {
    const searchInput = page.locator(searchInputSelector);
    await searchInput.fill(searchTerm);
    await searchInput.press('Enter');
    await page.waitForTimeout(1000); // Wait for search results
  }

  /**
   * Navigate to specific page via menu
   */
  static async navigateViaMenu(
    page: Page,
    menuItem: string,
    subMenuItem?: string
  ): Promise<void> {
    // Open main menu if needed
    const menuButton = page.getByRole('button', { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
    
    // Click main menu item
    const mainItem = page.getByRole('menuitem', { name: menuItem });
    await mainItem.click();
    
    // Click sub-menu item if provided
    if (subMenuItem) {
      const subItem = page.getByRole('menuitem', { name: subMenuItem });
      await subItem.click();
    }
    
    await this.waitForPageLoad(page);
  }

  /**
   * Get cell value from table
   */
  static async getTableCellValue(
    page: Page,
    tableSelector: string | Locator,
    rowIndex: number,
    columnIndex: number
  ): Promise<string | null> {
    const table = typeof tableSelector === 'string' ? page.locator(tableSelector) : tableSelector;
    const cell = table.locator(`tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${columnIndex + 1})`);
    return await cell.textContent();
  }

  /**
   * Verify page title
   */
  static async verifyPageTitle(
    page: Page,
    expectedTitle: string | RegExp
  ): Promise<void> {
    const title = page.getByRole('heading', { level: 1 }).getByText(expectedTitle);
    await expect(title).toBeVisible();
  }

  /**
   * Take screenshot for debugging
   */
  static async takeScreenshot(
    page: Page,
    name: string,
    fullPage = false
  ): Promise<void> {
    await page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage
    });
  }
}

// Re-export for convenience
export const waitForPageLoad = PageHelpers.waitForPageLoad;
export const waitForElementVisible = PageHelpers.waitForElementVisible;
export const fillFormField = PageHelpers.fillFormField;
export const clickButton = PageHelpers.clickButton;
export const verifyToastMessage = PageHelpers.verifyToastMessage;
export const handleDialog = PageHelpers.handleDialog;
export const verifyTableContains = PageHelpers.verifyTableContains;
export const searchInTable = PageHelpers.searchInTable;
export const navigateViaMenu = PageHelpers.navigateViaMenu;
export const getTableCellValue = PageHelpers.getTableCellValue;
export const verifyPageTitle = PageHelpers.verifyPageTitle;
export const takeScreenshot = PageHelpers.takeScreenshot;