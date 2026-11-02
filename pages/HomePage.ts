import { Page, Locator } from '@playwright/test';
import { RegistrationPage } from './RegistrationPage';
import { LoginPage } from './LoginPage';
import { LogoutPage } from './LogoutPage';
import { SearchResultsPage } from './SearchResultsPage';
import { ShoppingCartPage } from './ShoppingCartPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly lnkMyAccount: Locator;
    private readonly lnkRegister: Locator;
    private readonly lnkLogin: Locator;
    private readonly lnkLogout: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;
    private readonly btnCart: Locator;
    private readonly lnkViewCart: Locator;
    private readonly pnlHome: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lnkMyAccount = page.locator('#top-links a.dropdown-toggle');
        this.lnkRegister = page.locator('#top-links .dropdown-menu a', { hasText: 'Register' });
        this.lnkLogin = page.locator('#top-links .dropdown-menu a', { hasText: 'Login' });
        this.lnkLogout = page.locator('#top-links .dropdown-menu a', { hasText: 'Logout' });
        this.txtSearch = page.locator('#search input[name="search"]');
        this.btnSearch = page.locator('#search button');
        this.btnCart = page.locator('#cart button.dropdown-toggle');
        this.lnkViewCart = page.locator('#cart .dropdown-menu a[href*="checkout/cart"]');
        this.pnlHome = page.locator('#common-home');
    }

    /**
     * Opens the My Account dropdown menu in the header
     */
    async clickMyAccount(): Promise<void> {
        await this.lnkMyAccount.click();
    }

    /**
     * Clicks the Register link in the My Account dropdown
     * @returns Promise<RegistrationPage> - Instance of the registration page
     */
    async clickRegister(): Promise<RegistrationPage> {
        await this.lnkRegister.click();
        return new RegistrationPage(this.page);
    }

    /**
     * Clicks the Login link in the My Account dropdown
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async clickLogin(): Promise<LoginPage> {
        await this.lnkLogin.click();
        return new LoginPage(this.page);
    }

    /**
     * Clicks the Logout link in the My Account dropdown
     * @returns Promise<LogoutPage> - Instance of the logout page
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.lnkLogout.click();
        return new LogoutPage(this.page);
    }

    /**
     * Searches for a product from the header search box
     * @param productName - Product name to search for
     * @returns Promise<SearchResultsPage> - Instance of the search results page
     */
    async searchProduct(productName: string): Promise<SearchResultsPage> {
        await this.txtSearch.fill(productName);
        await this.btnSearch.click();
        return new SearchResultsPage(this.page);
    }

    /**
     * Opens the shopping cart page from the header cart dropdown
     * @returns Promise<ShoppingCartPage> - Instance of the shopping cart page
     */
    async clickShoppingCart(): Promise<ShoppingCartPage> {
        await this.btnCart.click();
        await this.lnkViewCart.click();
        return new ShoppingCartPage(this.page);
    }

    /**
     * Verifies the home page is displayed
     * @returns Promise<boolean> - true if the home page is displayed
     */
    async isHomePageExists(): Promise<boolean> {
        try {
            await this.pnlHome.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            console.log(`Error checking home page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the Logout option is rendered in the My Account dropdown (only when authenticated)
     * @returns Promise<boolean> - true if the Logout link is available
     */
    async isLogoutLinkPresent(): Promise<boolean> {
        try {
            return (await this.lnkLogout.count()) > 0;
        } catch (error) {
            console.log(`Error checking Logout link: ${error}`);
            return false;
        }
    }
}
