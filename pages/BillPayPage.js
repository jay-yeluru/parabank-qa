const { expect } = require('@playwright/test');

class BillPayPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Payee information fields
    this.payeeName = page.locator('input[name="payee.name"]');
    this.payeeAddress = page.locator('input[name="payee.address.street"]');
    this.payeeCity = page.locator('input[name="payee.address.city"]');
    this.payeeState = page.locator('input[name="payee.address.state"]');
    this.payeeZipCode = page.locator('input[name="payee.address.zipCode"]');
    this.payeePhone = page.locator('input[name="payee.phoneNumber"]');
    this.payeeAccountNumber = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountNumber = page.locator('input[name="verifyAccount"]');
    this.amount = page.locator('input[name="amount"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });

    // Result elements
    this.successHeader = page.locator('#billpayResult h1');
    this.payeePaidName = page.locator('#billpayResult .ng-binding').first();
  }

  async navigate() {
    await this.page.goto('/parabank/billpay.htm');
  }

  /**
   * @param {{ payeeName: string, street: string, city: string, state: string,
   *            zipCode: string, phone: string, accountNumber: string, amount: string }} billData
   * @param {string} fromAccountId
   */
  async payBill(billData, fromAccountId) {
    await this.payeeName.fill(billData.payeeName);
    await this.payeeAddress.fill(billData.street);
    await this.payeeCity.fill(billData.city);
    await this.payeeState.fill(billData.state);
    await this.payeeZipCode.fill(billData.zipCode);
    await this.payeePhone.fill(billData.phone);
    await this.payeeAccountNumber.fill(billData.accountNumber);
    await this.verifyAccountNumber.fill(billData.accountNumber);
    await this.amount.fill(billData.amount);

    await this.fromAccountSelect.waitFor({ state: 'visible' });
    await this.fromAccountSelect.selectOption({ value: fromAccountId });

    await this.sendPaymentButton.click();

    await expect(this.successHeader).toContainText('Bill Payment Complete', {
      timeout: 15000,
    });
  }

  async verifyBillPaymentSuccess(payeeName) {
    await expect(this.successHeader).toContainText('Bill Payment Complete', { timeout: 15000 });
    if (payeeName) {
      await expect(this.page.locator('#billpayResult')).toContainText(payeeName);
    }
  }
}

module.exports = { BillPayPage };
