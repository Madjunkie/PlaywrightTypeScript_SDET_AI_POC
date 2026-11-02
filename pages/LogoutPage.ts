import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly lblAccountLogout: Locator;
    private readonly lblLogoutMessage: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblAccountLogout = page.locator('#content').getByRole('heading', { name: 'Account Logout' });
        this.lblLogoutMessage = page.locator('#content p').first();
        this.btnContinue = page.locator('#content').getByRole('link', { name: 'Continue' });
    }

    /**
     * Verifies the logout confirmation page is displayed
     * @returns Promise<boolean> - true if the logout page is displayed
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            await this.lblAccountLogout.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the logout confirmation message
     * @returns Promise<string> - Logout confirmation message text
     */
    async getLogoutMessage(): Promise<string> {
        return await this.lblLogoutMessage.innerText();
    }

    /**
     * Clicks the Continue button to return to the home page
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickContinue(): Promise<HomePage> {
        await this.btnContinue.click();
        return new HomePage(this.page);
    }
}
