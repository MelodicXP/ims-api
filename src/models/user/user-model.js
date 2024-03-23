'use strict';

const getUserSchemaProperties = require('./user-properties');
const { hashPassword } = require('../../utilities/hash-password');
const addBasicAuthenticationMethod = require('../../authentication/auth-logic/basic-auth');
const addTokenAuthenticationMethod = require('../../authentication/auth-logic/bearer-token-auth');

const defineUserModel = (sequilize, DataTypes) => {
  const userSchemaProperties = getUserSchemaProperties(DataTypes);
  const User = sequilize.define('Users', userSchemaProperties);

  User.beforeCreate(async (user) => {
    user.password = await hashPassword(user.password);
  });

  User.authenticateUserBasic = (username, password) => addBasicAuthenticationMethod(User, username, password);
  User.authenticateUserToken = (token) => addTokenAuthenticationMethod(User, token);

  return User;
};

module.exports = defineUserModel;
