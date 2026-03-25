const { test } = require('../../fixtures/pom-fixture');

test.describe('ParaBank - Accounts Management (Step 5 & 6) @ui @accounts', () => {
  test('TC-01 - Open New Savings Account and Verify Overview @smoke', async ({
    poManager,
    dataManager,
    registeredUser,
  }) => {
    const userData = registeredUser;

    const openAccountPage = poManager.getOpenNewAccountPage();
    const overviewPage = poManager.getAccountsOverviewPage();

    // The user is already logged in via the savingsAccount fixture dependency!
    // 5. Create a Savings account (Step 5)
    await openAccountPage.navigate();
    const savingsAccountId = await openAccountPage.openAccount(dataManager.getSavingsAccountType());
    await openAccountPage.verifyValidAccountIdFormat(savingsAccountId);

    // 6. Validate balance details in accounts overview (Step 6)
    await overviewPage.navigate();
    await overviewPage.verifyAccountExists(savingsAccountId);
    await overviewPage.verifyBalancesDisplayed();
  });
});
