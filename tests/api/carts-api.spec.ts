/**
 * Test Cases: FakeStore carts API
 *
 * Tags: @master @sanity @regression @api
 *
 * Steps:
 * 1) GET all carts and validate the cart structure
 * 2) GET a single cart by ID
 * 3) GET carts filtered by date range and by user
 * 4) GET carts with a limit and sorted ascending / descending
 * 5) POST / PUT / DELETE a cart and validate the responses
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

interface CartProduct {
    productId: number;
    quantity: number;
}

interface Cart {
    id: number;
    userId: number;
    date: string;
    products: CartProduct[];
}

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), 'GET all carts should return status 200').toBe(200);

        const responseBody: Cart[] = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, 'Response should contain at least one cart').toBeGreaterThan(0);

        responseBody.forEach((cart, index) => {
            expect(typeof cart.id, `Cart at index ${index} should have a numeric id`).toBe('number');
            expect(typeof cart.userId, `Cart at index ${index} should have a numeric userId`).toBe('number');
            expect(Array.isArray(cart.products), `Cart at index ${index} should contain a products array`).toBeTruthy();
        });

        console.log(`✅ Retrieved ${responseBody.length} carts.`);
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`);

        expect(response.status(), `GET cart ${CART_ID} should return status 200`).toBe(200);

        const cart: Cart = await response.json();

        expect(cart.id, 'Returned cart ID should match the requested ID').toBe(CART_ID);
        expect(typeof cart.userId, 'Cart should have a numeric userId').toBe('number');
        expect(cart.date, 'Cart should have a date').toBeTruthy();
        expect(Array.isArray(cart.products), 'Cart should contain a products array').toBeTruthy();

        cart.products.forEach((product, index) => {
            expect(typeof product.productId, `Product at index ${index} should have a numeric productId`).toBe('number');
            expect(typeof product.quantity, `Product at index ${index} should have a numeric quantity`).toBe('number');
        });

        console.log(`✅ Retrieved cart ${CART_ID}.`);
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by date range @master @regression @api', async ({ request }) => {

        const dateRangeRoute = Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE);

        const response = await request.get(`${BASE_URL}${dateRangeRoute}`);

        expect(response.status(), 'GET carts by date range should return status 200').toBe(200);

        const responseBody: Cart[] = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, `Response should contain carts between ${START_DATE} and ${END_DATE}`).toBeGreaterThan(0);

        const startTime = new Date(START_DATE).getTime();
        const endTime = new Date(END_DATE).getTime();

        responseBody.forEach((cart, index) => {
            const cartTime = new Date(cart.date).getTime();
            expect(cartTime, `Cart at index ${index} should fall on or after ${START_DATE}`).toBeGreaterThanOrEqual(startTime);
            expect(cartTime, `Cart at index ${index} should fall on or before ${END_DATE}`).toBeLessThanOrEqual(endTime);
        });

        console.log(`✅ Retrieved ${responseBody.length} carts within the requested date range.`);
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - Carts by user @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`);

        expect(response.status(), `GET carts for user ${USER_ID} should return status 200`).toBe(200);

        const responseBody: Cart[] = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, `Response should contain at least one cart for user ${USER_ID}`).toBeGreaterThan(0);

        responseBody.forEach((cart, index) => {
            expect(cart.userId, `Cart at index ${index} should belong to user ${USER_ID}`).toBe(USER_ID);
        });

        console.log(`✅ Retrieved ${responseBody.length} carts for user ${USER_ID}.`);
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`);

        expect(response.status(), 'GET carts with limit should return status 200').toBe(200);

        const responseBody: Cart[] = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, `Response should contain exactly ${LIMIT} carts`).toBe(LIMIT);

        console.log(`✅ Limited cart response contains ${responseBody.length} carts.`);
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Carts sorted ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status(), 'GET carts sorted ascending should return status 200').toBe(200);

        const responseBody: Cart[] = await response.json();
        const cartIds = responseBody.map((cart) => cart.id);
        const expectedOrder = [...cartIds].sort((a, b) => a - b);

        expect(cartIds, 'Cart IDs should be sorted in ascending order').toEqual(expectedOrder);

        console.log('✅ Cart IDs are in ascending order.');
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted Descending
    // ---------------------------------------------------------

    test('GET - Carts sorted descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status(), 'GET carts sorted descending should return status 200').toBe(200);

        const responseBody: Cart[] = await response.json();
        const cartIds = responseBody.map((cart) => cart.id);
        const expectedOrder = [...cartIds].sort((a, b) => b - a);

        expect(cartIds, 'Cart IDs should be sorted in descending order').toEqual(expectedOrder);

        console.log('✅ Cart IDs are in descending order.');
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status(), 'Cart creation should return status 201').toBe(201);

        const createdCart = await response.json();

        expect(createdCart.id, 'Created cart should have an ID').toBeTruthy();
        expect(createdCart.userId, 'Created cart should contain the submitted user ID').toBe(payload.userId);
        expect(createdCart.products, 'Created cart should contain the submitted products').toEqual(payload.products);

        console.log(`✅ Created cart with ID ${createdCart.id}.`);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`, { data: payload });

        expect(response.status(), 'Cart update should return status 200').toBe(200);

        const updatedCart = await response.json();

        expect(updatedCart.id, 'Returned cart ID should match the requested ID').toBe(CART_ID);
        expect(updatedCart.userId, 'Updated cart should contain the submitted user ID').toBe(payload.userId);
        expect(updatedCart.products[0].quantity, 'Updated product quantity should be reflected in the response')
            .toBe(payload.products[0].quantity);

        console.log(`✅ Updated cart ${CART_ID}.`);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete cart @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`);

        expect(response.status(), 'Cart deletion should return status 200').toBe(200);

        const deletedCart = await response.json();

        expect(deletedCart.id, 'Deleted cart response should contain the deleted cart ID').toBe(CART_ID);
        expect(Array.isArray(deletedCart.products), 'Deleted cart response should contain the products list').toBeTruthy();

        console.log(`✅ Deleted cart ${CART_ID}.`);
    });
});
