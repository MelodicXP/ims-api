'use strict';

const jwt = require('jsonwebtoken');
const CRUD = require('../utilities/crud-interface');
const { SECRET } = require('../utilities/secret-config');

async function authenticateToken (userModel, token) {

  // Insantiate CRUD with userModel
  const CRUD_Interface = new CRUD(userModel);

  try {
    const parsedToken = jwt.verify(token, SECRET);
    const user = await CRUD_Interface.get({ username: parsedToken.username });
    if (user) {
      return user;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = authenticateToken;

