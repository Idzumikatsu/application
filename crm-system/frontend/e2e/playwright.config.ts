import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import CustomReporter from './utils/custom-reporter';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['list', { printSteps: true }],
    [CustomReporter]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Capture screenshot on failure */
    screenshot: 'on',
    /* Capture video on failure */
    video: 'on',
    /* Viewport settings */
    viewport: { width: 1280, height: 720 },
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    /* Extra HTTP headers */
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  /* Global setup and teardown */
  globalSetup: require.resolve('./utils/global-setup'),
  globalTeardown: require.resolve('./utils/global-teardown'),

  /* Timeout settings */
  timeout: 30000,
  expect: {
    timeout: 10000
  },

  /* Output directory for test results */
  outputDir: 'test-results/',

  /* Test match patterns */
  testMatch: '**/*.spec.ts',
  testIgnore: '**/node_modules/**',

  /* Snapshot settings */
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',

  /* Preserve output directory */
  preserveOutput: 'always',

  /* Shard tests for CI */
  shard: process.env.CI ? {
    total: Number(process.env.CI_NODE_TOTAL) || 1,
    current: Number(process.env.CI_NODE_INDEX) || 0
  } : undefined,

  /* Environment variables */
  env: {
    NODE_ENV: 'test',
    TEST_MODE: 'e2e',
    API_BASE_URL: process.env.API_URL || 'http://localhost:8080/api',
    HEADLESS: process.env.HEADLESS || 'true',
    SLOW_MO: process.env.SLOW_MO || '100'
  }
});
