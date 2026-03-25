const { expect } = require('@playwright/test');

class AccountsOverviewPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.pageHeader = page.locator('#rightPanel h1').first();
    this.accountsTable = page.locator('#accountTable');
    this.totalBalance = page.locator('#accountTable tfoot td').nth(1);
  }

  async navigate() {
    await this.page.goto('/parabank/overview.htm');
  }

  async verifyPageLoaded() {
    await expect(this.pageHeader).toContainText('Accounts Overview');
    await expect(this.accountsTable).toBeVisible();
    // Wait for the table to populate with at least one linked account
    await expect(this.accountsTable.locator('tbody tr a').first()).toBeVisible({ timeout: 15000 });
  }

  /**
   * Returns all account rows as an array of { accountId, balance, availableAmount }
   * @returns {Promise<Array<{accountId: string, balance: string, availableAmount: string}>>}
   */
  async getAccountRows() {
    // Ensure table populated before pulling text
    await this.accountsTable
      .locator('tbody tr a')
      .first()
      .waitFor({ state: 'visible', timeout: 15000 });

    // Only capture rows that contain a link to avoid footers/totals sometimes rendered in tbody
    const rows = this.accountsTable.locator('tbody tr').filter({ has: this.page.locator('a') });
    const count = await rows.count();
    const accounts = [];

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');
      const accountId = (await cells.nth(0).textContent()).trim();
      const balance = (await cells.nth(1).textContent()).trim();
      const availableAmount = (await cells.nth(2).textContent()).trim();
      accounts.push({ accountId, balance, availableAmount });
    }

    return accounts;
  }

  /**
   * Verifies that a specific account is listed.
   * @param {string} accountNumber
   */
  async verifyAccountExists(accountNumber) {
    const accountLink = this.page.getByRole('link', { name: accountNumber });
    await expect(accountLink).toBeVisible();
  }

  /**
   * Verifies that balance columns are non-empty and look like currency values.
   */
  async verifyHasAccounts() {
    const rows = await this.getAccountRows();
    expect(rows.length).toBeGreaterThan(0);
  }

  /**
   * Verifies that balance columns are non-empty and look like currency values.
   */
  async verifyBalancesDisplayed() {
    const rows = await this.getAccountRows();
    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      expect(row.balance).toMatch(/\$[\d,]+\.\d{2}/);
      expect(row.availableAmount).toMatch(/\$[\d,]+\.\d{2}/);
    }
  }
}

module.exports = { AccountsOverviewPage };
