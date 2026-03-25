const baseTest = require('@playwright/test');
const { apiFixtures } = require('./api-fixtures');

/**
 * Main consolidated test export.
 * Combines Core, Context (UI Setup), and API fixtures.
 */
module.exports = {
  test: apiFixtures,
  expect: baseTest.expect,
};
