'use strict';

module.exports = (DataTypes) => ({
  categoryName: {
    type: DataTypes.ENUM(
      'cases',
      'chargers',
      'cell phones',
      'accessories',
    ),
    required: true,
  },
});