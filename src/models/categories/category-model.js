'use strict';

const getCategoryProperties = require('../items/item-properties');

const defineItemModel = (sequelize, DataTypes) => {
  const categoryModelProperties = getCategoryProperties(DataTypes);
  const category = sequelize.define('Items', categoryModelProperties);
  return category;
};

module.exports = defineItemModel;