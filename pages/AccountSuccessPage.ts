import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class AccountSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly lblAccountCreated: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblAccountCreated = page.locator('#content').getByRole('heading', { name: 'Your Account Has Been Created!' });
        this.btnContinue = page.locator('#content').getByRole('link', { name: 'Continue' });
    }

    /**
     * Verifies the account created confirmation page is displayed
     * @returns Promise<boolean> - true if the account created confirmation is displayed
     */
    async isAccountSuccessPageExists(): Promise<boolean> {
        try {
            await this.lblAccountCreated.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking account success page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the account created confirmation message
     * @returns Promise<string> - Confirmation message text
     */
    async getSuccessMessage(): Promise<string> {
        return await this.lblAccountCreated.innerText();
    }

    /**
     * Clicks the Continue button to proceed to the My Account page
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async clickContinue(): Promise<MyAccountPage> {
        await this.btnContinue.click();
        return new MyAccountPage(this.page);
    }
}
