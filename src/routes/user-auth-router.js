'use strict';

const express = require('express');
const userAuthRouter = express.Router();

const models = require('../database/database-models');
const { User } = models;
const verifyBasicAuthentication = require('../authentication/middleware/basic-auth-middleware');
const verifyBearerToken = require('../authentication/middleware/bearer-auth-middleware');
const CRUD = require('../utilities/crud-interface');
const requirePermission = require('../authentication/middleware/access-control-list-middleware');

function generateUserResponse(userRecord) {
  return {
    user: userRecord,
    token: userRecord.token,
  };
}

async function registerUser(req, res, next) {
  const newUser = req.body;
  try {
    const newUserRecord = await User.create(newUser);
    res.status(201).json(generateUserResponse(newUserRecord));
  } catch (error) {
    next(error.message);
  }
}

async function loginUser(req, res, next) {
  const user = req.user;
  try {
    if(!user || !user.token) {
      throw new Error('Authentication failed');
    }
    res.status(200).json(generateUserResponse(user));
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const userRepository = new CRUD(User); 
    const allUsers = await userRepository.get({});
    const usernames = allUsers.map(user => user.username);
    res.status(200).json(usernames);
  } catch (error) {
    next(error);
  }
}

// Route definitions
userAuthRouter.post('/signup', registerUser);
userAuthRouter.post('/signin', verifyBasicAuthentication, loginUser);
userAuthRouter.get('/users', verifyBearerToken, requirePermission('delete'), listUsers);

module.exports = userAuthRouter;