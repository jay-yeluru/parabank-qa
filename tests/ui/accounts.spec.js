const { test } = require('../../fixtures/pom-fixture');


test.describe('ParaBank - Accounts Management (Step 5 & 6)', () => {

  test('TC-01 - Open New Savings Account and Verify Overview', async ({ poManager, dataManager, registeredUser }) => {
    const userData = registeredUser;

    const loginPage = poManager.getLoginPage();
    const openAccountPage = poManager.getOpenNewAccountPage();
    const overviewPage = poManager.getAccountsOverviewPage();

    await loginPage.navigate();
    await loginPage.login(userData.username, userData.password);
    await loginPage.verifySuccessfulLogin();

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


