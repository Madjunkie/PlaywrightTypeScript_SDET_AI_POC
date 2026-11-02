/**
 * Test Cases: FakeStore JSON schema validation
 *
 * Tags: @master @regression @api
 *
 * Steps:
 * 1) GET a product and validate the response against the product schema
 * 2) GET a user and validate the response against the user schema
 * 3) GET a cart and validate the response against the cart schema
 */

import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import dotenv from 'dotenv';

dotenv.config();

test.describe('JSON Schema Validation API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    const ajv = new Ajv();

    // ---------------------------------------------------------
    // Product Response Schema
    // ---------------------------------------------------------

    test('JSON schema - Product response @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status(), `GET product ${PRODUCT_ID} should return status 200`).toBe(200);

        const responseBody = await response.json();

        const productSchema = DataProvider.readJson('./api/schemas/product_api_schema.json');
        const validate = ajv.compile(productSchema);
        const isValid = validate(responseBody);

        expect(isValid, `Product response does not conform to the expected schema: ${JSON.stringify(validate.errors, null, 2)}`).toBeTruthy();

        console.log('✅ Product response conforms to the expected JSON schema.');
    });

    // ---------------------------------------------------------
    // User Response Schema
    // ---------------------------------------------------------

    test('JSON schema - User response @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`);

        expect(response.status(), `GET user ${USER_ID} should return status 200`).toBe(200);

        const responseBody = await response.json();

        const userSchema = DataProvider.readJson('./api/schemas/user_api_schema.json');
        const validate = ajv.compile(userSchema);
        const isValid = validate(responseBody);

        expect(isValid, `User response does not conform to the expected schema: ${JSON.stringify(validate.errors, null, 2)}`).toBeTruthy();

        console.log('✅ User response conforms to the expected JSON schema.');
    });

    // ---------------------------------------------------------
    // Cart Response Schema
    // ---------------------------------------------------------

    test('JSON schema - Cart response @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`);

        expect(response.status(), `GET cart ${CART_ID} should return status 200`).toBe(200);

        const responseBody = await response.json();

        const cartSchema = DataProvider.readJson('./api/schemas/cart_api_schema.json');
        const validate = ajv.compile(cartSchema);
        const isValid = validate(responseBody);

        expect(isValid, `Cart response does not conform to the expected schema: ${JSON.stringify(validate.errors, null, 2)}`).toBeTruthy();

        console.log('✅ Cart response conforms to the expected JSON schema.');
    });
});
