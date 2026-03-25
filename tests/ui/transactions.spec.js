const { test } = require('../../fixtures/pom-fixture');


test.describe('ParaBank - Fund Transfers and Bill Payments (Step 7 & 8)', () => {

  test('TC-01 - Transfer Funds and Pay Bill', async ({ poManager, dataManager, savingsAccount }) => {
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
    const defaultAccountId = accountRows.find(r => r.accountId !== savingsAccountId)?.accountId || accountRows[0].accountId;

    // 7. Transfer funds (Step 7: FROM account created in step 5 TO another account)
    await transferPage.navigate();
    await transferPage.transferFunds(dataManager.getTransferAmount(), savingsAccountId, defaultAccountId);
    await transferPage.verifyTransferSuccess();

    // 8. Pay the bill (Step 8: with account created in step 5)
    const billData = dataManager.generateBillData('50.00', 'TRANSACTIONS_SPEC');
    await billPayPage.navigate();
    await billPayPage.payBill(billData, savingsAccountId);
    await billPayPage.verifyBillPaymentSuccess(billData.payeeName);
  });
});


