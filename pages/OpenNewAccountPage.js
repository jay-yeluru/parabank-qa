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
    await this.page.goto('/parabank/openaccount.htm');
  }

  /**
   * Opens a new account of the given type.
   * @param {'CHECKING'|'SAVINGS'} accountType
   * @returns {Promise<string>} the new account number
   */
  async openAccount(accountType = 'SAVINGS') {
    // Wait for the from-account dropdown to populate
    await this.fromAccountSelect.waitFor({ state: 'visible' });
    await expect(this.fromAccountSelect.locator('option')).not.toHaveCount(0);

    // Select account type
    await this.accountTypeSelect.selectOption({ label: accountType });

    await this.openAccountButton.click();

    // Wait for result
    await expect(this.successHeader).toContainText('Account Opened!', { timeout: 15000 });

    const newAccountNumber = await this.newAccountId.textContent();
    return newAccountNumber.trim();
  }
}

module.exports = { OpenNewAccountPage };
