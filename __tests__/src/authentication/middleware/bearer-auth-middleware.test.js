'use strict';

// require('dotenv').config();
const middleware = require('../../../../src/authentication/middleware/bearer-auth-middleware.js');
const { database } = require('../../../../src/database/database-config.js');
const models = require('../../../../src/models/create-all-models.js');
const { User } = models;
const jwt = require('jsonwebtoken');
const { SECRET } = require('../../../../src/utilities/secret-config.js');

let userInfo = {
  admin: { username: 'admin', password: 'password' },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await database.sync({ force: true });
  try {
    await User.create(userInfo.admin);
  } catch (error) {
    console.error('Error creating test user:', error);
  }
});

afterAll(async () => {
  await database.close();
});

describe('Auth Middleware', () => {

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    setHeader: jest.fn(),
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with an incorrect token', async () => {

      req.headers = {
        authorization: 'Bearer thisisabadtoken',
      };

      // Await middleware to complete execution
      await middleware(req, res, next);

      // After middlware has awaited, proceed with expectations
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('logs in a user with a proper token', async() => {

      const user = { username: 'admin'};
      
      const token = jwt.sign(user, SECRET);

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();

    });
  });
});