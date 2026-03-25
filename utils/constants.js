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
