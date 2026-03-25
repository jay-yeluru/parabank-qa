// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',

  fullyParallel: true, // Independent tests can now run in parallel
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Add retries for stability with more workers
  workers: process.env.CI ? 2 : undefined, // Use all CPU cores locally

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['json', { outputFile: 'test-results/report.json' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'UI',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'API',
      testDir: './tests/api',
      // No more dependency on UI! Both projects can now run in parallel.
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'test-results/',
});
