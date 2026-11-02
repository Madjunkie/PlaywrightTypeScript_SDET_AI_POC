import { Page, Locator } from '@playwright/test';

export class ShoppingCartPage {
    private readonly page: Page;

    // Locators
    private readonly lblShoppingCart: Locator;
    private readonly lstProductNames: Locator;
    private readonly txtProductQuantity: Locator;
    private readonly lblUnitPrice: Locator;
    private readonly rowCartTotal: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblShoppingCart = page.locator('#content').getByRole('heading', { name: /^Shopping Cart/ });
        this.lstProductNames = page.locator('#content .table-responsive table tbody tr td.text-left a');
        this.txtProductQuantity = page.locator('#content .table-responsive table tbody tr td input[name^="quantity"]');
        this.lblUnitPrice = page.locator('#content .table-responsive table tbody tr td.text-right').first();
        this.rowCartTotal = page.locator('#content table tr', { has: page.locator('strong', { hasText: /^Total:$/ }) });
    }

    /**
     * Verifies the shopping cart page is displayed
     * @returns Promise<boolean> - true if the shopping cart page is displayed
     */
    async isShoppingCartPageExists(): Promise<boolean> {
        try {
            await this.lblShoppingCart.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking shopping cart page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the name of the product displayed in the cart
     * @returns Promise<string> - Product name text
     */
    async getProductName(): Promise<string> {
        return (await this.lstProductNames.first().innerText()).trim();
    }

    /**
     * Gets the quantity displayed for the product in the cart
     * @returns Promise<string> - Quantity value
     */
    async getProductQuantity(): Promise<string> {
        return await this.txtProductQuantity.first().inputValue();
    }

    /**
     * Gets the unit price displayed for the product in the cart
     * @returns Promise<string> - Unit price text
     */
    async getUnitPrice(): Promise<string> {
        return (await this.lblUnitPrice.innerText()).trim();
    }

    /**
     * Gets the applicable cart total
     * @returns Promise<string> - Cart total text
     */
    async getCartTotal(): Promise<string> {
        return (await this.rowCartTotal.locator('td').last().innerText()).trim();
    }
}
