// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',

  fullyParallel: true, // Independent tests can now run in parallel
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : undefined, // Add retries for stability with more workers
  workers: process.env.CI ? 2 : undefined, // Use all CPU cores locally

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['json', { outputFile: 'test-results/report.json' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    // Dynamic Base URL based on environment (stage, beta, prod)
    baseURL: require('./configs/environment').config.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'setup',
      testDir: './tests/setup',
      testMatch: /global\.setup\.js/,
    },
    {
      name: 'UI',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'API',
      testDir: './tests/api',
      dependencies: ['setup'],
      use: {},
    },
  ],
  outputDir: 'test-results/',
});
