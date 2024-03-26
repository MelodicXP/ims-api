'use strict';

const getCategoryProperties = require('../categories/category-properties');

const defineItemModel = (sequelize, DataTypes) => {
  const categoryModelProperties = getCategoryProperties(DataTypes);
  const category = sequelize.define('Category', categoryModelProperties);
  return category;
};

module.exports = defineItemModel;