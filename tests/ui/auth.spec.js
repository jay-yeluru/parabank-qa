// @ts-check
const { test } = require('../../fixtures/pom-fixture');

test.describe('ParaBank - User Authentication (Step 2 & 3) @ui @auth', () => {
  test('TC-01 - User Registration and Login @smoke', async ({ poManager, dataManager }) => {
    const userData = dataManager.generateFreshUser();

    const loginPage = poManager.getLoginPage();
    const registerPage = poManager.getRegisterPage();
    const homePage = poManager.getHomePage();

    // 2. Create a new user (Step 2)
    await loginPage.navigate();
    await loginPage.clickRegister();
    await registerPage.register(userData);
    await registerPage.verifyRegistrationSuccess(userData.username);

    // 3. Login with created user (Step 3)
    await homePage.logout();
    await loginPage.navigate();
    await loginPage.login(userData.username, userData.password);
    await loginPage.verifySuccessfulLogin();
  });
});
