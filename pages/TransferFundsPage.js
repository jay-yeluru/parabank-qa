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
    await test.step('Navigate to Transfer Funds page', async () => {
      await this.page.goto('/parabank/transfer.htm');
    });
  }

  /**
   * Transfers funds between two accounts.
   * @param {string} amount
   * @param {string} fromAccountId
   * @param {string} toAccountId
   */
  async transferFunds(amount, fromAccountId, toAccountId) {
    await test.step(`Transfer $${amount} from account ${fromAccountId} to ${toAccountId}`, async () => {
      await this.fromAccountSelect.waitFor({ state: 'visible' });

      // Wait for the specific account options to be populated by Angular XHR
      await expect(this.fromAccountSelect.locator(`option[value="${fromAccountId}"]`)).toHaveCount(
        1,
        { timeout: 15000 }
      );
      await expect(this.toAccountSelect.locator(`option[value="${toAccountId}"]`)).toHaveCount(1, {
        timeout: 15000,
      });

      await this.amountInput.fill(amount);
      await this.fromAccountSelect.selectOption({ value: fromAccountId });
      await this.toAccountSelect.selectOption({ value: toAccountId });
      await this.transferButton.click();

      await expect(this.successHeader).toContainText('Transfer Complete!', { timeout: 15000 });
    });
  }

  async verifyTransferSuccess(amount) {
    await test.step(`Verify transfer of $${amount} was successful`, async () => {
      await expect(this.successHeader).toContainText('Transfer Complete!');
      if (amount) {
        // The result message often contains the amount in a span with ng-binding
        await expect(this.page.locator('#showResult')).toContainText(`$${amount}`);
      }
    });
  }
}

const { test } = require('@playwright/test');

module.exports = { TransferFundsPage };
