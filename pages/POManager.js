const { LoginPage } = require('./LoginPage');
const { HomePage } = require('./HomePage');
const { OpenNewAccountPage } = require('./OpenNewAccountPage');
const { AccountsOverviewPage } = require('./AccountsOverviewPage');
const { TransferFundsPage } = require('./TransferFundsPage');
const { BillPayPage } = require('./BillPayPage');
const { RegisterPage } = require('./RegisterPage');

class POManager {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.homePage = new HomePage(this.page);
    this.openNewAccountPage = new OpenNewAccountPage(this.page);
    this.accountsOverviewPage = new AccountsOverviewPage(this.page);
    this.transferFundsPage = new TransferFundsPage(this.page);
    this.billPayPage = new BillPayPage(this.page);
    this.registerPage = new RegisterPage(this.page);
  }

  getLoginPage() {
    return this.loginPage;
  }
  getHomePage() {
    return this.homePage;
  }
  getOpenNewAccountPage() {
    return this.openNewAccountPage;
  }
  getAccountsOverviewPage() {
    return this.accountsOverviewPage;
  }
  getTransferFundsPage() {
    return this.transferFundsPage;
  }
  getBillPayPage() {
    return this.billPayPage;
  }
  getRegisterPage() {
    return this.registerPage;
  }
}

module.exports = { POManager };
