'use strict';

const properties = require('./user-properties');//import user properties here
const { hashedPassword } = require('../../utilities/hash-password');

const userSchema = (database, DataTypes) => {
  // Prepare the properties for sequelize database by passing DataTypes
  const userProperties = properties(DataTypes);

  const schema = database.define('Users', userProperties);

  schema.beforeCreate(async (user) => {
    user.password = await hashedPassword(user.password);
  });
};

module.exports = userSchema;
