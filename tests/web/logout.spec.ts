/**
 * Test Case: OpenCart customer logout flow
 *
 * Tags: @master @regression @web
 *
 * Steps:
 * 1) Login with valid credentials
 * 2) Verify successful authentication
 * 3) Click Logout from the account menu
 * 4) Verify the logout confirmation page and message
 * 5) Continue to the home page and verify authenticated options are no longer available
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('User logout test @master @regression @web', async ({ homePage, loginPage, myAccountPage, logoutPage, page }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Login with valid credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(email, password);
    });

    await test.step('2) Verify successful authentication', async () => {
        await expect(page).toHaveURL(/route=account\/account/);
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('3) Click Logout from the account menu', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogout();
    });

    await test.step('4) Verify the logout confirmation page and message', async () => {
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
        expect(await logoutPage.getLogoutMessage()).toContain('You have been logged off your account');
    });

    await test.step('5) Continue to the home page and verify authenticated options are no longer available', async () => {
        await logoutPage.clickContinue();
        expect(await homePage.isHomePageExists()).toBeTruthy();
        expect(await homePage.isLogoutLinkPresent()).toBeFalsy();
    });

    console.log('✅ ✔️ Completed successfully!');
});
