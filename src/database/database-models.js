'use strict';

const { database } = require('./database-config');
const { DataTypes } = require('sequelize');


const createUserModel = require('../models/user/user-model');
const createItemModel = require('../models/items/item-model');
const createCategoryModel = require('../models/categories/category-model');

function initializeModels (sequelizeInstance) {
  const models = {};
  
  models.User = createUserModel(sequelizeInstance, DataTypes);
  models.Item = createItemModel(sequelizeInstance, DataTypes);
  models.Category = createCategoryModel(sequelizeInstance, DataTypes);
  
  // Make associations
  models.Category.hasMany(models.Item, {
    foreignKey: 'categoryID',
    sourceKey: 'id',
  });
  models.Item.belongsTo(models.Category, {
    foreignKey: 'categoryID',
    targetKey: 'id',
  });
  
  return models;
}

const models = initializeModels(database);

module.exports = models;
