const { contextFixtures } = require('./context-fixtures');
const { ApiClient } = require('../utils/apiClient');

/**
 * @typedef {object} ApiFixtures
 * @property {ApiClient} apiUserClient - Authenticated API client for the registered user
 * @property {object} apiData - Self-contained data for API testing (User + Account)
 */

/** @type {import('@playwright/test').TestType<ApiFixtures & import('./context-fixtures').ContextFixtures & import('./core-fixtures').CoreFixtures, {}>} */
const apiFixtures = contextFixtures.extend({
  // Authenticated API client fixture
  apiUserClient: async ({ request, registeredUser }, use) => {
    const apiClient = new ApiClient(request, registeredUser.username, registeredUser.password);
    await use(apiClient);
  },

  // Self-contained data fixture for API tests testing Bill Pay
  billPayApiData: async ({ request, savingsAccount, dataManager }, use) => {
    const { userData, accountId } = savingsAccount;
    const apiClient = new ApiClient(request, userData.username, userData.password);

    // Use dataManager instead of hardcoding values
    const billData = dataManager.generateBillData(undefined, 'API');
    const { amount, payeeName } = billData;

    const billPayRes = await request.post(`/parabank/services/bank/billpay`, {
      params: { 
        accountId: accountId, 
        amount: amount
      },
      data: {
        name: payeeName,
        address: {
          street: billData.street,
          city: billData.city,
          state: billData.state,
          zipCode: billData.zipCode
        },
        phoneNumber: billData.phone,
        accountNumber: billData.accountNumber
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': apiClient.getAuthHeader(),
      },
    });

    if (!billPayRes.ok()) {
      throw new Error(`Bill pay failed with status ${billPayRes.status()}: ${await billPayRes.text()}`);
    }

    // Give DB a moment to record the transaction
    await new Promise(r => setTimeout(r, 1000));

    await use({
      userData: userData,
      savingsAccountId: accountId,
      amount: amount,
      payeeName: payeeName,
    });
  },
});

module.exports = { apiFixtures };
