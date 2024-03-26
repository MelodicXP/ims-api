'use strict';

const supertest = require('supertest');

const { app } = require('../../../src/server.js');

const mockRequest = supertest(app);

describe ('Deafault server route and and 404 error handler', () => {

  it('checks default route', async () => {

    const response = await mockRequest.get('/');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Default route message');
  });

  it('checks 404 error handler', async () => {

    const response = await mockRequest.get('/badRoute');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Sorry, we could not find what you were looking for');
  });
  
  it('handles 404 on a bad method', async () => {
    const response = await mockRequest.put('/category');
    expect(response.status).toEqual(404);
  });
});