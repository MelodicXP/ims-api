'use strict';

const { app } = require('../../../../src/server.js');
const { db, users } = require('../../../../src/schemas/index-models.js');
const supertest = require('supertest');
const request = supertest(app);

let createdFoodItemId;
let testUser, testWriter, testEditor, testAdmin;
let createdUsers = [];

// Pre-load database with fake users
beforeAll(async () => {
  await db.sync({force: true});

  // Create test users with different roles
  testUser = await users.create({
    username: 'TestUser',
    password: 'pass123',
    role: 'user',
  });

  testWriter = await users.create({
    username: 'TestWriter',
    password: 'pass123',
    role: 'writer',
  });

  testEditor = await users.create({
    username: 'TestEditor',
    password: 'pass123',
    role: 'editor',
  });

  testAdmin = await users.create({
    username: 'TestAdmin',
    password: 'pass123',
    role: 'admin',
  });

  createdUsers.push(testUser, testWriter, testEditor, testAdmin);
});

afterAll(async () => {
  await db.drop();
});

describe('ACL Integration', () => {

  it('verfies Writer can CREATE', async () => {
    // Food Item to be created
    const foodItem = {
      name: 'banana',
      calories: 100,
      type: 'fruit',
    };

    // Create food item with authorized user
    let response = await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${testWriter.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(foodItem.name);

    // Save ID of food item for use in later tests
    createdFoodItemId = response.body.id;
  });

  it('verfies Editor can CREATE', async () => {
    // Food Item to be created
    const foodItem = {
      name: 'banana',
      calories: 100,
      type: 'fruit',
    };

    // Create food item with authorized user
    let response = await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${testEditor.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(foodItem.name);

    // Save ID of food item for use in later tests
    createdFoodItemId = response.body.id;
  });

  it('verfies Admin can CREATE', async () => {
    // Food Item to be created
    const foodItem = {
      name: 'banana',
      calories: 100,
      type: 'fruit',
    };

    // Create food item with authorized user
    let response = await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${testAdmin.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(foodItem.name);

    // Save ID of food item for use in later tests
    createdFoodItemId = response.body.id;
  });

  it('does NOT allow User to CREATE', async () => {
    // Food Item to be created
    const foodItem = {
      name: 'banana',
      calories: 100,
      type: 'fruit',
    };

    // Create food item with authorized user
    let response = await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${testUser.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Access Denied');
  });

  it('verifies ALL Users can READ', async () => {
    for (const user of createdUsers) {
      // Create Basic Auth Header(username and password only needed to read)
      // const credentials = base64.encode(`${user.username}:${user.password}`);
      console.log('user token from test', user.token);
      const authHeader = `Bearer ${user.token}`;

      // Set Authorization header
      let response = await request
        .get('/api/v2/food')
        .set('Authorization', authHeader);

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBe(true); // Check if response body is an array
      expect(response.body.length).toBeGreaterThan(0);
    }
  });

  it('verifies ALL Users can READ one item', async () => {
    for (const user of createdUsers) {
      // Create Basic Auth Header(username and password only needed to read)
      // const credentials = base64.encode(`${user.username}:${user.password}`);
      const authHeader = `Bearer ${user.token}`;

      // Set Authorization header
      let response = await request
        .get(`/api/v2/food/${createdFoodItemId}`)
        .set('Authorization', authHeader);

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBe(false); // Check if response body is an array
      expect(response.body.name).toEqual('banana');
    }
  });

  it('verifies Editor can UPDATE' , async () => {
    // Food Item to be updated
    const foodItem = {
      name: 'banana',
      calories: 250,
      type: 'fruit',
    };

    let response = await request
      .put(`/api/v2/food/${createdFoodItemId}`)
      .set('Authorization', `Bearer ${testEditor.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(200);
    expect(response.body.calories).toEqual(250);
  });

  it('verifies Admin can UPDATE' , async () => {
    // Food Item to be updated
    const foodItem = {
      name: 'banana',
      calories: 300,
      type: 'fruit',
    };

    let response = await request
      .put(`/api/v2/food/${createdFoodItemId}`)
      .set('Authorization', `Bearer ${testAdmin.token}`)
      .send(foodItem); // send food data in request body

    expect(response.status).toEqual(200);
    expect(response.body.calories).toEqual(300);
  });

  it('does NOT allow User to UPDATE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header
    if (!createdFoodItemId) {
      throw new Error('No food item ID defined. Make sure \'allows create access\' test runs successfully before this test.');
    }

    // Update food item
    const updatedFoodItem = {
      calories: 250, // New calorie count
    };

    let response = await request
      .put(`/api/v2/food/${createdFoodItemId}`)
      .set('Authorization', `Bearer ${testUser.token}`)
      .send(updatedFoodItem);

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Access Denied');
  });

  it('does NOT allow Writer to UPDATE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header
    if (!createdFoodItemId) {
      throw new Error('No food item ID defined. Make sure \'allows create access\' test runs successfully before this test.');
    }

    // Update food item
    const updatedFoodItem = {
      calories: 250, // New calorie count
    };

    let response = await request
      .put(`/api/v2/food/${createdFoodItemId}`)
      .set('Authorization', `Bearer ${testWriter.token}`)
      .send(updatedFoodItem);

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Access Denied');
  });

  it('does NOT allow User to DELETE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header

    let response = await request
      .delete(`/api/v2/food/${createdFoodItemId}`)
      .set('Authorization', `Bearer ${testUser.token}`);

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Access Denied');
  });

  it('does NOT allow Writer to DELETE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header

    let response = await request
      .delete(`/api/v2/food/${createdFoodItemId}`)
      .set('Authorization', `Bearer ${testWriter.token}`);

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Access Denied');
  });

  it('does NOT allow Editor to DELETE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header

    let response = await request
      .delete(`/api/v2/food/${createdFoodItemId}`)
      .set('Authorization', `Bearer ${testEditor.token}`);

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Access Denied');
  });

  it('verifies Admin can DELETE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header

    let response = await request
      .delete(`/api/v2/food/${createdFoodItemId}`)
      .set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual(`Record ${createdFoodItemId} deleted`);
  });
});