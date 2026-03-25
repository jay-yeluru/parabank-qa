/**
 * Config for PRODUCTION environment
 */
module.exports = {
  baseUrl: 'https://parabank.parasoft.com',
  credentials: {
    username: process.env.PROD_USERNAME || 'prod_user',
    password: process.env.PROD_PASSWORD || 'password123',
  },
};
