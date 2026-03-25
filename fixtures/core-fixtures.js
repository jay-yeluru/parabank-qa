const baseTest = require('@playwright/test');
const { POManager } = require('../pages/POManager');
const { TestDataManager } = require('../utils/TestDataManager');
const { UtilsManager } = require('../utils/UtilsManager');

/**
 * @typedef {object} CoreFixtures
 * @property {POManager} poManager
 * @property {TestDataManager} dataManager
 * @property {UtilsManager} utilsManager
 */

/** @type {baseTest.TestType<CoreFixtures, {}>} */
const coreFixtures = baseTest.test.extend({
  // Data Manager fixture
  dataManager: async ({}, use) => {
    const dataManager = new TestDataManager();
    await use(dataManager);
  },

  // PO Manager fixture
  poManager: async ({ page }, use) => {
    const poManager = new POManager(page);
    await use(poManager);
  },

  // Utils Manager fixture
  utilsManager: async ({}, use) => {
    const utilsManager = new UtilsManager();
    await use(utilsManager);
  },
});

module.exports = { coreFixtures };
