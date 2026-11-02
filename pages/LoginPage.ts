import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly lblReturningCustomer: Locator;
    private readonly lblWarning: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtEmail = page.locator('#input-email');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.locator('#content input[type="submit"][value="Login"]');
        this.lblReturningCustomer = page.locator('#content').getByRole('heading', { name: 'Returning Customer' });
        this.lblWarning = page.locator('.alert-danger');
    }

    /**
     * Logs in with the given credentials (blank values leave the corresponding field empty)
     * @param email - User email address
     * @param password - User password
     */
    async login(email: string, password: string): Promise<void> {
        await this.txtEmail.fill(email);
        await this.txtPassword.fill(password);
        await this.btnLogin.click();
    }

    /**
     * Verifies the login page is displayed
     * @returns Promise<boolean> - true if the login page is displayed
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            await this.lblReturningCustomer.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the warning message displayed when authentication fails
     * @returns Promise<string> - Warning message text
     */
    async getWarningMessage(): Promise<string> {
        return await this.lblWarning.innerText();
    }
}
