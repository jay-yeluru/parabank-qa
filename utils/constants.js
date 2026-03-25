/**
 * Static constants used throughout the test suite.
 */
const CONSTANTS = {
  ENDPOINTS: {
    ADMIN: '/parabank/admin.htm',
    REGISTER: '/parabank/register.htm',
    INDEX: '/parabank/index.htm',
    SERVICES: '/parabank/services/bank',
  },
  MESSAGES: {
    REGISTRATION_SUCCESS: 'Your account was created successfully',
    LOGIN_ERROR: 'The username and password could not be verified',
    ACCOUNT_OPENED: 'Account Opened',
  },
  ACCOUNT_TYPES: {
    CHECKING: 'CHECKING',
    SAVINGS: 'SAVINGS',
  },
  DEFAULT_VALUES: {
    TRANSFER_AMOUNT: '100.00',
    BILL_AMOUNT: '50.00',
    API_TRANSFER_AMOUNT: '25.00',
  },
};

module.exports = { CONSTANTS };
