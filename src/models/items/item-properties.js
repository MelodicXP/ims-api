'use strict';

module.exports = (DataTypes) => ({
  itemName: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
  },
  price: {
    type: DataTypes.INTEGER,
    required: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    required: true,
  },
  categoryID: {
    type: DataTypes.INTEGER,
    required: true,
  },
});