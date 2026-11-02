/**
 * Test Case: OpenCart product search flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Search for a known product from the header search box
 * 2) Verify that the search results page is displayed
 * 3) Verify that the expected product appears with a matching name
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product search test @master @sanity @regression @web', async ({ homePage, searchResultsPage, page }) => {
    const { productName } = Helper.getProductDetails();

    await test.step('1) Search for a known product from the header search box', async () => {
        await homePage.searchProduct(productName);
    });

    await test.step('2) Verify that the search results page is displayed', async () => {
        await expect(page).toHaveURL(/route=product\/search/);
        expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
    });

    await test.step('3) Verify that the expected product appears with a matching name', async () => {
        expect(await searchResultsPage.getProductNames()).toContain(productName);
    });

    console.log('✅ ✔️ Completed successfully!');
});
