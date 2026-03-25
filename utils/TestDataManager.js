const { generateUserData, randomDigits } = require('./helpers');
const { CONSTANTS } = require('./constants');
const path = require('path');

/**
 * TestDataManager class to manage all test data generation and state.
 * Refactors environment-specific data loading with fallbacks to defaults.
 */
class TestDataManager {
  constructor() {
    this.userData = null;
    this.billData = null;

    const ENV = process.env.TEST_ENV || 'stage';
    
    // Load data with tiered fallback: Env-specific -> Global Default -> Static Constants
    const defaultData = require('../data/default.json');
    let envData = {};
    try {
      envData = require(`../data/${ENV}.json`);
    } catch (e) {
      console.warn(`Warning: Could not load data for environment: ${ENV}, using defaults.`);
    }

    const { config } = require('../configs/environment');

    // Consolidate data into a single searchable object
    this.data = {
      ...CONSTANTS.DEFAULT_VALUES,
      ...defaultData,
      ...config,
      ...envData,
    };

    // Static messages and types from constants
    this.types = CONSTANTS.ACCOUNT_TYPES;
    this.messages = CONSTANTS.MESSAGES;
    this.endpoints = CONSTANTS.ENDPOINTS;
  }

  getAdminEndpoint() {
    return this.data.adminEndpoint || this.endpoints.ADMIN;
  }

  getRegistrationSuccessMessage() {
    return this.messages.REGISTRATION_SUCCESS;
  }

  getCheckingAccountType() {
    return this.types.CHECKING;
  }

  getSavingsAccountType() {
    return this.types.SAVINGS;
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
   * Returns current or new user data.
   */
  getUserData() {
    return this.userData || this.generateFreshUser();
  }

  /**
   * Generates and returns bill payment data.
   */
  generateBillData(amount = this.data.billAmount, suffix = '') {
    this.billData = {
      payeeName: `Electricity Company${suffix ? ' ' + suffix : ''}`,
      street: `${randomDigits(3)} Power Ave`,
      city: 'Austin',
      state: 'TX',
      zipCode: randomDigits(5),
      phone: randomDigits(10),
      accountNumber: randomDigits(8),
      amount: String(amount),
    };
    return this.billData;
  }

  getTransferAmount() {
    return String(this.data.transferAmount || this.data.TRANSFER_AMOUNT);
  }

  getApiTransferAmount() {
    return String(this.data.apiTransferAmount || this.data.API_TRANSFER_AMOUNT);
  }
}

module.exports = { TestDataManager };
