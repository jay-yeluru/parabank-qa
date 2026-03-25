// @ts-check
const { test } = require('../../fixtures/pom-fixture');

test.describe('ParaBank - Global Navigation (Step 4) @ui @navigation', () => {

  test('TC-01 - Global Navigation Menu Visibility and Links', async ({ poManager, registeredUser, dataManager }) => {
    const loginPage = poManager.getLoginPage();
    const homePage = poManager.getHomePage();

    await test.step('Login to access global navigation', async () => {
      await loginPage.navigate();
      await loginPage.login(registeredUser.username, registeredUser.password);
      await loginPage.verifySuccessfulLogin();
    });

    await test.step('Verify all navigation menu links are visible', async () => {
      await homePage.verifyGlobalNavMenu();
    });

    const navItems = dataManager.getNavItems();

    for (const item of navItems) {

      await test.step(`Click and verify navigation to: ${item.name}`, async () => {
        await homePage.clickNavLink(item.name);
        await homePage.verifyNavigatedTo(item.expectedUrl);
      });
    }
  });
});
