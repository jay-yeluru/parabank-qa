const { expect } = require('@playwright/test');

class OpenNewAccountPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.openAccountButton = page.getByRole('button', { name: 'Open New Account' });
    this.newAccountId = page.locator('#newAccountId');
    this.successHeader = page.locator('#openAccountResult h1');
  }

  async navigate() {
    await test.step('Navigate to Open New Account page', async () => {
      await this.page.goto('/parabank/openaccount.htm');
    });
  }

  /**
   * Opens a new account of the given type.
   * @param {string} accountType
   * @returns {Promise<string>} the new account number
   */
  async openAccount(accountType = 'SAVINGS') {
    return await test.step(`Open a new ${accountType} account`, async () => {
      // Wait for the from-account dropdown to populate
      await this.fromAccountSelect.waitFor({ state: 'visible' });
      await expect(this.fromAccountSelect.locator('option')).not.toHaveCount(0);

      // Select account type
      await this.accountTypeSelect.selectOption({ label: accountType });

      await this.openAccountButton.click();

      // Wait for result and ensure the new account value is actually populated
      // Parabank sometimes shows the link but with no text for a split second
      await expect(this.successHeader).toContainText('Account Opened!', { timeout: 15000 });
      
      // Wait specifically for the link to contain a digit (the account number)
      await expect(this.newAccountId).toContainText(/\d+/, { timeout: 15000 });

      const newAccountNumber = await this.newAccountId.textContent();
      return newAccountNumber.trim();
    });
  }

  async verifyValidAccountIdFormat(accountId) {
    await test.step(`Verify account ID format: ${accountId}`, async () => {
      expect(accountId).toBeTruthy();
      expect(accountId).toMatch(/\d+/);
    });
  }
}

const { test } = require('@playwright/test');

module.exports = { OpenNewAccountPage };
