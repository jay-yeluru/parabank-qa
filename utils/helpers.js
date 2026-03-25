const { faker } = require('@faker-js/faker');

/**
 * Generates a random alphanumeric string of the given length.
 * @param {number} length
 * @returns {string}
 */
function randomString(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Generates a unique username formatted as user_workerIndex_timestamp_random.
 * @returns {string}
 */
function generateUsername() {
  const workerIndex = process.env.TEST_PARALLEL_INDEX || '0';
  const timestamp = Date.now().toString(36).slice(-4);
  return `user_${workerIndex}_${timestamp}_${randomString(4)}`;
}

/**
 * Generates a random numeric string for SSN/phone etc.
 * @param {number} digits
 * @returns {string}
 */
function randomDigits(digits = 9) {
  return faker.string.numeric(digits);
}

/**
 * Generates user registration data with a unique username.
 * @returns {{ firstName: string, lastName: string, street: string, city: string,
 *             state: string, zipCode: string, phone: string, ssn: string,
 *             username: string, password: string }}
 */
function generateUserData() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####'),
    phone: faker.string.numeric(10),
    ssn: faker.string.numeric(9),
    username: generateUsername(),
    password: 'Password@123',
  };
}

module.exports = { randomString, generateUsername, randomDigits, generateUserData };
