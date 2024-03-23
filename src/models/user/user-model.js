'use strict';

const getUserProperties = require('./user-properties');
const { hashPassword } = require('../../utilities/hash-password');
const addBasicAuthenticationMethod = require('../../authentication/auth-logic/basic-auth');
const addTokenAuthenticationMethod = require('../../authentication/auth-logic/bearer-token-auth');

const defineUserModel = (sequelize, DataTypes) => {
  const userModelProperties = getUserProperties(DataTypes);
  const User = sequelize.define('Users', userModelProperties);

  User.beforeCreate(async (user) => {
    user.password = await hashPassword(user.password);
  });

  User.authenticateUserBasic = (username, password) => addBasicAuthenticationMethod(User, username, password);
  User.authenticateUserToken = (token) => addTokenAuthenticationMethod(User, token);

  return User;
};

module.exports = defineUserModel;
