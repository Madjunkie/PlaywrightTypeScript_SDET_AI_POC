/**
 * Test Cases: FakeStore users API
 *
 * Tags: @master @sanity @regression @api
 *
 * Steps:
 * 1) GET all users and validate the user structure
 * 2) GET a single user by ID
 * 3) GET users with a limit and sorted ascending / descending
 * 4) POST / PUT / DELETE a user and validate the responses
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

interface User {
    id: number;
    email: string;
    username: string;
    name: {
        firstname: string;
        lastname: string;
    };
    phone: string;
}

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status(), 'GET all users should return status 200').toBe(200);

        const responseBody: User[] = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, 'Response should contain at least one user').toBeGreaterThan(0);

        responseBody.forEach((user, index) => {
            expect(typeof user.id, `User at index ${index} should have a numeric id`).toBe('number');
            expect(user.email, `User at index ${index} should have an email`).toContain('@');
            expect(user.username, `User at index ${index} should have a username`).toBeTruthy();
        });

        console.log(`✅ Retrieved ${responseBody.length} users.`);
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`);

        expect(response.status(), `GET user ${USER_ID} should return status 200`).toBe(200);

        const user: User = await response.json();

        expect(user.id, 'Returned user ID should match the requested ID').toBe(USER_ID);
        expect(user.email, 'User should have an email').toContain('@');
        expect(user.username, 'User should have a username').toBeTruthy();

        console.log(`✅ Retrieved user ${USER_ID}.`);
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`);

        expect(response.status(), 'GET users with limit should return status 200').toBe(200);

        const responseBody: User[] = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, `Response should contain exactly ${LIMIT} users`).toBe(LIMIT);

        console.log(`✅ Limited user response contains ${responseBody.length} users.`);
    });

    // ---------------------------------------------------------
    // GET - Users Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Users sorted ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status(), 'GET users sorted ascending should return status 200').toBe(200);

        const responseBody: User[] = await response.json();
        const userIds = responseBody.map((user) => user.id);
        const expectedOrder = [...userIds].sort((a, b) => a - b);

        expect(userIds, 'User IDs should be sorted in ascending order').toEqual(expectedOrder);

        console.log('✅ User IDs are in ascending order.');
    });

    // ---------------------------------------------------------
    // GET - Users Sorted Descending
    // ---------------------------------------------------------

    test('GET - Users sorted descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status(), 'GET users sorted descending should return status 200').toBe(200);

        const responseBody: User[] = await response.json();
        const userIds = responseBody.map((user) => user.id);
        const expectedOrder = [...userIds].sort((a, b) => b - a);

        expect(userIds, 'User IDs should be sorted in descending order').toEqual(expectedOrder);

        console.log('✅ User IDs are in descending order.');
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create user @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status(), 'User creation should return status 201').toBe(201);

        // The API returns the generated user ID as the creation result
        const createdUser = await response.json();

        expect(createdUser.id, 'Created user response should contain a generated user ID').toBeTruthy();
        expect(typeof createdUser.id, 'Generated user ID should be a number').toBe('number');
        expect(createdUser.id, 'Generated user ID should be greater than zero').toBeGreaterThan(0);

        console.log(`✅ Created user with ID ${createdUser.id}.`);
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update user @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserUpdatePayload();

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(USER_ID))}`, { data: payload });

        expect(response.status(), 'User update should return status 200').toBe(200);

        const updatedUser = await response.json();

        expect(updatedUser.username, 'Updated username should be reflected in the response').toBe(payload.username);
        expect(updatedUser.email, 'Updated email should be reflected in the response').toBe(payload.email);
        expect(updatedUser.phone, 'Updated phone should be reflected in the response').toBe(payload.phone);

        console.log(`✅ Updated user ${USER_ID}.`);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete user @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(USER_ID))}`);

        expect(response.status(), 'User deletion should return status 200').toBe(200);

        const deletedUser = await response.json();

        expect(deletedUser.id, 'Deleted user response should contain the deleted user ID').toBe(USER_ID);
        expect(deletedUser.username, 'Deleted user response should contain the username').toBeTruthy();

        console.log(`✅ Deleted user ${USER_ID}.`);
    });
});
