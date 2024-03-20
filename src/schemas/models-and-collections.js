'use strict';

const { database } = require('../database/database-config');
const { DataTypes } = require('sequelize');
// todo const CRUD = require('../utilities/crud-operations');

const userSchema = require('./user/user-schema');
// todo const itemSchema = require();
// todo const itemCategorySchema = require();

// Initialize Models
const users = userSchema(database, DataTypes);
// todo const itemModel = itemSchema(database, DataTypes);
// todo const itemCategoryModel = itemCategorySchema(database, DataTypes);

// Create a new CRUD class for items and categories
// todo const items = new CRUD(itemModel);
// todo const categories = new CRUD(itemCategoryModel);

module.exports = {
  users,
  // todo items,
  // todod categories,
};
