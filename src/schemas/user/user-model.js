'use strict';

const getUserSchemaProperties = require('./user-properties');
const { hashPassword } = require('../../utilities/hash-password');
const addBasicAuthenticationMethod = require('../../authentication/basic-auth');
const addTokenAuthenticationMethod = require('../../authentication/bearer-token-auth');

const defineUserModel = (sequilize, DataTypes) => {
  const userSchemaProperties = getUserSchemaProperties(DataTypes);
  const User = sequilize.define('Users', userSchemaProperties);

  User.beforeCreate(async (user) => {
    user.password = await hashPassword(user.password);
  });

  User.authenticateBasic = (username, password) => addBasicAuthenticationMethod(User, username, password);
  User.authenticateToken = (token) => addTokenAuthenticationMethod(User, token);

  return User;
};

module.exports = defineUserModel;
