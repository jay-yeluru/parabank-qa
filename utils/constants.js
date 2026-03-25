/**
 * Static constants used throughout the test suite.
 * Values here should be truly immutable across all environments.
 */
const CONSTANTS = {
  ACCOUNT_TYPES: {
    CHECKING: 'CHECKING',
    SAVINGS: 'SAVINGS',
  },
  MESSAGES: {
    REGISTRATION_SUCCESS: 'Your account was created successfully',
    LOGIN_ERROR: 'The username and password could not be verified',
  },
  TRANSACTION_TYPES: {
    DEBIT: 'Debit',
    CREDIT: 'Credit',
  },
  DESCRIPTION_PATTERNS: {
    BILL_PAYMENT: 'Bill Payment to',
    ACCOUNT_TRANSFER: 'Transfer to account',
  },
  NAV_ITEMS: [
    { name: 'Open New Account', expectedUrl: /openaccount/ },
    { name: 'Accounts Overview', expectedUrl: /overview/ },
    { name: 'Transfer Funds', expectedUrl: /transfer/ },
    { name: 'Bill Pay', expectedUrl: /billpay/ },
    { name: 'Find Transactions', expectedUrl: /findtrans/ },
    { name: 'Update Contact Info', expectedUrl: /updateprofile/ },
    { name: 'Request Loan', expectedUrl: /requestloan/ },
    { name: 'Log Out', expectedUrl: /index/ },
  ],
  DEFAULT_VALUES: {
    TRANSFER_AMOUNT: '100.00',
    BILL_AMOUNT: '50.00',
    API_TRANSFER_AMOUNT: '25.00',
  },
  ENDPOINTS: {
    ADMIN: '/parabank/admin.htm',
    REGISTER: '/parabank/register.htm',
    INDEX: '/parabank/index.htm',
  },
};

module.exports = { CONSTANTS };
