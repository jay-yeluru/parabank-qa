const { request } = require('@playwright/test');

/**
 * API client for ParaBank REST services.
 * Uses the services_proxy/bank base path.
 */
class ApiClient {
  /**
   * @param {string} apiBaseUrl
   * @param {string} username
   * @param {string} password
   */
  constructor(apiBaseUrl, username, password) {
    this.apiBaseUrl = apiBaseUrl;
    this.username = username;
    this.password = password;
  }

  /**
   * Searches transactions for a given account by amount.
   * @param {string|number} accountId
   * @param {string|number} amount
   * @returns {Promise<Array>}
   */
  async findTransactionsByAmount(accountId, amount) {
    const context = await request.newContext({
      baseURL: this.apiBaseUrl,
      extraHTTPHeaders: {
        Accept: 'application/json',
        Authorization:
          'Basic ' +
          Buffer.from(`${this.username}:${this.password}`).toString('base64'),
      },
    });

    const response = await context.get(
      `/accounts/${accountId}/transactions/amount/${amount}`
    );

    const status = response.status();
    const body = await response.json();

    await context.dispose();
    return { status, body };
  }
}

module.exports = { ApiClient };
