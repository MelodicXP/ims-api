'use strict';

const { app } = require('../../../src/server.js');
const { database } = require('../../../src/database/database-config.js');
const models  = require('../../../src/database/database-models.js');
const { User } = models;
const supertest = require('supertest');
const request = supertest(app);

let createdItemId;
let testClerk, testManager, testAuditor;
let createdUsers = [];

// Pre-load database with fake users
beforeAll(async () => {
  await database.sync({force: true});

  // Create test users with different roles
  testClerk = await User.create({
    username: 'TestClerk',
    password: 'pass123',
    role: 'clerk',
  });

  testManager = await User.create({
    username: 'TestManager',
    password: 'pass123',
    role: 'manager',
  });

  testAuditor = await User.create({
    username: 'TestAuditor',
    password: 'pass123',
    role: 'auditor',
  });

  createdUsers.push(testClerk, testManager, testAuditor);
});

afterAll(async () => {
  await database.drop();
});

describe('ACL Integration', () => {

  it('verfies clerk can CREATE', async () => {
    const inventoryItem = {
      itemName: 'cell phone',
      price: 100,
      quantity: 4,
    };

    let response = await request
      .post('/api/v1/item')
      .set('Authorization', `Bearer ${testClerk.token}`)
      .send(inventoryItem); 

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(inventoryItem.name);

    // Save ID of item for use in later tests
    createdItemId = response.body.id;
  });

  it('verfies Manager can CREATE', async () => {
    const inventoryItem = {
      itemName: 'charger',
      price: 100,
      quantity: 2,
    };

    // Create item with authorized user
    let response = await request
      .post('/api/v1/item')
      .set('Authorization', `Bearer ${testManager.token}`)
      .send(inventoryItem); 

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(inventoryItem.name);

    // Save ID of item for use in later tests
    createdItemId = response.body.id;
  });

  it('does NOT allow Auditor to CREATE', async () => {
    const inventoryItem = {
      itemName: 'fast charger',
      price: 200,
      quantity: 4,
    };

    // Create item with unauthorized user
    let response = await request
      .post('/api/v1/item')
      .set('Authorization', `Bearer ${testAuditor.token}`)
      .send(inventoryItem); 

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
        .get('/api/v1/item')
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
        .get(`/api/v1/item/${createdItemId}`)
        .set('Authorization', authHeader);

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBe(false); // Check if response body is an array
      expect(response.body.itemName).toEqual('charger');
    }
  });

  it('verifies clerk can UPDATE' , async () => {
    // Item to be updated
    const inventoryItem = {
      itemName: 'charger',
      price: 150,
      quantity: 2,
    };

    let response = await request
      .put(`/api/v1/item/${createdItemId}`)
      .set('Authorization', `Bearer ${testClerk.token}`)
      .send(inventoryItem); 

    expect(response.status).toEqual(200);
    expect(response.body.price).toEqual(150);
  });

  it('verifies Manager can UPDATE' , async () => {
    // Item to be updated
    const inventoryItem = {
      itemName: 'charger',
      price: 180,
      quantity: 2,
    };

    let response = await request
      .put(`/api/v1/item/${createdItemId}`)
      .set('Authorization', `Bearer ${testManager.token}`)
      .send(inventoryItem); // send food data in request body

    expect(response.status).toEqual(200);
    expect(response.body.price).toEqual(180);
  });

  it('does NOT allow Auditor to UPDATE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header
    if (!createdItemId) {
      throw new Error('No food item ID defined. Make sure \'allows create access\' test runs successfully before this test.');
    }

    const updatedItem = {
      quantity: 4, // New calorie count
    };

    let response = await request
      .put(`/api/v1/item/${createdItemId}`)
      .set('Authorization', `Bearer ${testAuditor.token}`)
      .send(updatedItem);

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Access Denied');
  });

  it('does NOT allow clerk to DELETE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header

    let response = await request
      .delete(`/api/v1/item/${createdItemId}`)
      .set('Authorization', `Bearer ${testClerk.token}`);

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Access Denied');
  });

  it('does NOT allow Auditor to DELETE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header

    let response = await request
      .delete(`/api/v1/item/${createdItemId}`)
      .set('Authorization', `Bearer ${testAuditor.token}`);

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Access Denied');
  });

  it('verifies Manager can DELETE', async () => {
    // set('Authorization', `Bearer ${testWriter.token}`) is used to set and send header

    let response = await request
      .delete(`/api/v1/item/${createdItemId}`)
      .set('Authorization', `Bearer ${testManager.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual(`Record ${createdItemId} deleted`);
  });
});