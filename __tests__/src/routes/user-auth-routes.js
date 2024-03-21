'use strict';

const supertest = require('supertest');

const { app } = require('../../../src/server.js');
const { database } = require('../../../src/database/database-config.js');
const { users } = require('../../../src/schemas/models-and-collections.js');

const mockRequest = supertest(app);

// Define test user data
let testManager;
let userData = {
  testUser: { username: 'user', password: 'password'},
};

beforeAll(async () => {
  await database.sync({force: true});
  // Create admin user for delete test
  testManager = await users.create({
    username: 'TestClerk',
    password: 'pass123',
    role: 'manager',
  });
});

afterAll(async () => {
  await database.close();
});

describe ('User Authorization Router', () => {

  it('can create a new user', async () => {

    const response = await mockRequest.post('/signup').send(userData.testUser);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(userData.testUser.username);
  });

});
