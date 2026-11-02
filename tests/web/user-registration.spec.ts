/**
 * Test Case: OpenCart user registration flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to My Account -> Register
 * 2) Verify that the registration page is displayed
 * 3) Generate a unique customer and complete the registration form
 * 4) Verify that registration succeeds and the account created message is displayed
 * 5) Verify that the newly created account is available through the account navigation
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test.setTimeout(60 * 1000);

test('User registration test @master @sanity @regression @web', async ({ homePage, registrationPage, accountSuccessPage, myAccountPage, page }) => {
    const customer = RandomDataUtil.generateCustomerRegistrationPayload();
    customer.email = `qa.auto.${Date.now()}-${RandomDataUtil.getNumber()}@example.com`;

    await test.step('1) Navigate to the registration page', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
    });

    await test.step('2) Verify that the registration page is displayed', async () => {
        expect(await registrationPage.isRegistrationPageExists()).toBeTruthy();
    });

    await test.step('3) Complete the registration form with valid customer details', async () => {
        await registrationPage.completeRegistration(customer);
    });

    await test.step('4) Verify that registration succeeds and the account created message is displayed', async () => {
        await expect(page).toHaveURL(/route=account\/success/);
        expect(await accountSuccessPage.isAccountSuccessPageExists()).toBeTruthy();
        expect(await accountSuccessPage.getSuccessMessage()).toContain('Your Account Has Been Created!');
    });

    await test.step('5) Verify that the new account is available through the account navigation', async () => {
        await accountSuccessPage.clickContinue();
        await expect(page).toHaveURL(/route=account\/account/);
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        expect(await homePage.isLogoutLinkPresent()).toBeTruthy();
    });

    console.log('✅ ✔️ Completed successfully!');
});
