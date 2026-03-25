const { test } = require('../../fixtures/pom-fixture');

test.describe('ParaBank - Fund Transfers and Bill Payments (Step 7 & 8) @ui @transactions', () => {
  test('TC-01 - Transfer Funds and Pay Bill @smoke', async ({
    poManager,
    dataManager,
    savingsAccount,
  }) => {
    const { userData, accountId: savingsAccountId } = savingsAccount;

    const loginPage = poManager.getLoginPage();
    const overviewPage = poManager.getAccountsOverviewPage();
    const transferPage = poManager.getTransferFundsPage();
    const billPayPage = poManager.getBillPayPage();

    await loginPage.navigate();
    await loginPage.login(userData.username, userData.password);
    await loginPage.verifySuccessfulLogin();

    // Preparation: Get a from-account ID which isn't the new savings account
    await overviewPage.navigate();
    const accountRows = await overviewPage.getAccountRows();
    const defaultAccountId =
      accountRows.find((r) => r.accountId !== savingsAccountId)?.accountId ||
      accountRows[0].accountId;

    // 7. Transfer funds (Step 7: FROM account created in step 5 TO another account)
    await transferPage.navigate();
    const transferAmount = dataManager.getTransferAmount();
    await transferPage.transferFunds(
      transferAmount,
      savingsAccountId,
      defaultAccountId
    );
    await transferPage.verifyTransferSuccess(transferAmount);

    // 8. Pay the bill (Step 8: with account created in step 5)
    const billData = dataManager.generateBillData(undefined, 'UI');

    await billPayPage.navigate();
    await billPayPage.payBill(billData, savingsAccountId);
    await billPayPage.verifyBillPaymentSuccess(billData);

  });
});
