'use strict';

const bcrypt = require('bcrypt');
const CRUD = require('../../utilities/crud-interface');

async function authenticateUserBasic(userModel, username, password) {

  const userRepository = new CRUD(userModel);

  try {
    const user = await findUserByUsername(userRepository, username);
    await verifyPassword(password, user);
    return user; // Authentication successful
  } catch (error) {
    throw new Error('Authentication failed: ' + error.message);
  }
}

async function findUserByUsername(repository, username) {
  const user = await repository.get({ username });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

async function verifyPassword(plainTextPassword, user) {
  const isPasswordValid = await bcrypt.compare(plainTextPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  return true; // Password verification passed
}

module.exports = authenticateUserBasic;


