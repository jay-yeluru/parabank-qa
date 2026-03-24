const { expect } = require('@playwright/test');

class TransferFundsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.successHeader = page.locator('#showResult h1');
    this.transferAmount = page.locator('#showResult .ng-binding').first();
  }

  async navigate() {
    await this.page.goto('/parabank/transfer.htm');
  }

  /**
   * Transfers funds between two accounts.
   * @param {string} amount
   * @param {string} fromAccountId
   * @param {string} toAccountId
   */
  async transferFunds(amount, fromAccountId, toAccountId) {
    await this.fromAccountSelect.waitFor({ state: 'visible' });
    await expect(this.fromAccountSelect.locator('option')).not.toHaveCount(0);

    await this.amountInput.fill(amount);
    await this.fromAccountSelect.selectOption({ value: fromAccountId });
    await this.toAccountSelect.selectOption({ value: toAccountId });
    await this.transferButton.click();

    await expect(this.successHeader).toContainText('Transfer Complete!', { timeout: 15000 });
  }

  async verifyTransferSuccess() {
    await expect(this.successHeader).toContainText('Transfer Complete!');
  }
}

module.exports = { TransferFundsPage };
