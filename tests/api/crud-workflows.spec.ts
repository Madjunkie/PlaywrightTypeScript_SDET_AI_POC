/**
 * Test Cases: FakeStore end-to-end CRUD workflows
 *
 * Tags: @master @regression @api @end-to-end
 *
 * Steps:
 * 1) Create a product, update it and delete it using the generated product ID
 * 2) Create a user, update it and delete it using the generated user ID
 * 3) Create a cart, update it and delete it using the generated cart ID
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('CRUD Workflow API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const USER_ID = Number(process.env.USER_ID ?? 1);

    // ---------------------------------------------------------
    // Product CRUD Workflow
    // ---------------------------------------------------------

    test('E2E - Product create, update and delete workflow @master @regression @api @end-to-end', async ({ request }) => {

        let productId = 0;

        await test.step('1) Create a product and verify status 201', async () => {
            const payload = RandomDataUtil.generateProductPayload();

            const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

            expect(response.status(), 'Product creation should return status 201').toBe(201);

            const createdProduct = await response.json();

            expect(createdProduct.id, 'Created product should have an ID').toBeTruthy();
            productId = createdProduct.id;
        });

        await test.step('2) Update the created product and verify the updated values', async () => {
            const payload = RandomDataUtil.generateUpdatedProductPayload();

            const response = await request.put(`${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`, { data: payload });

            expect(response.status(), 'Product update should return status 200').toBe(200);

            const updatedProduct = await response.json();

            expect(updatedProduct.id, 'Updated product ID should match the created product ID').toBe(productId);
            expect(updatedProduct.title, 'Updated title should be reflected in the response').toBe(payload.title);
        });

        await test.step('3) Delete the created product and verify status 200', async () => {
            const response = await request.delete(`${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`);

            // The API acknowledges the deletion of a generated ID with status 200 and an empty body
            expect(response.status(), 'Product deletion should return status 200').toBe(200);
        });

        console.log(`✅ Product CRUD workflow completed for product ID ${productId}.`);
    });

    // ---------------------------------------------------------
    // User CRUD Workflow
    // ---------------------------------------------------------

    test('E2E - User create, update and delete workflow @master @regression @api @end-to-end', async ({ request }) => {

        let userId = 0;

        await test.step('1) Create a user and verify status 201', async () => {
            const payload = RandomDataUtil.generateUserPayload();

            const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

            expect(response.status(), 'User creation should return status 201').toBe(201);

            const createdUser = await response.json();

            expect(createdUser.id, 'Created user should have a generated ID').toBeTruthy();
            userId = createdUser.id;
        });

        await test.step('2) Update the created user and verify the updated values', async () => {
            const payload = RandomDataUtil.generateUserUpdatePayload();

            const response = await request.put(`${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`, { data: payload });

            expect(response.status(), 'User update should return status 200').toBe(200);

            const updatedUser = await response.json();

            expect(updatedUser.username, 'Updated username should be reflected in the response').toBe(payload.username);
            expect(updatedUser.email, 'Updated email should be reflected in the response').toBe(payload.email);
        });

        await test.step('3) Delete the created user and verify status 200', async () => {
            const response = await request.delete(`${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`);

            // The API acknowledges the deletion of a generated ID with status 200 and a null body
            expect(response.status(), 'User deletion should return status 200').toBe(200);
        });

        console.log(`✅ User CRUD workflow completed for user ID ${userId}.`);
    });

    // ---------------------------------------------------------
    // Cart CRUD Workflow
    // ---------------------------------------------------------

    test('E2E - Cart create, update and delete workflow @master @regression @api @end-to-end', async ({ request }) => {

        let cartId = 0;

        await test.step('1) Create a cart and verify status 201', async () => {
            const payload = RandomDataUtil.generateCartPayload(USER_ID);

            const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

            expect(response.status(), 'Cart creation should return status 201').toBe(201);

            const createdCart = await response.json();

            expect(createdCart.id, 'Created cart should have an ID').toBeTruthy();
            expect(createdCart.userId, 'Created cart should contain the submitted user ID').toBe(payload.userId);
            expect(createdCart.products, 'Created cart should contain the submitted products').toEqual(payload.products);
            cartId = createdCart.id;
        });

        await test.step('2) Update the created cart and verify the updated product quantity', async () => {
            const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);

            const response = await request.put(`${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`, { data: payload });

            expect(response.status(), 'Cart update should return status 200').toBe(200);

            const updatedCart = await response.json();

            expect(updatedCart.id, 'Updated cart ID should match the created cart ID').toBe(cartId);
            expect(updatedCart.products[0].quantity, 'Updated product quantity should be reflected in the response')
                .toBe(payload.products[0].quantity);
        });

        await test.step('3) Delete the created cart and verify status 200', async () => {
            const response = await request.delete(`${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`);

            // The API acknowledges the deletion of a generated ID with status 200 and a null body
            expect(response.status(), 'Cart deletion should return status 200').toBe(200);
        });

        console.log(`✅ Cart CRUD workflow completed for cart ID ${cartId}.`);
    });
});
