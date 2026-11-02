/**
 * Test Case: OpenCart valid login flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to My Account -> Login
 * 2) Verify that the login page is displayed
 * 3) Login with valid credentials from the fixed test data
 * 4) Verify successful authentication and the My Account section
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid login test @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage, page }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Verify that the login page is displayed', async () => {
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    await test.step('3) Login with valid credentials', async () => {
        await loginPage.login(email, password);
    });

    await test.step('4) Verify successful authentication and the My Account section', async () => {
        await expect(page).toHaveURL(/route=account\/account/);
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        expect(await homePage.isLogoutLinkPresent()).toBeTruthy();
    });

    console.log('✅ ✔️ Completed successfully!');
});
