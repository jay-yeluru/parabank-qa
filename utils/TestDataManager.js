const { generateUserData, randomDigits } = require('./helpers');
const { CONSTANTS } = require('./constants');

/**
 * TestDataManager class to manage all test data generation and state.
 * Refactor note: Centralizes static strings via constants.js
 */
class TestDataManager {
  constructor() {
    this.userData = null;
    this.billData = null;
    
    // Default values from constants
    this.transferAmount = CONSTANTS.DEFAULT_VALUES.TRANSFER_AMOUNT;
    this.apiTransferAmount = CONSTANTS.DEFAULT_VALUES.API_TRANSFER_AMOUNT;
    this.checkingAccountType = CONSTANTS.ACCOUNT_TYPES.CHECKING;
    this.savingsAccountType = CONSTANTS.ACCOUNT_TYPES.SAVINGS;
    this.registrationSuccessMessage = CONSTANTS.MESSAGES.REGISTRATION_SUCCESS;
    this.adminEndpoint = CONSTANTS.ENDPOINTS.ADMIN;
  }

  /**
   * @returns {string} The endpoint for the administration page
   */
  getAdminEndpoint() {
    return this.adminEndpoint;
  }

  /**
   * @returns {string} Success message for user registration
   */
  getRegistrationSuccessMessage() {
    return this.registrationSuccessMessage;
  }

  /**
   * @returns {string} The formatted checking account type
   */
  getCheckingAccountType() {
    return this.checkingAccountType;
  }

  /**
   * @returns {string} The formatted savings account type
   */
  getSavingsAccountType() {
    return this.savingsAccountType;
  }

  /**
   * Generates and returns a fresh unique user dataset.
   * @returns {import('../fixtures/pom-fixture').UserData}
   */
  generateFreshUser() {
    this.userData = generateUserData();
    return this.userData;
  }

  /**
   * Returns the current user data or generates it if not present.
   * @returns {import('../fixtures/pom-fixture').UserData}
   */
  getUserData() {
    if (!this.userData) {
      return this.generateFreshUser();
    }
    return this.userData;
  }

  /**
   * Generates and returns bill payment data.
   * @param {string} amount - The amount for the bill.
   * @param {string} suffix - Optional suffix for the payee name.
   * @returns {{ payeeName: string, street: string, city: string, state: string,
   *            zipCode: string, phone: string, accountNumber: string, amount: string }}
   */
  generateBillData(amount = CONSTANTS.DEFAULT_VALUES.BILL_AMOUNT, suffix = '') {

    this.billData = {
      payeeName: `Electricity Company${suffix ? ' ' + suffix : ''}`,
      street: `${randomDigits(3)} Power Ave`,
      city: 'Austin',
      state: 'TX',
      zipCode: randomDigits(5),
      phone: randomDigits(10),
      accountNumber: randomDigits(8),
      amount: amount,
    };
    return this.billData;
  }

  /**
   * Returns generic transfer amount.
   * @returns {string}
   */
  getTransferAmount() {
    return this.transferAmount || CONSTANTS.DEFAULT_VALUES.TRANSFER_AMOUNT;
  }

  /**
   * Returns generic transfer amount for API setup.
   * @returns {string}
   */
  getApiTransferAmount() {
    return this.apiTransferAmount || CONSTANTS.DEFAULT_VALUES.API_TRANSFER_AMOUNT;
  }
}

module.exports = { TestDataManager };

