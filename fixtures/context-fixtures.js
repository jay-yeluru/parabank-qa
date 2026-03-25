const { test } = require('@playwright/test');
const { coreFixtures } = require('./core-fixtures');

/**
 * @typedef {object} UserData
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} street
 * @property {string} city
 * @property {string} state
 * @property {string} zipCode
 * @property {string} phone
 * @property {string} ssn
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {object} ContextFixtures
 * @property {UserData} registeredUser
 * @property {import('@playwright/test').Page} loggedInPage
 * @property {object} savingsAccount
 * @property {string} savingsAccount.accountId
 * @property {UserData} savingsAccount.userData
 */

/** @type {import('@playwright/test').TestType<import('@playwright/test').PlaywrightTestArgs & import('@playwright/test').PlaywrightTestOptions & ContextFixtures & import('./core-fixtures').CoreFixtures, import('@playwright/test').PlaywrightWorkerArgs & import('@playwright/test').PlaywrightWorkerOptions>} */
const contextFixtures = coreFixtures.extend({
  // Registered User fixture
  registeredUser: async ({ poManager, dataManager }, use) => {
    const userData = dataManager.generateFreshUser();
    const loginPage = poManager.getLoginPage();
    const registerPage = poManager.getRegisterPage();

    await test.step(`Registering fresh user: ${userData.username}`, async () => {
      // UI-based registration ensures ParaBank initializes the session state machine correctly
      await loginPage.navigate();
      await loginPage.clickRegister();
      await registerPage.register(userData);
      await registerPage.verifyRegistrationSuccess(userData.username);
    });

    // Yield userData. Note: The browser session is now logged in.
    await use(userData);
  },

  // NEW: Pre-authenticated Page fixture
  loggedInPage: async ({ registeredUser, page }, use) => {
    await test.step('Navigating to Accounts Overview (Post-Login)', async () => {
      // registeredUser already finishes on the welcome page, logged in.
      // Ensure we are on the Overview page for a consistent test starting point
      await page.goto('/parabank/overview.htm');
    });
    await use(page);
  },

  // Savings Account fixture (Uses the loggedInPage state)
  savingsAccount: async ({ poManager, dataManager, registeredUser, loggedInPage }, use) => {
    const openAccountPage = poManager.getOpenNewAccountPage();

    let accountId;
    await test.step('Opening a new SAVINGS account', async () => {
      await openAccountPage.navigate();
      accountId = await openAccountPage.openAccount(dataManager.getSavingsAccountType());
    });

    // We leave the user logged in to save time in tests that use this fixture
    await use({ accountId, userData: registeredUser });
  },
});

module.exports = { contextFixtures };
