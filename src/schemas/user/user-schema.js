'use strict';

const userProperties = require('./user-properties');
const { hashedPassword } = require('../../utilities/hash-password');
const authenticateBasic = require('../../authentication/basic-auth');
const authenticateToken = require('../../authentication/bearer-token-auth');

const userSchema = (database, DataTypes) => {
  // Prepare the properties for sequelize database by passing DataTypes
  const properties = userProperties(DataTypes);

  const schema = database.define('Users', properties);

  schema.beforeCreate(async (user) => {
    user.password = await hashedPassword(user.password);
  });

  schema.authenticateBasic = (username, password) => authenticateBasic(schema, username, password);

  schema.authenticateToken = (token) => authenticateToken(schema, token);

  return schema;
};

module.exports = userSchema;
