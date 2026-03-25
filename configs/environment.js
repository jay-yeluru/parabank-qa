const stage = require('./env.stage');
const beta = require('./env.beta');
const prod = require('./env.prod');

const ENV = process.env.TEST_ENV || 'stage';

const configs = {
  stage,
  beta,
  prod,
};

/**
 * Returns the configuration for the active environment.
 * @returns {object}
 */
module.exports = { 
  config: configs[ENV] || configs.stage,
  ENV 
};
