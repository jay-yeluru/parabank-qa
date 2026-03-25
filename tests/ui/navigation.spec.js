// @ts-check
const { test } = require('../../fixtures/pom-fixture');
const { TestDataManager } = require('../../utils/TestDataManager');

test.describe('ParaBank - Global Navigation (Step 4)', () => {
  const dataManager = new TestDataManager();
  let userData;

  // Use beforeAll to ensure a user exists for this spec if needed
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    try {
      const { LoginPage } = require('../../pages/LoginPage');
      const { RegisterPage } = require('../../pages/RegisterPage');
      const lp = new LoginPage(page);
      const rp = new RegisterPage(page);
      userData = dataManager.generateFreshUser();
      
      await lp.navigate();
      await lp.clickRegister();
      await rp.register(userData);
      await rp.verifyRegistrationSuccess(userData.username);
    } finally {
      await page.close();
    }
  });

  test('TC-01 - Global Navigation Menu Visibility', async ({ poManager }) => {
    const loginPage = poManager.getLoginPage();
    const homePage = poManager.getHomePage();

    // 4. Verify global navigation menu works as expected (Step 4)
    await loginPage.navigate();
    await loginPage.login(userData.username, userData.password);
    await loginPage.verifySuccessfulLogin();

    await homePage.verifyGlobalNavMenu();
    await homePage.clickNavLink('Accounts Overview');
    await homePage.verifyNavigatedTo(/overview/);
  });
});
