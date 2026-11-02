/**
 * Test Case: Add a product to the shopping cart
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Search for a known product and open its details page
 * 2) Verify that the product details are displayed
 * 3) Set the required quantity and add the product to the cart
 * 4) Verify the product added confirmation message
 * 5) Open the shopping cart and verify the product and quantity
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add product to cart test @master @sanity @regression @web', async ({ homePage, searchResultsPage, productPage, shoppingCartPage }) => {
    const { productName, productQuantity } = Helper.getProductDetails();

    await test.step('1) Search for a known product and open its details page', async () => {
        await homePage.searchProduct(productName);
        await searchResultsPage.openProduct(productName);
    });

    await test.step('2) Verify that the product details are displayed', async () => {
        expect(await productPage.isProductPageExists()).toBeTruthy();
        expect(await productPage.getProductName()).toBe(productName);
    });

    await test.step('3) Set the required quantity and add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.clickAddToCart();
    });

    await test.step('4) Verify the product added confirmation message', async () => {
        expect(await productPage.getSuccessMessage()).toContain(`Success: You have added ${productName} to your shopping cart!`);
    });

    await test.step('5) Open the shopping cart and verify the product and quantity', async () => {
        await homePage.clickShoppingCart();
        expect(await shoppingCartPage.isShoppingCartPageExists()).toBeTruthy();
        expect(await shoppingCartPage.getProductName()).toBe(productName);
        expect(await shoppingCartPage.getProductQuantity()).toBe(productQuantity);
    });

    console.log('✅ ✔️ Completed successfully!');
});
