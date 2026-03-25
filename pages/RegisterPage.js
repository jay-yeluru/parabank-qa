const { expect, test } = require('@playwright/test');

class RegisterPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('#customer\\.firstName');
    this.lastNameInput = page.locator('#customer\\.lastName');
    this.streetInput = page.locator('#customer\\.address\\.street');
    this.cityInput = page.locator('#customer\\.address\\.city');
    this.stateInput = page.locator('#customer\\.address\\.state');
    this.zipCodeInput = page.locator('#customer\\.address\\.zipCode');
    this.phoneInput = page.locator('#customer\\.phoneNumber');
    this.ssnInput = page.locator('#customer\\.ssn');
    this.usernameInput = page.locator('#customer\\.username');
    this.passwordInput = page.locator('#customer\\.password');
    this.confirmPasswordInput = page.locator('#repeatedPassword');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.successMessage = page.locator('#rightPanel h1');
    this.errorMessage = page.locator('.error');
  }

  async navigate() {
    await test.step('Navigate to Registration Page', async () => {
      await this.page.goto('/parabank/register.htm');
      await expect(this.page).toHaveTitle(/ParaBank/);
    });
  }

  /**
   * @param {{ firstName: string, lastName: string, street: string, city: string,
   *            state: string, zipCode: string, phone: string, ssn: string,
   *            username: string, password: string }} userData
   */
  async register(userData) {
    await test.step(`Fill registration form for ${userData.username}`, async () => {
      await this.firstNameInput.waitFor({ state: 'visible' });
      await this.firstNameInput.fill(userData.firstName);
      await this.lastNameInput.fill(userData.lastName);
      await this.streetInput.fill(userData.street);
      await this.cityInput.fill(userData.city);
      await this.stateInput.fill(userData.state);
      await this.zipCodeInput.fill(userData.zipCode);
      await this.phoneInput.fill(userData.phone);
      await this.ssnInput.fill(userData.ssn);
      await this.usernameInput.fill(userData.username);
      await this.passwordInput.fill(userData.password);
      await this.confirmPasswordInput.fill(userData.password);

      await this.registerButton.click();
      // Parabank registration can be slow to commit to DB
      await this.page.waitForTimeout(1000);

      // Check for short-lived validation errors if the page didn't redirect
      if (await this.errorMessage.isVisible({ timeout: 2000 })) {
        const error = await this.errorMessage.innerText();
        throw new Error(`Registration failed with error: ${error}`);
      }
    });
  }

  async verifyRegistrationSuccess(username) {
    await test.step(`Verify registration success for ${username}`, async () => {
      const { TestDataManager } = require('../utils/TestDataManager');
      const successMsg = new TestDataManager().getRegistrationSuccessMessage();
      // Wait for the success page (right panel header should say Welcome)
      await expect(this.successMessage).toContainText('Welcome', { timeout: 15000 });
      await expect(this.page.locator('#rightPanel p')).toContainText(successMsg);
    });
  }
}

module.exports = { RegisterPage };
