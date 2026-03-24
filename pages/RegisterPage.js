const { expect } = require('@playwright/test');

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
    await this.page.goto('/parabank/register.htm');
    await expect(this.page).toHaveTitle(/ParaBank/);
  }

  /**
   * @param {{ firstName: string, lastName: string, street: string, city: string,
   *            state: string, zipCode: string, phone: string, ssn: string,
   *            username: string, password: string }} userData
   */
  async register(userData) {
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
  }

  async verifyRegistrationSuccess(username) {
    await expect(this.successMessage).toContainText('Welcome');
    await expect(this.page.locator('#rightPanel p')).toContainText(
      `${username} was created successfully`
    );
  }
}

module.exports = { RegisterPage };
