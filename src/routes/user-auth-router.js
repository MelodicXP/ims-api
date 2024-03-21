'use strict';

const express = require('express');
const userAuthRouter = express.Router();

const { users } = require('../schemas/models-and-collections');
const basicAuthMiddlware = require('../authentication/middleware/basic-auth-middleware');

function createUserResponseObject(userRecord) {
  return {
    user: userRecord,
    token: userRecord.token,
  };
}

async function handleNewUserSignup(req, res, next) {
  const newUser = req.body;
  try {
    let newUserRecord = await users.create(newUser);
    const newUserResponse = createUserResponseObject(newUserRecord);
    res.status(201).json(newUserResponse);
  } catch (error) {
    next(error.message);
  }
}

async function handleUserSignin (req, res, next) {
  const user = req.user;
  try {
    if(!user || !user.token) {
      throw new Error('Authentication failed');
    }
    const userResponse = createUserResponseObject(user);
    res.status(200).json(userResponse);
  } catch (error) {
    next(error);
  }
}

// Route definitions
userAuthRouter.post('/signup', handleNewUserSignup);
userAuthRouter.post('/signin', basicAuthMiddlware, handleUserSignin);

module.exports = userAuthRouter;