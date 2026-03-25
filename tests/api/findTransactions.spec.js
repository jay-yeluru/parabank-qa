const { test } = require('../../fixtures/pom-fixture');
const { ApiResponsePage } = require('../../pages/ApiResponsePage');

test.describe('ParaBank - Find Transactions API (Self-Contained) @api @transactions', () => {
  test('TC-API-01 - Find transactions by amount returns correct data @smoke', async ({
    apiUserClient,
    billPayApiData,
    dataManager
  }) => {
    const { savingsAccountId, amount, payeeName } = billPayApiData;

    // 1. Call API: GET /accounts/{id}/transactions/amount/{amount}
    const response = await apiUserClient.findTransactionsByAmount(savingsAccountId, amount);

    // VERIFY: HTTP 200 (Step 1 API)
    const apiResponse = new ApiResponsePage(response);
    await apiResponse.verifyStatus(200);

    const body = await response.json();
    console.log('API Response body:', JSON.stringify(body, null, 2));

    // VERIFY: Content (Step 2 API)
    await apiResponse.verifyIsArray(body);
    await apiResponse.verifyArrayMinLength(body, 1);

    const transaction = body[0];
    await apiResponse.verifyTransactionDetails(
      transaction,
      savingsAccountId,
      amount,
      dataManager.getTransactionTypes().DEBIT,
      `${dataManager.getBillPaymentPattern()} ${payeeName}`
    );



  });

  test('TC-API-02 - Find transactions by non-existent amount', async ({
    apiUserClient,
    billPayApiData,
  }) => {
    const { savingsAccountId } = billPayApiData;

    const fakeAmount = '999999.99';
    const response = await apiUserClient.findTransactionsByAmount(savingsAccountId, fakeAmount);

    const apiResponse = new ApiResponsePage(response);
    await apiResponse.verifyStatusOneOf([200, 404]);

    if (response.status() === 200) {
      const body = await response.json();
      await apiResponse.verifyArrayEmpty(body);
    }
  });
});
