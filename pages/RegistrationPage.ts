import { Page, Locator } from '@playwright/test';
import { AccountSuccessPage } from './AccountSuccessPage';

export class RegistrationPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtPasswordConfirm: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;
    private readonly lblRegisterAccount: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtPasswordConfirm = page.locator('#input-confirm');
        this.chkPrivacyPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.locator('#content input[type="submit"][value="Continue"]');
        this.lblRegisterAccount = page.locator('#content').getByRole('heading', { name: 'Register Account' });
    }

    /**
     * Completes the registration form with the customer details, accepts the privacy policy and submits it
     * @param customer - Customer registration details
     * @returns Promise<AccountSuccessPage> - Instance of the account success page
     */
    async completeRegistration(customer: {
        firstName: string;
        lastName: string;
        email: string;
        telephone: string;
        password: string;
    }): Promise<AccountSuccessPage> {
        try {
            await this.txtFirstName.fill(customer.firstName);
            await this.txtLastName.fill(customer.lastName);
            await this.txtEmail.fill(customer.email);
            await this.txtTelephone.fill(customer.telephone);
            await this.txtPassword.fill(customer.password);
            await this.txtPasswordConfirm.fill(customer.password);
            await this.chkPrivacyPolicy.check();
            await this.btnContinue.click();
            return new AccountSuccessPage(this.page);
        } catch (error) {
            console.log(`Error completing registration: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the registration page is displayed
     * @returns Promise<boolean> - true if the registration page is displayed
     */
    async isRegistrationPageExists(): Promise<boolean> {
        try {
            await this.lblRegisterAccount.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking registration page: ${error}`);
            return false;
        }
    }
}
