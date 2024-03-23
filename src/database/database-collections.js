'use strict';

const Collection = require('../utilities/crud-interface');
const models = require ('./database-models');
const { Item: itemsModel, Category: categoriesModel } = models;

const itemsCollection = new Collection(itemsModel);
const categoriesCollection = new Collection(categoriesModel);

module.exports = {
  itemsCollection,
  categoriesCollection,
};

