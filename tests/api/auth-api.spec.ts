/**
 * Test Cases: FakeStore authentication API
 *
 * Tags: @master @sanity @regression @api
 *
 * Steps:
 * 1) POST valid credentials to AUTH_LOGIN and verify status 201
 * 2) Verify the response contains a non-empty authentication token
 * 3) POST invalid credentials to AUTH_LOGIN and verify status 401
 * 4) Verify the error message states the credentials are incorrect
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Authentication API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const API_USERNAME = process.env.API_USERNAME || 'mor_2314';
    const API_PASSWORD = process.env.API_PASSWORD || '83r5^_';

    // ---------------------------------------------------------
    // POST - Successful Login
    // ---------------------------------------------------------

    test('POST - Login with valid credentials @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: API_USERNAME, password: API_PASSWORD }
        });

        expect(response.status(), 'Valid credentials should return status 201').toBe(201);

        const responseBody = await response.json();

        expect(responseBody.token, 'Response should contain an authentication token').toBeTruthy();
        expect(typeof responseBody.token, 'Authentication token should be a string').toBe('string');
        expect(responseBody.token.length, 'Authentication token should not be empty').toBeGreaterThan(0);

        console.log('✅ Login returned a non-empty authentication token.');
    });

    // ---------------------------------------------------------
    // POST - Invalid Login
    // ---------------------------------------------------------

    test('POST - Login with invalid credentials @master @regression @api', async ({ request }) => {

        const invalidCredentials = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: invalidCredentials
        });

        expect(response.status(), 'Invalid credentials should return status 401').toBe(401);

        // The API returns the error message as plain text, not JSON
        const errorMessage = (await response.text()).trim();

        expect(errorMessage, 'API should reject invalid credentials with the expected error message')
            .toBe('username or password is incorrect');

        console.log('✅ Invalid credentials were rejected with the expected error message.');
    });
});
