/**
 * Test Case: OpenCart invalid login flow
 *
 * Tags: @master @regression @web
 *
 * Steps:
 * 1) Navigate to My Account -> Login
 * 2) Submit the login form with an invalid email and password
 * 3) Verify that authentication fails and the warning message is displayed
 * 4) Verify that the customer is not authenticated
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Invalid login test @master @regression @web', async ({ homePage, loginPage, myAccountPage, page }) => {
    const email = `no.match.${Date.now()}-${RandomDataUtil.getNumber()}@example.com`;
    const password = RandomDataUtil.getPassword(10);

    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Enter invalid credentials and submit the login form', async () => {
        await loginPage.login(email, password);
    });

    await test.step('3) Verify that authentication fails and the warning message is displayed', async () => {
        expect(await loginPage.getWarningMessage()).toContain('Warning: No match for E-Mail Address and/or Password.');
    });

    await test.step('4) Verify that the customer is not authenticated', async () => {
        expect(await myAccountPage.isMyAccountPageExists()).toBeFalsy();
        expect(page.url()).toContain('route=account/login');
    });

    console.log('✅ ✔️ Completed successfully!');
});
