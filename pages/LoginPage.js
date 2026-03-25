const { expect } = require('@playwright/test');

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[value="Log In"]');
    this.errorMessage = page.locator('.error');
    this.registerLink = page.getByRole('link', { name: 'Register' });
  }

  async navigate() {
    await this.page.goto('/parabank/index.htm');
    await expect(this.page).toHaveTitle(/ParaBank/);
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickRegister() {
    await this.registerLink.click();
  }

  async verifySuccessfulLogin() {
    await expect(this.page).toHaveURL(/overview/, { timeout: 10000 });
  }
}

module.exports = { LoginPage };
