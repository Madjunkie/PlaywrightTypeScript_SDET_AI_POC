/**
 * Test Case: End-to-end shopping journey (register, logout, login, search, add to cart, cart validation)
 *
 * Tags: @master @end-to-end @web
 *
 * Steps:
 * 1) Register a new customer with dynamically generated unique data
 * 2) Log out of the new account
 * 3) Log in again with the newly created credentials
 * 4) Search for a known product and open its details page
 * 5) Set the quantity and add the product to the cart
 * 6) Verify the cart product, quantity, price and total
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test.setTimeout(90 * 1000);

test('End-to-end shopping flow test @master @end-to-end @web', async ({ homePage, registrationPage, accountSuccessPage, myAccountPage, loginPage, logoutPage, searchResultsPage, productPage, shoppingCartPage }) => {
    const customer = RandomDataUtil.generateCustomerRegistrationPayload();
    customer.email = `qa.auto.${Date.now()}-${RandomDataUtil.getNumber()}@example.com`;
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Register a new customer with unique data', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        await registrationPage.completeRegistration(customer);
        expect(await accountSuccessPage.isAccountSuccessPageExists()).toBeTruthy();
        await accountSuccessPage.clickContinue();
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('2) Log out of the new account', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogout();
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step('3) Log in again with the newly created credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(customer.email, customer.password);
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('4) Search for a known product and open its details page', async () => {
        await homePage.searchProduct(productName);
        expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
        await searchResultsPage.openProduct(productName);
        expect(await productPage.getProductName()).toBe(productName);
    });

    await test.step('5) Set the quantity and add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.clickAddToCart();
        expect(await productPage.getSuccessMessage()).toContain(`Success: You have added ${productName} to your shopping cart!`);
    });

    await test.step('6) Verify the cart product, quantity, price and total', async () => {
        await homePage.clickShoppingCart();
        expect(await shoppingCartPage.isShoppingCartPageExists()).toBeTruthy();
        expect(await shoppingCartPage.getProductName()).toBe(productName);
        expect(await shoppingCartPage.getProductQuantity()).toBe(productQuantity);
        expect(await shoppingCartPage.getUnitPrice()).toBe(totalPrice);
        expect(await shoppingCartPage.getCartTotal()).toBe(totalPrice);
    });

    console.log('✅ ✔️ Completed successfully!');
});
