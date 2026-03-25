// @ts-check
const { test } = require('../../fixtures/pom-fixture');

test.describe('ParaBank - Global Navigation (Step 4) @ui @navigation', () => {

  test('TC-01 - Global Navigation Menu Visibility and Links', async ({ poManager, loggedInPage, dataManager }) => {
    const homePage = poManager.getHomePage();

    // No need to manually login anymore!


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
