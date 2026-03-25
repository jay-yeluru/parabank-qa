const { expect, test } = require('@playwright/test');

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
    await test.step('Navigate to Login/Index Page', async () => {
      await this.page.goto('/parabank/index.htm');
      await expect(this.page).toHaveTitle(/ParaBank/);
    });
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await test.step(`Login with user: ${username}`, async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    });
  }

  async clickRegister() {
    await test.step('Click Register link', async () => {
      await this.registerLink.click();
    });
  }

  async verifySuccessfulLogin() {
    await test.step('Verify login was successful', async () => {
      await expect(this.page).toHaveURL(/overview/, { timeout: 20000 });
    });

  }
}

module.exports = { LoginPage };
