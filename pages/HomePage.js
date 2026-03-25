const { expect } = require('@playwright/test');

class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Global navigation menu links (left panel after login)
    this.navOpenNewAccount = page.getByRole('link', { name: 'Open New Account' });
    this.navAccountsOverview = page.getByRole('link', { name: 'Accounts Overview' });
    this.navTransferFunds = page.getByRole('link', { name: 'Transfer Funds' });
    this.navBillPay = page.getByRole('link', { name: 'Bill Pay' });
    this.navFindTransactions = page.getByRole('link', { name: 'Find Transactions' });
    this.navUpdateContactInfo = page.getByRole('link', { name: 'Update Contact Info' });
    this.navRequestLoan = page.getByRole('link', { name: 'Request Loan' });
    this.navLogout = page.getByRole('link', { name: 'Log Out' });

    this.welcomeMessage = page.locator('#leftPanel .smallText');
    this.pageHeader = page.locator('#rightPanel h1');
  }

  async verifyLoggedIn(username) {
    await test.step(`Verify user ${username} is logged in`, async () => {
      await expect(this.page).toHaveURL(/overview/);
      await expect(this.welcomeMessage).toContainText(username);
    });
  }

  async verifyGlobalNavMenu() {
    await test.step('Verify all navigation menu links are visible', async () => {
      await expect(this.navOpenNewAccount).toBeVisible();
      await expect(this.navAccountsOverview).toBeVisible();
      await expect(this.navTransferFunds).toBeVisible();
      await expect(this.navBillPay).toBeVisible();
      await expect(this.navFindTransactions).toBeVisible();
      await expect(this.navUpdateContactInfo).toBeVisible();
      await expect(this.navRequestLoan).toBeVisible();
      await expect(this.navLogout).toBeVisible();
    });
  }

  async clickNavLink(linkName) {
    await test.step(`Click navigation link: ${linkName}`, async () => {
      await this.page.getByRole('link', { name: linkName }).click();
    });
  }

  async verifyNavigatedTo(urlRegex) {
    await test.step(`Verify navigation to URL matching: ${urlRegex}`, async () => {
      await expect(this.page).toHaveURL(urlRegex, { timeout: 10000 });
    });
  }

  async logout() {
    await test.step('Logout from application', async () => {
      await this.navLogout.click();
    });
  }
}

const { test } = require('@playwright/test');

module.exports = { HomePage };
