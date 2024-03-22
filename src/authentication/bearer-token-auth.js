'use strict';

const jwt = require('jsonwebtoken');
const CRUD = require('../utilities/crud-interface');
const { SECRET } = require('../utilities/secret-config');

function decodeToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

async function findUserByUsername(userModel, username) {
  const repository = new CRUD(userModel);
  const user = await repository.get({ username });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

async function authenticateUserToken (userModel, token) {
  try {
    const { username } = decodeToken(token);
    const user = await findUserByUsername(userModel, username);
    return user; // User authenticated successfully
  } catch (error) {
    throw new Error('Authentication failed: ' + error.message);
  }
}

module.exports = authenticateUserToken;

