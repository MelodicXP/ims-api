'use strict';

const { database } = require('./database-config');
const { DataTypes } = require('sequelize');
const Collection = require(''); // this is where the CRUD comes from, sonsider renaming

const userSchema = require();
const itemSchema = require();
const itemCategorySchema = require();

// Initialize Models
const users = userSchema(database, DataTypes);
const itemModel = itemSchema(database, DataTypes);
const itemCategoryModel = itemCategorySchema(database, DataTypes);

// Create a new collection class for items and categories
const items = new Collection(itemModel);
const categories = new Collection(itemCategoryModel);

module.exports = {
  users,
  items,
  categories,
};
