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
    const homePage = poManager.getHomePage();

    await loginPage.navigate();
    await loginPage.clickRegister();
    await registerPage.register(userData);
    await registerPage.verifyRegistrationSuccess(userData.username);

    // Many ParaBank tests expect to log in explicitly. Ensure we start logged out.
    if (await homePage.navLogout.isVisible({ timeout: 5000 })) {
      await homePage.logout();
    }

    await use(userData);
  },

  // Savings Account fixture
  savingsAccount: async ({ poManager, dataManager, registeredUser }, use) => {
    const openAccountPage = poManager.getOpenNewAccountPage();
    const loginPage = poManager.getLoginPage();

    // Login if not already logged in (usually registeredUser finishes at register success page)
    await loginPage.navigate();
    await loginPage.login(registeredUser.username, registeredUser.password);

    await openAccountPage.navigate();
    const accountId = await openAccountPage.openAccount(dataManager.getSavingsAccountType());

    const homePage = poManager.getHomePage();
    await homePage.logout();

    await use({ accountId, userData: registeredUser });
  },
});

module.exports = { contextFixtures };
