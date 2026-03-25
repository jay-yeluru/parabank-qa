const { contextFixtures } = require('./context-fixtures');
const { ApiClient } = require('../utils/apiClient');

/**
 * @typedef {object} ApiFixtures
 * @property {ApiClient} apiUserClient - Authenticated API client for the registered user
 * @property {object} apiData - Self-contained data for API testing (User + Account)
 */

/** @type {import('@playwright/test').TestType<ApiFixtures & import('./context-fixtures').ContextFixtures, {}>} */
const apiFixtures = contextFixtures.extend({
  // Authenticated API client fixture
  apiUserClient: async ({ request, registeredUser }, use) => {
    const apiClient = new ApiClient(request, registeredUser.username, registeredUser.password);
    await use(apiClient);
  },

  // Self-contained data fixture for API tests
  apiData: async ({ request, dataManager, registeredUser }, use) => {
    const apiClient = new ApiClient(request, registeredUser.username, registeredUser.password);
    
    // 1. Get Customer ID via login API
    const loginResponse = await request.get(`/parabank/services/bank/login/${registeredUser.username}/${registeredUser.password}`, {
      headers: { Accept: 'application/json' }
    });
    const customer = await loginResponse.json();
    const customerId = customer.id;
    
    // 2. Get Customer's accounts to find an initial one
    const accountsResponse = await request.get(`/parabank/services/bank/customers/${customerId}/accounts`, {
      headers: { Accept: 'application/json' }
    });
    const accounts = await accountsResponse.json();
    const initialAccountId = accounts[0].id; // ParaBank usually returns an array directly
    
    // 3. Create a new "SAVINGS" account via API
    const createResponse = await apiClient.createAccount(customerId, initialAccountId, 'SAVINGS');
    const newAccount = await createResponse.json();

    
    // 3. Perform a deposit/transfer to have a transaction to search for
    const amount = '123.45';
    await request.post(`/parabank/services/bank/deposit`, {
      params: { accountId: newAccount.id, amount: amount },
      headers: { 
        Accept: 'application/json',
        Authorization: apiClient.getAuthHeader()
      }
    });

    await use({
      userData: registeredUser,
      savingsAccountId: newAccount.id,
      amount: amount
    });
  }
});

module.exports = { test: apiFixtures };

