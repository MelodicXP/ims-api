'use strict';

const { database } = require('../database/database-config');
const { DataTypes } = require('sequelize');
// todo const CRUD = require('../utilities/crud-operations');

const createUserModel = require('./user/user-model');
// todo const itemSchema = require();
// todo const itemCategorySchema = require();

// Initialize Models
function initializeModels (sequelizeInstance) {
  const models = {};

  models.users = createUserModel(sequelizeInstance, DataTypes);

  // Todo Initialize other models when ready
  // models.items = createItemModel(sequelizeInstance, DataTypes);
  // models.itemCategories = createItemCategoryModel(sequelizeInstance, DataTypes);

  return models;
}
// const users = createUserModel(database, DataTypes);
// todo const itemModel = itemSchema(database, DataTypes);
// todo const itemCategoryModel = itemCategorySchema(database, DataTypes);

// Create a new CRUD class for items and categories
// todo const items = new CRUD(itemModel);
// todo const categories = new CRUD(itemCategoryModel);

const models = initializeModels(database);

module.exports = models;
