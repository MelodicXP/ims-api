'use strict';

const { app } = require('../../../src/server.js');
const { database } = require('../../../src/database/database-config.js');
const models  = require('../../../src/models/create-all-models.js');
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

describe('Category REST API', () => {

  it('fails to get a non-existent category by id', async () => {
    let response = await request.get('/category/9999');
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Sorry, we could not find what you were looking for');
  });
  
  it('fails to add category with invalid data', async () => {
    let response = await request.post('/category').send({
      categoryName: 123, // assuming name should be a string
    });
    expect(response.status).toEqual(404);
  });
  
  it('fails to update a non-existent category by id', async () => {
    let response = await request.put('/author/9999').send({
      categoryName: 'Non-existent Cateogry',
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Sorry, we could not find what you were looking for');
  });

  it('fails to delete non-existent category by id', async () => {
    let deleteErrorResponse = await request.delete('/category/9999');
    expect(deleteErrorResponse.status).toEqual(404);
    expect(deleteErrorResponse.body.message).toEqual('Sorry, we could not find what you were looking for');
  });

  it('verifies manager an CREATE categories', async () => {
    const categoryNames = ['cases', 'chargers', 'cell phones', 'accessories'];
  
    const categories = categoryNames.map(name => ({ categoryName: name }));
  
    // Initialize expectedId to manage the expected sequence of IDs
    let expectedId = 1;
  
    for (const category of categories) {
      console.log('category:', category);

      let response = await request
        .post('/api/v1/category')
        .set('Authorization', `Bearer ${testManager.token}`)
        .send(category);

      console.log('response body from creating categories:', response.body);
  
      expect(response.status).toEqual(201);
      expect(response.body.categoryName).toEqual(category.categoryName);
      expect(response.body.id).toBeTruthy();
      expect(response.body.id).toEqual(expectedId++);
    }
  });

  it('verifies Manager can READ categories from database', async () => {

    // Set Authorization header
    let response = await request
      .get('/api/v1/category')
      .set('Authorization', `Bearer ${testManager.token}`);

    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true); // Check if response body is an array
    expect(response.body.length).toBeGreaterThan(1);
    expect(response.body[0].categoryName).toEqual('cases');
    expect(response.body[1].categoryName).toEqual('chargers');
    expect(response.body[0].id).toEqual(1);
  });

  it('verifies Manger can READ one category by id', async () => {
    // Set Authorization header
    let response = await request
      .get('/api/v1/category/1')
      .set('Authorization', `Bearer ${testManager.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.categoryName).toEqual('cases');
    expect(response.body.id).toBeTruthy();
    expect(response.body.id).toEqual(1);
  });

  it('verifies Manager can UPDATE category by id', async () => {
    // Set Authorization header
    let response = await request
      .put('/api/v1/category/1')
      .set('Authorization', `Bearer ${testManager.token}`)
      .send({
        categoryName: 'phone cases',
      });
    
    expect(response.status).toEqual(200);
    expect(response.body.categoryName).toEqual('phone cases');
    expect(response.body.id).toBeTruthy();
    expect(response.body.id).toEqual(1);
  });
});

describe('Inventory API ACL Integration', () => {
  
  it('verfies clerk can CREATE inventory item', async () => {
    const inventoryItem = {
      itemName: 'Samsung Z Fold 5 Case',
      price: 50,
      quantity: 4,
      categoryID: 1, // this id is cases category
    };
    
    let response = await request
      .post('/api/v1/item')
      .set('Authorization', `Bearer ${testClerk.token}`)
      .send(inventoryItem); 
    
    expect(response.status).toEqual(201);
    expect(response.body.itemName).toEqual(inventoryItem.itemName);
    expect(response.body.categoryID).toEqual(1);
  });
  
  it('verfies Manager can CREATE inventory item', async () => {
    const inventoryItem = {
      itemName: 'Anker Charger',
      price: 100,
      quantity: 2,
      categoryID: 2, // this id is chargers
    };

    // Create item with authorized user
    let response = await request
      .post('/api/v1/item')
      .set('Authorization', `Bearer ${testManager.token}`)
      .send(inventoryItem); 

    expect(response.status).toEqual(201);
    expect(response.body.itemName).toEqual(inventoryItem.itemName);
    expect(response.body.categoryID).toEqual(2);

    // Save ID of item for use in later tests
    createdItemId = response.body.id;
  });
  
  it('does NOT allow Auditor to CREATE', async () => {
    const inventoryItem = {
      itemName: 'iPhone 15 Pro Max',
      price: 1300,
      quantity: 4,
      categoryID: 3,
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
      expect(response.body.itemName).toEqual('Anker Charger');
      expect(response.body.categoryID).toEqual(2); // category of chargers
    }
  });

  it('verifies clerk can UPDATE item by id' , async () => {
    // Item to be updated
    const inventoryItem = {
      itemName: 'Anker Accessory',
      price: 150,
      quantity: 2,
      categoryID: 4,
    };

    let response = await request
      .put(`/api/v1/item/${createdItemId}`)
      .set('Authorization', `Bearer ${testClerk.token}`)
      .send(inventoryItem); 

    expect(response.status).toEqual(200);
    expect(response.body.price).toEqual(150);
    expect(response.body.itemName).toEqual(inventoryItem.itemName);
    expect(response.body.categoryID).toEqual(4);
  });

  it('verifies Manager can UPDATE' , async () => {
    // Item to be updated
    const inventoryItem = {
      itemName: 'Anker charger',
      price: 180,
      quantity: 2,
      categoryID: 2,
    };

    let response = await request
      .put(`/api/v1/item/${createdItemId}`)
      .set('Authorization', `Bearer ${testManager.token}`)
      .send(inventoryItem); // send food data in request body

    expect(response.status).toEqual(200);
    expect(response.body.price).toEqual(180);
    expect(response.body.itemName).toEqual(inventoryItem.itemName);
    expect(response.body.categoryID).toEqual(2);
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

  it('verifies all user can READ items by category id', async () => {
    for (const user of createdUsers) {
      // Create Basic Auth Header(username and password only needed to read)
      // const credentials = base64.encode(`${user.username}:${user.password}`);
      const authHeader = `Bearer ${user.token}`;

      // Set Authorization header
      let response = await request
        .get('/api/v1/category/1/items')
        .set('Authorization', authHeader);

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBe(true);
      console.log('Category body with items in it:', response.body);
      expect(response.body[0].itemName).toEqual('Samsung Z Fold 5 Case');
      expect(response.body[0].itemName).toEqual('Samsung Z Fold 5 Case');    }
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