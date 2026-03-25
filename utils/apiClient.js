/**
 * API client for ParaBank REST services.
 * Refactor note: Now accepts a request context directly for better integration with Playwright fixtures.
 */
class ApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {string} username
   * @param {string} password
   */
  constructor(request, username, password) {
    this.request = request;
    this.username = username;
    this.password = password;
  }

  /**
   * Gets the authorization header value.
   * @returns {string}
   */
  getAuthHeader() {
    return 'Basic ' + Buffer.from(`${this.username}:${this.password}`).toString('base64');
  }

  /**
   * Searches transactions for a given account by amount.
   * @param {string|number} accountId
   * @param {string|number} amount
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async findTransactionsByAmount(accountId, amount) {
    return this.request.get(
      `/parabank/services/bank/accounts/${accountId}/transactions/amount/${amount}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: this.getAuthHeader(),
        },
      }
    );
  }

  /**
   * Opens a new account via API (Requires customerId).
   * @param {string|number} customerId
   * @param {string|number} fromAccountId
   * @param {string} accountType - 'CHECKING' or 'SAVINGS'
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async createAccount(customerId, fromAccountId, accountType) {
    return this.request.post(`/parabank/services/bank/createAccount`, {
      params: {
        customerId: customerId,
        newAccountType: accountType === 'SAVINGS' ? 1 : 0, // ParaBank uses 0/1 for account types in some API versions
        fromAccountId: fromAccountId,
      },
      headers: {
        Accept: 'application/json',
        Authorization: this.getAuthHeader(),
      },
    });
  }
}

module.exports = { ApiClient };
