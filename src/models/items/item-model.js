'use strict';

const getItemProperties = require('../items/item-properties');

const defineItemModel = (sequelize, DataTypes) => {
  const itemModelProperties = getItemProperties(DataTypes);
  const Item = sequelize.define('Items', itemModelProperties);
  return Item;
};

module.exports = defineItemModel;
