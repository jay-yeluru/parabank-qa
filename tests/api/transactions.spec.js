// @ts-check
const { test, expect, request } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { LoginPage } = require('../../pages/LoginPage');
const { OpenNewAccountPage } = require('../../pages/OpenNewAccountPage');
const { AccountsOverviewPage } = require('../../pages/AccountsOverviewPage');
const { BillPayPage } = require('../../pages/BillPayPage');
const { TransferFundsPage } = require('../../pages/TransferFundsPage');
const { generateUserData } = require('../../utils/helpers');

/**
 * API Test: Find Transactions by Amount
 *
 * This test performs the full UI setup (register → login → open savings account
 * → transfer funds into it → pay bill), then calls the
 * /services_proxy/bank/accounts/{id}/transactions/amount/{amount} endpoint
 * to validate the payment transaction appears correctly.
 */
test.describe('ParaBank API Tests - Find Transactions', () => {
  let username;
  let password;
  let savingsAccountId;
  const billAmount = '75.00'; // Use a distinctive amount for easy lookup

  // ─── Setup: full UI flow to create a bill payment transaction ─────────────
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    // Register & login
    const userData = generateUserData();
    username = userData.username;
    password = userData.password;

    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.register(userData);
    await registerPage.verifyRegistrationSuccess(username);

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(username, password);
    await expect(page).toHaveURL(/overview/, { timeout: 10000 });

    // Get existing account
    const accountsOverview = new AccountsOverviewPage(page);
    await accountsOverview.navigate();
    const accountRows = await accountsOverview.getAccountRows();
    const existingAccountId = accountRows[0].accountId;

    // Open Savings account
    const openNewAccountPage = new OpenNewAccountPage(page);
    await openNewAccountPage.navigate();
    savingsAccountId = await openNewAccountPage.openAccount('SAVINGS');
    console.log(`ℹ️  API Test Savings account: ${savingsAccountId}`);

    // Transfer funds into savings account so it has balance
    const transferFundsPage = new TransferFundsPage(page);
    await transferFundsPage.navigate();
    await transferFundsPage.transferFunds('500', existingAccountId, savingsAccountId);

    // Pay a bill from savings account
    const billData = {
      payeeName: 'API Test Payee',
      street: '789 Test Blvd',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      phone: '2145550199',
      accountNumber: '11223344',
      amount: billAmount,
    };

    const billPayPage = new BillPayPage(page);
    await billPayPage.navigate();
    await billPayPage.payBill(billData, savingsAccountId);
    await billPayPage.verifyBillPaymentSuccess(billData.payeeName);
    console.log(`✅ API Setup: Bill paid $${billAmount} from ${savingsAccountId}`);

    await page.close();
  });

  // ─── TC-API-01: Find transactions by amount ────────────────────────────────
  test('TC-API-01 - Find transactions by amount returns bill payment transaction', async () => {
    const apiBaseUrl =
      process.env.API_BASE_URL ||
      'https://parabank.parasoft.com/parabank/services_proxy/bank';

    const authHeader =
      'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    const apiContext = await request.newContext({
      baseURL: apiBaseUrl,
      extraHTTPHeaders: {
        Accept: 'application/json',
        Authorization: authHeader,
      },
    });

    // Call: GET /accounts/{accountId}/transactions/amount/{amount}
    const response = await apiContext.get(
      `/accounts/${savingsAccountId}/transactions/amount/${billAmount}`
    );

    // ── Assertion 1: HTTP status is 200 ─────────────────────────────────────
    expect(response.status()).toBe(200);
    console.log(`✅ API returned 200 for account ${savingsAccountId}, amount ${billAmount}`);

    const body = await response.json();
    console.log('API Response body:', JSON.stringify(body, null, 2));

    // ── Assertion 2: Response is an array ────────────────────────────────────
    expect(Array.isArray(body)).toBe(true);

    // ── Assertion 3: At least one transaction is returned ────────────────────
    expect(body.length).toBeGreaterThan(0);
    console.log(`✅ Found ${body.length} transaction(s) for amount $${billAmount}`);

    // ── Assertion 4: Validate structure of each transaction ──────────────────
    for (const transaction of body) {
      // Required fields must be present
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('accountId');
      expect(transaction).toHaveProperty('type');
      expect(transaction).toHaveProperty('date');
      expect(transaction).toHaveProperty('amount');
      expect(transaction).toHaveProperty('description');

      // ── Assertion 5: Account ID matches our savings account ───────────────
      expect(String(transaction.accountId)).toBe(String(savingsAccountId));

      // ── Assertion 6: Amount matches the billed amount ─────────────────────
      expect(parseFloat(transaction.amount)).toBeCloseTo(parseFloat(billAmount), 2);

      // ── Assertion 7: Transaction type is Debit (bill payment debits account)
      expect(transaction.type).toBe('Debit');

      // ── Assertion 8: Date is a valid date string ──────────────────────────
      const txDate = new Date(transaction.date);
      expect(txDate.toString()).not.toBe('Invalid Date');

      // ── Assertion 9: Description is not empty ─────────────────────────────
      expect(transaction.description).toBeTruthy();

      console.log(
        `  → Transaction: id=${transaction.id}, type=${transaction.type}, ` +
          `amount=${transaction.amount}, description="${transaction.description}"`
      );
    }

    await apiContext.dispose();
  });

  // ─── TC-API-02: Find transactions by wrong amount returns empty ─────────────
  test('TC-API-02 - Find transactions by non-existent amount returns empty or 404', async () => {
    const apiBaseUrl =
      process.env.API_BASE_URL ||
      'https://parabank.parasoft.com/parabank/services_proxy/bank';

    const authHeader =
      'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    const apiContext = await request.newContext({
      baseURL: apiBaseUrl,
      extraHTTPHeaders: {
        Accept: 'application/json',
        Authorization: authHeader,
      },
    });

    const fakeAmount = '999999.99';
    const response = await apiContext.get(
      `/accounts/${savingsAccountId}/transactions/amount/${fakeAmount}`
    );

    const status = response.status();
    console.log(`ℹ️  Status for non-existent amount: ${status}`);

    // ParaBank returns 404 or empty array when no transactions found
    expect([200, 404]).toContain(status);

    if (status === 200) {
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(0);
    }

    console.log('✅ API correctly handles non-existent transaction amount');
    await apiContext.dispose();
  });
});
