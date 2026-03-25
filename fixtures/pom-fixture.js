const baseTest = require('@playwright/test');
const { contextFixtures } = require('./context-fixtures');

/**
 * Main test export combining all fixtures.
 * Refactor note: Split into core and context fixtures for better maintainability.
 */
module.exports = {
  test: contextFixtures,
  expect: baseTest.expect,
};
