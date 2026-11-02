/**
 * Test Case: OpenCart login flow (data driven using an external file)
 *
 * Tags: @master @datadriven @web
 *
 * Data: testdata/opencart_logindata.json
 *
 * Steps:
 * 1) Navigate to the login page
 * 2) Submit the login form with the credentials of the data row (blank values leave the fields empty)
 * 3) Verify the result against the expected value of the data row
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

type LoginDataRow = {
    testName: string;
    email: string;
    password: string;
    expected: string;
};

const loginData: LoginDataRow[] = DataProvider.readJson('./testdata/opencart_logindata.json');

test.describe('Login - Data Driven Tests', () => {
    for (const [index, row] of loginData.entries()) {
        test(`Login test - ${row.testName} [row ${index + 1}] @master @datadriven @web`, async ({ homePage, loginPage, myAccountPage, page }) => {
            const email = row.email.trim() === '' ? '' : row.email;
            const password = row.password.trim() === '' ? '' : row.password;

            await test.step('1) Navigate to the login page', async () => {
                await homePage.clickMyAccount();
                await homePage.clickLogin();
            });

            await test.step('2) Submit the login form with the data row credentials', async () => {
                await loginPage.login(email, password);
            });

            await test.step('3) Validate the result against the expected value', async () => {
                if (row.expected.trim().toLowerCase() === 'success') {
                    await expect(page).toHaveURL(/route=account\/account/);
                    expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
                } else {
                    expect(await loginPage.getWarningMessage()).toMatch(/No match for E-Mail Address and\/or Password|exceeded allowed number of login attempts/);
                    expect(await myAccountPage.isMyAccountPageExists()).toBeFalsy();
                    expect(page.url()).toContain('route=account/login');
                }
            });

            console.log('✅ ✔️ Completed successfully!');
        });
    }
});
