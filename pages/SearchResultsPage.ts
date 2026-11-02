import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly lblSearchCriteria: Locator;
    private readonly lstProductNames: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblSearchCriteria = page.locator('#content').getByRole('heading', { name: 'Products meeting the search criteria' });
        this.lstProductNames = page.locator('.product-thumb h4 a');
    }

    /**
     * Verifies the search results page is displayed
     * @returns Promise<boolean> - true if the search results page is displayed
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            await this.lblSearchCriteria.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the names of all products displayed in the search results
     * @returns Promise<string[]> - Array of product names
     */
    async getProductNames(): Promise<string[]> {
        const names = await this.lstProductNames.allInnerTexts();
        return names.map((name) => name.trim());
    }

    /**
     * Opens the details page of a product displayed in the search results
     * @param productName - Exact name of the product to open
     * @returns Promise<ProductPage> - Instance of the product details page
     */
    async openProduct(productName: string): Promise<ProductPage> {
        await this.page.locator('.product-thumb h4').getByRole('link', { name: productName, exact: true }).click();
        return new ProductPage(this.page);
    }
}
