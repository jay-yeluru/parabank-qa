const { expect } = require('@playwright/test');

class ApiResponsePage {
  /**
   * @param {import('@playwright/test').APIResponse} response
   */
  constructor(response) {
    this.response = response;
  }

  async verifyStatus(expectedStatus = 200) {
    expect(this.response.status()).toBe(expectedStatus);
  }

  async verifyStatusOneOf(statusArray) {
    expect(statusArray).toContain(this.response.status());
  }

  /**
   * @param {any} body
   */
  async verifyIsArray(body) {
    expect(Array.isArray(body)).toBe(true);
  }

  /**
   * @param {any[]} body
   * @param {number} minLength
   */
  async verifyArrayMinLength(body, minLength = 1) {
    expect(body.length).toBeGreaterThanOrEqual(minLength);
  }

  /**
   * @param {any[]} body
   */
  async verifyArrayEmpty(body) {
    expect(body.length).toBe(0);
  }

  /**
   * @param {any} transaction
   * @param {string} accountId
   * @param {string} amount
   * @param {string} type
   * @param {string} descriptionFragment
   */
  async verifyTransactionDetails(transaction, accountId, amount, type, descriptionFragment) {
    expect(String(transaction.accountId)).toBe(String(accountId));
    expect(parseFloat(transaction.amount)).toBeCloseTo(parseFloat(amount), 2);
    expect(transaction.type).toBe(type);
    expect(transaction.description).toContain(descriptionFragment);
  }
}

module.exports = { ApiResponsePage };
