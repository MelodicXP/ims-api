'use strict';

const base64 = require('base-64');
const middleware = require('../../../../src/authentication/middleware/basic-auth-middleware.js');
const { database } = require('../../../../src/database/database-config.js');
const { users } = require('../../../../src/schemas/models-and-collections.js');

let userInfo = {
  admin: { username: 'admin-basic', password: 'password' },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await database.sync({force: true});
  await users.create(userInfo.admin);
});
afterAll(async () => {
  await database.close();
});

describe('Auth Middleware', () => {

  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  };

  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with the incorrect basic credentials', async () => {
      const basicAuthString = base64.encode('username:password');

      // Change the request to match this test case
      req.headers = {
        authorization: `Basic ${basicAuthString}`,
      };

      // Await middleware to complete execution
      await middleware(req, res, next);

      // After middlware has awaited, proceed with expectations
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Login' });
    });

    it('logs in an admin user with the right credentials', async () => {
      let basicAuthString = base64.encode(`${userInfo.admin.username}:${userInfo.admin.password}`);

      // Change the request to match this test case
      req.headers = {
        authorization: `Basic ${basicAuthString}`,
      };

      // Await middleware to complete execution
      await middleware(req, res, next);
      
      // After middlware has awaited, proceed with expectations
      expect(next).toHaveBeenCalledWith();
    });
  });
});