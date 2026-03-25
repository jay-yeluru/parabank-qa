/**
 * Config for STAGING environment
 */
module.exports = {
  baseUrl: 'https://parabank.parasoft.com', // Replace with staging URL
  credentials: {
    username: process.env.STAGING_USERNAME || 'staging_user',
    password: process.env.STAGING_PASSWORD || 'password123',
  },
};
