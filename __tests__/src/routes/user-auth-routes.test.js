'use strict';

const supertest = require('supertest');

const { app } = require('../../../src/server.js');
const { database } = require('../../../src/database/database-config.js');
const models  = require('../../../src/models/database-models.js');
const { users } = models;

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
    username: 'TestManager',
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

  it('can signin with basic auth string', async () => {
    let { username, password } = userData.testUser;

    const response = await mockRequest
      .post('/signin')
      .auth(username, password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(username);
  });

  it('verfies basic auth fails with known user and wrong password ', async () => {

    const response = await mockRequest
      .post('/signin')
      .auth('user', 'xyz');
    const { user, token } = response.body;

    expect(response.status).toBe(403);
    expect(response.body.message).toEqual('Invalid Login');
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });

  it('verifies basic auth fails with unknown user', async () => {

    const response = await mockRequest.post('/signin')
      .auth('nobody', 'xyz');
    const { user, token } = response.body;

    expect(response.status).toBe(403);
    expect(response.body.message).toEqual('Invalid Login');
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });
});
