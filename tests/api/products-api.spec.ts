/**
 * Test Cases: FakeStore products API
 *
 * Tags: @master @sanity @regression @api
 *
 * Steps:
 * 1) GET all products and validate the product structure
 * 2) GET a single product by ID
 * 3) GET products with a limit and sorted ascending / descending
 * 4) GET all categories and products of a specific category
 * 5) POST / PUT / DELETE a product and validate the responses
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const CATEGORY = 'electronics';

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), 'GET all products should return status 200').toBe(200);

        const responseBody: Product[] = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, 'Response should contain at least one product').toBeGreaterThan(0);

        responseBody.forEach((product, index) => {
            expect(typeof product.id, `Product at index ${index} should have a numeric id`).toBe('number');
            expect(product.title, `Product at index ${index} should have a title`).toBeTruthy();
            expect(typeof product.price, `Product at index ${index} should have a numeric price`).toBe('number');
            expect(product.category, `Product at index ${index} should have a category`).toBeTruthy();
            expect(product.image, `Product at index ${index} should have an image URL`).toBeTruthy();
        });

        console.log(`✅ Retrieved ${responseBody.length} products.`);
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status(), `GET product ${PRODUCT_ID} should return status 200`).toBe(200);

        const product: Product = await response.json();

        expect(product.id, 'Returned product ID should match the requested ID').toBe(PRODUCT_ID);
        expect(product.title, 'Product should have a title').toBeTruthy();
        expect(product.price, 'Product price should be greater than zero').toBeGreaterThan(0);
        expect(product.category, 'Product should have a category').toBeTruthy();
        expect(product.image, 'Product should have an image URL').toContain('http');

        console.log(`✅ Retrieved product ${PRODUCT_ID}.`);
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`);

        expect(response.status(), 'GET products with limit should return status 200').toBe(200);

        const responseBody: Product[] = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, `Response should contain exactly ${LIMIT} products`).toBe(LIMIT);

        console.log(`✅ Limited product response contains ${responseBody.length} products.`);
    });

    // ---------------------------------------------------------
    // GET - Products Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Products sorted ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status(), 'GET products sorted ascending should return status 200').toBe(200);

        const responseBody: Product[] = await response.json();
        const productIds = responseBody.map((product) => product.id);
        const expectedOrder = [...productIds].sort((a, b) => a - b);

        expect(productIds, 'Product IDs should be sorted in ascending order').toEqual(expectedOrder);

        console.log('✅ Product IDs are in ascending order.');
    });

    // ---------------------------------------------------------
    // GET - Products Sorted Descending
    // ---------------------------------------------------------

    test('GET - Products sorted descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status(), 'GET products sorted descending should return status 200').toBe(200);

        const responseBody: Product[] = await response.json();
        const productIds = responseBody.map((product) => product.id);
        const expectedOrder = [...productIds].sort((a, b) => b - a);

        expect(productIds, 'Product IDs should be sorted in descending order').toEqual(expectedOrder);

        console.log('✅ Product IDs are in descending order.');
    });

    // ---------------------------------------------------------
    // GET - All Product Categories
    // ---------------------------------------------------------

    test('GET - All product categories @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), 'GET all categories should return status 200').toBe(200);

        const responseBody: string[] = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, 'Response should contain at least one category').toBeGreaterThan(0);

        responseBody.forEach((category, index) => {
            expect(typeof category, `Category at index ${index} should be a string`).toBe('string');
            expect(category.length, `Category at index ${index} should not be empty`).toBeGreaterThan(0);
        });

        console.log(`✅ Retrieved ${responseBody.length} product categories.`);
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by category @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', CATEGORY)}`);

        expect(response.status(), `GET products for category '${CATEGORY}' should return status 200`).toBe(200);

        const responseBody: Product[] = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, `Response should contain at least one '${CATEGORY}' product`).toBeGreaterThan(0);

        responseBody.forEach((product, index) => {
            expect(product.category, `Product at index ${index} should belong to category '${CATEGORY}'`).toBe(CATEGORY);
        });

        console.log(`✅ Retrieved ${responseBody.length} products for category '${CATEGORY}'.`);
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status(), 'Product creation should return status 201').toBe(201);

        const createdProduct = await response.json();

        expect(createdProduct.id, 'Created product should have an ID').toBeTruthy();
        expect(createdProduct.title, 'Created product should contain the submitted title').toBe(payload.title);
        expect(createdProduct.price, 'Created product should contain the submitted price').toBe(payload.price);
        expect(createdProduct.description, 'Created product should contain the submitted description').toBe(payload.description);
        expect(createdProduct.category, 'Created product should contain the submitted category').toBe(payload.category);
        expect(createdProduct.image, 'Created product should contain the submitted image').toBe(payload.image);

        console.log(`✅ Created product with ID ${createdProduct.id}.`);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedProductPayload();

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`, { data: payload });

        expect(response.status(), 'Product update should return status 200').toBe(200);

        const updatedProduct = await response.json();

        expect(updatedProduct.id, 'Returned product ID should match the requested ID').toBe(PRODUCT_ID);
        expect(updatedProduct.title, 'Updated title should be reflected in the response').toBe(payload.title);
        expect(updatedProduct.price, 'Updated price should be reflected in the response').toBe(payload.price);

        console.log(`✅ Updated product ${PRODUCT_ID}.`);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete product @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status(), 'Product deletion should return status 200').toBe(200);

        const deletedProduct = await response.json();

        expect(deletedProduct.id, 'Deleted product response should contain the deleted product ID').toBe(PRODUCT_ID);
        expect(deletedProduct.title, 'Deleted product response should contain the product title').toBeTruthy();

        console.log(`✅ Deleted product ${PRODUCT_ID}.`);
    });
});
