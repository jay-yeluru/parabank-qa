/**
 * Generates a random alphanumeric string of the given length.
 * @param {number} length
 * @returns {string}
 */
function randomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Generates a unique username formatted as user_test_timestamp.
 * @returns {string}
 */
function generateUsername() {
  return `user_${randomString(6)}`;
}

/**
 * Generates a random numeric string for SSN/phone etc.
 * @param {number} digits
 * @returns {string}
 */
function randomDigits(digits = 9) {
  return Math.floor(Math.random() * Math.pow(10, digits))
    .toString()
    .padStart(digits, '0');
}

/**
 * Generates user registration data with a unique username.
 * @returns {{ firstName: string, lastName: string, street: string, city: string,
 *             state: string, zipCode: string, phone: string, ssn: string,
 *             username: string, password: string }}
 */
function generateUserData() {
  return {
    firstName: 'Test',
    lastName: 'User',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: randomDigits(10),
    ssn: randomDigits(9),
    username: generateUsername(),
    password: 'Password@123',
  };
}

module.exports = { randomString, generateUsername, randomDigits, generateUserData };
