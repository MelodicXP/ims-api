'use strict';

const CrudInterface = require('../utilities/crud-interface');
const models = require ('./database-models');
const { Item: ItemModel, Category: CategoryModel } = models;

const itemCrud = new CrudInterface(ItemModel);
const categoryCrud = new CrudInterface(CategoryModel);

module.exports = {
  itemCrud,
  categoryCrud,
};

