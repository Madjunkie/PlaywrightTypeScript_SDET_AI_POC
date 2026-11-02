import { Page, Locator } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly lblProductName: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly lblSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblProductName = page.locator('#content h1');
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.lblSuccessMessage = page.locator('.alert-success');
    }

    /**
     * Verifies the product details page is displayed
     * @returns Promise<boolean> - true if the product details page is displayed
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            await this.btnAddToCart.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the name of the product displayed on the details page
     * @returns Promise<string> - Product name text
     */
    async getProductName(): Promise<string> {
        return (await this.lblProductName.innerText()).trim();
    }

    /**
     * Sets the product quantity required for the cart
     * @param quantity - Quantity to set
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Adds the product to the shopping cart
     */
    async clickAddToCart(): Promise<void> {
        await this.btnAddToCart.click();
    }

    /**
     * Gets the product added confirmation message
     * @returns Promise<string> - Success message text
     */
    async getSuccessMessage(): Promise<string> {
        return await this.lblSuccessMessage.innerText();
    }
}
