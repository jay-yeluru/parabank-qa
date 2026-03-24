// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { RegisterPage } = require('../../pages/RegisterPage');
const { HomePage } = require('../../pages/HomePage');
const { OpenNewAccountPage } = require('../../pages/OpenNewAccountPage');
const { AccountsOverviewPage } = require('../../pages/AccountsOverviewPage');
const { TransferFundsPage } = require('../../pages/TransferFundsPage');
const { BillPayPage } = require('../../pages/BillPayPage');
const { generateUserData } = require('../../utils/helpers');

/** @type {{ username: string, password: string, savingsAccountId: string, existingAccountId: string, billAmount: string }} */
const testContext = {};

test.describe('ParaBank E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we start from the home page
    await page.goto('/parabank/index.htm');
  });

  // ─── Test 1 & 2: Register a new user ────────────────────────────────────────
  test('TC01 - Register a new unique user', async ({ page }) => {
    const userData = generateUserData();
    testContext.username = userData.username;
    testContext.password = userData.password;

    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Click register from login page
    await loginPage.clickRegister();
    await expect(page).toHaveURL(/register/);

    const registerPage = new RegisterPage(page);
    await registerPage.register(userData);

    // Verify registration success
    await registerPage.verifyRegistrationSuccess(userData.username);

    console.log(`✅ Registered user: ${userData.username}`);
  });

  // ─── Test 3: Login ──────────────────────────────────────────────────────────
  test('TC02 - Login with newly registered user', async ({ page }) => {
    // Re-register to have a fresh user for this test (tests run independently)
    const userData = generateUserData();
    testContext.username = userData.username;
    testContext.password = userData.password;

    // Register first
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.register(userData);
    await registerPage.verifyRegistrationSuccess(userData.username);

    // Navigate to login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(userData.username, userData.password);

    // Verify login redirects to overview
    await expect(page).toHaveURL(/overview/, { timeout: 10000 });
    console.log(`✅ Logged in as: ${userData.username}`);
  });

  // ─── Test 4: Global Navigation Menu ─────────────────────────────────────────
  test('TC03 - Verify global navigation menu is working', async ({ page }) => {
    const userData = generateUserData();
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.register(userData);

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(userData.username, userData.password);
    await expect(page).toHaveURL(/overview/, { timeout: 10000 });

    const homePage = new HomePage(page);

    // Verify all nav links are visible
    await homePage.verifyGlobalNavMenu();

    // Verify each link is clickable and navigates correctly
    await homePage.clickNavLink('Open New Account');
    await expect(page).toHaveURL(/openaccount/);

    await homePage.clickNavLink('Accounts Overview');
    await expect(page).toHaveURL(/overview/);

    await homePage.clickNavLink('Transfer Funds');
    await expect(page).toHaveURL(/transfer/);

    await homePage.clickNavLink('Bill Pay');
    await expect(page).toHaveURL(/billpay/);

    await homePage.clickNavLink('Find Transactions');
    await expect(page).toHaveURL(/findtrans/);

    await homePage.clickNavLink('Update Contact Info');
    await expect(page).toHaveURL(/updateprofile/);

    await homePage.clickNavLink('Request Loan');
    await expect(page).toHaveURL(/requestloan/);

    console.log('✅ All global navigation menu links verified');
  });

  // ─── Tests 5–8: Full banking flow ───────────────────────────────────────────
  test('TC04 - Full banking flow: Open Savings, Overview, Transfer & Bill Pay', async ({
    page,
  }) => {
    // ── Step A: Register + Login ─────────────────────────────────────────────
    const userData = generateUserData();
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.register(userData);
    await registerPage.verifyRegistrationSuccess(userData.username);

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(userData.username, userData.password);
    await expect(page).toHaveURL(/overview/, { timeout: 10000 });

    // ── Step B: Capture existing default account ─────────────────────────────
    const accountsOverview = new AccountsOverviewPage(page);
    await accountsOverview.navigate();
    await accountsOverview.verifyPageLoaded();

    const accountRows = await accountsOverview.getAccountRows();
    expect(accountRows.length).toBeGreaterThan(0);
    const existingAccountId = accountRows[0].accountId;
    console.log(`ℹ️  Existing account ID: ${existingAccountId}`);

    // ── Step C (Test 5): Open a new Savings account ──────────────────────────
    const openNewAccountPage = new OpenNewAccountPage(page);
    await openNewAccountPage.navigate();
    const savingsAccountId = await openNewAccountPage.openAccount('SAVINGS');
    expect(savingsAccountId).toBeTruthy();
    expect(savingsAccountId).toMatch(/\d+/);
    console.log(`✅ Opened Savings account: ${savingsAccountId}`);

    // ── Step D (Test 6): Validate Accounts Overview ──────────────────────────
    await accountsOverview.navigate();
    await accountsOverview.verifyPageLoaded();
    await accountsOverview.verifyAccountExists(savingsAccountId);
    await accountsOverview.verifyBalancesDisplayed();
    console.log('✅ Accounts overview balance details validated');

    // ── Step E (Test 7): Transfer funds from savings → existing account ──────
    const transferFundsPage = new TransferFundsPage(page);
    await transferFundsPage.navigate();
    await transferFundsPage.transferFunds('100', existingAccountId, savingsAccountId);
    await transferFundsPage.verifyTransferSuccess();
    console.log(`✅ Transferred $100 from ${existingAccountId} to ${savingsAccountId}`);

    // ── Step F (Test 8): Pay a bill from the savings account ─────────────────
    const billAmount = '50.00';
    const billData = {
      payeeName: 'Electricity Company',
      street: '456 Power Ave',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      phone: '5125550101',
      accountNumber: '98765432',
      amount: billAmount,
    };

    const billPayPage = new BillPayPage(page);
    await billPayPage.navigate();
    await billPayPage.payBill(billData, savingsAccountId);
    await billPayPage.verifyBillPaymentSuccess(billData.payeeName);
    console.log(`✅ Paid bill of $${billAmount} from account ${savingsAccountId}`);

    // Store for API tests
    testContext.savingsAccountId = savingsAccountId;
    testContext.existingAccountId = existingAccountId;
    testContext.billAmount = billAmount;
  });
});
