'use strict';

const bcrypt = require('bcrypt');
const CRUD = require('./crud-interface');

async function authenticateBasic (userModel, username, password) {

  // Insantiate CRUD with userModel
  const CRUD_Interface = new CRUD(userModel);

  try {

    const user = await CRUD_Interface.get({ username: username });

    if(!user) {
      throw new Error('User not found');
    }

    // Compare password provided to password from database
    const validPassword = await bcrypt.compare(password, user.password);

    if(validPassword) {
      return user;
    } else {
      throw new Error('Invalid User');
    }

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = authenticateBasic;