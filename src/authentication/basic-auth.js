'use strict';

const bcrypt = require('bcrypt');
const CRUD = require('../utilities/crud-interface');

async function authenticateBasic(userModel, username, password) {

  const CRUDInterface = new CRUD(userModel);

  try {
    const user = await getUserByUsername(CRUDInterface, username);
    await validateUserPassword(password, user);
    return user; // User authenticated successfully
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getUserByUsername(CRUDInterface, username) {
  const user = await CRUDInterface.get({ username: username });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

async function validateUserPassword(password, user) {
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('Invalid User');
  }
  return true; // Return true as validation passed
}

module.exports = authenticateBasic;


