/**
 * Config for BETA environment
 */
module.exports = {
  baseUrl: 'https://parabank.parasoft.com', // Replace with beta URL
  credentials: {
    username: process.env.BETA_USERNAME || 'beta_user',
    password: process.env.BETA_PASSWORD || 'password123',
  },
};
