'use strict';

const express = require('express');
const authRouter = express.Router();

const { users } = require('../schemas/models-and-collections');
//todo set up middleware - const basicAuthMiddlware = require

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

// todo - reactivate once basic auth middlware created
// async function handleUserSignin (req, res, next) {
//   const user = req.user;
//   try {
//     if(!user || !user.token) {
//       throw new Error('Authentication failed');
//     }
//     const userResponse = createUserResponseObject(user);
//     res.status(200).json(userResponse);
//   } catch (error) {
//     next(error);
//   }
// }

// Route definitions
authRouter.post('/signup', handleNewUserSignup);
// todo - authRouter.post('/signin', basicAuthMiddleware, handleUserSignin);

module.exports = authRouter;