'use strict';

const CrudInterface = require('../utilities/crud-abilities');
const models = require ('./create-all-models');
const { Item: ItemModel, Category: CategoryModel } = models;

const itemCrud = new CrudInterface(ItemModel);
const categoryCrud = new CrudInterface(CategoryModel);

module.exports = {
  item: itemCrud,
  category: categoryCrud,
};

