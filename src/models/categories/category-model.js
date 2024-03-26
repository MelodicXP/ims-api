'use strict';

const getCategoryProperties = require('../categories/category-properties');

const defineCategoryModel = (sequelize, DataTypes) => {
  const categoryModelProperties = getCategoryProperties(DataTypes);
  const category = sequelize.define('Category', categoryModelProperties);
  return category;
};

module.exports = defineCategoryModel;