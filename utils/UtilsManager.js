const helpers = require('./helpers');
const { ApiClient } = require('./apiClient');

/**
 * UtilsManager provides access to helper functions and external clients.
 */
class UtilsManager {
  /**
   * Returns the helpers module.
   * @returns {object}
   */
  getHelpers() {
    return helpers;
  }
  
  /**
   * Returns a new instance of ApiClient.
   * Note: Now accepts username and password for authentication.
   * @param {import('@playwright/test').APIRequestContext} requestContext
   * @param {string} username
   * @param {string} password
   * @returns {ApiClient}
   */
  getApiClient(requestContext, username, password) { 
    return new ApiClient(requestContext, username, password); 
  }
}

module.exports = { UtilsManager };

